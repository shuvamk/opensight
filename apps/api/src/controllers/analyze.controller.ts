import { Request, Response, NextFunction } from 'express';
import { analyzeService } from '../services/analyze.service.js';
import { logger } from '../utils/logger.js';

/**
 * POST /api/analyze
 * Queue a domain analysis request via Inngest
 */
export async function requestAnalysis(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { domain, email } = req.body;
    const result = await analyzeService.requestAnalysis(domain, email);
    res.status(202).json(result);
  } catch (error) {
    logger.error(error, 'Error requesting analysis');
    next(error);
  }
}
