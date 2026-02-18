import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { requestAnalysis } from '../controllers/analyze.controller.js';
import { analyzeRequestSchema } from '@opensight/shared';

const router = Router();

// POST /api/analyze - Queue a domain analysis
router.post('/', validate(analyzeRequestSchema), requestAnalysis);

export default router;
