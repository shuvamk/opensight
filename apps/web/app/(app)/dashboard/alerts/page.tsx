"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  Bell,
  TrendingDown,
  MessageSquare,
  BarChart3,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: "visibility_drop" | "mention" | "sentiment" | "competitor";
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

const getNotificationIcon = (
  type: "visibility_drop" | "mention" | "sentiment" | "competitor"
) => {
  switch (type) {
    case "visibility_drop":
      return <TrendingDown className="h-5 w-5 text-red-500" />;
    case "mention":
      return <MessageSquare className="h-5 w-5 text-blue-500" />;
    case "sentiment":
      return <BarChart3 className="h-5 w-5 text-orange-500" />;
    case "competitor":
      return <AlertCircle className="h-5 w-5 text-purple-500" />;
  }
};

const getNotificationTypeLabel = (
  type: "visibility_drop" | "mention" | "sentiment" | "competitor"
) => {
  switch (type) {
    case "visibility_drop":
      return "Visibility Drop";
    case "mention":
      return "New Mention";
    case "sentiment":
      return "Sentiment Shift";
    case "competitor":
      return "New Competitor";
  }
};

const formatDate = (date: string) => {
  const now = new Date();
  const time = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return time.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export default function AlertsPage() {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const queryClient = useQueryClient();

  // Fetch notifications
  const { data: notifications = [], isLoading, refetch } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: () => apiClient.get("/notifications"),
  });

  // Mark as read mutation
  const { mutate: markAsRead } = useMutation({
    mutationFn: (notificationId: string) =>
      apiClient.patch(`/notifications/${notificationId}/read`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      toast.error("Failed to mark as read");
    },
  });

  // Mark all as read mutation
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMutation({
    mutationFn: () => apiClient.patch("/notifications/read-all", {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("All notifications marked as read");
    },
    onError: (error) => {
      toast.error("Failed to mark all as read");
    },
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  const hasUnread = unreadCount > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="h-8 w-8" />
            Notifications
          </h1>
          <p className="text-gray-600 mt-2">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
              : "All caught up!"}
          </p>
        </div>

        {hasUnread && (
          <Button
            variant="outline"
            onClick={() => markAllAsRead()}
            disabled={isMarkingAll}
          >
            {isMarkingAll ? "Marking..." : "Mark All Read"}
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as "all" | "unread")}>
        <TabsList>
          <TabsTrigger value="all" className="relative">
            All
          </TabsTrigger>
          <TabsTrigger value="unread" className="relative">
            Unread
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6 space-y-4">
          {isLoading ? (
            <Card className="p-8 text-center text-gray-600">
              Loading notifications...
            </Card>
          ) : filteredNotifications.length === 0 ? (
            <Card className="p-8">
              <div className="flex flex-col items-center justify-center text-center">
                <CheckCircle2 className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600">
                  {filter === "unread"
                    ? "No unread notifications"
                    : "No notifications yet"}
                </p>
              </div>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`p-4 cursor-pointer transition-colors ${
                  !notification.isRead
                    ? "bg-blue-50 border-blue-200"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => {
                  if (!notification.isRead) {
                    markAsRead(notification.id);
                  }
                }}
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                          {notification.title}
                        </h3>
                        <Badge
                          variant="secondary"
                          className="text-xs whitespace-nowrap"
                        >
                          {getNotificationTypeLabel(notification.type)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {!notification.isRead && (
                          <div className="h-2 w-2 bg-blue-600 rounded-full flex-shrink-0" />
                        )}
                        <span className="text-xs text-gray-500 whitespace-nowrap flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(notification.createdAt)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{notification.body}</p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
