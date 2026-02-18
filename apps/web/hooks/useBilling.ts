"use client";

import { useQuery } from "@tanstack/react-query";
import * as usersApi from "@/lib/api/users";

export interface BillingData {
  currentPlan: {
    id: string;
    name: string;
    price: number;
    renewalDate: string;
    isCurrentPlan: boolean;
  };
  usage: {
    promptsUsed: number;
    promptsLimit: number;
    contentScoresUsed: number;
    contentScoresLimit: number;
    apiRequestsUsed: number;
    apiRequestsLimit: number;
  };
  portalUrl: string;
}

export function useBilling() {
  return useQuery({
    queryKey: ["billing"],
    queryFn: async (): Promise<BillingData> => {
      const profile = await usersApi.getProfile();
      const planId = profile.plan_id ?? "free";
      return {
        currentPlan: {
          id: planId,
          name:
            planId === "growth"
              ? "Growth"
              : planId === "starter"
                ? "Starter"
                : "Free",
          price: planId === "growth" ? 99 : planId === "starter" ? 29 : 0,
          renewalDate: "",
          isCurrentPlan: true,
        },
        usage: {
          promptsUsed: 0,
          promptsLimit:
            planId === "free" ? 10 : planId === "starter" ? 100 : 999999,
          contentScoresUsed: 0,
          contentScoresLimit: 5,
          apiRequestsUsed: 0,
          apiRequestsLimit: 100,
        },
        portalUrl: "",
      };
    },
  });
}
