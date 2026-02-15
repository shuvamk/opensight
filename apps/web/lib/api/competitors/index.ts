import { apiClient } from "@/lib/api-client";
import type {
  Competitor,
  ListCompetitorsResponse,
  AddCompetitorPayload,
  AddCompetitorResponse,
  CompetitorComparisonResponse,
} from "./types";

export async function listCompetitors(brandId: string): Promise<Competitor[]> {
  const res = await apiClient.get<ListCompetitorsResponse>(
    `/brands/${brandId}/competitors`
  );
  return res.competitors;
}

export async function addCompetitor(
  brandId: string,
  payload: AddCompetitorPayload
): Promise<Competitor> {
  const res = await apiClient.post<AddCompetitorResponse>(
    `/brands/${brandId}/competitors`,
    payload
  );
  return res.competitor;
}

export async function removeCompetitor(
  brandId: string,
  competitorId: string
): Promise<{ success: boolean }> {
  return apiClient.del<{ success: boolean }>(
    `/brands/${brandId}/competitors/${competitorId}`
  );
}

export async function getCompetitorComparison(
  brandId: string
): Promise<CompetitorComparisonResponse> {
  return apiClient.get<CompetitorComparisonResponse>(
    `/brands/${brandId}/competitors/comparison`
  );
}
