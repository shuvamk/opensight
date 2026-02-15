"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface Plan {
  id: string;
  name: string;
  price: number;
  renewalDate: string;
  isCurrentPlan: boolean;
}

interface UsageMetrics {
  promptsUsed: number;
  promptsLimit: number;
  contentScoresUsed: number;
  contentScoresLimit: number;
  apiRequestsUsed: number;
  apiRequestsLimit: number;
}

interface BillingData {
  currentPlan: Plan;
  usage: UsageMetrics;
  portalUrl: string;
}

interface PlanFeature {
  name: string;
  free: boolean;
  starter: boolean;
  growth: boolean;
}

const planFeatures: PlanFeature[] = [
  { name: "Content Scoring", free: true, starter: true, growth: true },
  { name: "Prompts", free: 10, starter: 100, growth: "Unlimited" },
  { name: "Content Scores", free: 5, starter: 50, growth: "Unlimited" },
  { name: "API Requests", free: 100, starter: 10000, growth: "Unlimited" },
  { name: "API Keys", free: false, starter: true, growth: true },
  { name: "Webhooks", free: false, starter: false, growth: true },
  { name: "Priority Support", free: false, starter: false, growth: true },
];

export default function BillingPage() {
  const { data: billingData, isLoading } = useQuery<BillingData>({
    queryKey: ["billing"],
    queryFn: () => apiClient.get("/api/user/profile"),
  });

  const { mutate: managePayment, isPending } = useMutation({
    mutationFn: () => {
      if (!billingData?.portalUrl) {
        throw new Error("Portal URL not available");
      }
      window.location.href = billingData.portalUrl;
      return Promise.resolve();
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to open payment portal"
      );
    },
  });

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.round((used / limit) * 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-amber-500";
    return "bg-green-500";
  };

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
                Loading billing information...
              </Card>
            ) : billingData ? (
              <>
                {/* Current Plan */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Current Plan</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold">
                          {billingData.currentPlan.name}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          ${billingData.currentPlan.price}/month
                        </p>
                      </div>
                      <Badge variant="outline" className="text-lg px-3 py-1">
                        Active
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      Renewal: {new Date(billingData.currentPlan.renewalDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <Button
                      onClick={() => managePayment()}
                      disabled={isPending}
                      variant="outline"
                      className="w-full"
                    >
                      {isPending && (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      )}
                      Manage Payment
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </Card>

                {/* Usage Metrics */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Usage</h2>
                  <div className="space-y-6">
                    {/* Prompts */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Prompts</span>
                        <span className="text-sm text-gray-600">
                          {billingData.usage.promptsUsed} /{" "}
                          {billingData.usage.promptsLimit}
                        </span>
                      </div>
                      <Progress
                        value={getUsagePercentage(
                          billingData.usage.promptsUsed,
                          billingData.usage.promptsLimit
                        )}
                        className="h-2"
                      />
                    </div>

                    {/* Content Scores */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Content Scores</span>
                        <span className="text-sm text-gray-600">
                          {billingData.usage.contentScoresUsed} /{" "}
                          {billingData.usage.contentScoresLimit}
                        </span>
                      </div>
                      <Progress
                        value={getUsagePercentage(
                          billingData.usage.contentScoresUsed,
                          billingData.usage.contentScoresLimit
                        )}
                        className="h-2"
                      />
                    </div>

                    {/* API Requests */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">API Requests</span>
                        <span className="text-sm text-gray-600">
                          {billingData.usage.apiRequestsUsed} /{" "}
                          {billingData.usage.apiRequestsLimit}
                        </span>
                      </div>
                      <Progress
                        value={getUsagePercentage(
                          billingData.usage.apiRequestsUsed,
                          billingData.usage.apiRequestsLimit
                        )}
                        className="h-2"
                      />
                    </div>
                  </div>
                </Card>

                {/* Plan Comparison */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Plan Comparison</h2>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-48">Feature</TableHead>
                          <TableHead className="text-center">Free</TableHead>
                          <TableHead className="text-center">Starter</TableHead>
                          <TableHead className="text-center">Growth</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {planFeatures.map((feature) => (
                          <TableRow key={feature.name}>
                            <TableCell className="font-medium">
                              {feature.name}
                            </TableCell>
                            <TableCell className="text-center">
                              {typeof feature.free === "boolean" ? (
                                feature.free ? (
                                  <Check className="h-5 w-5 mx-auto text-green-600" />
                                ) : (
                                  <span className="text-gray-400">—</span>
                                )
                              ) : (
                                <span className="text-sm">{feature.free}</span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {typeof feature.starter === "boolean" ? (
                                feature.starter ? (
                                  <Check className="h-5 w-5 mx-auto text-green-600" />
                                ) : (
                                  <span className="text-gray-400">—</span>
                                )
                              ) : (
                                <span className="text-sm">{feature.starter}</span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {typeof feature.growth === "boolean" ? (
                                feature.growth ? (
                                  <Check className="h-5 w-5 mx-auto text-green-600" />
                                ) : (
                                  <span className="text-gray-400">—</span>
                                )
                              ) : (
                                <span className="text-sm">{feature.growth}</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="mt-6 flex gap-3 justify-center">
                    <Button variant="outline">Downgrade Plan</Button>
                    <Button>Upgrade Plan</Button>
                  </div>
                </Card>
              </>
            ) : (
              <Card className="p-8 text-center text-gray-600">
                Unable to load billing information
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
