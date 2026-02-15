"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as usersApi from "@/lib/api/users";

export interface UserProfileUI {
  id: string;
  email: string;
  displayName: string;
  avatar?: string | null;
  authMethod: string;
}

export function useProfile() {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async (): Promise<UserProfileUI> => {
      const data = await usersApi.getProfile();
      return {
        id: data.id,
        email: data.email,
        displayName: data.full_name ?? "",
        avatar: data.avatar_url,
        authMethod: "email",
      };
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { displayName: string }) =>
      usersApi.updateProfile({ name: data.displayName }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      usersApi.changePassword({
        current_password: data.currentPassword,
        new_password: data.newPassword,
      }),
  });
}
