import { EngineQuery, EngineResponse, EngineClient } from './types';

export abstract class BaseEngineClient implements EngineClient {
  abstract name: string;

  protected readonly maxRetries = 3;
  protected readonly baseDelay = 1000; // 1 second

  abstract query(input: EngineQuery): Promise<EngineResponse>;

  protected async retryWithExponentialBackoff<T>(
    fn: () => Promise<T>,
    retries: number = this.maxRetries
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt < retries) {
          const delay = this.baseDelay * Math.pow(2, attempt);
          console.log(
            `Attempt ${attempt + 1} failed, retrying in ${delay}ms...`,
            lastError.message
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error('Unknown error occurred');
  }

  protected extractUrlsFromText(text: string): string[] {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = text.match(urlRegex) || [];
    return [...new Set(matches)]; // Remove duplicates
  }
}
