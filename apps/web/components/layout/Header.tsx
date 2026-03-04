"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import NotificationBell from "./NotificationBell";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function segmentToLabel(segment: string): string {
  const labelMap: Record<string, string> = {
    dashboard: "Dashboard",
    prompts: "Prompts",
    competitors: "Competitors",
    "content-score": "Content Score",
    alerts: "Alerts",
    settings: "Settings",
    profile: "Profile",
    "api-keys": "API Keys",
    billing: "Billing",
    notifications: "Notifications",
    onboarding: "Onboarding",
  };
  return labelMap[segment] ?? segment.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

interface HeaderProps {
  pageTitle?: string;
  onMenuClick?: () => void;
  collapsed?: boolean;
  onCollapsedToggle?: () => void;
}

export default function Header({ pageTitle, onMenuClick, collapsed, onCollapsedToggle }: HeaderProps) {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbItems = segments.map((segment, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const isLast = i === segments.length - 1;
    const label = isLast && pageTitle ? pageTitle : segmentToLabel(segment);
    return { href, label, isLast };
  });

  return (
    <header className="sticky top-0 z-30 flex h-10 items-center justify-between border-b border-border bg-background/90 backdrop-blur-xl pl-1 pr-3">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {/* Mobile: open sheet menu. Desktop: toggle sidebar collapse. Same line-in-box visual. */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="md:hidden shrink-0 p-1 size-6.5 group"
          aria-label="Open menu"
        >
          <div className="border border-muted-foreground rounded-lg size-full p-px group-hover:border-foreground/70">
            <div className="h-full w-1 bg-muted-foreground group-hover:bg-foreground/70 rounded-[calc(var(--radius-lg)-1px)] duration-150 ease-out transition-all" />
          </div>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCollapsedToggle}
          className="hidden md:flex shrink-0 p-1 size-6.5 group"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <div className="border border-muted-foreground rounded-lg size-full p-px group-hover:border-foreground/70">
            <div className={cn("h-full bg-muted-foreground group-hover:bg-foreground/70 rounded-[calc(var(--radius-lg)-1px)] duration-150 ease-out transition-all", collapsed ? "w-0.5" : "w-1")} />
          </div>
        </Button>
        <Breadcrumb className="min-w-0 flex-1">
          <BreadcrumbList>
            {breadcrumbItems.length === 0 ? (
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            ) : (
              breadcrumbItems.map((item, i) => (
                <span key={item.href} className="contents">
                  {i > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {item.isLast ? (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={item.href} render={<Link href={item.href} />}>
                        {item.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </span>
              ))
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <ThemeToggle />
        <NotificationBell />
      </div>
    </header>
  );
}
