"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuthProfile } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useBrands } from "@/hooks/useBrand";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import OsIcon from "../ui/OsIcon";

export default function AppLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user, isLoading: authLoading } = useAuthProfile();
  const { data: brandsData, isLoading: brandsLoading } = useBrands();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const brands = useMemo(
    () => (Array.isArray(brandsData) ? brandsData : []),
    [brandsData]
  );
  const hasNoBrands = !brandsLoading && brands.length === 0;
  const isOnboardingPage = pathname === "/onboarding" || pathname.startsWith("/onboarding/");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (user && hasNoBrands && !isOnboardingPage) {
      router.replace("/onboarding");
    }
  }, [authLoading, user, hasNoBrands, isOnboardingPage, router]);

  if (!authLoading && !user) {
    return null;
  }

  if (authLoading || (user && brandsLoading && !isOnboardingPage)) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-4">
          <OsIcon className="h-14 w-14 animate-spin text-primary" aria-hidden />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-surface">
      <div className="hidden md:block">
        <Sidebar collapsed={collapsed} />
      </div>

      <div className="md:hidden">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" showCloseButton={false} className="p-0 flex w-fit">
            <Sidebar collapsed={collapsed} />
          </SheetContent>
        </Sheet>
      </div>

      <div className={cn("flex flex-1 flex-col", collapsed ? "mdml-[56px]" : "mdml-[200px]")}>
        <Header
          onMenuClick={() => setMobileMenuOpen(true)}
          collapsed={collapsed}
          onCollapsedToggle={() => setCollapsed(!collapsed)}
        />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="p-3">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
