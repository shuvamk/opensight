import { db, notifications, notificationSettings } from '@opensight/db';
import { eq, desc, isNull, and } from 'drizzle-orm';
import { logger } from '../utils/logger.js';

interface CreateNotificationInput {
  type: string;
  title: string;
  body?: string;
  metadata?: Record<string, any>;
}

interface UpdateNotificationSettingsInput {
  emailFrequency?: string;
  alertVisibilityDrop?: boolean;
  alertNewMention?: boolean;
  alertSentimentShift?: boolean;
  alertCompetitorNew?: boolean;
  webhookUrl?: string;
}

export class NotificationService {
  async listNotifications(userId: string, unreadOnly: boolean = false) {
    try {
      const conditions = [eq(notifications.userId, userId)];
      if (unreadOnly) {
        conditions.push(isNull(notifications.readAt));
      }

      const notificationList = await db
        .select()
        .from(notifications)
        .where(and(...conditions))
        .orderBy(desc(notifications.createdAt));

      return notificationList;
    } catch (error) {
      logger.error(error, 'Error listing notifications');
      throw error;
    }
  }

  async markAsRead(notificationId: string, userId: string) {
    try {
      const notification = await db
        .select()
        .from(notifications)
        .where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)))
        .limit(1);

      if (!notification.length) {
        throw new Error('Notification not found');
      }

      const result = await db
        .update(notifications)
        .set({ readAt: new Date() })
        .where(eq(notifications.id, notificationId))
        .returning();

      return result[0];
    } catch (error) {
      logger.error(error, 'Error marking notification as read');
      throw error;
    }
  }

  async markAllAsRead(userId: string) {
    try {
      await db
        .update(notifications)
        .set({ readAt: new Date() })
        .where(and(eq(notifications.userId, userId), isNull(notifications.readAt)));

      return { success: true };
    } catch (error) {
      logger.error(error, 'Error marking all notifications as read');
      throw error;
    }
  }

  async getSettings(userId: string) {
    try {
      const settings = await db
        .select()
        .from(notificationSettings)
        .where(eq(notificationSettings.userId, userId))
        .limit(1);

      if (!settings.length) {
        // Create default settings if they don't exist
        const result = await db
          .insert(notificationSettings)
          .values({
            userId,
            emailFrequency: 'daily',
            alertVisibilityDrop: true,
            alertNewMention: true,
            alertSentimentShift: true,
            alertCompetitorNew: true,
          })
          .returning();

        return result[0];
      }

      return settings[0];
    } catch (error) {
      logger.error(error, 'Error getting notification settings');
      throw error;
    }
  }

  async updateSettings(userId: string, input: UpdateNotificationSettingsInput) {
    try {
      // Ensure settings exist
      await this.getSettings(userId);

      const result = await db
        .update(notificationSettings)
        .set({
          emailFrequency: input.emailFrequency,
          alertVisibilityDrop: input.alertVisibilityDrop,
          alertNewMention: input.alertNewMention,
          alertSentimentShift: input.alertSentimentShift,
          alertCompetitorNew: input.alertCompetitorNew,
          webhookUrl: input.webhookUrl,
          updatedAt: new Date(),
        })
        .where(eq(notificationSettings.userId, userId))
        .returning();

      return result[0];
    } catch (error) {
      logger.error(error, 'Error updating notification settings');
      throw error;
    }
  }

  async createNotification(userId: string, input: CreateNotificationInput) {
    try {
      const result = await db
        .insert(notifications)
        .values({
          userId,
          type: input.type,
          title: input.title,
          body: input.body,
          metadata: input.metadata || {},
        })
        .returning();

      return result[0];
    } catch (error) {
      logger.error(error, 'Error creating notification');
      throw error;
    }
  }
}

export const notificationService = new NotificationService();
