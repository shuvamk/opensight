"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-12 w-20 mb-4" />
              <Skeleton className="h-8 w-full mb-4" />
              <Skeleton className="h-20" />
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
            <p className="text-text-secondary">No data available</p>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {metrics.map((metric) => (
        <Card key={metric.engine}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{metric.engine}</CardTitle>
              {metric.trend !== undefined && (
                <div className="flex items-center gap-1">
                  {metric.trend > 0 ? (
                    <ArrowUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-red-600" />
                  )}
                  <span
                    className={`text-sm font-semibold ${
                      metric.trend > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {Math.abs(metric.trend)}%
                  </span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold">{metric.score}%</div>

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
                      className="flex-1 bg-blue-200 rounded-sm"
                      style={{ height: `${height}%`, minHeight: "2px" }}
                    />
                  );
                })}
              </div>
            )}

            <div>
              <p className="text-xs text-text-secondary mb-2">Top Prompt</p>
              <p className="text-sm font-medium line-clamp-2">
                {metric.topPrompt}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
