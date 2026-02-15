import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  listNotifications,
  markAsRead,
  markAllAsRead,
  getSettings,
  updateSettings,
} from '../controllers/notification.controller.js';
import { updateNotificationSettingsSchema } from '@opensight/shared';
import { z } from 'zod';

const router = Router();

// GET /api/notifications - List notifications
router.get(
  '/',
  requireAuth,
  validate(
    z.object({
      unread: z.string().optional(),
    }),
    'query'
  ),
  listNotifications
);

// PATCH /api/notifications/:id/read - Mark as read
router.patch('/:id/read', requireAuth, markAsRead);

// PATCH /api/notifications/read-all - Mark all as read
router.patch('/read-all', requireAuth, markAllAsRead);

// GET /api/notifications/settings - Get settings
router.get('/settings', requireAuth, getSettings);

// PATCH /api/notifications/settings - Update settings
router.patch('/settings', requireAuth, validate(updateNotificationSettingsSchema), updateSettings);

export default router;
