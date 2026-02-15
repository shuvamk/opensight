export interface PromptResult {
  id: string;
  prompt_id: string;
  brand_id: string;
  engine: EngineType;
  run_date: string;
  response_text: string;
  brand_mentioned: boolean;
  mention_position: number | null;
  sentiment_score: number;
  sentiment_label: SentimentLabel;
  citation_urls: string[];
  competitor_mentions: CompetitorMention[];
  visibility_score: number;
  created_at: string;
}

export type EngineType = 'chatgpt' | 'perplexity' | 'google_aio';
export type SentimentLabel = 'positive' | 'neutral' | 'negative';

export interface CompetitorMention {
  name: string;
  position: number;
  sentiment: SentimentLabel;
}

export interface ContentScore {
  id: string;
  user_id: string;
  url: string;
  overall_score: number;
  structure_score: number | null;
  readability_score: number | null;
  freshness_score: number | null;
  key_content_score: number | null;
  citation_score: number | null;
  recommendations: ContentRecommendation[];
  scored_at: string;
}

export interface ContentRecommendation {
  dimension: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  metadata: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
}

export type NotificationType = 'visibility_drop' | 'new_mention' | 'sentiment_shift' | 'competitor_new';

export interface NotificationSettings {
  id: string;
  user_id: string;
  email_frequency: 'daily' | 'weekly' | 'none';
  alert_visibility_drop: boolean;
  alert_new_mention: boolean;
  alert_sentiment_shift: boolean;
  alert_competitor_new: boolean;
  webhook_url: string | null;
  updated_at: string;
}

export interface ApiKey {
  id: string;
  user_id: string;
  name: string;
  key_prefix: string;
  last_used_at: string | null;
  requests_today: number;
  requests_month: number;
  created_at: string;
}

export interface CompetitorComparison {
  share_of_voice: { brand_name: string; percentage: number }[];
  gaps: { prompt: string; competitors_present: string[] }[];
  leaderboard: { prompt: string; rankings: { name: string; score: number }[] }[];
}

export interface JobRun {
  id: string;
  brand_id: string;
  job_type: 'prompt_run' | 'content_score' | 'snapshot';
  status: 'pending' | 'running' | 'completed' | 'failed';
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}
