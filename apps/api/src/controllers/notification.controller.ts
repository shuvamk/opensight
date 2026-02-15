import { Request, Response, NextFunction } from 'express';
import { notificationService } from '../services/notification.service.js';
import { logger } from '../utils/logger.js';

/**
 * GET /api/notifications
 * List notifications (with unread filter)
 */
export async function listNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { unread } = req.query as { unread?: string };
    const unreadOnly = unread === 'true';

    const notifications = await notificationService.listNotifications(req.user!.id, unreadOnly);
    res.json({ notifications });
  } catch (error) {
    logger.error(error, 'Error listing notifications');
    next(error);
  }
}

/**
 * PATCH /api/notifications/:id/read
 * Mark as read
 */
export async function markAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params as { id: string };

    const notification = await notificationService.markAsRead(id, req.user!.id);
    res.json({ notification });
  } catch (error) {
    const err = error as Error;
    if (err.message.includes('not found')) {
      res.status(404).json({ error: err.message });
    } else {
      logger.error(error, 'Error marking notification as read');
      next(error);
    }
  }
}

/**
 * PATCH /api/notifications/read-all
 * Mark all as read
 */
export async function markAllAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await notificationService.markAllAsRead(req.user!.id);
    res.json({ success: true });
  } catch (error) {
    logger.error(error, 'Error marking all notifications as read');
    next(error);
  }
}

/**
 * GET /api/notifications/settings
 * Get notification settings
 */
export async function getSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const settings = await notificationService.getSettings(req.user!.id);
    res.json({ settings });
  } catch (error) {
    logger.error(error, 'Error getting notification settings');
    next(error);
  }
}

/**
 * PATCH /api/notifications/settings
 * Update settings
 */
export async function updateSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email_frequency, alert_visibility_drop, alert_new_mention, alert_sentiment_shift, alert_competitor_new, webhook_url } = req.body;

    const settings = await notificationService.updateSettings(req.user!.id, {
      emailFrequency: email_frequency,
      alertVisibilityDrop: alert_visibility_drop,
      alertNewMention: alert_new_mention,
      alertSentimentShift: alert_sentiment_shift,
      alertCompetitorNew: alert_competitor_new,
      webhookUrl: webhook_url,
    });

    res.json({ settings });
  } catch (error) {
    logger.error(error, 'Error updating notification settings');
    next(error);
  }
}
