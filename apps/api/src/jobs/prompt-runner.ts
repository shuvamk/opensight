import { db, prompts, promptResults, brands, users, competitors } from '@opensight/db';
import { eq, and } from 'drizzle-orm';
import { createEngineClient } from '@opensight/engine-clients';
import { analyzeSentiment, extractMentions, extractCompetitorMentions } from '@opensight/analyzer';
import { createQueue, createWorker } from '../config/redis.js';
import { logger } from '../utils/logger.js';

interface PromptRunnerJobData {
  brandId: string;
  promptId?: string;
}

const queueName = 'prompt-runner';

/**
 * Determines which AI engines are enabled based on the user's plan
 */
function getEnabledEnginesForPlan(planId: string): string[] {
  // Plan tiers and their included engines
  const planEngines: Record<string, string[]> = {
    free: ['chatgpt'],
    pro: ['chatgpt', 'perplexity'],
    enterprise: ['chatgpt', 'perplexity', 'google_aio'],
  };

  return planEngines[planId] || ['chatgpt'];
}

/**
 * Process a single prompt with all enabled engines
 */
async function processPromptWithEngines(
  prompt: any,
  brand: any,
  user: any,
  enabledEngines: string[]
): Promise<any[]> {
  const results = [];

  for (const engine of enabledEngines) {
    try {
      // Create engine client with API keys from config
      const engineClient = createEngineClient(engine, {
        openaiApiKey: process.env.OPENAI_API_KEY || '',
        perplexityApiKey: process.env.PERPLEXITY_API_KEY || '',
        serperApiKey: process.env.SERPER_API_KEY || '',
      });

      // Query the engine
      const response = await engineClient.query({
        prompt: prompt.text,
        brandName: brand.name,
        brandUrl: brand.websiteUrl,
      });

      // Extract mentions and sentiment
      const brandMentionResult = extractMentions(response.responseText, brand.name, brand.websiteUrl);
      const sentimentResult = analyzeSentiment(response.responseText);

      // Get competitors for this brand
      const brandCompetitors = await db
        .select()
        .from(competitors)
        .where(eq(competitors.brandId, brand.id));

      const competitorMentions = extractCompetitorMentions(
        response.responseText,
        brandCompetitors.map((c) => ({
          name: c.name,
          url: c.websiteUrl,
        }))
      );

      // Calculate visibility score (0-100)
      // Based on: mention (50 points), position (30 points), sentiment (20 points)
      let visibilityScore = 0;
      if (brandMentionResult.mentioned) {
        visibilityScore += 50;
        // Position bonus: earlier mentions = higher score
        if (brandMentionResult.position && brandMentionResult.position <= 5) {
          visibilityScore += 30;
        } else if (brandMentionResult.position && brandMentionResult.position <= 10) {
          visibilityScore += 15;
        }
      }
      // Sentiment bonus
      if (sentimentResult.label === 'positive') {
        visibilityScore += 20;
      } else if (sentimentResult.label === 'neutral') {
        visibilityScore += 10;
      }

      // Store result in database
      const result = await db
        .insert(promptResults)
        .values({
          promptId: prompt.id,
          brandId: brand.id,
          engine: engine,
          responseText: response.responseText,
          brandMentioned: brandMentionResult.mentioned,
          mentionPosition: brandMentionResult.position,
          sentimentScore: sentimentResult.score.toString(),
          sentimentLabel: sentimentResult.label,
          citationUrls: response.citationUrls,
          competitorMentions: competitorMentions,
          visibilityScore: visibilityScore,
          rawResponse: response.rawResponse,
        })
        .returning();

      results.push(result[0]);

      logger.info(
        {
          promptId: prompt.id,
          brandId: brand.id,
          engine,
          visibilityScore,
          mentioned: brandMentionResult.mentioned,
        },
        `Processed prompt with ${engine}`
      );
    } catch (error) {
      logger.error(
        {
          promptId: prompt.id,
          brandId: brand.id,
          engine,
          error: error instanceof Error ? error.message : String(error),
        },
        `Failed to process prompt with ${engine}`
      );
    }
  }

  return results;
}

/**
 * BullMQ job processor for prompt running
 */
async function promptRunnerProcessor(job: any): Promise<any> {
  const { brandId, promptId } = job.data as PromptRunnerJobData;

  try {
    logger.info({ brandId, promptId }, 'Starting prompt runner job');

    // Get brand and user info
    const brandResult = await db.select().from(brands).where(eq(brands.id, brandId)).limit(1);

    if (!brandResult.length) {
      throw new Error(`Brand not found: ${brandId}`);
    }

    const brandRecord = brandResult[0];
    if (!brandRecord) {
      throw new Error(`Brand not found: ${brandId}`);
    }

    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, brandRecord.userId))
      .limit(1);

    if (!userResult.length) {
      throw new Error(`User not found for brand: ${brandId}`);
    }

    const userRecord = userResult[0];
    if (!userRecord) {
      throw new Error(`User not found for brand: ${brandId}`);
    }

    // Determine enabled engines based on plan
    const enabledEngines = getEnabledEnginesForPlan(userRecord.planId);

    logger.info({ brandId, engines: enabledEngines }, 'Using engines for plan');

    // Get prompts to process
    let promptsToProcess;
    if (promptId) {
      // Process specific prompt
      promptsToProcess = await db
        .select()
        .from(prompts)
        .where(and(eq(prompts.id, promptId), eq(prompts.brandId, brandId), eq(prompts.isActive, true)))
        .limit(1);
    } else {
      // Process all active prompts for the brand
      promptsToProcess = await db
        .select()
        .from(prompts)
        .where(and(eq(prompts.brandId, brandId), eq(prompts.isActive, true)));
    }

    if (!promptsToProcess.length) {
      logger.info({ brandId, promptId }, 'No active prompts found to process');
      return { success: true, processedCount: 0 };
    }

    // Process each prompt with all enabled engines
    let totalResults = 0;
    for (const prompt of promptsToProcess) {
      const results = await processPromptWithEngines(prompt, brandRecord, userRecord, enabledEngines);
      totalResults += results.length;
    }

    logger.info(
      { brandId, promptCount: promptsToProcess.length, resultCount: totalResults },
      'Prompt runner job completed successfully'
    );

    return {
      success: true,
      promptsProcessed: promptsToProcess.length,
      resultsCreated: totalResults,
    };
  } catch (error) {
    logger.error(
      { brandId, promptId, error: error instanceof Error ? error.message : String(error) },
      'Prompt runner job failed'
    );
    throw error;
  }
}

// Create queue and worker
export const promptRunnerQueue = createQueue(queueName);
export const promptRunnerWorker = createWorker(queueName, promptRunnerProcessor, 5);

/**
 * Queue a prompt runner job
 */
export async function queuePromptRunner(data: PromptRunnerJobData): Promise<string> {
  const job = await promptRunnerQueue.add(queueName, data, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: true,
  });

  logger.info({ jobId: job.id, brandId: data.brandId }, 'Queued prompt runner job');
  return job.id || '';
}

// Event handlers
promptRunnerWorker.on('completed', (job: any) => {
  logger.info({ jobId: job.id }, 'Prompt runner job completed');
});

promptRunnerWorker.on('failed', (job: any, error: Error) => {
  logger.error({ jobId: job?.id, error: error.message }, 'Prompt runner job failed');
});

promptRunnerWorker.on('error', (error: Error) => {
  logger.error({ error: error.message }, 'Prompt runner worker error');
});

export default promptRunnerProcessor;
