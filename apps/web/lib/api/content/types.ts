export interface ContentScore {
  id: string;
  userId: string;
  url: string;
  overallScore: number;
  structureScore?: number;
  readabilityScore?: number;
  freshnessScore?: number;
  keyContentScore?: number;
  citationScore?: number;
  recommendations?: string[];
  scoredAt: string;
}

export interface ScoreHistoryResponse {
  scores: ContentScore[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

export interface ScoreContentPayload {
  url: string;
}

export interface ScoreContentResult {
  score: ContentScore;
}
