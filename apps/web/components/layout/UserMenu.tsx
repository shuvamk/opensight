"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
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
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface UserMenuProps {
  /** When true, trigger shows avatar + name + email in a row (for sidebar) */
  variant?: "default" | "sidebar";
  /** When true (sidebar collapsed), trigger is compact (avatar only) */
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
      <button
        type="button"
        className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-surface transition-colors"
      >
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarImage src={userAvatarUrl} alt={user.name} />
          <AvatarFallback className="bg-muted text-accent-foreground text-xs font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
      </button>
    ) : (
      <button
        type="button"
        className={cn(
          "relative rounded-full ring-2 ring-transparent hover:ring-border transition-all",
          isSidebar && "flex items-center justify-center w-full"
        )}
      >
        <Avatar className={cn("h-9 w-9", isSidebar && "h-8 w-8")}>
          <AvatarImage src={userAvatarUrl} alt={user.name} />
          <AvatarFallback className="bg-muted text-accent-foreground text-xs font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </button>
    );

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
