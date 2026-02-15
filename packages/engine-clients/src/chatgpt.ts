import OpenAI from 'openai';
import { BaseEngineClient } from './base';
import { EngineQuery, EngineResponse } from './types';

export class ChatGPTClient extends BaseEngineClient {
  name = 'chatgpt';
  private client: OpenAI;

  constructor(apiKey?: string) {
    super();
    const key = apiKey || process.env.OPENAI_API_KEY;
    if (!key) {
      throw new Error('OPENAI_API_KEY is required for ChatGPT client');
    }
    this.client = new OpenAI({ apiKey: key });
  }

  async query(input: EngineQuery): Promise<EngineResponse> {
    const prompt = `${input.prompt}\n\nContext: This query is for ${input.brandName} (${input.brandUrl})`;

    const response = await this.retryWithExponentialBackoff(async () => {
      return await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
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
      engine: 'chatgpt',
      responseText,
      citationUrls,
      rawResponse: response,
      queriedAt: new Date(),
    };
  }
}
