"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface Competitor {
  id: string;
  name: string;
  url: string;
  latestScore: number;
  brandId: string;
  createdAt: string;
}

export interface ShareOfVoiceData {
  brand: number;
  competitors: { name: string; value: number }[];
}

export interface GapAnalysisItem {
  promptId: string;
  promptText: string;
  competitorsPresent: string[];
  opportunityScore: number;
}

export interface CompetitorTrendData {
  date: string;
  brand: number;
  competitor: number;
}

export function useCompetitors(brandId?: string) {
  return useQuery({
    queryKey: ["brands", brandId, "competitors"],
    queryFn: () =>
      apiClient.get<Competitor[]>(`/brands/${brandId}/competitors`),
    enabled: !!brandId,
  });
}

export function useShareOfVoice(brandId?: string) {
  return useQuery({
    queryKey: ["brands", brandId, "share-of-voice"],
    queryFn: () =>
      apiClient.get<ShareOfVoiceData>(
        `/brands/${brandId}/share-of-voice`
      ),
    enabled: !!brandId,
    staleTime: 1000 * 60 * 10,
  });
}

export function useGapAnalysis(brandId?: string) {
  return useQuery({
    queryKey: ["brands", brandId, "gap-analysis"],
    queryFn: () =>
      apiClient.get<GapAnalysisItem[]>(
        `/brands/${brandId}/gap-analysis`
      ),
    enabled: !!brandId,
    staleTime: 1000 * 60 * 10,
  });
}

export function useCompetitorTrends(
  brandId?: string,
  competitorId?: string
) {
  return useQuery({
    queryKey: ["brands", brandId, "competitors", competitorId, "trends"],
    queryFn: () =>
      apiClient.get<CompetitorTrendData[]>(
        `/brands/${brandId}/competitors/${competitorId}/trends`
      ),
    enabled: !!brandId && !!competitorId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useAddCompetitor(brandId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; url: string }) =>
      apiClient.post<Competitor>(
        `/brands/${brandId}/competitors`,
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["brands", brandId, "competitors"],
      });
    },
  });
}

export function useRemoveCompetitor(brandId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (competitorId: string) =>
      apiClient.del(`/brands/${brandId}/competitors/${competitorId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["brands", brandId, "competitors"],
      });
    },
  });
}
