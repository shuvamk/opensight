export interface PromptResultRecord {
  id: string;
  promptId: string;
  brandId: string;
  result?: unknown;
  brandMentioned?: boolean;
  competitorMentions?: unknown;
  createdAt?: string | null;
}

export interface PromptWithLatest {
  id: string;
  brandId: string;
  text: string;
  tags?: string[] | null;
  isActive?: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  latestResult?: PromptResultRecord | null;
}

export interface ListPromptsResponse {
  prompts: PromptWithLatest[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface GetPromptResponse {
  prompt: PromptWithLatest;
}

export interface CreatePromptPayload {
  text: string;
  tags?: string[];
}

export interface CreateBulkPromptsPayload {
  prompts: { text: string; tags?: string[] }[];
}

export interface CreateBulkPromptsResponse {
  created: number;
  skipped: number;
  prompts: PromptWithLatest[];
}

export interface UpdatePromptPayload {
  text?: string;
  tags?: string[];
  is_active?: boolean;
}

export interface GetPromptResultsResponse {
  promptId: string;
  prompt: PromptWithLatest;
  results: PromptResultRecord[];
}
