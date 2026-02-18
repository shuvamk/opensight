"use client";

import { useQuery } from "@tanstack/react-query";
import * as brandsApi from "@/lib/api/brands";
import type { DashboardData } from "@/lib/api/brands/types";

export type { DashboardData };

export function useDashboard(brandId?: string | null) {
  return useQuery({
    queryKey: ["brands", brandId, "dashboard"],
    queryFn: () => brandsApi.getBrandDashboard(brandId!),
    enabled: !!brandId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useTrends(brandId?: string, timeRange?: string) {
  return useQuery({
    queryKey: ["brands", brandId, "trends", timeRange],
    queryFn: () => brandsApi.getBrandTrends(brandId!, timeRange),
    enabled: !!brandId,
    staleTime: 1000 * 60 * 5,
  });
}
