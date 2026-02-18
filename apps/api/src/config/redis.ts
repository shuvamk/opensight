import { Redis } from '@upstash/redis';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

// Create Upstash Redis client (HTTP-based, no TCP connection needed)
export const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

logger.info('Upstash Redis client initialized');

// ---------------------------------------------------------------------------
// Simple in-process job runner (replaces BullMQ which requires TCP Redis)
// ---------------------------------------------------------------------------

interface JobOptions {
  attempts?: number;
  backoffMs?: number;
}

/**
 * Run a job processor with retry logic.
 * This replaces BullMQ queues for simple, single-server deployments.
 */
export async function runJob<T>(
  jobName: string,
  data: T,
  processor: (data: T) => Promise<any>,
  options: JobOptions = {}
): Promise<any> {
  const { attempts = 3, backoffMs = 2000 } = options;
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      logger.info({ jobName, attempt, data }, `Running job (attempt ${attempt}/${attempts})`);
      const result = await processor(data);
      logger.info({ jobName, attempt }, `Job completed successfully`);
      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      logger.error(
        { jobName, attempt, error: lastError.message },
        `Job attempt ${attempt}/${attempts} failed`
      );

      if (attempt < attempts) {
        const delay = backoffMs * Math.pow(2, attempt - 1);
        logger.info({ jobName, delayMs: delay }, `Retrying in ${delay}ms`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  logger.error({ jobName, error: lastError?.message }, `Job failed after ${attempts} attempts`);
  throw lastError;
}

export default redis;
