"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as apiKeysApi from "@/lib/api/api-keys";
import type {
  ApiKey,
  CreateApiKeyResponse,
} from "@/lib/api/api-keys/types";

export type { ApiKey, CreateApiKeyResponse };

export function useApiKeys() {
  return useQuery({
    queryKey: ["apiKeys"],
    queryFn: () => apiKeysApi.listApiKeys(),
  });
}

export function useCreateApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string }) => apiKeysApi.createApiKey(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apiKeys"] });
    },
  });
}

export function useRevokeApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiKeysApi.revokeApiKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apiKeys"] });
    },
  });
}
