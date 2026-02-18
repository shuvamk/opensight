"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboard } from "@/hooks/useDashboard";
import { useBrandStore } from "@/stores/brand-store";
import { ArrowUp, ArrowDown } from "lucide-react";

export function EngineBreakdown() {
  const { activeBrandId } = useBrandStore();
  const { data: dashboardData, isLoading } = useDashboard(activeBrandId);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32 rounded-lg" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-12 w-20 mb-4 rounded-lg" />
              <Skeleton className="h-8 w-full mb-4 rounded-lg" />
              <Skeleton className="h-20 rounded-lg" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const metrics = dashboardData?.engineMetrics || [];

  if (metrics.length === 0) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="flex items-center justify-center h-48">
            <p className="text-text-secondary text-sm">No data available</p>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {metrics.map((metric) => (
        <Card key={metric.engine} className="hover:shadow-medium transition-shadow duration-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{metric.engine}</CardTitle>
              {metric.trend !== undefined && (
                <div
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    metric.trend > 0
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {metric.trend > 0 ? (
                    <ArrowUp className="w-3 h-3" />
                  ) : (
                    <ArrowDown className="w-3 h-3" />
                  )}
                  {Math.abs(metric.trend)}%
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold text-primary-500">{metric.score}%</div>

            {metric.sparklineData && metric.sparklineData.length > 0 && (
              <div className="h-6 flex items-end gap-0.5">
                {metric.sparklineData.map((point, i) => {
                  const maxValue = Math.max(
                    ...metric.sparklineData.map((p) => p.value)
                  );
                  const height =
                    maxValue > 0 ? (point.value / maxValue) * 100 : 0;
                  return (
                    <div
                      key={i}
                      className="flex-1 bg-indigo-200 rounded-sm hover:bg-indigo-300 transition-colors"
                      style={{ height: `${height}%`, minHeight: "2px" }}
                    />
                  );
                })}
              </div>
            )}

            <div>
              <p className="text-xs text-text-tertiary mb-1.5 font-medium">Top Prompt</p>
              <p className="text-sm font-medium text-indigo-500 line-clamp-2">
                {metric.topPrompt}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
