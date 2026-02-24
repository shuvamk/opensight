"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { submitGetStarted } from "@/app/actions/get-started";

export default function GetStartedDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [domain, setDomain] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      await submitGetStarted({ email, domain });
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      // Reset form when closing
      setTimeout(() => {
        setEmail("");
        setDomain("");
        setStatus("idle");
        setErrorMsg("");
      }, 200);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={children as any} />
      <DialogPopup>
        {status === "success" ? (
          <>
            <DialogHeader>
              <div className="flex justify-center pt-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              </div>
              <DialogTitle className="text-center">
                Analysis started
              </DialogTitle>
              <DialogDescription className="text-center">
                We&apos;re analyzing <span className="font-medium text-foreground">{domain}</span>.
                You&apos;ll receive results at <span className="font-medium text-foreground">{email}</span> once complete.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter variant="bare">
              <Button
                className="w-full"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Get started free</DialogTitle>
              <DialogDescription>
                Enter your email and domain to get a free AI visibility analysis
                of your brand.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 px-6 pb-2">
              <div className="space-y-2">
                <Label htmlFor="get-started-email">Email</Label>
                <Input
                  id="get-started-email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={status === "loading"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="get-started-domain">Domain</Label>
                <Input
                  id="get-started-domain"
                  type="text"
                  placeholder="example.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  required
                  disabled={status === "loading"}
                />
                <p className="text-xs text-muted-foreground">
                  The website you want to analyze for AI visibility.
                </p>
              </div>

              {errorMsg && (
                <p className="text-sm text-destructive">{errorMsg}</p>
              )}
            </div>

            <DialogFooter variant="bare">
              <Button
                type="submit"
                className="w-full"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Start analysis
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogPopup>
    </Dialog>
  );
}
