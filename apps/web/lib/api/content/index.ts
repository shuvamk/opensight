import { apiClient } from "@/lib/api-client";
import type {
  ScoreHistoryResponse,
  ScoreContentPayload,
  ScoreContentResult,
} from "./types";

export async function getScoreHistory(
  limit?: number,
  offset?: number
): Promise<ScoreHistoryResponse> {
  const params = new URLSearchParams();
  if (limit != null) params.set("limit", String(limit));
  if (offset != null) params.set("offset", String(offset));
  const q = params.toString() ? `?${params.toString()}` : "";
  return apiClient.get<ScoreHistoryResponse>(`/content/score/history${q}`);
}

export async function scoreContent(
  payload: ScoreContentPayload
): Promise<ScoreContentResult> {
  return apiClient.post<ScoreContentResult>("/content/score", payload);
}
