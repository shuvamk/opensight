import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      plan_id: string;
      fullName?: string;
      avatarUrl?: string;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = extractToken(req);

  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded as Express.User;
    next();
  } catch (err) {
    logger.error(err, 'JWT verification failed');
    res.status(401).json({ error: 'Unauthorized' });
  }
}

export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
  const token = extractToken(req);

  if (token) {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET);
      req.user = decoded as Express.User;
    } catch (err) {
      logger.debug(err, 'Optional JWT verification failed');
    }
  }

  next();
}

function extractToken(req: Request): string | null {
  // Try Bearer token in Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  // Try httpOnly cookie
  if (req.cookies?.token) {
    return req.cookies.token;
  }

  return null;
}
