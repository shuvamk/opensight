import { z } from 'zod';

// Auth validators
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least 1 number'),
  name: z.string().min(1, 'Name is required').max(255),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least 1 number'),
});

export const changePasswordSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least 1 number'),
});

// User validators
export const updateProfileSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  avatar_url: z.string().url().optional(),
});

// Brand validators
export const createBrandSchema = z.object({
  name: z.string().min(1, 'Brand name is required').max(255),
  website_url: z.string().url('Invalid URL format'),
  industry: z.string().max(100).optional(),
});

export const updateBrandSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  website_url: z.string().url().optional(),
  industry: z.string().max(100).optional(),
});

// Prompt validators
export const createPromptSchema = z.object({
  text: z.string().min(1, 'Prompt text is required').max(1000),
  tags: z.array(z.string().max(50)).max(10).optional(),
});

export const bulkCreatePromptsSchema = z.object({
  prompts: z.array(
    z.object({
      text: z.string().min(1).max(1000),
      tags: z.array(z.string().max(50)).max(10).optional(),
    })
  ).min(1).max(50),
});

export const updatePromptSchema = z.object({
  text: z.string().min(1).max(1000).optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
  is_active: z.boolean().optional(),
});

export const suggestPromptsSchema = z.object({
  count: z.number().int().min(1).max(50).optional().default(20),
});

// Competitor validators
export const createCompetitorSchema = z.object({
  name: z.string().min(1, 'Competitor name is required').max(255),
  website_url: z.string().url('Invalid URL format'),
});

// Content score validators
export const scoreContentSchema = z.object({
  url: z.string().url('Invalid URL format'),
});

// Notification settings validators
export const updateNotificationSettingsSchema = z.object({
  email_frequency: z.enum(['daily', 'weekly', 'none']).optional(),
  alert_visibility_drop: z.boolean().optional(),
  alert_new_mention: z.boolean().optional(),
  alert_sentiment_shift: z.boolean().optional(),
  alert_competitor_new: z.boolean().optional(),
  webhook_url: z.string().url().nullable().optional(),
});

// API Key validators
export const createApiKeySchema = z.object({
  name: z.string().min(1, 'Key name is required').max(100),
});

// Query validators
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

export const trendRangeSchema = z.object({
  range: z.enum(['7d', '30d', '90d']).optional().default('30d'),
});

export const promptQuerySchema = paginationSchema.extend({
  tag: z.string().optional(),
  active: z.coerce.boolean().optional(),
});

export const promptResultsQuerySchema = z.object({
  engine: z.enum(['chatgpt', 'perplexity', 'google_aio']).optional(),
  days: z.coerce.number().int().min(1).max(90).optional().default(30),
});

export const notificationQuerySchema = z.object({
  unread_only: z.coerce.boolean().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional().default(50),
});

export const contentScoreHistorySchema = z.object({
  url: z.string().url().optional(),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
});

// Analyze validators
export const analyzeRequestSchema = z.object({
  domain: z.string().min(1, 'Domain is required').max(255),
  email: z.string().email('Invalid email address'),
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;
export type CreatePromptInput = z.infer<typeof createPromptSchema>;
export type BulkCreatePromptsInput = z.infer<typeof bulkCreatePromptsSchema>;
export type UpdatePromptInput = z.infer<typeof updatePromptSchema>;
export type CreateCompetitorInput = z.infer<typeof createCompetitorSchema>;
export type ScoreContentInput = z.infer<typeof scoreContentSchema>;
export type UpdateNotificationSettingsInput = z.infer<typeof updateNotificationSettingsSchema>;
export type CreateApiKeyInput = z.infer<typeof createApiKeySchema>;
export type AnalyzeRequestInput = z.infer<typeof analyzeRequestSchema>;
