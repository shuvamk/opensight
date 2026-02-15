"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as notificationsApi from "@/lib/api/notifications";
import type { Notification } from "@/lib/api/notifications/types";

/** Notification with isRead derived from readAt for UI */
export interface NotificationItem extends Omit<Notification, "readAt"> {
  isRead: boolean;
  createdAt: string;
}

function toNotificationItem(n: Notification): NotificationItem {
  return {
    ...n,
    isRead: n.readAt != null,
    createdAt: n.createdAt ?? "",
  };
}

export function useNotifications(unreadOnly?: boolean) {
  return useQuery({
    queryKey: ["notifications", unreadOnly],
    queryFn: () =>
      notificationsApi.listNotifications(unreadOnly).then((list) =>
        list.map(toNotificationItem)
      ),
  });
}

export function useMarkRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationsApi.markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsApi.markAllNotificationsAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useNotificationSettings() {
  return useQuery({
    queryKey: ["notificationsSettings"],
    queryFn: () => notificationsApi.getNotificationSettings(),
  });
}

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof notificationsApi.updateNotificationSettings>[0]) =>
      notificationsApi.updateNotificationSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificationsSettings"] });
    },
  });
}
