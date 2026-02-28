"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
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
}

export default function Header({ pageTitle, onMenuClick }: HeaderProps) {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbItems = segments.map((segment, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const isLast = i === segments.length - 1;
    const label = isLast && pageTitle ? pageTitle : segmentToLabel(segment);
    return { href, label, isLast };
  });

  return (
    <header className="sticky top-0 z-30 flex h-10 items-center justify-between border-b border-border bg-background/80 backdrop-blur-xl px-6">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="md:hidden shrink-0"
        >
          <Menu className="h-4 w-4" />
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
