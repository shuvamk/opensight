export interface Prompt {
  id: string;
  brand_id: string;
  text: string;
  tags: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  latest_results?: PromptResultSummary[];
}

export interface PromptResultSummary {
  engine: string;
  score: number;
  sentiment: string;
  mentioned: boolean;
}
