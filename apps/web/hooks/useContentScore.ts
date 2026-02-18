"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as contentApi from "@/lib/api/content";
import type {
  ScoreHistoryResponse,
  ScoreContentResult,
} from "@/lib/api/content/types";

export type { ScoreHistoryResponse, ScoreContentResult };

export function useScoreHistory(params?: { limit?: number; offset?: number }) {
  return useQuery({
    queryKey: ["contentScoreHistory", params],
    queryFn: () =>
      contentApi.getScoreHistory(params?.limit, params?.offset),
  });
}

export function useScoreContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (url: string) => contentApi.scoreContent({ url }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contentScoreHistory"] });
    },
  });
}
