"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboard } from "@/hooks/useDashboard";
import { useBrandStore } from "@/stores/brand-store";
import { ArrowUp, ArrowDown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function ChangesFeed() {
  const { activeBrandId } = useBrandStore();
  const { data: dashboardData, isLoading } = useDashboard(activeBrandId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Changes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 items-start">
              <Skeleton className="w-9 h-9 rounded-xl" />
              <div className="flex-1">
                <Skeleton className="h-4 w-full mb-2 rounded-lg" />
                <Skeleton className="h-3 w-32 rounded-lg" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const changes = dashboardData?.recentChanges.slice(0, 10) || [];

  if (changes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Changes</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <p className="text-text-secondary text-sm">No recent changes</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Changes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {changes.map((change) => (
          <div
            key={change.id}
            className="flex gap-4 items-start p-3 rounded-xl hover:bg-surface transition-colors -mx-1"
          >
            <div
              className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${
                change.type === "up" ? "bg-emerald-50" : "bg-red-50"
              }`}
            >
              {change.type === "up" ? (
                <ArrowUp className="w-4 h-4 text-emerald-600" />
              ) : (
                <ArrowDown className="w-4 h-4 text-red-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-primary-900">
                {change.description}
              </p>
              <p className="text-xs text-text-tertiary mt-0.5">
                {formatDistanceToNow(new Date(change.timestamp), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
