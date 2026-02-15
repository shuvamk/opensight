export interface Brand {
  id: string;
  user_id: string;
  name: string;
  website_url: string;
  industry: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Competitor {
  id: string;
  brand_id: string;
  name: string;
  website_url: string;
  created_at: string;
}

export interface DashboardData {
  overall_score: number;
  engine_scores: {
    chatgpt: number | null;
    perplexity: number | null;
    google_aio: number | null;
  };
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  total_mentions: number;
  total_prompts: number;
  recent_changes: Change[];
}

export interface Change {
  id: string;
  type: 'visibility_up' | 'visibility_down' | 'new_mention' | 'sentiment_shift';
  description: string;
  engine: string | null;
  change_value: number | null;
  created_at: string;
}

export interface TrendDataPoint {
  date: string;
  overall: number;
  chatgpt: number | null;
  perplexity: number | null;
  google_aio: number | null;
}

export interface VisibilitySnapshot {
  id: string;
  brand_id: string;
  snapshot_date: string;
  overall_score: number;
  chatgpt_score: number | null;
  perplexity_score: number | null;
  google_aio_score: number | null;
  sentiment_positive: number;
  sentiment_neutral: number;
  sentiment_negative: number;
  total_mentions: number;
  total_prompts_checked: number;
  competitor_data: Record<string, { score: number; mentions: number }>;
  created_at: string;
}
