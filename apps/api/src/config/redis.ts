import Redis from 'ioredis';
import { Queue, Worker } from 'bullmq';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

// Parse Redis URL
const redisUrl = new URL(env.REDIS_URL);
const redisConfig = {
  host: redisUrl.hostname,
  port: parseInt(redisUrl.port || '6379', 10),
  password: redisUrl.password,
  db: parseInt(redisUrl.pathname?.slice(1) || '0', 10),
};

// Create Redis client
export const redis = new Redis(redisConfig);

redis.on('error', (err) => {
  logger.error(err, 'Redis connection error');
});

redis.on('connect', () => {
  logger.info('Redis connected');
});

// BullMQ configuration
const connection = {
  host: redisConfig.host,
  port: redisConfig.port,
  password: redisConfig.password,
  db: redisConfig.db,
};

// Queue factories
export const createQueue = (name: string) => {
  return new Queue(name, { connection });
};

export const createWorker = (
  queueName: string,
  processor: (job: any) => Promise<any>,
  concurrency = 10
) => {
  return new Worker(queueName, processor, {
    connection,
    concurrency,
  });
};

export default redis;
