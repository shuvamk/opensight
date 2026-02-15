"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as competitorsApi from "@/lib/api/competitors";
import type {
  Competitor,
  CompetitorComparisonResponse,
} from "@/lib/api/competitors/types";

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

export type { Competitor, CompetitorComparisonResponse };

export function useCompetitors(brandId?: string) {
  return useQuery({
    queryKey: ["brands", brandId, "competitors"],
    queryFn: () => competitorsApi.listCompetitors(brandId!),
    enabled: !!brandId,
  });
}

export function useCompetitorComparison(brandId?: string) {
  return useQuery({
    queryKey: ["brands", brandId, "competitors", "comparison"],
    queryFn: () => competitorsApi.getCompetitorComparison(brandId!),
    enabled: !!brandId,
    staleTime: 1000 * 60 * 10,
  });
}

/** Derived from competitor comparison; API returns shareOfVoice as string */
export function useShareOfVoice(brandId?: string) {
  return useQuery({
    queryKey: ["brands", brandId, "share-of-voice"],
    queryFn: async (): Promise<ShareOfVoiceData> => {
      const comparison = await competitorsApi.getCompetitorComparison(brandId!);
      const brandVal = Number(comparison.brand.shareOfVoice) || 0;
      const competitors = comparison.competitors.map((c) => ({
        name: c.name,
        value: Number(c.shareOfVoice) || 0,
      }));
      return { brand: brandVal, competitors };
    },
    enabled: !!brandId,
    staleTime: 1000 * 60 * 10,
  });
}

/** API has no dedicated gap analysis endpoint; return empty for now */
export function useGapAnalysis(brandId?: string) {
  return useQuery({
    queryKey: ["brands", brandId, "gap-analysis"],
    queryFn: async (): Promise<GapAnalysisItem[]> => [],
    enabled: !!brandId,
    staleTime: 1000 * 60 * 10,
  });
}

export function useAddCompetitor(brandId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; website_url: string }) =>
      competitorsApi.addCompetitor(brandId!, data),
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
      competitorsApi.removeCompetitor(brandId!, competitorId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["brands", brandId, "competitors"],
      });
    },
  });
}
