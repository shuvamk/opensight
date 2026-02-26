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
import { ArrowRight, Loader2, CheckCircle2, Sparkles, ExternalLink } from "lucide-react";
import { submitGetStarted } from "@/app/actions/get-started";

export default function GetStartedDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [domain, setDomain] = useState("");
  const [reportSlug, setReportSlug] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "limit" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const result = await submitGetStarted({ email, domain });
      if (result.success) {
        setReportSlug(result.reportSlug);
        setStatus("success");
      } else if (result.reason === "limit_reached") {
        setStatus("limit");
      }
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
        setReportSlug("");
        setStatus("idle");
        setErrorMsg("");
      }, 200);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={children as React.ReactElement} />
      <DialogPopup>
        {status === "success" ? (
          <>
            <DialogHeader>
              <div className="flex justify-center pt-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              </div>
              <DialogTitle className="text-center">
                Report is being generated
              </DialogTitle>
              <DialogDescription className="text-center">
                We&apos;re analyzing <span className="font-medium text-foreground">{domain}</span>.
                You&apos;ll receive an email at <span className="font-medium text-foreground">{email}</span> with the report link once it&apos;s ready.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter variant="bare">
              <div className="flex flex-col gap-2 w-full">
                <a href={`/report/${reportSlug}`}>
                  <Button className="w-full">
                    View report status
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </a>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                >
                  Close
                </Button>
              </div>
            </DialogFooter>
          </>
        ) : status === "limit" ? (
          <>
            <DialogHeader>
              <div className="flex justify-center pt-2">
                <Sparkles className="w-12 h-12 text-amber-500" />
              </div>
              <DialogTitle className="text-center">
                Free analysis already used
              </DialogTitle>
              <DialogDescription className="text-center">
                A free analysis has already been run for{" "}
                <span className="font-medium text-foreground">{email}</span>.
                Upgrade to a paid plan to run unlimited analyses across
                multiple domains.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter variant="bare">
              <div className="flex flex-col gap-2 w-full">
                <a href="#pricing">
                  <Button className="w-full">
                    View pricing
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                >
                  Close
                </Button>
              </div>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Get your free AI visibility report</DialogTitle>
              <DialogDescription>
                Enter your email and domain. We&apos;ll analyze your brand across
                AI engines and send you a detailed report.
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
                    Starting analysis...
                  </>
                ) : (
                  <>
                    Generate report
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
