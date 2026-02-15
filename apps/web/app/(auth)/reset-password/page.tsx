"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { resetPasswordSchema } from "@opensight/shared";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

const resetPasswordFormSchema = resetPasswordSchema.omit({ token: true }).extend({
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormInput = z.infer<typeof resetPasswordFormSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormInput>({
    resolver: zodResolver(resetPasswordFormSchema),
  });

  const onSubmit = async (data: ResetPasswordFormInput) => {
    if (!token) {
      toast.error("Invalid or missing reset token");
      return;
    }

    try {
      await apiClient.post("/auth/reset-password", {
        token,
        password: data.password,
      });
      toast.success("Password reset successfully!");
      router.push("/login");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to reset password";
      toast.error(message);
    }
  };

  if (!token) {
    return (
      <div className="space-y-8">
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="rounded-2xl bg-red-50 p-3.5">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-primary-500">Invalid link</h1>
          <p className="text-sm text-text-secondary">
            The password reset link is invalid or has expired.
          </p>
        </div>

        <Link href="/forgot-password">
          <Button className="w-full" size="lg">Request a new link</Button>
        </Link>

        <Link href="/login">
          <Button variant="outline" className="w-full">Back to sign in</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header - mobile logo */}
      <div className="lg:hidden flex items-center gap-2.5 mb-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
            <span className="text-white font-bold text-xs tracking-wider">OS</span>
          </div>
          <span className="font-semibold text-primary-500 text-lg">OpenSight</span>
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-primary-500">Reset password</h1>
        <p className="text-sm text-text-secondary">
          Enter your new password below
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-indigo-500">New Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Create a strong password"
            disabled={isSubmitting}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-error">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium text-indigo-500">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            disabled={isSubmitting}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-error">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </Button>
      </form>

      <Link href="/login">
        <Button variant="outline" className="w-full">Back to sign in</Button>
      </Link>
    </div>
  );
}
