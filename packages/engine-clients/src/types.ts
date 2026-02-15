export interface EngineQuery {
  prompt: string;
  brandName: string;
  brandUrl: string;
}

export interface EngineResponse {
  engine: 'chatgpt' | 'perplexity' | 'google_aio';
  responseText: string;
  citationUrls: string[];
  rawResponse: unknown;
  queriedAt: Date;
}

export interface EngineClient {
  name: string;
  query(input: EngineQuery): Promise<EngineResponse>;
}
