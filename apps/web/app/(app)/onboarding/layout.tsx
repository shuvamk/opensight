"use client";

import { useRouter } from "next/navigation";
import { useAuthProfile } from "@/hooks/useAuth";
import OsIcon from "@/components/ui/OsIcon";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: user, isLoading } = useAuthProfile();

  // Redirect to login if not authenticated
  if (!isLoading && !user) {
    router.push("/login");
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <OsIcon className="h-14 w-14 animate-spin text-primary" aria-hidden />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      {children}
    </div>
  );
}
