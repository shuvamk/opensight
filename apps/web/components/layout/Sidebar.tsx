"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Zap,
  TrendingUp,
  BarChart3,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import BrandSwitcher from "./BrandSwitcher";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Prompts", href: "/prompts", icon: Zap },
  { label: "Competitors", href: "/competitors", icon: TrendingUp },
  { label: "Content Score", href: "/content-score", icon: BarChart3 },
  { label: "Alerts", href: "/alerts", icon: Bell },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-border bg-white transition-all duration-300",
        collapsed ? "w-[72px]" : "w-60"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-border px-4 h-16">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary-900 flex items-center justify-center">
                <span className="text-white font-bold text-xs tracking-wider">OS</span>
              </div>
              <span className="font-semibold text-primary-900">OpenSight</span>
            </Link>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-primary-900 flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-xs tracking-wider">OS</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "rounded-lg p-1.5 hover:bg-surface text-text-secondary hover:text-primary-900 transition-colors",
              collapsed && "hidden"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>

        {/* Brand Switcher */}
        <div className="border-b border-border px-3 py-3">
          <BrandSwitcher collapsed={collapsed} />
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary-900 text-white shadow-soft"
                    : "text-text-secondary hover:bg-surface hover:text-primary-900"
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={cn("h-[18px] w-[18px] flex-shrink-0", collapsed && "mx-auto")} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle at bottom */}
        {collapsed && (
          <div className="border-t border-border p-3">
            <button
              onClick={() => setCollapsed(false)}
              className="w-full flex items-center justify-center rounded-xl p-2 hover:bg-surface text-text-secondary hover:text-primary-900 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
