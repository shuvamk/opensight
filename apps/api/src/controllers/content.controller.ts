import { Request, Response, NextFunction } from 'express';
import { contentService } from '../services/content.service.js';
import { logger } from '../utils/logger.js';

/**
 * POST /api/content/score
 * Score a URL (check daily limit). For now, return mock scores
 */
export async function scoreContent(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { url } = req.body;

    const score = await contentService.scoreContent(req.user!.id, { url });

    res.status(201).json({ score });
  } catch (error) {
    const err = error as Error;
    if (err.message.includes('limit')) {
      res.status(429).json({ error: err.message });
    } else {
      logger.error(error, 'Error scoring content');
      next(error);
    }
  }
}

/**
 * GET /api/content/score/history
 * Get score history for user
 */
export async function getScoreHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { limit = '50', offset = '0' } = req.query;

    const limitNum = parseInt(limit as string, 10) || 50;
    const offsetNum = parseInt(offset as string, 10) || 0;

    const result = await contentService.getScoreHistory(req.user!.id, limitNum, offsetNum);

    res.json(result);
  } catch (error) {
    logger.error(error, 'Error getting score history');
    next(error);
  }
}
