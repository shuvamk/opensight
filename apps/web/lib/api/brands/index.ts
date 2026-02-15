import { apiClient } from "@/lib/api-client";
import type {
  Brand,
  ListBrandsResponse,
  GetBrandResponse,
  CreateBrandPayload,
  UpdateBrandPayload,
  DashboardData,
  GetBrandTrendsResponse,
} from "./types";

export async function listBrands(): Promise<Brand[]> {
  const res = await apiClient.get<ListBrandsResponse>("/brands");
  return res.brands;
}

export async function getBrand(id: string): Promise<Brand> {
  const res = await apiClient.get<GetBrandResponse>(`/brands/${id}`);
  return res.brand;
}

export async function createBrand(payload: CreateBrandPayload): Promise<Brand> {
  const res = await apiClient.post<{ brand: Brand }>("/brands", payload);
  return res.brand;
}

export async function updateBrand(
  id: string,
  payload: UpdateBrandPayload
): Promise<Brand> {
  const res = await apiClient.patch<{ brand: Brand }>(`/brands/${id}`, payload);
  return res.brand;
}

export async function deleteBrand(id: string): Promise<{ success: boolean }> {
  return apiClient.del<{ success: boolean }>(`/brands/${id}`);
}

export async function getBrandDashboard(id: string): Promise<DashboardData> {
  return apiClient.get<DashboardData>(`/brands/${id}/dashboard`);
}

export async function getBrandTrends(
  id: string,
  range?: string
): Promise<GetBrandTrendsResponse> {
  const params = range ? `?range=${range}` : "";
  return apiClient.get<GetBrandTrendsResponse>(
    `/brands/${id}/trends${params}`
  );
}
