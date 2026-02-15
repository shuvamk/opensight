import { Request, Response, NextFunction } from 'express';
import { brandService } from '../services/brand.service.js';
import { PLAN_LIMITS } from '@opensight/shared';
import { logger } from '../utils/logger.js';

/**
 * GET /api/brands
 * List user's brands with latest visibility score
 */
export async function listBrands(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const brands = await brandService.listBrands(req.user!.id);
    res.json({ brands });
  } catch (error) {
    logger.error(error, 'Error listing brands');
    next(error);
  }
}

/**
 * POST /api/brands
 * Create brand (check plan limits)
 */
export async function createBrand(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, website_url, industry } = req.body;

    // Check plan limits
    const planLimits = PLAN_LIMITS[req.user!.plan_id as keyof typeof PLAN_LIMITS];
    const currentCount = await brandService.getBrandCount(req.user!.id);

    if (currentCount >= planLimits.brands) {
      res.status(403).json({
        error: `You have reached the maximum number of brands (${planLimits.brands}) for your plan`,
      });
      return;
    }

    const brand = await brandService.createBrand({
      userId: req.user!.id,
      name,
      websiteUrl: website_url,
      industry,
    });

    res.status(201).json({ brand });
  } catch (error) {
    logger.error(error, 'Error creating brand');
    next(error);
  }
}

/**
 * GET /api/brands/:id
 * Get brand (verify ownership)
 */
export async function getBrand(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const brand = await brandService.getBrand(id, req.user!.id);
    res.json({ brand });
  } catch (error) {
    const err = error as Error;
    if (err.message.includes('not found')) {
      res.status(404).json({ error: err.message });
    } else {
      logger.error(error, 'Error getting brand');
      next(error);
    }
  }
}

/**
 * PATCH /api/brands/:id
 * Update brand
 */
export async function updateBrand(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const { name, website_url, industry } = req.body;

    const brand = await brandService.updateBrand(id, req.user!.id, {
      name,
      websiteUrl: website_url,
      industry,
    });

    res.json({ brand });
  } catch (error) {
    const err = error as Error;
    if (err.message.includes('not found')) {
      res.status(404).json({ error: err.message });
    } else {
      logger.error(error, 'Error updating brand');
      next(error);
    }
  }
}

/**
 * DELETE /api/brands/:id
 * Delete brand
 */
export async function deleteBrand(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    await brandService.deleteBrand(id, req.user!.id);
    res.json({ success: true });
  } catch (error) {
    const err = error as Error;
    if (err.message.includes('not found')) {
      res.status(404).json({ error: err.message });
    } else {
      logger.error(error, 'Error deleting brand');
      next(error);
    }
  }
}

/**
 * GET /api/brands/:id/dashboard
 * Aggregated dashboard data from visibility_snapshots
 */
export async function getBrandDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const dashboard = await brandService.getBrandDashboard(id, req.user!.id);
    res.json(dashboard);
  } catch (error) {
    const err = error as Error;
    if (err.message.includes('not found')) {
      res.status(404).json({ error: err.message });
    } else {
      logger.error(error, 'Error getting brand dashboard');
      next(error);
    }
  }
}

/**
 * GET /api/brands/:id/trends
 * Trend data points
 */
export async function getBrandTrends(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const { range } = req.query as { range?: string };

    let rangeInDays = 30;
    if (range === '7d') rangeInDays = 7;
    else if (range === '14d') rangeInDays = 14;
    else if (range === '30d') rangeInDays = 30;
    else if (range === '90d') rangeInDays = 90;

    const trends = await brandService.getBrandTrends(id, req.user!.id, rangeInDays);
    res.json(trends);
  } catch (error) {
    const err = error as Error;
    if (err.message.includes('not found')) {
      res.status(404).json({ error: err.message });
    } else {
      logger.error(error, 'Error getting brand trends');
      next(error);
    }
  }
}
