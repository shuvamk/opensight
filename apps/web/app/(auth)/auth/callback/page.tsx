"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const processCallback = async () => {
      try {
        const error = searchParams.get("error");
        const token = searchParams.get("token");
        const redirectTo = searchParams.get("redirect_to");

        if (error) {
          toast.error(error);
          router.push("/login");
          return;
        }

        const accessToken = token || searchParams.get("accessToken");
        if (accessToken) {
          const { setAuthToken } = await import("@/lib/auth-token");
          setAuthToken(accessToken);

          // Determine where to redirect
          const destination = redirectTo === "onboarding" ? "/onboarding" : "/dashboard";
          router.push(destination);
        } else {
          toast.error("Authentication failed: No token received");
          router.push("/login");
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Authentication failed";
        toast.error(message);
        router.push("/login");
      }
    };

    processCallback();
  }, [searchParams, router]);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="space-y-4 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        <h1 className="text-xl font-semibold">Processing authentication...</h1>
        <p className="text-sm text-muted-foreground">
          Please wait while we complete your sign in
        </p>
      </div>
    </div>
  );
}
