import cron from 'node-cron';
import { db, brands, users } from '@opensight/db';
import { eq } from 'drizzle-orm';
import { logger } from '../utils/logger.js';
import { queuePromptRunner } from './prompt-runner.js';
import { queueSnapshotAggregator } from './snapshot-aggregator.js';
import { queueAlertChecker } from './alert-checker.js';
import { queueEmailDigest } from './email-digest.js';

/**
 * Start all scheduled jobs
 */
export async function startScheduler(): Promise<void> {
  logger.info('Starting job scheduler');

  // ============================================================================
  // 6 AM UTC: Queue prompt runs for all active brands
  // ============================================================================
  cron.schedule('0 6 * * *', async () => {
    try {
      logger.info('Running scheduled prompt runner job');

      const activeBrands = await db
        .select()
        .from(brands)
        .where(eq(brands.isActive, true));

      logger.info({ brandCount: activeBrands.length }, 'Queuing prompt runners');

      for (const brand of activeBrands) {
        try {
          await queuePromptRunner({ brandId: brand.id });
        } catch (error) {
          logger.error(
            {
              brandId: brand.id,
              error: error instanceof Error ? error.message : String(error),
            },
            'Failed to queue prompt runner'
          );
        }
      }

      logger.info('Scheduled prompt runner jobs completed');
    } catch (error) {
      logger.error(
        { error: error instanceof Error ? error.message : String(error) },
        'Scheduled prompt runner job failed'
      );
    }
  });

  // ============================================================================
  // 8 AM UTC: Queue snapshot aggregation for all brands
  // ============================================================================
  cron.schedule('0 8 * * *', async () => {
    try {
      logger.info('Running scheduled snapshot aggregator job');

      const activeBrands = await db
        .select()
        .from(brands)
        .where(eq(brands.isActive, true));

      logger.info({ brandCount: activeBrands.length }, 'Queuing snapshot aggregators');

      for (const brand of activeBrands) {
        try {
          await queueSnapshotAggregator({ brandId: brand.id });
        } catch (error) {
          logger.error(
            {
              brandId: brand.id,
              error: error instanceof Error ? error.message : String(error),
            },
            'Failed to queue snapshot aggregator'
          );
        }
      }

      logger.info('Scheduled snapshot aggregator jobs completed');
    } catch (error) {
      logger.error(
        { error: error instanceof Error ? error.message : String(error) },
        'Scheduled snapshot aggregator job failed'
      );
    }
  });

  // ============================================================================
  // 9 AM UTC: Queue alert checking for all brands
  // ============================================================================
  cron.schedule('0 9 * * *', async () => {
    try {
      logger.info('Running scheduled alert checker job');

      const activeBrands = await db
        .select()
        .from(brands)
        .where(eq(brands.isActive, true));

      logger.info({ brandCount: activeBrands.length }, 'Queuing alert checkers');

      for (const brand of activeBrands) {
        try {
          await queueAlertChecker({ brandId: brand.id });
        } catch (error) {
          logger.error(
            {
              brandId: brand.id,
              error: error instanceof Error ? error.message : String(error),
            },
            'Failed to queue alert checker'
          );
        }
      }

      logger.info('Scheduled alert checker jobs completed');
    } catch (error) {
      logger.error(
        { error: error instanceof Error ? error.message : String(error) },
        'Scheduled alert checker job failed'
      );
    }
  });

  // ============================================================================
  // 10 AM UTC: Queue daily email digests
  // ============================================================================
  cron.schedule('0 10 * * *', async () => {
    try {
      logger.info('Running scheduled daily email digest job');

      // Get all users with daily digest preference
      const allUsers = await db.select().from(users);

      logger.info({ userCount: allUsers.length }, 'Queuing daily email digests');

      for (const user of allUsers) {
        try {
          await queueEmailDigest({ userId: user.id, frequency: 'daily' });
        } catch (error) {
          logger.error(
            {
              userId: user.id,
              error: error instanceof Error ? error.message : String(error),
            },
            'Failed to queue daily email digest'
          );
        }
      }

      logger.info('Scheduled daily email digest jobs completed');
    } catch (error) {
      logger.error(
        { error: error instanceof Error ? error.message : String(error) },
        'Scheduled daily email digest job failed'
      );
    }
  });

  // ============================================================================
  // 10 AM UTC, Monday: Queue weekly email digests
  // ============================================================================
  cron.schedule('0 10 * * 1', async () => {
    try {
      logger.info('Running scheduled weekly email digest job');

      // Get all users with weekly digest preference
      const allUsers = await db.select().from(users);

      logger.info({ userCount: allUsers.length }, 'Queuing weekly email digests');

      for (const user of allUsers) {
        try {
          await queueEmailDigest({ userId: user.id, frequency: 'weekly' });
        } catch (error) {
          logger.error(
            {
              userId: user.id,
              error: error instanceof Error ? error.message : String(error),
            },
            'Failed to queue weekly email digest'
          );
        }
      }

      logger.info('Scheduled weekly email digest jobs completed');
    } catch (error) {
      logger.error(
        { error: error instanceof Error ? error.message : String(error) },
        'Scheduled weekly email digest job failed'
      );
    }
  });

  logger.info('Job scheduler started successfully');
}

export default startScheduler;
