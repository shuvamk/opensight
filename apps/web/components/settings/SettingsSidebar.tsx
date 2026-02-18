"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Key, CreditCard, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Profile",
    href: "/settings/profile",
    icon: User,
  },
  {
    label: "API Keys",
    href: "/settings/api-keys",
    icon: Key,
  },
  {
    label: "Billing",
    href: "/settings/billing",
    icon: CreditCard,
  },
  {
    label: "Notifications",
    href: "/settings/notifications",
    icon: Bell,
  },
];

export function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-primary-500 text-white shadow-soft"
                : "text-text-secondary hover:bg-surface hover:text-primary-500"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
