"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

interface Prompt {
  id: string;
  title: string;
  content: string;
  brandId: string;
}

interface PromptResult {
  id: string;
  promptId: string;
  result: string;
  timestamp: string;
}

interface PromptsParams {
  page?: number;
  limit?: number;
}

export function usePrompts(brandId?: string, params?: PromptsParams) {
  return useQuery({
    queryKey: ["brands", brandId, "prompts", params],
    queryFn: () => {
      const query = new URLSearchParams();
      if (params?.page) query.append("page", String(params.page));
      if (params?.limit) query.append("limit", String(params.limit));
      const queryString = query.toString();
      return apiClient.get<Prompt[]>(
        `/brands/${brandId}/prompts${queryString ? `?${queryString}` : ""}`
      );
    },
    enabled: !!brandId,
  });
}

export function usePrompt(brandId?: string, promptId?: string) {
  return useQuery({
    queryKey: ["brands", brandId, "prompts", promptId],
    queryFn: () =>
      apiClient.get<Prompt>(`/brands/${brandId}/prompts/${promptId}`),
    enabled: !!brandId && !!promptId,
  });
}

export function usePromptResults(brandId?: string, promptId?: string) {
  return useQuery({
    queryKey: ["brands", brandId, "prompts", promptId, "results"],
    queryFn: () =>
      apiClient.get<PromptResult[]>(
        `/brands/${brandId}/prompts/${promptId}/results`
      ),
    enabled: !!brandId && !!promptId,
  });
}
