"use client";

import { useDashboard } from "@/hooks/useDashboard";
import { useBrandStore } from "@/stores/brand-store";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { VisibilityChart } from "@/components/dashboard/VisibilityChart";
import { EngineBreakdown } from "@/components/dashboard/EngineBreakdown";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  const { activeBrandId } = useBrandStore();
  const { data: dashboardData, isLoading } = useDashboard(
    activeBrandId ?? undefined,
  );

  if (!activeBrandId) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-primary-500">Dashboard</h2>
          <p className="text-text-secondary text-sm mt-1">
            Your AI visibility overview
          </p>
        </div>
        <div className="flex items-center justify-center h-96 rounded-2xl border border-dashed border-border bg-white">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-surface flex items-center justify-center mx-auto">
              <BarChart3 className="w-6 h-6 text-text-tertiary" />
            </div>
            <h3 className="text-base font-semibold text-primary-500">
              No brand selected
            </h3>
            <p className="text-sm text-text-secondary max-w-sm">
              Select or create a brand to start tracking your AI visibility.
            </p>
            <Link href="/onboarding">
              <Button size="sm" className="mt-2">
                <Plus className="w-4 h-4 mr-2" />
                Add Brand
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-primary-500">Dashboard</h2>
          <p className="text-text-secondary text-sm mt-1">
            Your AI visibility overview
          </p>
        </div>

        {/* Metric Cards Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-white p-5"
            >
              <Skeleton className="h-4 w-24 mb-4 rounded-lg" />
              <Skeleton className="h-8 w-32 mb-2 rounded-lg" />
              <Skeleton className="h-6 w-20 rounded-lg" />
            </div>
          ))}
        </div>

        <Skeleton className="h-80 rounded-2xl" />

        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>

        <Skeleton className="h-80 rounded-2xl" />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-primary-500">Dashboard</h2>
          <p className="text-text-secondary text-sm mt-1">
            Your AI visibility overview
          </p>
        </div>
        <div className="flex items-center justify-center h-96 rounded-2xl border border-dashed border-border bg-white">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-surface flex items-center justify-center mx-auto">
              <BarChart3 className="w-6 h-6 text-text-tertiary" />
            </div>
            <h3 className="text-base font-semibold text-primary-500">
              No data yet
            </h3>
            <p className="text-sm text-text-secondary">
              Setting up your first analysis...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary-500">Dashboard</h2>
        <p className="text-text-secondary text-sm mt-1">
          Your AI visibility overview
        </p>
      </div>

      {/* Metric Cards */}
      {dashboardData && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Overall Score"
            value={dashboardData?.overallScore || 0}
            suffix="%"
            decimals={1}
          />
          <MetricCard
            title="Total Mentions"
            value={dashboardData?.totalMentions || 0}
          />
          <MetricCard
            title="Positive Sentiment"
            value={dashboardData?.sentimentBreakdown?.positive || 0}
            suffix="%"
            decimals={1}
          />
          <MetricCard
            title="Active Prompts"
            value={dashboardData?.totalPromptsChecked || 0}
          />
        </div>
      )}

      {/* Visibility Chart */}
      <VisibilityChart />

      {/* Engine Breakdown */}
      <div>
        <h3 className="text-base font-semibold text-primary-500 mb-4">
          Engine Performance
        </h3>
        <EngineBreakdown />
      </div>

      {/* Changes Feed */}
      {/* <ChangesFeed /> */}
    </div>
  );
}
