import { apiClient } from "@/lib/api-client";
import type {
  ListPromptsResponse,
  GetPromptResponse,
  CreatePromptPayload,
  CreateBulkPromptsPayload,
  CreateBulkPromptsResponse,
  UpdatePromptPayload,
  GetPromptResultsResponse,
  PromptWithLatest,
} from "./types";

export async function listPrompts(
  brandId: string,
  params?: { page?: number; limit?: number; tags?: string }
): Promise<ListPromptsResponse> {
  const search = new URLSearchParams();
  if (params?.page != null) search.set("page", String(params.page));
  if (params?.limit != null) search.set("limit", String(params.limit));
  if (params?.tags) search.set("tags", params.tags);
  const q = search.toString() ? `?${search.toString()}` : "";
  return apiClient.get<ListPromptsResponse>(
    `/brands/${brandId}/prompts${q}`
  );
}

export async function getPrompt(
  brandId: string,
  promptId: string
): Promise<PromptWithLatest> {
  const res = await apiClient.get<GetPromptResponse>(
    `/brands/${brandId}/prompts/${promptId}`
  );
  return res.prompt;
}

export async function createPrompt(
  brandId: string,
  payload: CreatePromptPayload
): Promise<PromptWithLatest> {
  const res = await apiClient.post<{ prompt: PromptWithLatest }>(
    `/brands/${brandId}/prompts`,
    payload
  );
  return res.prompt;
}

export async function createBulkPrompts(
  brandId: string,
  payload: CreateBulkPromptsPayload
): Promise<CreateBulkPromptsResponse> {
  return apiClient.post<CreateBulkPromptsResponse>(
    `/brands/${brandId}/prompts`,
    { prompts: payload.prompts }
  );
}

export async function updatePrompt(
  brandId: string,
  promptId: string,
  payload: UpdatePromptPayload
): Promise<PromptWithLatest> {
  const res = await apiClient.patch<{ prompt: PromptWithLatest }>(
    `/brands/${brandId}/prompts/${promptId}`,
    payload
  );
  return res.prompt;
}

export async function deletePrompt(
  brandId: string,
  promptId: string
): Promise<{ success: boolean }> {
  return apiClient.del<{ success: boolean }>(
    `/brands/${brandId}/prompts/${promptId}`
  );
}

export async function getPromptResults(
  brandId: string,
  promptId: string
): Promise<GetPromptResultsResponse> {
  return apiClient.get<GetPromptResultsResponse>(
    `/brands/${brandId}/prompts/${promptId}/results`
  );
}
