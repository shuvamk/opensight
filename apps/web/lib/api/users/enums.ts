export const PlanId = {
  FREE: "free",
  STARTER: "starter",
  GROWTH: "growth",
} as const;

export type PlanIdType = (typeof PlanId)[keyof typeof PlanId];
