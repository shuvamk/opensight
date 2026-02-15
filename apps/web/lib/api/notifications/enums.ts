export const EmailFrequency = {
  DAILY: "daily",
  WEEKLY: "weekly",
  NONE: "none",
} as const;

export type EmailFrequencyType =
  (typeof EmailFrequency)[keyof typeof EmailFrequency];
