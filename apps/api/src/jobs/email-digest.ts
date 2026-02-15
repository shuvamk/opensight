import { db, users, notifications, notificationSettings } from '@opensight/db';
import { eq, and, isNull } from 'drizzle-orm';
import { createQueue, createWorker } from '../config/redis.js';
import { resend } from '../config/email.js';
import { logger } from '../utils/logger.js';

interface EmailDigestJobData {
  userId: string;
  frequency: 'daily' | 'weekly';
}

const queueName = 'email-digest';

/**
 * Format notifications into HTML email
 */
function formatEmailContent(
  userName: string,
  notificationsList: Array<{ title: string; body: string; createdAt: Date | null }>,
  frequency: string
): { subject: string; html: string } {
  const notificationsHtml = notificationsList
    .map(
      (notif) =>
        `
    <div style="border-left: 4px solid #3b82f6; padding-left: 16px; margin-bottom: 16px; padding: 12px;">
      <h3 style="margin: 0 0 8px 0; color: #1f2937;">${notif.title}</h3>
      <p style="margin: 0 0 4px 0; color: #4b5563;">${notif.body}</p>
      <small style="color: #9ca3af;">${notif.createdAt ? new Date(notif.createdAt).toLocaleString() : 'N/A'}</small>
    </div>
  `
    )
    .join('');

  const subject =
    frequency === 'daily'
      ? `Your Daily OpenSight Digest - ${new Date().toLocaleDateString()}`
      : `Your Weekly OpenSight Digest - Week of ${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}`;

  const html = `
    <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1f2937; margin-bottom: 8px;">OpenSight Digest</h1>
          <p style="color: #6b7280; margin-bottom: 24px;">Hi ${userName},</p>
          
          <p style="color: #6b7280; margin-bottom: 16px;">
            Here's your ${frequency} summary of alerts and updates from OpenSight:
          </p>
          
          <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <p style="margin: 0 0 16px 0; color: #4b5563; font-size: 14px;">
              <strong>${notificationsList.length}</strong> unread notification${notificationsList.length !== 1 ? 's' : ''}
            </p>
            ${notificationsHtml}
          </div>
          
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <a href="https://opensight.ai/dashboard" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">
              View Full Dashboard
            </a>
          </div>
          
          <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">
            You received this email because you're subscribed to ${frequency} digests. 
            <a href="https://opensight.ai/settings/notifications" style="color: #3b82f6; text-decoration: none;">Manage preferences</a>
          </p>
        </div>
      </body>
    </html>
  `;

  return { subject, html };
}

/**
 * BullMQ job processor for email digests
 */
async function emailDigestProcessor(job: any): Promise<any> {
  const { userId, frequency } = job.data as EmailDigestJobData;

  try {
    logger.info({ userId, frequency }, 'Starting email digest job');

    // Get user
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);

    if (!user.length || !user[0]) {
      throw new Error(`User not found: ${userId}`);
    }

    const userRecord = user[0];

    // Get unread notifications
    const unreadNotifications = await db
      .select()
      .from(notifications)
      .where(and(eq(notifications.userId, userId), isNull(notifications.readAt)))
      .orderBy(notifications.createdAt);

    if (!unreadNotifications.length) {
      logger.info({ userId }, 'No unread notifications to digest');
      return { success: true, emailSent: false, reason: 'No unread notifications' };
    }

    // Format and send email
    const { subject, html } = formatEmailContent(
      userRecord.fullName,
      unreadNotifications.map((n) => ({
        title: n.title,
        body: n.body || '',
        createdAt: n.createdAt,
      })),
      frequency
    );

    try {
      await resend.emails.send({
        from: 'noreply@opensight.ai',
        to: userRecord.email,
        subject,
        html,
      });

      logger.info(
        { userId, notificationCount: unreadNotifications.length },
        'Email digest sent successfully'
      );

      return {
        success: true,
        emailSent: true,
        notificationsSent: unreadNotifications.length,
      };
    } catch (emailError) {
      logger.error(
        { userId, error: emailError instanceof Error ? emailError.message : String(emailError) },
        'Failed to send email via Resend'
      );
      throw emailError;
    }
  } catch (error) {
    logger.error(
      { userId, frequency, error: error instanceof Error ? error.message : String(error) },
      'Email digest job failed'
    );
    throw error;
  }
}

// Create queue and worker
export const emailDigestQueue = createQueue(queueName);
export const emailDigestWorker = createWorker(queueName, emailDigestProcessor, 5);

/**
 * Queue an email digest job
 */
export async function queueEmailDigest(data: EmailDigestJobData): Promise<string> {
  const job = await emailDigestQueue.add(queueName, data, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: true,
  });

  logger.info({ jobId: job.id, userId: data.userId }, 'Queued email digest job');
  return job.id || '';
}

// Event handlers
emailDigestWorker.on('completed', (job: any) => {
  logger.info({ jobId: job.id }, 'Email digest job completed');
});

emailDigestWorker.on('failed', (job: any, error: Error) => {
  logger.error({ jobId: job?.id, error: error.message }, 'Email digest job failed');
});

emailDigestWorker.on('error', (error: Error) => {
  logger.error({ error: error.message }, 'Email digest worker error');
});

export default emailDigestProcessor;
