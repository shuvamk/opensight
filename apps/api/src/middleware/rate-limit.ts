import { Request, Response, NextFunction } from 'express';
import { redis } from '../config/redis.js';
import { logger } from '../utils/logger.js';

export interface RateLimiterOptions {
  windowMs: number; // Time window in milliseconds
  max: number; // Max requests per window
  keyPrefix: string; // Prefix for redis keys
}

export function rateLimiter(options: RateLimiterOptions) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const key = `${options.keyPrefix}:${getClientId(req)}`;

    try {
      const current = await redis.incr(key);

      if (current === 1) {
        // First request, set expiry
        await redis.expire(key, Math.ceil(options.windowMs / 1000));
      }

      res.set('X-RateLimit-Limit', options.max.toString());
      res.set('X-RateLimit-Remaining', Math.max(0, options.max - current).toString());

      if (current > options.max) {
        res.status(429).json({ error: 'Too many requests' });
        return;
      }

      next();
    } catch (err) {
      logger.error(err, 'Rate limiter error');
      next(); // Continue on error
    }
  };
}

function getClientId(req: Request): string {
  return req.user?.id || req.ip || 'unknown';
}
