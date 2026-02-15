export interface Competitor {
  id: string;
  name: string;
  websiteUrl: string;
  brandId: string;
  createdAt?: string | null;
}

export interface ListCompetitorsResponse {
  competitors: Competitor[];
}

export interface AddCompetitorPayload {
  name: string;
  website_url: string;
}

export interface AddCompetitorResponse {
  competitor: Competitor;
}

export interface ComparisonItem {
  id: string;
  name: string;
  websiteUrl: string;
  mentions: number;
  shareOfVoice: string;
  visibilityGap: string;
  rank: number;
}

export interface CompetitorComparisonResponse {
  brand: ComparisonItem;
  competitors: ComparisonItem[];
  leaderboard: ComparisonItem[];
}
