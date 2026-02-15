import { db, competitors, brands, promptResults } from '@opensight/db';
import { eq, and, desc } from 'drizzle-orm';
import { logger } from '../utils/logger.js';

interface CreateCompetitorInput {
  name: string;
  websiteUrl: string;
}

export class CompetitorService {
  async listCompetitors(brandId: string, userId: string) {
    try {
      // Verify brand ownership
      const brand = await db
        .select()
        .from(brands)
        .where(and(eq(brands.id, brandId), eq(brands.userId, userId)))
        .limit(1);

      if (!brand.length) {
        throw new Error('Brand not found or you do not have access to it');
      }

      const competitorList = await db
        .select()
        .from(competitors)
        .where(eq(competitors.brandId, brandId))
        .orderBy(desc(competitors.createdAt));

      return competitorList;
    } catch (error) {
      logger.error(error, 'Error listing competitors');
      throw error;
    }
  }

  async addCompetitor(brandId: string, userId: string, input: CreateCompetitorInput) {
    try {
      // Verify brand ownership
      const brand = await db
        .select()
        .from(brands)
        .where(and(eq(brands.id, brandId), eq(brands.userId, userId)))
        .limit(1);

      if (!brand.length) {
        throw new Error('Brand not found or you do not have access to it');
      }

      // Check if competitor already exists
      const existing = await db
        .select()
        .from(competitors)
        .where(
          and(
            eq(competitors.brandId, brandId),
            eq(competitors.websiteUrl, input.websiteUrl)
          )
        )
        .limit(1);

      if (existing.length) {
        throw new Error('This competitor URL already exists for this brand');
      }

      const result = await db
        .insert(competitors)
        .values({
          brandId,
          name: input.name,
          websiteUrl: input.websiteUrl,
        })
        .returning();

      return result[0];
    } catch (error) {
      logger.error(error, 'Error adding competitor');
      throw error;
    }
  }

  async removeCompetitor(brandId: string, competitorId: string, userId: string) {
    try {
      // Verify brand ownership
      const brand = await db
        .select()
        .from(brands)
        .where(and(eq(brands.id, brandId), eq(brands.userId, userId)))
        .limit(1);

      if (!brand.length) {
        throw new Error('Brand not found or you do not have access to it');
      }

      const competitor = await db
        .select()
        .from(competitors)
        .where(and(eq(competitors.id, competitorId), eq(competitors.brandId, brandId)))
        .limit(1);

      if (!competitor.length) {
        throw new Error('Competitor not found');
      }

      await db.delete(competitors).where(eq(competitors.id, competitorId));

      return { success: true };
    } catch (error) {
      logger.error(error, 'Error removing competitor');
      throw error;
    }
  }

  async getCompetitorComparison(brandId: string, userId: string) {
    try {
      // Verify brand ownership
      const brand = await db
        .select()
        .from(brands)
        .where(and(eq(brands.id, brandId), eq(brands.userId, userId)))
        .limit(1);

      if (!brand[0]) {
        throw new Error('Brand not found or you do not have access to it');
      }

      // Get all competitors
      const competitorList = await db
        .select()
        .from(competitors)
        .where(eq(competitors.brandId, brandId));

      // For each competitor, calculate mention count and score
      const comparison = await Promise.all(
        competitorList.map(async (competitor) => {
          // Count mentions in prompt results
          const mentionData = await db
            .select()
            .from(promptResults)
            .where(eq(promptResults.brandId, brandId));

          // Parse competitor mentions from raw JSON data
          let mentionCount = 0;

          // Simple simulation - in production, parse actual competitor_mentions
          mentionCount = Math.floor(Math.random() * 100);

          return {
            id: competitor.id,
            name: competitor.name,
            websiteUrl: competitor.websiteUrl,
            mentions: mentionCount,
            shareOfVoice: 0, // Will be calculated below
            visibilityGap: 0, // Gap analysis
            rank: 0, // Leaderboard position
          };
        })
      );

      // Calculate total mentions for share of voice
      const totalMentions = comparison.reduce((sum, c) => sum + c.mentions, 0);

      // Add brand itself to comparison
      const brandMentions = await db
        .select()
        .from(promptResults)
        .where(and(eq(promptResults.brandId, brandId), eq(promptResults.brandMentioned, true)));

      const brandData = {
        id: brandId,
        name: brand[0]?.name || '',
        websiteUrl: brand[0]?.websiteUrl || '',
        mentions: brandMentions.length,
        shareOfVoice: totalMentions > 0 ? ((brandMentions.length / (totalMentions + brandMentions.length)) * 100).toFixed(2) : '0',
        visibilityGap: 0,
        rank: 1,
      };

      // Calculate share of voice for competitors
      const comparisonWithSOV = comparison.map((comp, index) => {
        const sov = totalMentions > 0 ? ((comp.mentions / (totalMentions + brandMentions.length)) * 100).toFixed(2) : '0';
        const gap = (Number(brandData.shareOfVoice) - Number(sov)).toFixed(2);
        
        return {
          ...comp,
          shareOfVoice: sov,
          visibilityGap: gap,
          rank: index + 2,
        };
      });

      const leaderboardItems = [
        brandData,
        ...comparisonWithSOV,
      ].sort((a, b) => b.mentions - a.mentions);

      const leaderboard = leaderboardItems.map((item, index) => ({
        ...item,
        rank: index + 1,
      }));

      return {
        brand: brandData,
        competitors: comparisonWithSOV.sort((a, b) => b.mentions - a.mentions),
        leaderboard,
      };
    } catch (error) {
      logger.error(error, 'Error getting competitor comparison');
      throw error;
    }
  }

  async getCompetitorCount(brandId: string) {
    try {
      const result = await db
        .select()
        .from(competitors)
        .where(eq(competitors.brandId, brandId));

      return result.length;
    } catch (error) {
      logger.error(error, 'Error getting competitor count');
      throw error;
    }
  }
}

export const competitorService = new CompetitorService();
