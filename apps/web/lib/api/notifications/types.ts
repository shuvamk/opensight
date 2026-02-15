export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body?: string | null;
  metadata?: Record<string, unknown>;
  readAt: string | null;
  createdAt: string | null;
}

export interface ListNotificationsResponse {
  notifications: Notification[];
}

export interface MarkAsReadResponse {
  notification: Notification;
}

export interface NotificationSettings {
  id?: string;
  userId?: string;
  emailFrequency?: string;
  alertVisibilityDrop?: boolean;
  alertNewMention?: boolean;
  alertSentimentShift?: boolean;
  alertCompetitorNew?: boolean;
  webhookUrl?: string | null;
  updatedAt?: string | null;
}

export interface GetSettingsResponse {
  settings: NotificationSettings;
}

export interface UpdateSettingsPayload {
  email_frequency?: string;
  alert_visibility_drop?: boolean;
  alert_new_mention?: boolean;
  alert_sentiment_shift?: boolean;
  alert_competitor_new?: boolean;
  webhook_url?: string | null;
}
