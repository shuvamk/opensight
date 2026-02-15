import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  listPrompts,
  createPrompts,
  suggestPrompts,
  getPrompt,
  updatePrompt,
  deletePrompt,
  getPromptResults,
} from '../controllers/prompt.controller.js';
import { createPromptSchema, bulkCreatePromptsSchema, updatePromptSchema, suggestPromptsSchema } from '@opensight/shared';
import { z } from 'zod';

const router = Router({ mergeParams: true });

// GET /api/brands/:brandId/prompts - List prompts
router.get(
  '/',
  requireAuth,
  validate(
    z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
      tags: z.string().optional(),
    }),
    'query'
  ),
  listPrompts
);

// POST /api/brands/:brandId/prompts - Create prompt(s)
router.post(
  '/',
  requireAuth,
  validate(
    z.union([createPromptSchema, bulkCreatePromptsSchema])
  ),
  createPrompts
);

// POST /api/brands/:brandId/prompts/suggest - Suggest prompts
router.post(
  '/suggest',
  requireAuth,
  validate(suggestPromptsSchema),
  suggestPrompts
);

// GET /api/brands/:brandId/prompts/:promptId - Get single prompt
router.get('/:promptId', requireAuth, getPrompt);

// PATCH /api/brands/:brandId/prompts/:promptId - Update prompt
router.patch('/:promptId', requireAuth, validate(updatePromptSchema), updatePrompt);

// DELETE /api/brands/:brandId/prompts/:promptId - Delete prompt
router.delete('/:promptId', requireAuth, deletePrompt);

// GET /api/brands/:brandId/prompts/:promptId/results - Get prompt results
router.get('/:promptId/results', requireAuth, getPromptResults);

export default router;
