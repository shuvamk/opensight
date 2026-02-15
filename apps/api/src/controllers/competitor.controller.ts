import { Request, Response, NextFunction } from 'express';
import { competitorService } from '../services/competitor.service.js';
import { PLAN_LIMITS } from '@opensight/shared';
import { logger } from '../utils/logger.js';

/**
 * GET /api/brands/:brandId/competitors
 * List competitors
 */
export async function listCompetitors(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { brandId } = req.params as { brandId: string };
    const competitors = await competitorService.listCompetitors(brandId, req.user!.id);
    res.json({ competitors });
  } catch (error) {
    const err = error as Error;
    if (err.message.includes('not found')) {
      res.status(404).json({ error: err.message });
    } else {
      logger.error(error, 'Error listing competitors');
      next(error);
    }
  }
}

/**
 * POST /api/brands/:brandId/competitors
 * Add competitor (max based on plan)
 */
export async function addCompetitor(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { brandId } = req.params as { brandId: string };
    const { name, website_url } = req.body;

    // Check plan limits
    const planLimits = PLAN_LIMITS[req.user!.plan_id as keyof typeof PLAN_LIMITS];
    const currentCount = await competitorService.getCompetitorCount(brandId);

    if (currentCount >= planLimits.competitors) {
      res.status(403).json({
        error: `You have reached the maximum number of competitors (${planLimits.competitors}) for your plan`,
      });
      return;
    }

    const competitor = await competitorService.addCompetitor(brandId, req.user!.id, {
      name,
      websiteUrl: website_url,
    });

    res.status(201).json({ competitor });
  } catch (error) {
    const err = error as Error;
    if (err.message.includes('not found')) {
      res.status(404).json({ error: err.message });
    } else if (err.message.includes('already exists')) {
      res.status(409).json({ error: err.message });
    } else {
      logger.error(error, 'Error adding competitor');
      next(error);
    }
  }
}

/**
 * DELETE /api/brands/:brandId/competitors/:competitorId
 * Remove competitor
 */
export async function removeCompetitor(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { brandId, competitorId } = req.params as { brandId: string; competitorId: string };
    await competitorService.removeCompetitor(brandId, competitorId, req.user!.id);
    res.json({ success: true });
  } catch (error) {
    const err = error as Error;
    if (err.message.includes('not found')) {
      res.status(404).json({ error: err.message });
    } else {
      logger.error(error, 'Error removing competitor');
      next(error);
    }
  }
}

/**
 * GET /api/brands/:brandId/competitors/comparison
 * Share of voice, gap analysis, leaderboard
 */
export async function getCompetitorComparison(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { brandId } = req.params as { brandId: string };
    const comparison = await competitorService.getCompetitorComparison(brandId, req.user!.id);
    res.json(comparison);
  } catch (error) {
    const err = error as Error;
    if (err.message.includes('not found')) {
      res.status(404).json({ error: err.message });
    } else {
      logger.error(error, 'Error getting competitor comparison');
      next(error);
    }
  }
}
