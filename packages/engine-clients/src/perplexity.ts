import OpenAI from 'openai';
import { BaseEngineClient } from './base';
import { EngineQuery, EngineResponse } from './types';

export class PerplexityClient extends BaseEngineClient {
  name = 'perplexity';
  private client: OpenAI;

  constructor(apiKey?: string) {
    super();
    const key = apiKey || process.env.PERPLEXITY_API_KEY;
    if (!key) {
      throw new Error('PERPLEXITY_API_KEY is required for Perplexity client');
    }
    this.client = new OpenAI({
      apiKey: key,
      baseURL: 'https://api.perplexity.ai',
    });
  }

  async query(input: EngineQuery): Promise<EngineResponse> {
    const prompt = `${input.prompt}\n\nContext: This query is for ${input.brandName} (${input.brandUrl})`;

    const response = await this.retryWithExponentialBackoff(async () => {
      return await this.client.chat.completions.create({
        model: 'sonar',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });
    });

    const responseText =
      response.choices[0]?.message?.content || 'No response received';
    const citationUrls = this.extractUrlsFromText(responseText);

    return {
      engine: 'perplexity',
      responseText,
      citationUrls,
      rawResponse: response,
      queriedAt: new Date(),
    };
  }
}
