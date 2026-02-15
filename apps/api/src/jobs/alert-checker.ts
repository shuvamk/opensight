import { db, brands, visibilitySnapshots, notifications, notificationSettings } from '@opensight/db';
import { eq, and, sql, desc } from 'drizzle-orm';
import { createQueue, createWorker } from '../config/redis.js';
import { logger } from '../utils/logger.js';

interface AlertCheckerJobData {
  brandId: string;
}

const queueName = 'alert-checker';

/**
 * Check for visibility drop (>10% decrease)
 */
async function checkVisibilityDrop(
  brandId: string,
  currentScore: number
): Promise<{ triggered: boolean; message: string }> {
  // Get previous snapshot (yesterday or last recorded)
  const previousSnapshot = await db
    .select()
    .from(visibilitySnapshots)
    .where(eq(visibilitySnapshots.brandId, brandId))
    .orderBy(desc(visibilitySnapshots.snapshotDate))
    .limit(2)
    .offset(1);

  if (!previousSnapshot.length || !previousSnapshot[0]) {
    return { triggered: false, message: 'No previous snapshot' };
  }

  const previousScore = previousSnapshot[0].overallScore || 0;
  const drop = previousScore - currentScore;
  const percentDrop = (drop / previousScore) * 100;

  if (percentDrop > 10) {
    return {
      triggered: true,
      message: `Visibility dropped ${percentDrop.toFixed(1)}% from ${previousScore} to ${currentScore}`,
    };
  }

  return { triggered: false, message: 'No significant drop' };
}

/**
 * Check for new mentions (compared to previous snapshot)
 */
async function checkNewMentions(
  brandId: string,
  currentMentions: number
): Promise<{ triggered: boolean; message: string }> {
  const previousSnapshot = await db
    .select()
    .from(visibilitySnapshots)
    .where(eq(visibilitySnapshots.brandId, brandId))
    .orderBy(desc(visibilitySnapshots.snapshotDate))
    .limit(2)
    .offset(1);

  if (!previousSnapshot.length || !previousSnapshot[0]) {
    return { triggered: false, message: 'No previous snapshot' };
  }

  const previousMentions = previousSnapshot[0].totalMentions || 0;

  if (currentMentions > previousMentions) {
    return {
      triggered: true,
      message: `New mentions detected: ${currentMentions} (previously ${previousMentions})`,
    };
  }

  return { triggered: false, message: 'No new mentions' };
}

/**
 * Check for sentiment shift (from positive to negative or vice versa)
 */
async function checkSentimentShift(
  brandId: string,
  currentSentiment: { positive: number; neutral: number; negative: number }
): Promise<{ triggered: boolean; message: string }> {
  const previousSnapshot = await db
    .select()
    .from(visibilitySnapshots)
    .where(eq(visibilitySnapshots.brandId, brandId))
    .orderBy(desc(visibilitySnapshots.snapshotDate))
    .limit(2)
    .offset(1);

  if (!previousSnapshot.length || !previousSnapshot[0]) {
    return { triggered: false, message: 'No previous snapshot' };
  }

  const prevSent = previousSnapshot[0];
  const prevPositive = parseFloat(String(prevSent.sentimentPositive || 0));
  const prevNegative = parseFloat(String(prevSent.sentimentNegative || 0));

  // Check for significant shift (5% or more change)
  const positiveChange = currentSentiment.positive - prevPositive;
  const negativeChange = currentSentiment.negative - prevNegative;

  if (Math.abs(positiveChange) >= 5 || Math.abs(negativeChange) >= 5) {
    return {
      triggered: true,
      message: `Sentiment shift detected: positive ${positiveChange > 0 ? '+' : ''}${positiveChange.toFixed(1)}%, negative ${negativeChange > 0 ? '+' : ''}${negativeChange.toFixed(1)}%`,
    };
  }

  return { triggered: false, message: 'No significant shift' };
}

/**
 * Check for new competitor appearances
 */
async function checkNewCompetitors(
  brandId: string,
  currentCompetitors: Record<string, unknown>
): Promise<{ triggered: boolean; message: string }> {
  const previousSnapshot = await db
    .select()
    .from(visibilitySnapshots)
    .where(eq(visibilitySnapshots.brandId, brandId))
    .orderBy(desc(visibilitySnapshots.snapshotDate))
    .limit(2)
    .offset(1);

  if (!previousSnapshot.length || !previousSnapshot[0]) {
    return { triggered: false, message: 'No previous snapshot' };
  }

  const prevCompetitors = (previousSnapshot[0].competitorData as Record<string, unknown>) || {};
  const newCompetitors: string[] = [];

  Object.keys(currentCompetitors).forEach((name) => {
    if (!prevCompetitors[name]) {
      newCompetitors.push(name);
    }
  });

  if (newCompetitors.length > 0) {
    return {
      triggered: true,
      message: `New competitor appearances detected: ${newCompetitors.join(', ')}`,
    };
  }

  return { triggered: false, message: 'No new competitors' };
}

/**
 * Send webhook notification
 */
async function sendWebhookNotification(
  webhookUrl: string,
  notification: {
    type: string;
    title: string;
    body: string;
    metadata: Record<string, unknown>;
  }
): Promise<boolean> {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: notification.type,
        title: notification.title,
        body: notification.body,
        metadata: notification.metadata,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return true;
  } catch (error) {
    logger.error(
      { webhookUrl, error: error instanceof Error ? error.message : String(error) },
      'Failed to send webhook notification'
    );
    return false;
  }
}

/**
 * BullMQ job processor for alert checking
 */
async function alertCheckerProcessor(job: any): Promise<any> {
  const { brandId } = job.data as AlertCheckerJobData;

  try {
    logger.info({ brandId }, 'Starting alert checker job');

    // Get brand and its owner
    const brand = await db.select().from(brands).where(eq(brands.id, brandId)).limit(1);

    if (!brand.length || !brand[0]) {
      throw new Error(`Brand not found: ${brandId}`);
    }

    const brandRecord = brand[0];

    // Get today's snapshot
    const today = new Date().toISOString().split('T')[0];
    const todaySnapshot = await db
      .select()
      .from(visibilitySnapshots)
      .where(
        and(
          eq(visibilitySnapshots.brandId, brandId),
          sql`DATE(${visibilitySnapshots.snapshotDate}::date) = ${today}::date`
        )
      )
      .limit(1);

    if (!todaySnapshot.length || !todaySnapshot[0]) {
      logger.info({ brandId }, 'No snapshot found for today');
      return { success: true, alertsCreated: 0 };
    }

    const snapshot = todaySnapshot[0];

    // Get user notification settings
    const notifSettings = await db
      .select()
      .from(notificationSettings)
      .where(eq(notificationSettings.userId, brandRecord.userId))
      .limit(1);

    const settings = notifSettings[0];
    if (!settings) {
      logger.info({ brandId }, 'No notification settings configured');
      return { success: true, alertsCreated: 0 };
    }

    const alerts: Array<{
      type: string;
      title: string;
      body: string;
      severity: string;
    }> = [];

    // Check visibility drop
    if (settings.alertVisibilityDrop && snapshot.overallScore) {
      const visibilityCheck = await checkVisibilityDrop(brandId, snapshot.overallScore);
      if (visibilityCheck.triggered) {
        alerts.push({
          type: 'visibility_drop',
          title: 'Visibility Drop Alert',
          body: visibilityCheck.message,
          severity: 'warning',
        });
      }
    }

    // Check new mentions
    if (settings.alertNewMention && snapshot.totalMentions) {
      const mentionsCheck = await checkNewMentions(brandId, snapshot.totalMentions);
      if (mentionsCheck.triggered) {
        alerts.push({
          type: 'new_mention',
          title: 'New Mentions Detected',
          body: mentionsCheck.message,
          severity: 'info',
        });
      }
    }

    // Check sentiment shift
    if (settings.alertSentimentShift) {
      const sentimentCheck = await checkSentimentShift(brandId, {
        positive: parseFloat(String(snapshot.sentimentPositive || 0)),
        neutral: parseFloat(String(snapshot.sentimentNeutral || 0)),
        negative: parseFloat(String(snapshot.sentimentNegative || 0)),
      });
      if (sentimentCheck.triggered) {
        alerts.push({
          type: 'sentiment_shift',
          title: 'Sentiment Shift Detected',
          body: sentimentCheck.message,
          severity: 'warning',
        });
      }
    }

    // Check new competitors
    if (settings.alertCompetitorNew && snapshot.competitorData) {
      const competitorCheck = await checkNewCompetitors(
        brandId,
        snapshot.competitorData as Record<string, unknown>
      );
      if (competitorCheck.triggered) {
        alerts.push({
          type: 'competitor_new',
          title: 'New Competitor Mentioned',
          body: competitorCheck.message,
          severity: 'info',
        });
      }
    }

    // Create notifications and send webhooks
    let createdCount = 0;
    for (const alert of alerts) {
      // Create notification in database
      const notification = await db
        .insert(notifications)
        .values({
          userId: brandRecord.userId,
          type: alert.type,
          title: alert.title,
          body: alert.body,
          metadata: {
            brandId,
            brandName: brandRecord.name,
            severity: alert.severity,
          },
        })
        .returning();

      createdCount++;

      logger.info(
        { notificationId: notification[0]?.id, brandId, alertType: alert.type },
        'Created notification'
      );

      // Send webhook if configured
      if (settings.webhookUrl) {
        await sendWebhookNotification(settings.webhookUrl, {
          type: alert.type,
          title: alert.title,
          body: alert.body,
          metadata: { brandId, brandName: brandRecord.name },
        });
      }
    }

    logger.info(
      { brandId, alertsCreated: createdCount },
      'Alert checker job completed successfully'
    );

    return {
      success: true,
      alertsCreated: createdCount,
      alertTypes: alerts.map((a) => a.type),
    };
  } catch (error) {
    logger.error(
      { brandId, error: error instanceof Error ? error.message : String(error) },
      'Alert checker job failed'
    );
    throw error;
  }
}

// Create queue and worker
export const alertCheckerQueue = createQueue(queueName);
export const alertCheckerWorker = createWorker(queueName, alertCheckerProcessor, 10);

/**
 * Queue an alert checker job
 */
export async function queueAlertChecker(data: AlertCheckerJobData): Promise<string> {
  const job = await alertCheckerQueue.add(queueName, data, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: true,
  });

  logger.info({ jobId: job.id, brandId: data.brandId }, 'Queued alert checker job');
  return job.id || '';
}

// Event handlers
alertCheckerWorker.on('completed', (job: any) => {
  logger.info({ jobId: job.id }, 'Alert checker job completed');
});

alertCheckerWorker.on('failed', (job: any, error: Error) => {
  logger.error({ jobId: job?.id, error: error.message }, 'Alert checker job failed');
});

alertCheckerWorker.on('error', (error: Error) => {
  logger.error({ error: error.message }, 'Alert checker worker error');
});

export default alertCheckerProcessor;
