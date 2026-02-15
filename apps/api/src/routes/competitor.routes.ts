import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  listCompetitors,
  addCompetitor,
  removeCompetitor,
  getCompetitorComparison,
} from '../controllers/competitor.controller.js';
import { createCompetitorSchema } from '@opensight/shared';

const router = Router({ mergeParams: true });

// GET /api/brands/:brandId/competitors - List competitors
router.get('/', requireAuth, listCompetitors);

// POST /api/brands/:brandId/competitors - Add competitor
router.post('/', requireAuth, validate(createCompetitorSchema), addCompetitor);

// GET /api/brands/:brandId/competitors/comparison - Get comparison
router.get('/comparison', requireAuth, getCompetitorComparison);

// DELETE /api/brands/:brandId/competitors/:competitorId - Remove competitor
router.delete('/:competitorId', requireAuth, removeCompetitor);

export default router;
