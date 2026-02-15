export { EngineQuery, EngineResponse, EngineClient } from './types';
export { BaseEngineClient } from './base';
export { ChatGPTClient } from './chatgpt';
export { PerplexityClient } from './perplexity';
export { GoogleAIOClient } from './google-aio';

import { ChatGPTClient } from './chatgpt';
import { PerplexityClient } from './perplexity';
import { GoogleAIOClient } from './google-aio';
import { EngineClient } from './types';

export function createEngineClient(
  engine: string,
  config?: Record<string, string>
): EngineClient {
  switch (engine.toLowerCase()) {
    case 'chatgpt':
      return new ChatGPTClient(config?.openaiApiKey);
    case 'perplexity':
      return new PerplexityClient(config?.perplexityApiKey);
    case 'google':
    case 'google_aio':
      return new GoogleAIOClient(config?.serperApiKey);
    default:
      throw new Error(`Unknown engine: ${engine}`);
  }
}
