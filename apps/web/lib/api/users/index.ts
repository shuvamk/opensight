import { apiClient } from "@/lib/api-client";
import type {
  UserProfile,
  UpdateProfilePayload,
  ChangePasswordPayload,
} from "./types";

/** GET /users/profile - returns profile directly (no wrapper) */
export async function getProfile(): Promise<UserProfile> {
  return apiClient.get<UserProfile>("/users/profile");
}

/** PATCH /users/profile */
export async function updateProfile(
  payload: UpdateProfilePayload
): Promise<UserProfile> {
  return apiClient.patch<UserProfile>("/users/profile", payload);
}

/** PATCH /users/password */
export async function changePassword(
  payload: ChangePasswordPayload
): Promise<{ message: string }> {
  return apiClient.patch<{ message: string }>("/users/password", payload);
}
