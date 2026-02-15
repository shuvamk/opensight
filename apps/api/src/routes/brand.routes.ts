import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  listBrands,
  createBrand,
  getBrand,
  updateBrand,
  deleteBrand,
  getBrandDashboard,
  getBrandTrends,
} from '../controllers/brand.controller.js';
import { createBrandSchema, updateBrandSchema } from '@opensight/shared';
import { z } from 'zod';

const router = Router();

// GET /api/brands - List user's brands
router.get('/', requireAuth, listBrands);

// POST /api/brands - Create brand
router.post('/', requireAuth, validate(createBrandSchema), createBrand);

// GET /api/brands/:id - Get single brand
router.get('/:id', requireAuth, getBrand);

// PATCH /api/brands/:id - Update brand
router.patch('/:id', requireAuth, validate(updateBrandSchema), updateBrand);

// DELETE /api/brands/:id - Delete brand
router.delete('/:id', requireAuth, deleteBrand);

// GET /api/brands/:id/dashboard - Get brand dashboard
router.get('/:id/dashboard', requireAuth, getBrandDashboard);

// GET /api/brands/:id/trends - Get brand trends
router.get(
  '/:id/trends',
  requireAuth,
  validate(
    z.object({
      range: z.enum(['7d', '14d', '30d', '90d']).optional(),
    }),
    'query'
  ),
  getBrandTrends
);

export default router;
