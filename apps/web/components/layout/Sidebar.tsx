"use client";

import { useBrands } from "@/hooks/useBrand";
import { cn } from "@/lib/utils";
import { useBrandStore } from "@/stores/brand-store";
import {
  ArrowTrendingUpIcon,
  BellIcon,
  BoltIcon,
  ChartBarIcon,
  ChevronUpDownIcon,
  Cog6ToothIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Button } from "../ui/button";
import OsIcon from "../ui/OsIcon";
import { BrandAvatar } from "./BrandAvatar";
import BrandPopover from "./BrandPopover";
import UserMenu from "./UserMenu";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: Squares2X2Icon },
  { label: "Prompts", href: "/dashboard/prompts", icon: BoltIcon },
  { label: "Competitors", href: "/dashboard/competitors", icon: ArrowTrendingUpIcon },
  { label: "Content Score", href: "/dashboard/content-score", icon: ChartBarIcon },
  { label: "Alerts", href: "/dashboard/alerts", icon: BellIcon },
  { label: "Settings", href: "/settings", icon: Cog6ToothIcon },
];

export default function Sidebar({ collapsed }: { collapsed: boolean }) {
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
        "h-screen border-r border-border bg-background transition-all duration-300",
        collapsed ? "w-[56px]" : "w-[200px]"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo / Brand (click opens brand popover) */}
        <div className={cn("flex items-center border-b border-border px-0.5 h-10", collapsed ? "justify-center" : "justify-start")}>
          <BrandPopover
            brands={brands}
            activeBrand={activeBrand ?? null}
            onSelectBrand={(id) => setActiveBrand(id)}
            onBrandDeleted={(deletedId) => {
              if (deletedId === activeBrandId) {
                const next = brands.find((b) => b.id !== deletedId);
                setActiveBrand(next?.id ?? "");
              }
            }}
            collapsed={false}
          >
            <Button
              type="button"
              variant="ghost"
              className={cn("px-1 font-sans gap-1.5 text-left normal-case w-full", collapsed && "w-9 justify-center")}
            >
              {logoLabel === "OpenSight" ? <OsIcon className="size-5 text-primary" aria-hidden /> : <BrandAvatar size={20} name={logoLabel} id={activeBrandId ?? ""} />}
              {!collapsed && (
                <>
                  <span className="w-full font-[450] text-foreground text-base truncate flex-1">{logoLabel}</span>
                  <ChevronUpDownIcon className="size-4" />
                </>
              )}
            </Button>
          </BrandPopover>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (

              <Button
                key={item.href}
                variant={isActive ? "primary-ghost" : "ghost"}
                className={cn(collapsed ? "px-0" : "px-3", "w-full justify-start")}
                render={
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className={cn("h-[18px] w-[18px] shrink-0", collapsed && "mx-auto")} />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                }
              />
            );
          })}
        </nav>

        <div className="p-2">
          <UserMenu variant="sidebar" collapsed={collapsed} />
        </div>
      </div>
    </aside>
  );
}
