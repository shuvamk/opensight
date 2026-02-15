import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { redis } from '../config/redis.js';
import { logger } from '../utils/logger.js';

export async function requireApiKey(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer os_')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const apiKey = authHeader.slice(7);

  try {
    // Hash the API key to look up in database/cache
    const hashedKey = hashApiKey(apiKey);
    
    // TODO: Look up in database or cache
    // For now, just verify format
    if (!apiKey.startsWith('os_')) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // TODO: Attach user/workspace to request
    req.user = {
      id: 'api-user',
      email: 'api@example.com',
      plan_id: 'default',
    };

    next();
  } catch (err) {
    logger.error(err, 'API key validation failed');
    res.status(401).json({ error: 'Unauthorized' });
  }
}

function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}
