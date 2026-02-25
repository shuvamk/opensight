"use client";

import { useEffect, useState } from "react";
import { useAuthProfile } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export default function AppLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: user, isLoading } = useAuthProfile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  if (!isLoading && !user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center animate-pulse">
            <span className="text-primary-foreground font-bold text-xs tracking-wider">OS</span>
          </div>
          <div className="text-sm text-text-secondary">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-surface">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="md:hidden">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="p-0 w-60">
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-1 flex-col md:ml-60">
        <Header onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-3">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
