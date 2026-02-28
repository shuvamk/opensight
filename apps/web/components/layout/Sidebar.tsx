"use client";

import { useBrands } from "@/hooks/useBrand";
import { cn } from "@/lib/utils";
import { useBrandStore } from "@/stores/brand-store";
import {
  BarChart3,
  Bell,
  ChevronsUpDown,
  LayoutDashboard,
  Settings,
  SidebarCloseIcon,
  SidebarOpenIcon,
  TrendingUp,
  Zap
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Button } from "../ui/button";
import { BrandAvatar } from "./BrandAvatar";
import BrandPopover from "./BrandPopover";
import UserMenu from "./UserMenu";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Prompts", href: "/dashboard/prompts", icon: Zap },
  { label: "Competitors", href: "/dashboard/competitors", icon: TrendingUp },
  { label: "Content Score", href: "/dashboard/content-score", icon: BarChart3 },
  { label: "Alerts", href: "/dashboard/alerts", icon: Bell },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean, setCollapsed: (collapsed: boolean) => void }) {
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
        collapsed ? "w-[56px]" : "w-[200px]"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo / Brand (click opens brand popover) */}
        <div className={cn("flex items-center border-b border-border px-1.5 h-10 group", collapsed ? "justify-center" : "justify-between")}>
          <BrandPopover
            brands={brands}
            activeBrand={activeBrand ?? null}
            onSelectBrand={(id) => setActiveBrand(id)}
            collapsed={false}
          >
            <Button
              type="button"
              variant="ghost"
              className={cn("px-1 font-sans text-left normal-case", collapsed && "group-hover:opacity-0")}
            >
              <BrandAvatar size={24} name={logoLabel} id={activeBrandId ?? ""} />
              {!collapsed &&
                <>
                  <span className="font-medium truncate flex-1">{logoLabel}</span>
                  <ChevronsUpDown className="size-4 ml-6" />
                </>
              }
            </Button>
          </BrandPopover>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "rounded-lg p-1.5 group-hover:bg-surface text-text-secondary hover:text-primary transition-colors",
              collapsed && "absolute group-hover:opacity-100 opacity-0"
            )}
          >            {collapsed ? <SidebarOpenIcon className="h-4 w-4" /> : <SidebarCloseIcon className="h-4 w-4" />}

          </Button>
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
                  "flex items-center gap-3 rounded-md py-1.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-text-secondary hover:bg-surface hover:text-primary",
                  collapsed ? "px-0" : "px-3"
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={cn("h-[18px] w-[18px] shrink-0", collapsed && "mx-auto")} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <UserMenu variant="sidebar" collapsed={collapsed} />
        </div>
      </div>
    </aside>
  );
}
