"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

interface Brand {
  id: string;
  name: string;
  description?: string;
}

interface DashboardData {
  brandId: string;
  metrics: Record<string, unknown>;
}

interface TrendData {
  timestamp: string;
  value: number;
}

export function useBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: () => apiClient.get<Brand[]>("/brands"),
  });
}

export function useBrand(id?: string) {
  return useQuery({
    queryKey: ["brands", id],
    queryFn: () => apiClient.get<Brand>(`/brands/${id}`),
    enabled: !!id,
  });
}

export function useDashboard(id?: string) {
  return useQuery({
    queryKey: ["brands", id, "dashboard"],
    queryFn: () => apiClient.get<DashboardData>(`/brands/${id}/dashboard`),
    enabled: !!id,
  });
}

export function useTrends(id?: string, range?: string) {
  return useQuery({
    queryKey: ["brands", id, "trends", range],
    queryFn: () =>
      apiClient.get<TrendData[]>(`/brands/${id}/trends`, {
        headers: range ? { "X-Range": range } : {},
      }),
    enabled: !!id,
  });
}
