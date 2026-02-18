"use client";

import { useQuery } from "@tanstack/react-query";
import * as brandsApi from "@/lib/api/brands";
import type { Brand, DashboardData, GetBrandTrendsResponse } from "@/lib/api/brands/types";

export type { Brand, DashboardData };

export function useBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: () => brandsApi.listBrands(),
  });
}

export function useBrand(id?: string) {
  return useQuery({
    queryKey: ["brands", id],
    queryFn: () => brandsApi.getBrand(id!),
    enabled: !!id,
  });
}

export function useDashboard(id?: string) {
  return useQuery({
    queryKey: ["brands", id, "dashboard"],
    queryFn: () => brandsApi.getBrandDashboard(id!),
    enabled: !!id,
  });
}

export function useTrends(id?: string, range?: string) {
  return useQuery({
    queryKey: ["brands", id, "trends", range],
    queryFn: () => brandsApi.getBrandTrends(id!, range),
    enabled: !!id,
  });
}

export type { GetBrandTrendsResponse };
