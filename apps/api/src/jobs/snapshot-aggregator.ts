import { db, promptResults, visibilitySnapshots, brands } from '@opensight/db';
import { eq, and, sql } from 'drizzle-orm';
import { runJob } from '../config/redis.js';
import { logger } from '../utils/logger.js';

interface SnapshotAggregatorJobData {
  brandId: string;
}

/**
 * Snapshot aggregator processor function
 */
export async function snapshotAggregatorProcessor(data: SnapshotAggregatorJobData): Promise<any> {
  const { brandId } = data;

  try {
    logger.info({ brandId }, 'Starting snapshot aggregator job');

    const brandResult = await db.select().from(brands).where(eq(brands.id, brandId)).limit(1);

    if (!brandResult.length) {
      throw new Error(`Brand not found: ${brandId}`);
    }

    const today = new Date().toISOString().split('T')[0];

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

    const overallScore = Math.round(
      todaysResults.reduce((sum, r) => sum + (r.visibilityScore || 0), 0) / todaysResults.length
    );

    const sentimentCounts: Record<string, number> = {
      positive: 0,
      neutral: 0,
      negative: 0,
    };

    todaysResults.forEach((result) => {
      const label = result.sentimentLabel;
      if (label && label in sentimentCounts) {
        sentimentCounts[label] = (sentimentCounts[label] ?? 0) + 1;
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

    const brandMentionedCount = todaysResults.filter((r) => r.brandMentioned).length;
    const totalMentions = brandMentionedCount;

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

/**
 * Queue a snapshot aggregator job (runs in-process with retry)
 */
export async function queueSnapshotAggregator(data: SnapshotAggregatorJobData): Promise<void> {
  runJob('snapshot-aggregator', data, snapshotAggregatorProcessor, {
    attempts: 3,
    backoffMs: 2000,
  }).catch((error) => {
    logger.error({ error: error.message, brandId: data.brandId }, 'Snapshot aggregator job failed after retries');
  });
}

export default snapshotAggregatorProcessor;
