import type { PlanId } from './types/user';

export const ENGINE_NAMES = {
  chatgpt: 'ChatGPT',
  perplexity: 'Perplexity',
  google_aio: 'Google AI Overviews',
} as const;

export const ENGINES = ['chatgpt', 'perplexity', 'google_aio'] as const;

export const INDUSTRIES = [
  'SaaS',
  'E-commerce',
  'Finance',
  'Healthcare',
  'Agency',
  'Other',
] as const;

export interface PlanLimits {
  prompts: number;
  competitors: number;
  content_scores_per_day: number;
  api_requests_per_day: number;
  api_keys: number;
  brands: number;
  engines: readonly string[];
  email_alerts: string;
  webhooks: boolean;
}

export const PLAN_LIMITS: Record<PlanId, PlanLimits> = {
  free: {
    prompts: 25,
    competitors: 2,
    content_scores_per_day: 5,
    api_requests_per_day: 100,
    api_keys: 2,
    brands: 1,
    engines: ['chatgpt'],
    email_alerts: 'weekly',
    webhooks: false,
  },
  starter: {
    prompts: 100,
    competitors: 5,
    content_scores_per_day: 25,
    api_requests_per_day: 1000,
    api_keys: 5,
    brands: 3,
    engines: ['chatgpt', 'perplexity', 'google_aio'],
    email_alerts: 'daily+instant',
    webhooks: false,
  },
  growth: {
    prompts: 250,
    competitors: 5,
    content_scores_per_day: 100,
    api_requests_per_day: 10000,
    api_keys: 20,
    brands: 10,
    engines: ['chatgpt', 'perplexity', 'google_aio'],
    email_alerts: 'daily+instant+webhooks',
    webhooks: true,
  },
} as const;

export const PLAN_PRICES = {
  free: { monthly: 0 },
  starter: { monthly: 49 },
  growth: { monthly: 149 },
} as const;

export const SENTIMENT_LABELS = ['positive', 'neutral', 'negative'] as const;

export const NOTIFICATION_TYPES = [
  'visibility_drop',
  'new_mention',
  'sentiment_shift',
  'competitor_new',
] as const;

export const JOB_TYPES = ['prompt_run', 'content_score', 'snapshot'] as const;

export const JOB_STATUSES = ['pending', 'running', 'completed', 'failed'] as const;
