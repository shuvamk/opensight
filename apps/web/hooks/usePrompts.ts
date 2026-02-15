"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as promptsApi from "@/lib/api/prompts";
import type {
  PromptWithLatest,
  ListPromptsResponse,
  GetPromptResultsResponse,
  CreatePromptPayload,
} from "@/lib/api/prompts/types";

export type { PromptWithLatest, ListPromptsResponse, GetPromptResultsResponse };

interface PromptsParams {
  page?: number;
  limit?: number;
  tags?: string;
}

export function usePrompts(brandId?: string, params?: PromptsParams) {
  return useQuery({
    queryKey: ["brands", brandId, "prompts", params],
    queryFn: () => promptsApi.listPrompts(brandId!, params),
    enabled: !!brandId,
  });
}

export function usePrompt(brandId?: string, promptId?: string) {
  return useQuery({
    queryKey: ["brands", brandId, "prompts", promptId],
    queryFn: () => promptsApi.getPrompt(brandId!, promptId!),
    enabled: !!brandId && !!promptId,
  });
}

export function usePromptResults(brandId?: string, promptId?: string) {
  return useQuery({
    queryKey: ["brands", brandId, "prompts", promptId, "results"],
    queryFn: () => promptsApi.getPromptResults(brandId!, promptId!),
    enabled: !!brandId && !!promptId,
  });
}

export function useCreatePrompt(brandId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePromptPayload) =>
      promptsApi.createPrompt(brandId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands", brandId, "prompts"] });
    },
  });
}

export function useDeletePrompt(brandId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (promptId: string) =>
      promptsApi.deletePrompt(brandId!, promptId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands", brandId, "prompts"] });
    },
  });
}
