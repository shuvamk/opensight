"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@opensight/shared";
import { useLogin } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Github } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      await loginMutation.mutateAsync(data);
      toast.success("Signed in successfully!");
      router.push("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to sign in";
      toast.error(message);
    }
  };

  const handleOAuthLogin = (provider: "github" | "google") => {
    setIsOAuthLoading(true);
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/${provider}`;
  };

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
        <h1 className="text-2xl font-bold text-primary-500">Welcome back</h1>
        <p className="text-sm text-text-secondary">Sign in to your account to continue</p>
      </div>

      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => handleOAuthLogin("github")}
          disabled={isOAuthLoading || isSubmitting}
        >
          <Github className="mr-2 h-4 w-4" />
          Continue with GitHub
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => handleOAuthLogin("google")}
          disabled={isOAuthLoading || isSubmitting}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-text-tertiary">or continue with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-indigo-500">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            disabled={isSubmitting || isOAuthLoading}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-error">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium text-indigo-500">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-indigo-400 hover:text-indigo-500 font-medium"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            disabled={isSubmitting || isOAuthLoading}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-error">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isSubmitting || isOAuthLoading}
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <p className="text-center text-sm text-text-secondary">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-indigo-400 hover:text-indigo-500 font-medium">
          Sign up
        </Link>
      </p>
    </div>
  );
}
