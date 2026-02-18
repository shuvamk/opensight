import { inngest } from '../client.js';
import { logger } from '../../utils/logger.js';

export const handleAnalyseRequest = inngest.createFunction(
  {
    id: 'handle-analyse-request',
    name: 'Handle Analyse Request',
  },
  { event: 'analyse-request' },
  async ({ event, step }) => {
    const { domain, email } = event.data;

    logger.info({ domain, email }, 'Processing analyse request');

    await step.run('analyse-domain', async () => {
      logger.info({ domain }, 'Analysing domain');
      // TODO: Implement domain analysis logic
      return { domain, status: 'analysed' };
    });

    await step.run('notify-user', async () => {
      logger.info({ email }, 'Notifying user');
      // TODO: Send email notification with results
      return { email, status: 'notified' };
    });

    return { success: true, domain, email };
  }
);
