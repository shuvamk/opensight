import { apiClient } from "@/lib/api-client";
import type {
  Notification,
  ListNotificationsResponse,
  MarkAsReadResponse,
  GetSettingsResponse,
  UpdateSettingsPayload,
  NotificationSettings,
} from "./types";

export async function listNotifications(unread?: boolean): Promise<Notification[]> {
  const q = unread !== undefined ? `?unread=${unread}` : "";
  const res = await apiClient.get<ListNotificationsResponse>(
    `/notifications${q}`
  );
  return res.notifications;
}

export async function markNotificationAsRead(
  notificationId: string
): Promise<Notification> {
  const res = await apiClient.patch<MarkAsReadResponse>(
    `/notifications/${notificationId}/read`,
    {}
  );
  return res.notification;
}

export async function markAllNotificationsAsRead(): Promise<{ success: boolean }> {
  return apiClient.patch<{ success: boolean }>("/notifications/read-all", {});
}

export async function getNotificationSettings(): Promise<NotificationSettings> {
  const res = await apiClient.get<GetSettingsResponse>(
    "/notifications/settings"
  );
  return res.settings;
}

export async function updateNotificationSettings(
  payload: UpdateSettingsPayload
): Promise<NotificationSettings> {
  const res = await apiClient.patch<{ settings: NotificationSettings }>(
    "/notifications/settings",
    payload
  );
  return res.settings;
}
