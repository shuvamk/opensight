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
              "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              isActive
                ? "bg-blue-100 text-blue-900"
                : "text-gray-700 hover:bg-gray-100"
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
