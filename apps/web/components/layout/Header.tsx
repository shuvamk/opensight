"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationBell from "./NotificationBell";
import UserMenu from "./UserMenu";

interface HeaderProps {
  pageTitle?: string;
  onMenuClick?: () => void;
}

export default function Header({ pageTitle, onMenuClick }: HeaderProps) {
  const pathname = usePathname();

  // Format page title from pathname if not provided
  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1] || "Dashboard";
  const defaultTitle = lastSegment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const title = pageTitle || defaultTitle;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-white/80 backdrop-blur-xl px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="md:hidden"
        >
          <Menu className="h-4 w-4" />
        </Button>
        <h1 className="text-lg font-semibold text-primary-900">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <NotificationBell />
        <UserMenu />
      </div>
    </header>
  );
}
