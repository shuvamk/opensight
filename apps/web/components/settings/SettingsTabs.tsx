"use client";

import { usePathname, useRouter } from "next/navigation";
import { User, Key, CreditCard, Bell } from "lucide-react";
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs";

const navItems = [
  { label: "Profile", href: "/settings/profile", icon: User },
  { label: "API Keys", href: "/settings/api-keys", icon: Key },
  { label: "Billing", href: "/settings/billing", icon: CreditCard },
  { label: "Notifications", href: "/settings/notifications", icon: Bell },
];

export function SettingsTabs() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Tabs
      value={pathname}
      onValueChange={(value) => router.push(value)}
      aria-label="Settings"
    >
      <TabsList variant="underline" className="justify-start border-b border-border rounded-none bg-transparent p-0 h-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <TabsTab
              key={item.href}
              value={item.href}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </TabsTab>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
