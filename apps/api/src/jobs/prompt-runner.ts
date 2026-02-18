import { db, prompts, promptResults, brands, users, competitors } from '@opensight/db';
import { eq, and } from 'drizzle-orm';
import { createEngineClient } from '@opensight/engine-clients';
import { analyzeSentiment, extractMentions, extractCompetitorMentions } from '@opensight/analyzer';
import { runJob } from '../config/redis.js';
import { logger } from '../utils/logger.js';

interface PromptRunnerJobData {
  brandId: string;
  promptId?: string;
}

/**
 * Determines which AI engines are enabled based on the user's plan
 */
function getEnabledEnginesForPlan(planId: string): string[] {
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
      const engineClient = createEngineClient(engine, {
        openaiApiKey: process.env.OPENAI_API_KEY || '',
        perplexityApiKey: process.env.PERPLEXITY_API_KEY || '',
        serperApiKey: process.env.SERPER_API_KEY || '',
      });

      const response = await engineClient.query({
        prompt: prompt.text,
        brandName: brand.name,
        brandUrl: brand.websiteUrl,
      });

      const brandMentionResult = extractMentions(response.responseText, brand.name, brand.websiteUrl);
      const sentimentResult = analyzeSentiment(response.responseText);

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

      let visibilityScore = 0;
      if (brandMentionResult.mentioned) {
        visibilityScore += 50;
        if (brandMentionResult.position && brandMentionResult.position <= 5) {
          visibilityScore += 30;
        } else if (brandMentionResult.position && brandMentionResult.position <= 10) {
          visibilityScore += 15;
        }
      }
      if (sentimentResult.label === 'positive') {
        visibilityScore += 20;
      } else if (sentimentResult.label === 'neutral') {
        visibilityScore += 10;
      }

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
 * Prompt runner processor function
 */
export async function promptRunnerProcessor(data: PromptRunnerJobData): Promise<any> {
  const { brandId, promptId } = data;

  try {
    logger.info({ brandId, promptId }, 'Starting prompt runner job');

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

    const enabledEngines = getEnabledEnginesForPlan(userRecord.planId);

    logger.info({ brandId, engines: enabledEngines }, 'Using engines for plan');

    let promptsToProcess;
    if (promptId) {
      promptsToProcess = await db
        .select()
        .from(prompts)
        .where(and(eq(prompts.id, promptId), eq(prompts.brandId, brandId), eq(prompts.isActive, true)))
        .limit(1);
    } else {
      promptsToProcess = await db
        .select()
        .from(prompts)
        .where(and(eq(prompts.brandId, brandId), eq(prompts.isActive, true)));
    }

    if (!promptsToProcess.length) {
      logger.info({ brandId, promptId }, 'No active prompts found to process');
      return { success: true, processedCount: 0 };
    }

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

/**
 * Queue a prompt runner job (runs in-process with retry)
 */
export async function queuePromptRunner(data: PromptRunnerJobData): Promise<void> {
  // Fire and forget - run in background with retry
  runJob('prompt-runner', data, promptRunnerProcessor, {
    attempts: 3,
    backoffMs: 2000,
  }).catch((error) => {
    logger.error({ error: error.message, brandId: data.brandId }, 'Prompt runner job failed after retries');
  });
}

export default promptRunnerProcessor;
