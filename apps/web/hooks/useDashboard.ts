"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface DashboardMetrics {
  overallScore: number;
  totalMentions: number;
  positiveSentimentPercent: number;
  activePrompts: number;
}

export interface TrendData {
  date: string;
  chatgpt: number;
  perplexity: number;
  googleAIO: number;
}

export interface EngineMetric {
  engine: string;
  score: number;
  trend: number;
  topPrompt: string;
  sparklineData: Array<{ value: number }>;
}

export interface Change {
  id: string;
  type: "up" | "down";
  description: string;
  timestamp: string;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  trends: TrendData[];
  engineMetrics: EngineMetric[];
  recentChanges: Change[];
}

export function useDashboard(brandId?: string) {
  return useQuery({
    queryKey: ["brands", brandId, "dashboard"],
    queryFn: () => apiClient.get<DashboardData>(`/brands/${brandId}/dashboard`),
    enabled: !!brandId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useTrends(
  brandId?: string,
  timeRange: "7d" | "30d" | "90d" = "30d"
) {
  return useQuery({
    queryKey: ["brands", brandId, "trends", timeRange],
    queryFn: () =>
      apiClient.get<TrendData[]>(
        `/brands/${brandId}/trends?timeRange=${timeRange}`
      ),
    enabled: !!brandId,
    staleTime: 1000 * 60 * 5,
  });
}
