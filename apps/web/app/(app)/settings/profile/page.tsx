"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

const profileSchema = z.object({
  displayName: z.string().min(1, "Display name is required").max(100),
  email: z.string().email(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormInputs = z.infer<typeof profileSchema>;
type PasswordFormInputs = z.infer<typeof passwordSchema>;

interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  avatar?: string;
  authMethod: "email" | "oauth";
}

export default function ProfileSettingsPage() {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const queryClient = useQueryClient();

  // Fetch profile (API returns full_name, we map to displayName)
  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const data = await apiClient.get<{ id: string; email: string; full_name?: string; avatar_url?: string }>("/users/profile");
      return {
        id: data.id,
        email: data.email,
        displayName: data.full_name ?? "",
        avatar: data.avatar_url,
        authMethod: "email",
      };
    },
  });

  // Profile form
  const profileForm = useForm<ProfileFormInputs>({
    resolver: zodResolver(profileSchema),
    values: {
      displayName: profile?.displayName || "",
      email: profile?.email || "",
    },
  });

  // Password form
  const passwordForm = useForm<PasswordFormInputs>({
    resolver: zodResolver(passwordSchema),
  });

  // Update profile mutation (API expects name, not displayName)
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: (data: ProfileFormInputs) =>
      apiClient.patch("/users/profile", { name: data.displayName }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    },
  });

  // Update password mutation (API expects current_password, new_password)
  const { mutate: updatePassword, isPending: isUpdatingPassword } = useMutation({
    mutationFn: (data: PasswordFormInputs) =>
      apiClient.patch("/users/password", {
        current_password: data.currentPassword,
        new_password: data.newPassword,
      }),
    onSuccess: () => {
      toast.success("Password updated successfully!");
      passwordForm.reset();
      setShowPasswordForm(false);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update password"
      );
    },
  });

  const onProfileSubmit = (data: ProfileFormInputs) => {
    updateProfile(data);
  };

  const onPasswordSubmit = (data: PasswordFormInputs) => {
    updatePassword(data);
  };

  const initials =
    profile?.displayName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings</p>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div>
            <Card className="p-4">
              <SettingsSidebar />
            </Card>
          </div>

          {/* Content */}
          <div className="md:col-span-3 space-y-6">
            {isLoading ? (
              <Card className="p-8 text-center text-gray-600">
                Loading profile...
              </Card>
            ) : (
              <>
                {/* Profile Section */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Profile Information</h2>

                  {/* Avatar */}
                  <div className="mb-6">
                    <Label className="text-sm font-medium mb-4 block">Avatar</Label>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={profile?.avatar} alt={profile?.displayName} />
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <Button variant="outline" size="sm" disabled>
                        <Upload className="h-4 w-4 mr-2" />
                        Change Avatar
                      </Button>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Profile Form */}
                  <form
                    onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        placeholder="Your name"
                        {...profileForm.register("displayName")}
                        disabled={isUpdatingProfile}
                      />
                      {profileForm.formState.errors.displayName && (
                        <p className="text-sm text-red-500 mt-1">
                          {profileForm.formState.errors.displayName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        {...profileForm.register("email")}
                        disabled
                        className="bg-gray-50 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Email cannot be changed
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={isUpdatingProfile}
                      >
                        {isUpdatingProfile && (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        )}
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </Card>

                {/* Password Section */}
                {profile?.authMethod === "email" && (
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-6">Change Password</h2>

                    {!showPasswordForm ? (
                      <Button
                        variant="outline"
                        onClick={() => setShowPasswordForm(true)}
                      >
                        Change Password
                      </Button>
                    ) : (
                      <form
                        onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                        className="space-y-4"
                      >
                        <div>
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            placeholder="Enter your current password"
                            {...passwordForm.register("currentPassword")}
                            disabled={isUpdatingPassword}
                          />
                          {passwordForm.formState.errors.currentPassword && (
                            <p className="text-sm text-red-500 mt-1">
                              {passwordForm.formState.errors.currentPassword.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            placeholder="Enter new password (min 8 characters)"
                            {...passwordForm.register("newPassword")}
                            disabled={isUpdatingPassword}
                          />
                          {passwordForm.formState.errors.newPassword && (
                            <p className="text-sm text-red-500 mt-1">
                              {passwordForm.formState.errors.newPassword.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="confirmPassword">Confirm Password</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm your new password"
                            {...passwordForm.register("confirmPassword")}
                            disabled={isUpdatingPassword}
                          />
                          {passwordForm.formState.errors.confirmPassword && (
                            <p className="text-sm text-red-500 mt-1">
                              {passwordForm.formState.errors.confirmPassword.message}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-3 justify-end">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setShowPasswordForm(false);
                              passwordForm.reset();
                            }}
                            disabled={isUpdatingPassword}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={isUpdatingPassword}
                          >
                            {isUpdatingPassword && (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            )}
                            Update Password
                          </Button>
                        </div>
                      </form>
                    )}
                  </Card>
                )}

                {profile?.authMethod === "oauth" && (
                  <Card className="p-6 bg-blue-50 border-blue-200">
                    <p className="text-sm text-blue-800">
                      Your account uses single sign-on. Password changes are not available.
                    </p>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
