"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { setAuthToken, clearAuthToken } from "@/lib/auth-token";
import * as usersApi from "@/lib/api/users";

/** API returns full_name; we expose as name for UI */
interface User {
  id: string;
  email: string;
  name: string;
  full_name?: string;
}

interface AuthResponse {
  user: User;
  accessToken: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

export function useAuthProfile() {
  return useQuery({
    queryKey: ["auth", "profile"],
    queryFn: async () => {
      const data = await usersApi.getProfile();
      return { ...data, name: data.full_name ?? "" } as User;
    },
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const data = await apiClient.post<AuthResponse>("/auth/login", payload);
      if (data.accessToken) setAuthToken(data.accessToken);
      return data;
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const data = await apiClient.post<AuthResponse>("/auth/register", payload);
      if (data.accessToken) setAuthToken(data.accessToken);
      return data;
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      await apiClient.post("/auth/logout");
      clearAuthToken();
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) =>
      apiClient.post("/auth/forgot-password", { email }),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: { token: string; password: string }) =>
      apiClient.post("/auth/reset-password", payload),
  });
}
