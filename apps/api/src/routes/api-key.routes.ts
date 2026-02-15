import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { listApiKeys, createApiKey, deleteApiKey } from '../controllers/api-key.controller.js';
import { z } from 'zod';

const router = Router();

const createApiKeySchema = z.object({
  name: z.string().min(1, 'API key name is required').max(100),
});

// GET /api/api-keys - List API keys
router.get('/', requireAuth, listApiKeys);

// POST /api/api-keys - Create API key
router.post('/', requireAuth, validate(createApiKeySchema), createApiKey);

// DELETE /api/api-keys/:id - Delete/revoke API key
router.delete('/:id', requireAuth, deleteApiKey);

export default router;
