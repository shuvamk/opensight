import { db, contentScores, users } from '@opensight/db';
import { eq, desc, gte, and } from 'drizzle-orm';
import { logger } from '../utils/logger.js';

interface ScoreContentInput {
  url: string;
}

export class ContentService {
  async scoreContent(userId: string, input: ScoreContentInput) {
    try {
      // Check daily limit for this user
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayScores = await db
        .select()
        .from(contentScores)
        .where(and(eq(contentScores.userId, userId), gte(contentScores.scoredAt, today)));

      // Get user's plan limit
      const user = await db
        .select({ planId: users.planId })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user[0]) {
        throw new Error('User not found');
      }

      // Mock plan limits check (in production, use PLAN_LIMITS from shared)
      const planLimits: Record<string, number> = {
        free: 5,
        starter: 25,
        growth: 100,
      };

      const userPlanLimit = planLimits[user[0].planId || 'free'] || 5;

      if (todayScores.length >= userPlanLimit) {
        throw new Error(`You have reached your daily content score limit (${userPlanLimit}) for your plan`);
      }

      // For now, return mock scores
      const mockScore = {
        overall_score: Math.floor(Math.random() * (100 - 50)) + 50,
        structure_score: Math.floor(Math.random() * 100),
        readability_score: Math.floor(Math.random() * 100),
        freshness_score: Math.floor(Math.random() * 100),
        key_content_score: Math.floor(Math.random() * 100),
        citation_score: Math.floor(Math.random() * 100),
        recommendations: [
          'Improve page structure with better heading hierarchy',
          'Add more internal links to related content',
          'Update outdated information',
          'Include more citations and sources',
          'Enhance readability with shorter paragraphs',
        ],
      };

      // Save to database
      const result = await db
        .insert(contentScores)
        .values({
          userId,
          url: input.url,
          overallScore: mockScore.overall_score,
          structureScore: mockScore.structure_score,
          readabilityScore: mockScore.readability_score,
          freshnessScore: mockScore.freshness_score,
          keyContentScore: mockScore.key_content_score,
          citationScore: mockScore.citation_score,
          recommendations: mockScore.recommendations,
        })
        .returning();

      return result[0];
    } catch (error) {
      logger.error(error, 'Error scoring content');
      throw error;
    }
  }

  async getScoreHistory(userId: string, limit: number = 50, offset: number = 0) {
    try {
      const scores = await db
        .select()
        .from(contentScores)
        .where(eq(contentScores.userId, userId))
        .orderBy(desc(contentScores.scoredAt))
        .limit(limit)
        .offset(offset);

      const total = await db
        .select()
        .from(contentScores)
        .where(eq(contentScores.userId, userId));

      return {
        scores,
        pagination: {
          limit,
          offset,
          total: total.length,
        },
      };
    } catch (error) {
      logger.error(error, 'Error getting score history');
      throw error;
    }
  }

  async getTodayScoreCount(userId: string) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const scores = await db
        .select()
        .from(contentScores)
        .where(and(eq(contentScores.userId, userId), gte(contentScores.scoredAt, today)));

      return scores.length;
    } catch (error) {
      logger.error(error, 'Error getting today score count');
      throw error;
    }
  }
}

export const contentService = new ContentService();
