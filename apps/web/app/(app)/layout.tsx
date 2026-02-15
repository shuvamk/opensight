"use client";

import { useState } from "react";
import { useProfile } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: user, isLoading } = useProfile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Redirect to login if not authenticated
  if (!isLoading && !user) {
    router.push("/login");
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-xs tracking-wider">OS</span>
          </div>
          <div className="text-sm text-text-secondary">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-surface">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="p-0 w-60">
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col md:ml-60">
        <Header onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
