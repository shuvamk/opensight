import { db, promptResults, visibilitySnapshots, brands } from '@opensight/db';
import { eq, and, sql } from 'drizzle-orm';
import { createQueue, createWorker } from '../config/redis.js';
import { logger } from '../utils/logger.js';

interface SnapshotAggregatorJobData {
  brandId: string;
}

const queueName = 'snapshot-aggregator';

/**
 * BullMQ job processor for snapshot aggregation
 */
async function snapshotAggregatorProcessor(job: any): Promise<any> {
  const { brandId } = job.data as SnapshotAggregatorJobData;

  try {
    logger.info({ brandId }, 'Starting snapshot aggregator job');

    // Verify brand exists
    const brandResult = await db.select().from(brands).where(eq(brands.id, brandId)).limit(1);

    if (!brandResult.length) {
      throw new Error(`Brand not found: ${brandId}`);
    }

    // Get today's date
    const today = new Date().toISOString().split('T')[0];

    // Get all prompt results for today
    const todaysResults = await db
      .select()
      .from(promptResults)
      .where(
        and(
          eq(promptResults.brandId, brandId),
          sql`DATE(${promptResults.createdAt}::date) = ${today}::date`
        )
      );

    if (!todaysResults.length) {
      logger.info({ brandId }, 'No results found for aggregation');
      return { success: true, snapshotCreated: false };
    }

    // Calculate aggregated metrics

    // 1. Average visibility score per engine
    const engineScores: Record<string, number[]> = {};
    todaysResults.forEach((result) => {
      if (!engineScores[result.engine]) {
        engineScores[result.engine] = [];
      }
      const visScore = result.visibilityScore;
      if (visScore !== null && visScore !== undefined) {
        engineScores[result.engine]!.push(visScore);
      }
    });

    const chatgptScore = engineScores['chatgpt'] && engineScores['chatgpt'].length > 0
      ? Math.round(
          engineScores['chatgpt'].reduce((a, b) => a + b, 0) / engineScores['chatgpt'].length
        )
      : null;

    const perplexityScore = engineScores['perplexity'] && engineScores['perplexity'].length > 0
      ? Math.round(
          engineScores['perplexity'].reduce((a, b) => a + b, 0) / engineScores['perplexity'].length
        )
      : null;

    const googleAioScore = engineScores['google_aio'] && engineScores['google_aio'].length > 0
      ? Math.round(
          engineScores['google_aio'].reduce((a, b) => a + b, 0) / engineScores['google_aio'].length
        )
      : null;

    // Overall score (average across all results)
    const overallScore = Math.round(
      todaysResults.reduce((sum, r) => sum + (r.visibilityScore || 0), 0) / todaysResults.length
    );

    // 2. Sentiment distribution
    const sentimentCounts: Record<string, number> = {
      positive: 0,
      neutral: 0,
      negative: 0,
    };

    let totalSentimentScore = 0;
    let sentimentCount = 0;

    todaysResults.forEach((result) => {
      const label = result.sentimentLabel;
      if (label && label in sentimentCounts) {
        sentimentCounts[label] = (sentimentCounts[label] ?? 0) + 1;
      }
      if (result.sentimentScore !== null && result.sentimentScore !== undefined) {
        totalSentimentScore += parseFloat(String(result.sentimentScore));
        sentimentCount++;
      }
    });

    const totalResults = todaysResults.length;
    const sentimentPositive = parseFloat(
      (((sentimentCounts.positive || 0) / totalResults) * 100).toFixed(2)
    );
    const sentimentNeutral = parseFloat(
      (((sentimentCounts.neutral || 0) / totalResults) * 100).toFixed(2)
    );
    const sentimentNegative = parseFloat(
      (((sentimentCounts.negative || 0) / totalResults) * 100).toFixed(2)
    );

    // 3. Total mentions and brand mention count
    const brandMentionedCount = todaysResults.filter((r) => r.brandMentioned).length;
    const totalMentions = brandMentionedCount;

    // 4. Competitor data aggregation
    const competitorMentionsMap: Record<
      string,
      { count: number; sentiments: Record<string, number> }
    > = {};

    todaysResults.forEach((result) => {
      if (result.competitorMentions && Array.isArray(result.competitorMentions)) {
        (result.competitorMentions as Array<{ name: string; sentiment?: string }>).forEach((mention) => {
          if (!competitorMentionsMap[mention.name]) {
            competitorMentionsMap[mention.name] = {
              count: 0,
              sentiments: { positive: 0, neutral: 0, negative: 0 },
            };
          }
          competitorMentionsMap[mention.name]!.count++;
          if (mention.sentiment && mention.sentiment in competitorMentionsMap[mention.name]!.sentiments) {
            competitorMentionsMap[mention.name]!.sentiments[mention.sentiment]!++;
          }
        });
      }
    });

    const competitorData = Object.entries(competitorMentionsMap).reduce(
      (acc, [name, data]) => {
        acc[name] = {
          mentions: data.count,
          sentiment: data.sentiments,
        };
        return acc;
      },
      {} as Record<string, unknown>
    );

    // Insert or update visibility snapshot
    const existingSnapshot = await db
      .select()
      .from(visibilitySnapshots)
      .where(
        and(
          eq(visibilitySnapshots.brandId, brandId),
          sql`DATE(${visibilitySnapshots.snapshotDate}::date) = ${today}::date`
        )
      )
      .limit(1);

    let snapshot;

    if (existingSnapshot.length && existingSnapshot[0]) {
      // Update existing snapshot
      const existingId = existingSnapshot[0].id;
      snapshot = await db
        .update(visibilitySnapshots)
        .set({
          overallScore,
          chatgptScore,
          perplexityScore,
          googleAioScore,
          sentimentPositive: String(sentimentPositive),
          sentimentNeutral: String(sentimentNeutral),
          sentimentNegative: String(sentimentNegative),
          totalMentions,
          totalPromptsChecked: totalResults,
          competitorData,
        })
        .where(eq(visibilitySnapshots.id, existingId))
        .returning();
    } else {
      // Create new snapshot - use the date string directly
      snapshot = await db
        .insert(visibilitySnapshots)
        .values({
          brandId,
          snapshotDate: today,
          overallScore,
          chatgptScore,
          perplexityScore,
          googleAioScore,
          sentimentPositive: String(sentimentPositive),
          sentimentNeutral: String(sentimentNeutral),
          sentimentNegative: String(sentimentNegative),
          totalMentions,
          totalPromptsChecked: totalResults,
          competitorData,
        })
        .returning();
    }

    logger.info(
      {
        brandId,
        snapshotId: snapshot[0]?.id,
        overallScore,
        totalMentions,
        sentimentPositive,
      },
      'Snapshot aggregator job completed successfully'
    );

    return {
      success: true,
      snapshotCreated: existingSnapshot.length === 0,
      snapshotId: snapshot[0]?.id,
      metrics: {
        overallScore,
        chatgptScore,
        perplexityScore,
        googleAioScore,
        totalMentions,
        sentimentDistribution: {
          positive: sentimentPositive,
          neutral: sentimentNeutral,
          negative: sentimentNegative,
        },
      },
    };
  } catch (error) {
    logger.error(
      { brandId, error: error instanceof Error ? error.message : String(error) },
      'Snapshot aggregator job failed'
    );
    throw error;
  }
}

// Create queue and worker
export const snapshotAggregatorQueue = createQueue(queueName);
export const snapshotAggregatorWorker = createWorker(queueName, snapshotAggregatorProcessor, 10);

/**
 * Queue a snapshot aggregator job
 */
export async function queueSnapshotAggregator(data: SnapshotAggregatorJobData): Promise<string> {
  const job = await snapshotAggregatorQueue.add(queueName, data, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: true,
  });

  logger.info({ jobId: job.id, brandId: data.brandId }, 'Queued snapshot aggregator job');
  return job.id || '';
}

// Event handlers
snapshotAggregatorWorker.on('completed', (job: any) => {
  logger.info({ jobId: job.id }, 'Snapshot aggregator job completed');
});

snapshotAggregatorWorker.on('failed', (job: any, error: Error) => {
  logger.error({ jobId: job?.id, error: error.message }, 'Snapshot aggregator job failed');
});

snapshotAggregatorWorker.on('error', (error: Error) => {
  logger.error({ error: error.message }, 'Snapshot aggregator worker error');
});

export default snapshotAggregatorProcessor;
