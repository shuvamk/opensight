import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  decimal,
  date,
  timestamp,
  jsonb,
  uniqueIndex,
  index,
  primaryKey,
  foreignKey,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================================================
// USERS TABLE
// ============================================================================
export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }),
    fullName: varchar('full_name', { length: 255 }).notNull(),
    avatarUrl: text('avatar_url'),
    emailVerified: boolean('email_verified').default(false),
    githubId: varchar('github_id', { length: 100 }).unique(),
    googleId: varchar('google_id', { length: 100 }).unique(),
    stripeCustomerId: varchar('stripe_customer_id', { length: 255 }).unique(),
    stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
    planId: varchar('plan_id', { length: 50 }).notNull().default('free'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => {
    return {
      emailIdx: index('users_email_idx').on(table.email),
      githubIdIdx: index('users_github_id_idx').on(table.githubId),
      googleIdIdx: index('users_google_id_idx').on(table.googleId),
      stripeCustomerIdIdx: index('users_stripe_customer_id_idx').on(table.stripeCustomerId),
    };
  }
);

export const usersRelations = relations(users, ({ many }) => ({
  passwordResetTokens: many(passwordResetTokens),
  refreshTokens: many(refreshTokens),
  apiKeys: many(apiKeys),
  brands: many(brands),
  contentScores: many(contentScores),
  notifications: many(notifications),
  notificationSettings: many(notificationSettings),
  jobRuns: many(jobRuns),
}));

// ============================================================================
// PASSWORD RESET TOKENS TABLE
// ============================================================================
export const passwordResetTokens = pgTable(
  'password_reset_tokens',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull(),
    tokenHash: varchar('token_hash', { length: 255 }).notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    usedAt: timestamp('used_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => {
    return {
      userIdIdx: index('password_reset_tokens_user_id_idx').on(table.userId),
      tokenHashIdx: index('password_reset_tokens_token_hash_idx').on(table.tokenHash),
      userIdFk: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: 'password_reset_tokens_user_id_fk',
      }).onDelete('cascade'),
    };
  }
);

export const passwordResetTokensRelations = relations(passwordResetTokens, ({ one }) => ({
  user: one(users, {
    fields: [passwordResetTokens.userId],
    references: [users.id],
  }),
}));

// ============================================================================
// REFRESH TOKENS TABLE
// ============================================================================
export const refreshTokens = pgTable(
  'refresh_tokens',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull(),
    tokenHash: varchar('token_hash', { length: 255 }).notNull(),
    deviceFingerprint: varchar('device_fingerprint', { length: 255 }),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => {
    return {
      userIdIdx: index('refresh_tokens_user_id_idx').on(table.userId),
      tokenHashIdx: index('refresh_tokens_token_hash_idx').on(table.tokenHash),
      userIdFk: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: 'refresh_tokens_user_id_fk',
      }).onDelete('cascade'),
    };
  }
);

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userId],
    references: [users.id],
  }),
}));

// ============================================================================
// API KEYS TABLE
// ============================================================================
export const apiKeys = pgTable(
  'api_keys',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    keyPrefix: varchar('key_prefix', { length: 20 }).notNull(),
    keyHash: varchar('key_hash', { length: 255 }).notNull(),
    lastUsedAt: timestamp('last_used_at', { withTimezone: true }),
    requestsToday: integer('requests_today').default(0),
    requestsMonth: integer('requests_month').default(0),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => {
    return {
      userIdIdx: index('api_keys_user_id_idx').on(table.userId),
      keyHashIdx: index('api_keys_key_hash_idx').on(table.keyHash),
      userIdFk: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: 'api_keys_user_id_fk',
      }).onDelete('cascade'),
    };
  }
);

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  user: one(users, {
    fields: [apiKeys.userId],
    references: [users.id],
  }),
}));

// ============================================================================
// BRANDS TABLE
// ============================================================================
export const brands = pgTable(
  'brands',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    websiteUrl: text('website_url').notNull(),
    industry: varchar('industry', { length: 100 }),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => {
    return {
      userIdIdx: index('brands_user_id_idx').on(table.userId),
      userIdFk: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: 'brands_user_id_fk',
      }).onDelete('cascade'),
    };
  }
);

export const brandsRelations = relations(brands, ({ one, many }) => ({
  user: one(users, {
    fields: [brands.userId],
    references: [users.id],
  }),
  competitors: many(competitors),
  prompts: many(prompts),
  promptResults: many(promptResults),
  visibilitySnapshots: many(visibilitySnapshots),
  jobRuns: many(jobRuns),
}));

// ============================================================================
// COMPETITORS TABLE
// ============================================================================
export const competitors = pgTable(
  'competitors',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    brandId: uuid('brand_id').notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    websiteUrl: text('website_url').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => {
    return {
      brandIdIdx: index('competitors_brand_id_idx').on(table.brandId),
      brandIdFk: foreignKey({
        columns: [table.brandId],
        foreignColumns: [brands.id],
        name: 'competitors_brand_id_fk',
      }).onDelete('cascade'),
    };
  }
);

export const competitorsRelations = relations(competitors, ({ one }) => ({
  brand: one(brands, {
    fields: [competitors.brandId],
    references: [brands.id],
  }),
}));

// ============================================================================
// PROMPTS TABLE
// ============================================================================
export const prompts = pgTable(
  'prompts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    brandId: uuid('brand_id').notNull(),
    text: text('text').notNull(),
    tags: text('tags').array().default([]),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => {
    return {
      brandIdIdx: index('prompts_brand_id_idx').on(table.brandId),
      brandIdTextUniqueIdx: uniqueIndex('prompts_brand_id_text_unique_idx').on(
        table.brandId,
        table.text
      ),
      brandIdFk: foreignKey({
        columns: [table.brandId],
        foreignColumns: [brands.id],
        name: 'prompts_brand_id_fk',
      }).onDelete('cascade'),
    };
  }
);

export const promptsRelations = relations(prompts, ({ one, many }) => ({
  brand: one(brands, {
    fields: [prompts.brandId],
    references: [brands.id],
  }),
  results: many(promptResults),
}));

// ============================================================================
// PROMPT RESULTS TABLE
// ============================================================================
export const promptResults = pgTable(
  'prompt_results',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    promptId: uuid('prompt_id').notNull(),
    brandId: uuid('brand_id').notNull(),
    engine: varchar('engine', { length: 50 }).notNull(),
    runDate: date('run_date').defaultNow(),
    responseText: text('response_text').notNull(),
    brandMentioned: boolean('brand_mentioned').default(false),
    mentionPosition: integer('mention_position'),
    sentimentScore: decimal('sentiment_score', { precision: 3, scale: 2 }),
    sentimentLabel: varchar('sentiment_label', { length: 20 }),
    citationUrls: text('citation_urls').array().default([]),
    competitorMentions: jsonb('competitor_mentions').default('[]'),
    visibilityScore: integer('visibility_score').default(0),
    rawResponse: jsonb('raw_response'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => {
    return {
      promptIdIdx: index('prompt_results_prompt_id_idx').on(table.promptId),
      brandIdIdx: index('prompt_results_brand_id_idx').on(table.brandId),
      runDateIdx: index('prompt_results_run_date_idx').on(table.runDate),
      engineIdx: index('prompt_results_engine_idx').on(table.engine),
      promptIdFk: foreignKey({
        columns: [table.promptId],
        foreignColumns: [prompts.id],
        name: 'prompt_results_prompt_id_fk',
      }).onDelete('cascade'),
      brandIdFk: foreignKey({
        columns: [table.brandId],
        foreignColumns: [brands.id],
        name: 'prompt_results_brand_id_fk',
      }).onDelete('cascade'),
    };
  }
);

export const promptResultsRelations = relations(promptResults, ({ one }) => ({
  prompt: one(prompts, {
    fields: [promptResults.promptId],
    references: [prompts.id],
  }),
  brand: one(brands, {
    fields: [promptResults.brandId],
    references: [brands.id],
  }),
}));

// ============================================================================
// VISIBILITY SNAPSHOTS TABLE
// ============================================================================
export const visibilitySnapshots = pgTable(
  'visibility_snapshots',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    brandId: uuid('brand_id').notNull(),
    snapshotDate: date('snapshot_date').defaultNow(),
    overallScore: integer('overall_score').default(0),
    chatgptScore: integer('chatgpt_score'),
    perplexityScore: integer('perplexity_score'),
    googleAioScore: integer('google_aio_score'),
    sentimentPositive: decimal('sentiment_positive', { precision: 5, scale: 2 }),
    sentimentNeutral: decimal('sentiment_neutral', { precision: 5, scale: 2 }),
    sentimentNegative: decimal('sentiment_negative', { precision: 5, scale: 2 }),
    totalMentions: integer('total_mentions').default(0),
    totalPromptsChecked: integer('total_prompts_checked').default(0),
    competitorData: jsonb('competitor_data').default('{}'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => {
    return {
      brandIdIdx: index('visibility_snapshots_brand_id_idx').on(table.brandId),
      snapshotDateIdx: index('visibility_snapshots_snapshot_date_idx').on(table.snapshotDate),
      brandIdFk: foreignKey({
        columns: [table.brandId],
        foreignColumns: [brands.id],
        name: 'visibility_snapshots_brand_id_fk',
      }).onDelete('cascade'),
    };
  }
);

export const visibilitySnapshotsRelations = relations(visibilitySnapshots, ({ one }) => ({
  brand: one(brands, {
    fields: [visibilitySnapshots.brandId],
    references: [brands.id],
  }),
}));

// ============================================================================
// CONTENT SCORES TABLE
// ============================================================================
export const contentScores = pgTable(
  'content_scores',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull(),
    url: text('url').notNull(),
    overallScore: integer('overall_score').notNull(),
    structureScore: integer('structure_score'),
    readabilityScore: integer('readability_score'),
    freshnessScore: integer('freshness_score'),
    keyContentScore: integer('key_content_score'),
    citationScore: integer('citation_score'),
    recommendations: jsonb('recommendations').default('[]'),
    scoredAt: timestamp('scored_at', { withTimezone: true }).defaultNow(),
  },
  (table) => {
    return {
      userIdIdx: index('content_scores_user_id_idx').on(table.userId),
      userIdFk: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: 'content_scores_user_id_fk',
      }).onDelete('cascade'),
    };
  }
);

export const contentScoresRelations = relations(contentScores, ({ one }) => ({
  user: one(users, {
    fields: [contentScores.userId],
    references: [users.id],
  }),
}));

// ============================================================================
// NOTIFICATIONS TABLE
// ============================================================================
export const notifications = pgTable(
  'notifications',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull(),
    type: varchar('type', { length: 50 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    body: text('body'),
    metadata: jsonb('metadata').default('{}'),
    readAt: timestamp('read_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => {
    return {
      userIdIdx: index('notifications_user_id_idx').on(table.userId),
      typeIdx: index('notifications_type_idx').on(table.type),
      userIdFk: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: 'notifications_user_id_fk',
      }).onDelete('cascade'),
    };
  }
);

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

// ============================================================================
// NOTIFICATION SETTINGS TABLE
// ============================================================================
export const notificationSettings = pgTable(
  'notification_settings',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().unique(),
    emailFrequency: varchar('email_frequency', { length: 20 }).default('daily'),
    alertVisibilityDrop: boolean('alert_visibility_drop').default(true),
    alertNewMention: boolean('alert_new_mention').default(true),
    alertSentimentShift: boolean('alert_sentiment_shift').default(true),
    alertCompetitorNew: boolean('alert_competitor_new').default(true),
    webhookUrl: text('webhook_url'),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => {
    return {
      userIdFk: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: 'notification_settings_user_id_fk',
      }).onDelete('cascade'),
    };
  }
);

export const notificationSettingsRelations = relations(notificationSettings, ({ one }) => ({
  user: one(users, {
    fields: [notificationSettings.userId],
    references: [users.id],
  }),
}));

// ============================================================================
// JOB RUNS TABLE
// ============================================================================
export const jobRuns = pgTable(
  'job_runs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    brandId: uuid('brand_id').notNull(),
    jobType: varchar('job_type', { length: 50 }).notNull(),
    status: varchar('status', { length: 20 }).default('pending'),
    startedAt: timestamp('started_at', { withTimezone: true }),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    errorMessage: text('error_message'),
    metadata: jsonb('metadata').default('{}'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => {
    return {
      brandIdIdx: index('job_runs_brand_id_idx').on(table.brandId),
      jobTypeIdx: index('job_runs_job_type_idx').on(table.jobType),
      statusIdx: index('job_runs_status_idx').on(table.status),
      brandIdFk: foreignKey({
        columns: [table.brandId],
        foreignColumns: [brands.id],
        name: 'job_runs_brand_id_fk',
      }).onDelete('cascade'),
    };
  }
);

export const jobRunsRelations = relations(jobRuns, ({ one }) => ({
  brand: one(brands, {
    fields: [jobRuns.brandId],
    references: [brands.id],
  }),
}));
