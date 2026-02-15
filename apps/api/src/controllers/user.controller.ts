import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service.js';
import { logger } from '../utils/logger.js';

/**
 * Get user profile handler
 * GET /users/profile
 */
export async function getProfileHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const profile = await userService.getProfile(userId);

    res.status(200).json(profile);
  } catch (err) {
    const error = err as Error;
    logger.error(err, 'Get profile failed');
    
    if (error.message.includes('not found')) {
      res.status(404).json({ error: error.message });
    } else {
      next(err);
    }
  }
}

/**
 * Update user profile handler
 * PATCH /users/profile
 */
export async function updateProfileHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const data = req.body;
    const profile = await userService.updateProfile(userId, data);

    res.status(200).json(profile);
  } catch (err) {
    const error = err as Error;
    logger.error(err, 'Update profile failed');
    
    if (error.message.includes('not found')) {
      res.status(404).json({ error: error.message });
    } else {
      next(err);
    }
  }
}

/**
 * Change password handler
 * PATCH /users/password
 */
export async function changePasswordHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { current_password, new_password } = req.body;

    await userService.changePassword(userId, current_password, new_password);

    res.status(200).json({
      message: 'Password changed successfully',
    });
  } catch (err) {
    const error = err as Error;
    logger.error(err, 'Change password failed');
    
    if (error.message.includes('not found')) {
      res.status(404).json({ error: error.message });
    } else if (error.message.includes('incorrect')) {
      res.status(400).json({ error: error.message });
    } else {
      next(err);
    }
  }
}
