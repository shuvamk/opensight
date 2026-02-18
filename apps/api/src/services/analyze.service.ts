import { inngest } from '../inngest/index.js';
import { logger } from '../utils/logger.js';

class AnalyzeService {
  async requestAnalysis(domain: string, email: string) {
    await inngest.send({
      name: 'analyse-request',
      data: { domain, email },
    });

    logger.info({ domain, email }, 'Queued analyse-request event via Inngest');

    return { queued: true, domain, email };
  }
}

export const analyzeService = new AnalyzeService();
