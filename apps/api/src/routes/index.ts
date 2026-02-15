import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import brandRoutes from './brand.routes.js';
import promptRoutes from './prompt.routes.js';
import competitorRoutes from './competitor.routes.js';
import contentRoutes from './content.routes.js';
import notificationRoutes from './notification.routes.js';
import apiKeyRoutes from './api-key.routes.js';
import webhookRoutes from './webhook.routes.js';

const router = Router();

// Auth routes
router.use('/auth', authRoutes);

// User routes
router.use('/users', userRoutes);

// Brand routes
router.use('/brands', brandRoutes);

// Prompt routes (nested under brands)
router.use('/brands/:brandId/prompts', promptRoutes);

// Competitor routes (nested under brands)
router.use('/brands/:brandId/competitors', competitorRoutes);

// Content routes
router.use('/content', contentRoutes);

// Notification routes
router.use('/notifications', notificationRoutes);

// API Key routes
router.use('/api-keys', apiKeyRoutes);

// Webhook routes
router.use('/webhooks', webhookRoutes);

export default router;
