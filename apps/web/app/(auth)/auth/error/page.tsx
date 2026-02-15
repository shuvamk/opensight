"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message") ?? "authentication_failed";

  const errorMessages: Record<string, string> = {
    authentication_failed: "We couldn’t sign you in. Please try again or use your email and password.",
  };
  const displayMessage = errorMessages[message] ?? message;

  return (
    <div className="flex h-screen flex-col items-center justify-center p-6">
      <div className="space-y-6 text-center max-w-sm">
        <div className="flex justify-center">
          <div className="rounded-2xl bg-red-50 p-3.5">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
        </div>
        <h1 className="text-xl font-semibold text-primary-500">Sign-in failed</h1>
        <p className="text-sm text-text-secondary">{displayMessage}</p>
        <div className="flex flex-col gap-2">
          <Link href="/login">
            <Button className="w-full" size="lg">Back to sign in</Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" className="w-full">Create an account</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
