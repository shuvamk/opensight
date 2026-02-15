"use client";

import React from "react";
import { useDashboard } from "@/hooks/useDashboard";
import { useBrandStore } from "@/stores/brand-store";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { VisibilityChart } from "@/components/dashboard/VisibilityChart";
import { EngineBreakdown } from "@/components/dashboard/EngineBreakdown";
import { ChangesFeed } from "@/components/dashboard/ChangesFeed";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { activeBrandId } = useBrandStore();
  const { data: dashboardData, isLoading } = useDashboard(activeBrandId);

  if (!activeBrandId) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <div className="flex items-center justify-center h-96 rounded-lg border border-dashed">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">No brand selected</h3>
            <p className="text-text-secondary">
              Please select or create a brand to view your dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>

        {/* Metric Cards Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-lg border bg-white p-6">
              <Skeleton className="h-4 w-24 mb-4" />
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-6 w-20" />
            </div>
          ))}
        </div>

        {/* Chart Skeleton */}
        <Skeleton className="h-80 rounded-lg" />

        {/* Engine Breakdown Skeleton */}
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))}
        </div>

        {/* Feed Skeleton */}
        <Skeleton className="h-80 rounded-lg" />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <div className="flex items-center justify-center h-96 rounded-lg border border-dashed">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">No data yet</h3>
            <p className="text-text-secondary">
              Setting up your first analysis...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { metrics } = dashboardData;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Overall Score"
          value={metrics.overallScore}
          suffix="%"
          decimals={1}
        />
        <MetricCard
          title="Total Mentions"
          value={metrics.totalMentions}
        />
        <MetricCard
          title="Positive Sentiment"
          value={metrics.positiveSentimentPercent}
          suffix="%"
          decimals={1}
        />
        <MetricCard
          title="Active Prompts"
          value={metrics.activePrompts}
        />
      </div>

      {/* Visibility Chart */}
      <VisibilityChart />

      {/* Engine Breakdown */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Engine Performance</h3>
        <EngineBreakdown />
      </div>

      {/* Changes Feed */}
      <ChangesFeed />
    </div>
  );
}
