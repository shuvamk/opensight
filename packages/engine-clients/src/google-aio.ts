import fetch from 'node-fetch';
import { BaseEngineClient } from './base';
import { EngineQuery, EngineResponse } from './types';

interface SerperResponse {
  answerBox?: {
    snippet?: string;
    sources?: Array<{ title: string; link: string }>;
  };
  organic?: Array<{
    title: string;
    link: string;
    snippet: string;
  }>;
}

export class GoogleAIOClient extends BaseEngineClient {
  name = 'google_aio';
  private apiKey: string;

  constructor(apiKey?: string) {
    super();
    const key = apiKey || process.env.SERPER_API_KEY;
    if (!key) {
      throw new Error('SERPER_API_KEY is required for Google AIO client');
    }
    this.apiKey = key;
  }

  async query(input: EngineQuery): Promise<EngineResponse> {
    const searchQuery = `${input.prompt} ${input.brandName}`;

    const response = await this.retryWithExponentialBackoff(async () => {
      const res = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: {
          'X-API-KEY': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: searchQuery,
          gl: 'us',
          hl: 'en',
        }),
      });

      if (!res.ok) {
        throw new Error(`Serper API error: ${res.statusText}`);
      }

      return (await res.json()) as SerperResponse;
    });

    let responseText = '';
    const citationUrls: string[] = [];

    if (response.answerBox?.snippet) {
      responseText = response.answerBox.snippet;
      if (response.answerBox.sources) {
        response.answerBox.sources.forEach((source) => {
          citationUrls.push(source.link);
        });
      }
    }

    if (response.organic) {
      if (!responseText) {
        responseText = response.organic
          .slice(0, 3)
          .map((result) => `${result.title}: ${result.snippet}`)
          .join('\n\n');
      }
      response.organic.forEach((result) => {
        citationUrls.push(result.link);
      });
    }

    return {
      engine: 'google_aio',
      responseText: responseText || 'No results found',
      citationUrls: [...new Set(citationUrls)],
      rawResponse: response,
      queriedAt: new Date(),
    };
  }
}
