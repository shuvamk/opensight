"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  Settings,
  Users,
  BookOpen,
  Sun,
  Moon,
  Monitor,
  LogOut,
  Plus,
  SwatchBook,
} from "lucide-react";
import { useAuthProfile, useLogout } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site-config";

type User = { name: string; email: string } & { avatar_url?: string };

function SidebarPopoverContent({
  user,
  userAvatarUrl,
  initials,
  onLogout,
}: {
  user: User;
  userAvatarUrl: string;
  initials: string;
  onLogout: () => void;
}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  const themeOptions = [
    { value: "light" as const, icon: Sun, label: "Light" },
    { value: "dark" as const, icon: Moon, label: "Dark" },
    { value: "system" as const, icon: Monitor, label: "System" },
  ] as const;

  return (
    <div className="flex flex-col">
      {/* User block: avatar left, name + email right */}
      <div className="flex items-center gap-1.5 p-1">
        <Avatar className="h-11 w-11 shrink-0">
          <AvatarImage src={userAvatarUrl} alt={user.name} />
          <AvatarFallback className="bg-muted text-accent-foreground text-sm font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>


      <div className="px-1 pb-1">
        <Button
          size="xs"
          render={
            <Link href="/settings/billing" className="gap-2">
              <Plus className="size-4" />
              Increase Limit
            </Link>
          }
          className="w-full"
        />
      </div>

      <Separator />

      <div className="flex flex-col p-1">
        <Button
          render={
            <Link href="/settings">
              <Settings className="size-4 shrink-0" />
              Settings
            </Link>
          }
          variant="ghost"
          size="sm"
          className="w-full justify-start"
        />
        <Button
          render={
            <Link href="/settings/team">
              <Users className="size-4 shrink-0" />
              Invite members
            </Link>
          }
          variant="ghost"
          size="sm"
          className="w-full justify-start"
        />
        <Button
          render={
            <Link href={site.links.docs} target="_blank" rel="noopener noreferrer">
              <BookOpen className="size-4 shrink-0" />
              Documentation
            </Link>
          }
          variant="ghost"
          size="sm"
          className="w-full justify-start"
        />
      </div>

      <Separator />

      {/* Theme: label + tabs */}
      <div className="w-full flex justify-between items-center p-1 pl-3.5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <SwatchBook className="size-4 shrink-0" />
          <span>Theme</span>
        </div>
        {mounted && (
          <Tabs
            value={theme ?? "system"}
            onValueChange={(v) => setTheme(v as "light" | "dark" | "system")}
          >
            <TabsList>
              {themeOptions.map(({ value, icon: Icon }) => (
                <TabsTab
                  key={value}
                  value={value}
                  aria-label={value}
                  className="size-7! px-!"
                >
                  <Icon />
                </TabsTab>
              ))}
            </TabsList>
          </Tabs>
        )}
      </div>

      <Separator />

      {/* Logout */}
      <div className="p-1">
        <Button
          type="button"
          variant="destructive-ghost"
          onClick={onLogout}
          className="w-full justify-start"
        >
          <LogOut className="size-4 shrink-0" />
          Logout
        </Button>
      </div>
    </div>
  );
}

interface UserMenuProps {
  variant?: "default" | "sidebar";
  collapsed?: boolean;
}

export default function UserMenu({ variant = "default", collapsed }: UserMenuProps) {
  const router = useRouter();
  const { data: user, isLoading } = useAuthProfile();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    router.push("/login");
  };

  if (isLoading || !user) {
    return (
      <div
        className={cn(
          "animate-pulse rounded-full bg-muted",
          variant === "sidebar" && !collapsed ? "h-10 w-10 shrink-0" : "h-9 w-9"
        )}
      />
    );
  }

  const initials = user.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  const isSidebar = variant === "sidebar";
  const userAvatarUrl = (user as { avatar_url?: string }).avatar_url ?? "";
  const triggerContent =
    isSidebar && !collapsed ? (
      <Button
        type="button"
        variant="ghost"
        className="w-full justify-start gap-1 font-sans normal-case font-medium text-foreground hover:bg-surface"
      >
        <Avatar className="size-7 shrink-0">
          <AvatarImage src={userAvatarUrl} alt={user.name} />
          <AvatarFallback className="bg-muted text-accent-foreground text-xs font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 text-left -space-y-0.5">
          <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
      </Button>
    ) : (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn(
          "rounded-full ring-2 ring-transparent hover:ring-border",
          isSidebar && "w-full"
        )}
      >
        <Avatar className={cn("h-9 w-9", isSidebar && "h-8 w-8")}>
          <AvatarImage src={userAvatarUrl} alt={user.name} />
          <AvatarFallback className="bg-muted text-accent-foreground text-xs font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </Button>
    );

  if (isSidebar) {
    return (
      <Popover>
        <PopoverTrigger render={triggerContent} />
        <PopoverContent
          side="right"
          align="start"
          sideOffset={4}
          alignOffset={16}
          className="w-72 rounded-xl p-0"
        >
          <SidebarPopoverContent user={user} userAvatarUrl={userAvatarUrl} initials={initials} onLogout={handleLogout} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={triggerContent} />
      <DropdownMenuContent align="end" className="w-56 rounded-xl">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-primary-500">{user.name}</span>
              <span className="text-xs text-text-secondary">{user.email}</span>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/settings/profile" className="cursor-pointer">Profile</Link>} />
        <DropdownMenuItem render={<Link href="/settings/api-keys" className="cursor-pointer">API Keys</Link>} />
        <DropdownMenuItem render={<Link href="/settings/billing" className="cursor-pointer">Billing</Link>} />
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer focus:text-red-600">
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
