// Enums for brand industry or related API payload/response values
export const BrandIndustry = {
  SAAS: "saas",
  ECOMMERCE: "ecommerce",
  FINANCE: "finance",
  HEALTHCARE: "healthcare",
  OTHER: "other",
} as const;

export type BrandIndustryType = (typeof BrandIndustry)[keyof typeof BrandIndustry];
