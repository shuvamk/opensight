import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(process.cwd(), ".env") });
config({ path: path.resolve(__dirname, "../../../.env") });

const { default: app } = await import("./app.js");
const { env } = await import("./config/env.js");
const { logger } = await import("./utils/logger.js");
const { startScheduler } = await import("./jobs/scheduler.js");

const PORT = env.API_PORT;

app.listen(PORT, () => {
  logger.info(`API server running on port ${PORT}`);
});

// Start background job scheduler
startScheduler().catch((error) => {
  logger.error(error, "Failed to start scheduler");
  process.exit(1);
});
