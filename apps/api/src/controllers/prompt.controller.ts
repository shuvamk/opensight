import { Request, Response, NextFunction } from 'express';
import { promptService } from '../services/prompt.service.js';
import { PLAN_LIMITS } from '@opensight/shared';
import { logger } from '../utils/logger.js';

/**
 * GET /api/brands/:brandId/prompts
 * List prompts with pagination, tag filter, latest results
 */
export async function listPrompts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { brandId } = req.params as { brandId: string };
    const { page = '1', limit = '20', tags } = req.query as { page?: string; limit?: string; tags?: string };

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 20;
    const tagArray = tags
      ? Array.isArray(tags)
        ? tags
        : (tags as string).split(',')
      : undefined;

    const result = await promptService.listPrompts(brandId, req.user!.id, pageNum, limitNum, tagArray);
    res.json(result);
  } catch (error) {
    const err = error as Error;
    if (err.message.includes('not found')) {
      res.status(404).json({ error: err.message });
    } else {
      logger.error(error, 'Error listing prompts');
      next(error);
    }
  }
}

/**
 * POST /api/brands/:brandId/prompts
 * Create single or bulk prompts (check plan limits, check duplicates)
 */
export async function createPrompts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { brandId } = req.params as { brandId: string };
    const { text, tags, prompts: bulkPrompts } = req.body;

    // Check plan limits
    const planLimits = PLAN_LIMITS[req.user!.plan_id as keyof typeof PLAN_LIMITS];
    const currentCount = await promptService.getPromptCount(brandId);

    if (bulkPrompts) {
      // Bulk creation
      if (currentCount + bulkPrompts.length > planLimits.prompts) {
        res.status(403).json({
          error: `You have reached the maximum number of prompts (${planLimits.prompts}) for your plan`,
        });
        return;
      }

      const result = await promptService.createBulkPrompts(brandId, req.user!.id, bulkPrompts);
      res.status(201).json(result);
    } else {
      // Single creation
      if (currentCount >= planLimits.prompts) {
        res.status(403).json({
          error: `You have reached the maximum number of prompts (${planLimits.prompts}) for your plan`,
        });
        return;
      }

      const prompt = await promptService.createPrompt(brandId, req.user!.id, { text, tags });
      res.status(201).json({ prompt });
    }
  } catch (error) {
    const err = error as Error;
    if (err.message.includes('not found')) {
      res.status(404).json({ error: err.message });
    } else if (err.message.includes('already exists')) {
      res.status(409).json({ error: err.message });
    } else {
      logger.error(error, 'Error creating prompts');
      next(error);
    }
  }
}

/**
 * POST /api/brands/:brandId/prompts/suggest
 * Generate prompt suggestions (hardcoded industry-specific)
 */
export async function suggestPrompts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { count = 20, industry } = req.body;

    // Get brand to get industry
    // For now, just use the industry passed or default
    const suggestions = await promptService.suggestPrompts(industry, count);
    res.json({ suggestions });
  } catch (error) {
    logger.error(error, 'Error suggesting prompts');
    next(error);
  }
}

/**
 * GET /api/brands/:brandId/prompts/:promptId
 * Get prompt with latest results
 */
export async function getPrompt(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { brandId, promptId } = req.params as { brandId: string; promptId: string };
    const prompt = await promptService.getPrompt(brandId, promptId, req.user!.id);
    res.json({ prompt });
  } catch (error) {
    const err = error as Error;
    if (err.message.includes('not found')) {
      res.status(404).json({ error: err.message });
    } else {
      logger.error(error, 'Error getting prompt');
      next(error);
    }
  }
}

/**
 * PATCH /api/brands/:brandId/prompts/:promptId
 * Update prompt
 */
export async function updatePrompt(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { brandId, promptId } = req.params as { brandId: string; promptId: string };
    const { text, tags, is_active } = req.body;

    const prompt = await promptService.updatePrompt(brandId, promptId, req.user!.id, {
      text,
      tags,
      isActive: is_active,
    });

    res.json({ prompt });
  } catch (error) {
    const err = error as Error;
    if (err.message.includes('not found')) {
      res.status(404).json({ error: err.message });
    } else if (err.message.includes('already exists')) {
      res.status(409).json({ error: err.message });
    } else {
      logger.error(error, 'Error updating prompt');
      next(error);
    }
  }
}

/**
 * DELETE /api/brands/:brandId/prompts/:promptId
 * Delete prompt
 */
export async function deletePrompt(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { brandId, promptId } = req.params as { brandId: string; promptId: string };
    await promptService.deletePrompt(brandId, promptId, req.user!.id);
    res.json({ success: true });
  } catch (error) {
    const err = error as Error;
    if (err.message.includes('not found')) {
      res.status(404).json({ error: err.message });
    } else {
      logger.error(error, 'Error deleting prompt');
      next(error);
    }
  }
}

/**
 * GET /api/brands/:brandId/prompts/:promptId/results
 * Get prompt results history
 */
export async function getPromptResults(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { brandId, promptId } = req.params as { brandId: string; promptId: string };
    const result = await promptService.getPromptResults(brandId, promptId, req.user!.id);
    res.json(result);
  } catch (error) {
    const err = error as Error;
    if (err.message.includes('not found')) {
      res.status(404).json({ error: err.message });
    } else {
      logger.error(error, 'Error getting prompt results');
      next(error);
    }
  }
}
