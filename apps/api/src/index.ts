import 'dotenv/config';
import app from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { startScheduler } from './jobs/scheduler.js';

const PORT = env.API_PORT;

app.listen(PORT, () => {
  logger.info(`API server running on port ${PORT}`);
});

// Start background job scheduler
startScheduler().catch((error) => {
  logger.error(error, 'Failed to start scheduler');
  process.exit(1);
});
