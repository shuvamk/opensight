"use client";

import { useNotifications } from "@/hooks/useNotifications";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function NotificationBell() {
  const { data, isLoading } = useNotifications();
  const notifications = Array.isArray(data) ? data : [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-9 w-9 p-0 rounded-full"
        >
          <Bell className="h-[18px] w-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 h-4 w-4 flex items-center justify-center rounded-full bg-indigo-300 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 rounded-xl">
        <DropdownMenuLabel className="font-semibold">
          Notifications
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoading ? (
          <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
        ) : notifications.length === 0 ? (
          <div className="py-8 text-center">
            <Bell className="h-8 w-8 text-text-tertiary mx-auto mb-2" />
            <p className="text-sm text-text-secondary">No notifications yet</p>
          </div>
        ) : (
          notifications.slice(0, 5).map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="flex flex-col items-start py-3 cursor-pointer"
            >
              <span className="text-sm text-primary-500">
                {notification.message}
              </span>
              <span className="text-xs text-text-tertiary mt-0.5">
                {new Date(notification.createdAt).toLocaleDateString()}
              </span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
