import { apiClient } from "@/lib/api-client";
import type {
  ApiKey,
  ListApiKeysResponse,
  CreateApiKeyPayload,
  CreateApiKeyResponse,
  RevokeApiKeyResponse,
} from "./types";

export async function listApiKeys(): Promise<ApiKey[]> {
  const res = await apiClient.get<ListApiKeysResponse>("/api-keys");
  return res.keys;
}

export async function createApiKey(
  payload: CreateApiKeyPayload
): Promise<CreateApiKeyResponse> {
  return apiClient.post<CreateApiKeyResponse>("/api-keys", payload);
}

export async function revokeApiKey(id: string): Promise<RevokeApiKeyResponse> {
  return apiClient.del<RevokeApiKeyResponse>(`/api-keys/${id}`);
}
