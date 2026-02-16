import { db, brands, visibilitySnapshots } from '@opensight/db';
import { eq, desc, and, sql } from 'drizzle-orm';
import { logger } from '../utils/logger.js';

interface CreateBrandInput {
  userId: string;
  name: string;
  websiteUrl: string;
  industry?: string;
}

interface UpdateBrandInput {
  name?: string;
  websiteUrl?: string;
  industry?: string;
}

export class BrandService {
  async listBrands(userId: string) {
    try {
      // Get all brands for user with their latest visibility score
      const userBrands = await db
        .select({
          id: brands.id,
          name: brands.name,
          websiteUrl: brands.websiteUrl,
          industry: brands.industry,
          isActive: brands.isActive,
          createdAt: brands.createdAt,
          updatedAt: brands.updatedAt,
        })
        .from(brands)
        .where(eq(brands.userId, userId))
        .orderBy(desc(brands.createdAt));

      // For each brand, get the latest visibility snapshot
      const brandsWithScores = await Promise.all(
        userBrands.map(async (brand) => {
          const latestSnapshot = await db
            .select({ overallScore: visibilitySnapshots.overallScore })
            .from(visibilitySnapshots)
            .where(eq(visibilitySnapshots.brandId, brand.id))
            .orderBy(desc(visibilitySnapshots.createdAt))
            .limit(1);

          return {
            ...brand,
            latestVisibilityScore: latestSnapshot[0]?.overallScore || 0,
          };
        })
      );

      return brandsWithScores;
    } catch (error) {
      logger.error(error, 'Error listing brands');
      throw error;
    }
  }

  async getBrand(brandId: string, userId: string) {
    try {
      const brand = await db
        .select()
        .from(brands)
        .where(and(eq(brands.id, brandId), eq(brands.userId, userId)))
        .limit(1);

      if (!brand[0]) {
        throw new Error('Brand not found or you do not have access to it');
      }

      // Get latest visibility snapshot
      const latestSnapshot = await db
        .select({ overallScore: visibilitySnapshots.overallScore })
        .from(visibilitySnapshots)
        .where(eq(visibilitySnapshots.brandId, brandId))
        .orderBy(desc(visibilitySnapshots.createdAt))
        .limit(1);

      return {
        ...brand[0],
        latestVisibilityScore: latestSnapshot[0]?.overallScore || 0,
      };
    } catch (error) {
      logger.error(error, 'Error getting brand');
      throw error;
    }
  }

  async createBrand(input: CreateBrandInput) {
    try {
      const result = await db
        .insert(brands)
        .values({
          userId: input.userId,
          name: input.name,
          websiteUrl: input.websiteUrl,
          industry: input.industry,
          isActive: true,
        })
        .returning();

      if (!result[0]) {
        throw new Error('Failed to create brand');
      }

      return result[0];
    } catch (error) {
      logger.error(error, 'Error creating brand');
      throw error;
    }
  }

  async updateBrand(brandId: string, userId: string, input: UpdateBrandInput) {
    try {
      // Verify ownership
      const brand = await db
        .select()
        .from(brands)
        .where(and(eq(brands.id, brandId), eq(brands.userId, userId)))
        .limit(1);

      if (!brand[0]) {
        throw new Error('Brand not found or you do not have access to it');
      }

      const result = await db
        .update(brands)
        .set({
          name: input.name,
          websiteUrl: input.websiteUrl,
          industry: input.industry,
          updatedAt: new Date(),
        })
        .where(eq(brands.id, brandId))
        .returning();

      if (!result[0]) {
        throw new Error('Failed to update brand');
      }

      return result[0];
    } catch (error) {
      logger.error(error, 'Error updating brand');
      throw error;
    }
  }

  async deleteBrand(brandId: string, userId: string) {
    try {
      // Verify ownership
      const brand = await db
        .select()
        .from(brands)
        .where(and(eq(brands.id, brandId), eq(brands.userId, userId)))
        .limit(1);

      if (!brand[0]) {
        throw new Error('Brand not found or you do not have access to it');
      }

      await db.delete(brands).where(eq(brands.id, brandId));

      return { success: true };
    } catch (error) {
      logger.error(error, 'Error deleting brand');
      throw error;
    }
  }

  async getBrandDashboard(brandId: string, userId: string) {
    try {
      // Verify ownership
      const brand = await db
        .select()
        .from(brands)
        .where(and(eq(brands.id, brandId), eq(brands.userId, userId)))
        .limit(1);

      if (!brand[0]) {
        throw new Error('Brand not found or you do not have access to it');
      }

      // Get latest snapshot for aggregated data
      const latestSnapshot = await db
        .select()
        .from(visibilitySnapshots)
        .where(eq(visibilitySnapshots.brandId, brandId))
        .orderBy(desc(visibilitySnapshots.createdAt))
        .limit(1);

      if (!latestSnapshot[0]) {
        return {
          brandId,
          overallScore: 0,
          chatgptScore: 0,
          perplexityScore: 0,
          googleAioScore: 0,
          sentimentBreakdown: {
            positive: 0,
            neutral: 0,
            negative: 0,
          },
          totalMentions: 0,
          totalPromptsChecked: 0,
          competitorData: {},
          recent_changes: [],
        };
      }

      const snapshot = latestSnapshot[0];

      // Build recent_changes from last 11 snapshots (compare consecutive for up to 10 changes)
      const recentSnapshots = await db
        .select({
          id: visibilitySnapshots.id,
          snapshotDate: visibilitySnapshots.snapshotDate,
          overallScore: visibilitySnapshots.overallScore,
          totalMentions: visibilitySnapshots.totalMentions,
          createdAt: visibilitySnapshots.createdAt,
        })
        .from(visibilitySnapshots)
        .where(eq(visibilitySnapshots.brandId, brandId))
        .orderBy(desc(visibilitySnapshots.snapshotDate))
        .limit(11);

      const recent_changes: Array<{
        id: string;
        type: 'up' | 'down';
        description: string;
        timestamp: string;
      }> = [];
      for (let i = 0; i < recentSnapshots.length - 1; i++) {
        const newer = recentSnapshots[i];
        const older = recentSnapshots[i + 1];
        if (!newer || !older) continue;
        const scoreDelta = (newer.overallScore ?? 0) - (older.overallScore ?? 0);
        const mentionsDelta = (newer.totalMentions ?? 0) - (older.totalMentions ?? 0);
        if (scoreDelta !== 0) {
          recent_changes.push({
            id: newer.id,
            type: scoreDelta > 0 ? 'up' : 'down',
            description:
              scoreDelta > 0
                ? `Overall visibility score increased by ${scoreDelta}`
                : `Overall visibility score decreased by ${Math.abs(scoreDelta)}`,
            timestamp: (newer.createdAt ?? new Date()).toISOString(),
          });
        } else if (mentionsDelta !== 0) {
          recent_changes.push({
            id: `${newer.id}-mentions`,
            type: mentionsDelta > 0 ? 'up' : 'down',
            description:
              mentionsDelta > 0
                ? `Mentions increased by ${mentionsDelta}`
                : `Mentions decreased by ${Math.abs(mentionsDelta)}`,
            timestamp: (newer.createdAt ?? new Date()).toISOString(),
          });
        }
        if (recent_changes.length >= 10) break;
      }

      return {
        brandId,
        overallScore: snapshot.overallScore,
        chatgptScore: snapshot.chatgptScore ?? 0,
        perplexityScore: snapshot.perplexityScore ?? 0,
        googleAioScore: snapshot.googleAioScore ?? 0,
        sentimentBreakdown: {
          positive: Number(snapshot.sentimentPositive ?? 0) || 0,
          neutral: Number(snapshot.sentimentNeutral ?? 0) || 0,
          negative: Number(snapshot.sentimentNegative ?? 0) || 0,
        },
        totalMentions: snapshot.totalMentions,
        totalPromptsChecked: snapshot.totalPromptsChecked,
        competitorData: snapshot.competitorData,
        recent_changes,
      };
    } catch (error) {
      logger.error(error, 'Error getting brand dashboard');
      throw error;
    }
  }

  async getBrandTrends(brandId: string, userId: string, rangeInDays: number = 30) {
    try {
      // Verify ownership
      const brand = await db
        .select()
        .from(brands)
        .where(and(eq(brands.id, brandId), eq(brands.userId, userId)))
        .limit(1);

      if (!brand[0]) {
        throw new Error('Brand not found or you do not have access to it');
      }

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - rangeInDays);
      const startDateStr = startDate.toISOString().split('T')[0];

      // Get snapshots within the date range
      const snapshots = await db
        .select({
          snapshotDate: visibilitySnapshots.snapshotDate,
          overallScore: visibilitySnapshots.overallScore,
          chatgptScore: visibilitySnapshots.chatgptScore,
          perplexityScore: visibilitySnapshots.perplexityScore,
          googleAioScore: visibilitySnapshots.googleAioScore,
          totalMentions: visibilitySnapshots.totalMentions,
          sentimentPositive: visibilitySnapshots.sentimentPositive,
          sentimentNeutral: visibilitySnapshots.sentimentNeutral,
          sentimentNegative: visibilitySnapshots.sentimentNegative,
        })
        .from(visibilitySnapshots)
        .where(
          and(
            eq(visibilitySnapshots.brandId, brandId),
            sql`${visibilitySnapshots.snapshotDate} >= ${startDateStr}`
          )
        )
        .orderBy(visibilitySnapshots.snapshotDate);

      return {
        brandId,
        rangeInDays,
        dataPoints: snapshots.map((snapshot) => ({
          date: snapshot.snapshotDate,
          overallScore: snapshot.overallScore,
          chatgptScore: snapshot.chatgptScore ?? 0,
          perplexityScore: snapshot.perplexityScore ?? 0,
          googleAioScore: snapshot.googleAioScore ?? 0,
          mentions: snapshot.totalMentions,
          sentiment: {
            positive: Number(snapshot.sentimentPositive ?? 0) || 0,
            neutral: Number(snapshot.sentimentNeutral ?? 0) || 0,
            negative: Number(snapshot.sentimentNegative ?? 0) || 0,
          },
        })),
      };
    } catch (error) {
      logger.error(error, 'Error getting brand trends');
      throw error;
    }
  }

  async getBrandCount(userId: string) {
    try {
      const result = await db
        .select()
        .from(brands)
        .where(eq(brands.userId, userId));

      return result.length;
    } catch (error) {
      logger.error(error, 'Error getting brand count');
      throw error;
    }
  }
}

export const brandService = new BrandService();
