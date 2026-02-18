export interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  lastUsedAt: string | null;
  createdAt: string;
  revokedAt?: string | null;
  requestsToday?: number;
  requestsThisMonth?: number;
}

export interface ListApiKeysResponse {
  keys: ApiKey[];
}

export interface CreateApiKeyPayload {
  name: string;
}

export interface CreateApiKeyResponse {
  key: ApiKey & { key?: string };
  warning?: string;
}

export interface RevokeApiKeyResponse {
  key: ApiKey;
  message: string;
}
