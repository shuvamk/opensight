export interface Brand {
  id: string;
  name: string;
  websiteUrl: string;
  industry?: string;
  isActive?: boolean;
  pinned?: boolean;
  createdAt?: string;
  updatedAt?: string;
  latestVisibilityScore?: number;
}

export interface ListBrandsResponse {
  brands: Brand[];
}

export interface GetBrandResponse {
  brand: Brand;
}

export interface CreateBrandPayload {
  name: string;
  website_url: string;
  industry?: string;
}

export interface UpdateBrandPayload {
  name?: string;
  website_url?: string;
  industry?: string;
  pinned?: boolean;
}

export interface RecentChange {
  id: string;
  type: "up" | "down";
  description: string;
  timestamp: string;
}

export interface DashboardData {
  brandId: string;
  overallScore?: number;
  chatgptScore?: number;
  perplexityScore?: number;
  googleAioScore?: number;
  sentimentBreakdown?: { positive: number; neutral: number; negative: number };
  totalMentions?: number;
  totalPromptsChecked?: number;
  competitorData?: Record<string, unknown>;
  recent_changes?: RecentChange[];
}

export interface EngineMetric {
  engine: string;
  score: number;
  trend?: number;
  sparklineData?: Array<{ value: number }>;
  topPrompt?: string;
}

export interface TrendDataPoint {
  date: string;
  overallScore: number;
  chatgptScore: number;
  perplexityScore: number;
  googleAioScore: number;
  mentions?: number;
  sentiment?: { positive: number; neutral: number; negative: number };
}

export interface GetBrandTrendsResponse {
  brandId: string;
  rangeInDays: number;
  dataPoints: TrendDataPoint[];
}
