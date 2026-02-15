import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { scoreContent, getScoreHistory } from '../controllers/content.controller.js';
import { scoreContentSchema } from '@opensight/shared';
import { z } from 'zod';

const router = Router();

// POST /api/content/score - Score a URL
router.post('/score', requireAuth, validate(scoreContentSchema), scoreContent);

// GET /api/content/score/history - Get score history
router.get(
  '/score/history',
  requireAuth,
  validate(
    z.object({
      limit: z.string().optional(),
      offset: z.string().optional(),
    }),
    'query'
  ),
  getScoreHistory
);

export default router;
