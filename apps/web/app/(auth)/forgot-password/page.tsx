"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@opensight/shared";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ChevronLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      await apiClient.post("/auth/forgot-password", data);
      setEmail(data.email);
      setIsSubmitted(true);
      toast.success("Reset link sent to your email");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send reset link";
      toast.error(message);
    }
  };

  if (isSubmitted) {
    return (
      <div className="space-y-8">
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="rounded-2xl bg-indigo-50 p-3.5">
              <Mail className="h-6 w-6 text-indigo-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-primary-500">Check your email</h1>
          <p className="text-sm text-text-secondary">
            We&apos;ve sent a password reset link to {email}
          </p>
        </div>

        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
          <p className="text-sm text-indigo-700">
            The link will expire in 24 hours. If you don&apos;t see the email, check your spam folder.
          </p>
        </div>

        <Link href="/login">
          <Button variant="outline" className="w-full">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to sign in
          </Button>
        </Link>

        <p className="text-center text-xs text-text-tertiary">
          Didn&apos;t receive the email?{" "}
          <button
            onClick={() => setIsSubmitted(false)}
            className="text-indigo-400 hover:text-indigo-500 font-medium"
          >
            Try again
          </button>
        </p>
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
          Enter your email address and we&apos;ll send you a link to reset your password
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-indigo-500">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            disabled={isSubmitting}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-error">{errors.email.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      <Link href="/login">
        <Button variant="outline" className="w-full">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to sign in
        </Button>
      </Link>
    </div>
  );
}
