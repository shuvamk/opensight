import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { inngest } from '../client.js';
import { logger } from '../../utils/logger.js';
import { BRAND_ANALYSIS_PROMPT, BrandAnalysisSchema } from './prompts/brand-analysis.js';

export const handleAnalyseRequest = inngest.createFunction(
  {
    id: 'handle-analyse-request',
    name: 'Handle Analyse Request',
    retries: 1,
  },
  { event: 'analyse-request' },
  async ({ event, step }) => {
    const { domain, email } = event.data;

    logger.info({ domain, email }, 'Processing analyse request');

    const analysisResult = await step.run('analyse-domain', async () => {
      logger.info({ domain }, 'Calling OpenAI Responses API with structured output');

      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const response = await openai.responses.parse({
        model: 'gpt-4.1',
        tools: [{ type: 'web_search_preview' }],
        input: BRAND_ANALYSIS_PROMPT + domain,
        max_output_tokens: 16000,
        text: {
          format: zodTextFormat(BrandAnalysisSchema, 'brand_analysis'),
        },
      });

      // Extract parsed output from the response
      const messageOutput = response.output.find(
        (item: any) => item.type === 'message'
      );

      if (!messageOutput || messageOutput.type !== 'message') {
        throw new Error('No message output received from OpenAI');
      }

      for (const item of messageOutput.content) {
        if (item.type === 'refusal') {
          throw new Error(`OpenAI refused the request: ${item.refusal}`);
        }
        if (item.type === 'output_text' && item.parsed) {
          logger.info(
            { domain, brand: item.parsed.brand?.name },
            'Brand analysis completed successfully'
          );
          return item.parsed;
        }
      }

      throw new Error('No parsed output found in OpenAI response');
    });

    await step.run('notify-user', async () => {
      logger.info({ email, domain }, 'Notifying user of analysis completion');
      // TODO: Send email notification with results via Resend
      return { email, status: 'notified' };
    });

    return { success: true, domain, email, analysis: analysisResult };
  }
);
