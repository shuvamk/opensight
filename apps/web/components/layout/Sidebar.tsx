"use client";

import { useEffect, useMemo, useState } from "react";
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
  ChevronsUpDown,
} from "lucide-react";
import BrandPopover from "./BrandPopover";
import UserMenu from "./UserMenu";
import { useBrands } from "@/hooks/useBrand";
import { useBrandStore } from "@/stores/brand-store";
import { BrandAvatar } from "./BrandPopover";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Prompts", href: "/dashboard/prompts", icon: Zap },
  { label: "Competitors", href: "/dashboard/competitors", icon: TrendingUp },
  { label: "Content Score", href: "/dashboard/content-score", icon: BarChart3 },
  { label: "Alerts", href: "/dashboard/alerts", icon: Bell },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { data: brandsData } = useBrands();
  const { activeBrandId, setActiveBrand } = useBrandStore();
  const brands = useMemo(
    () => (Array.isArray(brandsData) ? brandsData : []),
    [brandsData]
  );
  const activeBrand = useMemo(
    () => brands.find((b) => b.id === activeBrandId),
    [brands, activeBrandId]
  );
  useEffect(() => {
    if (brands.length > 0 && !activeBrandId) {
      setActiveBrand(brands[0].id);
    }
  }, [brands, activeBrandId, setActiveBrand]);
  const logoLabel = activeBrand ? activeBrand.name : "OpenSight";

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-border bg-background transition-all duration-300",
        collapsed ? "w-[72px]" : "w-[200px]"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo / Brand (click opens brand popover) */}
        <div className="flex items-center justify-between border-b border-border px-2 h-10">
          {!collapsed && (
            <BrandPopover
              brands={brands}
              activeBrand={activeBrand ?? null}
              onSelectBrand={(id) => setActiveBrand(id)}
              collapsed={false}
            >
              <div className="flex items-center gap-1.5 hover:bg-muted py-1 px-2 rounded-sm">
                <BrandAvatar className="size-5" name={logoLabel} id={activeBrandId ?? ""} />
                <span className="font-semibold text-primary truncate">{logoLabel}</span>
                <ChevronsUpDown className="size-4 ml-6" />
              </div>

            </BrandPopover>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "rounded-lg p-1.5 hover:bg-surface text-text-secondary hover:text-primary transition-colors",
              collapsed && "hidden"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-text-secondary hover:bg-surface hover:text-primary"
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={cn("h-[18px] w-[18px] shrink-0", collapsed && "mx-auto")} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User account - bottom left */}
        <div className="border-t border-border p-3">
          <UserMenu variant="sidebar" collapsed={collapsed} />
        </div>

        {/* Collapse toggle at bottom (when collapsed) */}
        {collapsed && (
          <div className="border-t border-border p-3">
            <button
              onClick={() => setCollapsed(false)}
              className="w-full flex items-center justify-center rounded-xl p-2 hover:bg-surface text-text-secondary hover:text-primary transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
