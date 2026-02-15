import { Request, Response, NextFunction } from 'express';
import { apiKeyService } from '../services/api-key.service.js';
import { PLAN_LIMITS } from '@opensight/shared';
import { logger } from '../utils/logger.js';

/**
 * GET /api/api-keys
 * List user's API keys
 */
export async function listApiKeys(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const keys = await apiKeyService.listApiKeys(req.user!.id);
    res.json({ keys });
  } catch (error) {
    logger.error(error, 'Error listing API keys');
    next(error);
  }
}

/**
 * POST /api/api-keys
 * Create new key (return full key only once)
 */
export async function createApiKey(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name } = req.body;

    // Check plan limits
    const planLimits = PLAN_LIMITS[req.user!.plan_id as keyof typeof PLAN_LIMITS];
    const currentCount = await apiKeyService.getApiKeyCount(req.user!.id);

    if (currentCount >= planLimits.api_keys) {
      res.status(403).json({
        error: `You have reached the maximum number of API keys (${planLimits.api_keys}) for your plan`,
      });
      return;
    }

    const key = await apiKeyService.createApiKey(req.user!.id, { name });

    // Important: Display a warning about this being the only time they'll see the full key
    res.status(201).json({
      key,
      warning: 'Please save this API key in a secure location. You will not be able to view it again.',
    });
  } catch (error) {
    logger.error(error, 'Error creating API key');
    next(error);
  }
}

/**
 * DELETE /api/api-keys/:id
 * Revoke key
 */
export async function deleteApiKey(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params as { id: string };

    const key = await apiKeyService.revokeApiKey(id, req.user!.id);

    res.json({
      key,
      message: 'API key has been revoked and is no longer usable',
    });
  } catch (error) {
    const err = error as Error;
    if (err.message.includes('not found')) {
      res.status(404).json({ error: err.message });
    } else if (err.message.includes('already revoked')) {
      res.status(400).json({ error: err.message });
    } else {
      logger.error(error, 'Error deleting API key');
      next(error);
    }
  }
}
