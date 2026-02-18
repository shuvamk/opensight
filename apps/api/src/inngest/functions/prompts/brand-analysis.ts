import { z } from 'zod';

// --- Zod schema matching the expected brand analysis output ---

const BrandSchema = z.object({
  name: z.string(),
  domain: z.string(),
  tagline: z.string(),
  description: z.string(),
  founded_year: z.number().nullable(),
  headquarters: z.string(),
  brand_voice: z.string(),
  mission_statement: z.string(),
});

const ClassificationSchema = z.object({
  industry: z.string(),
  sub_industry: z.string(),
  business_model: z.string(),
  pricing_tier: z.string(),
  company_size_estimate: z.string(),
  geographic_focus: z.array(z.string()),
});

const ProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  category: z.string(),
  is_flagship: z.boolean(),
});

const ValuePropSchema = z.object({
  statement: z.string(),
  supporting_evidence: z.string(),
});

const PersonaSchema = z.object({
  role: z.string(),
  industry: z.string(),
  pain_points: z.array(z.string()),
  goals: z.array(z.string()),
});

const TargetAudienceSchema = z.object({
  primary_personas: z.array(PersonaSchema),
  company_size_target: z.array(z.string()),
  decision_makers: z.array(z.string()),
});

const KeywordsSchema = z.object({
  primary: z.array(z.string()),
  secondary: z.array(z.string()),
  branded_terms: z.array(z.string()),
  problem_terms: z.array(z.string()),
  comparison_terms: z.array(z.string()),
});

const CompetitorSchema = z.object({
  name: z.string(),
  domain: z.string(),
  relationship: z.string(),
  overlap_area: z.string(),
});

const SocialProofSchema = z.object({
  notable_customers: z.array(z.string()),
  integrations: z.array(z.string()),
  certifications: z.array(z.string()),
  awards: z.array(z.string()),
});

const PromptsSchema = z.object({
  discovery: z.array(z.string()),
  comparison: z.array(z.string()),
  recommendation: z.array(z.string()),
  problem_solution: z.array(z.string()),
  review_sentiment: z.array(z.string()),
  industry_landscape: z.array(z.string()),
  use_case_specific: z.array(z.string()),
  negative_reputation: z.array(z.string()),
  feature_deep_dive: z.array(z.string()),
  buying_decision: z.array(z.string()),
});

export const BrandAnalysisSchema = z.object({
  brand: BrandSchema,
  classification: ClassificationSchema,
  products_and_services: z.array(ProductSchema),
  value_propositions: z.array(ValuePropSchema),
  target_audience: TargetAudienceSchema,
  keywords: KeywordsSchema,
  competitors: z.array(CompetitorSchema),
  differentiators: z.array(z.string()),
  social_proof: SocialProofSchema,
  content_themes: z.array(z.string()),
  prompts: PromptsSchema,
});

export const BRAND_ANALYSIS_PROMPT = `You are an expert brand analyst and AI search strategist. Your job is to thoroughly analyze a website and extract a complete brand intelligence profile that will be used to monitor how this brand appears across AI answer engines (ChatGPT, Perplexity, Gemini, Claude, Copilot, Grok).

Browse the website I provide at the end of this message. Visit the homepage, about page, pricing page, product/features pages, blog (if any), and any other key pages. Explore at least 10-15 pages to build a comprehensive understanding.

Then return a JSON object matching the schema provided.

FIELD INSTRUCTIONS:

**brand**
- name: Official brand/company name as displayed on the site
- domain: The exact domain provided
- tagline: Their primary tagline or slogan (from homepage or meta)
- description: 2-3 sentence summary of what the company does, written as a neutral third-party observer
- founded_year: Year founded if discoverable, otherwise null
- headquarters: City, Country if discoverable
- brand_voice: One of: "corporate_formal", "professional_friendly", "casual_conversational", "technical_authoritative", "playful_creative", "luxury_premium"
- mission_statement: Their mission or vision statement if stated

**classification**
- industry: Broad industry (e.g., "SaaS", "E-commerce", "Healthcare", "Finance")
- sub_industry: Specific niche (e.g., "Marketing Automation", "Project Management", "Telemedicine")
- business_model: One of: "B2B_SaaS", "B2C_SaaS", "B2B2C", "marketplace", "e_commerce", "DTC", "agency_services", "freemium", "enterprise_software", "other"
- pricing_tier: One of: "free", "freemium", "mid_market", "enterprise", "custom_only", "unknown"
- company_size_estimate: One of: "startup_1_10", "small_11_50", "medium_51_200", "large_201_1000", "enterprise_1000_plus", "unknown"
- geographic_focus: Array of regions (e.g., ["North America", "Europe", "Global"])

**products_and_services**
- List ALL distinct products/services/plans. Mark the primary offering with is_flagship: true
- category: e.g., "software", "platform", "api", "service", "hardware", "content"

**value_propositions**
- Extract 3-5 core value props from their homepage and feature pages
- supporting_evidence: A specific claim, stat, or feature that backs it up

**target_audience**
- primary_personas: 2-4 buyer personas based on their messaging, case studies, testimonials
- company_size_target: e.g., ["SMB", "Mid-Market", "Enterprise"]
- decision_makers: Job titles they target (e.g., ["CTO", "VP Engineering", "Marketing Manager"])

**keywords**
- primary: 10-15 core keywords that define what this company does (e.g., "project management software")
- secondary: 10-15 related/long-tail terms (e.g., "agile sprint planning tool")
- branded_terms: Terms unique to this brand (product names, proprietary features)
- problem_terms: 5-10 problem statements their audience searches for (e.g., "how to reduce meeting overload")
- comparison_terms: 5-10 "X vs Y" or "alternative to X" terms people might search

**competitors**
- List exactly 10 competitors. Include:
  - Direct competitors (same product category)
  - Indirect competitors (different approach, same problem)
  - Adjacent competitors (overlapping audience, different product)
- relationship: One of: "direct", "indirect", "adjacent"
- overlap_area: Describe the specific area of competition

**differentiators**
- 3-5 things that make this brand unique vs. competitors, stated as neutral observations

**social_proof**
- notable_customers: Company names mentioned on site (customer logos, case studies)
- integrations: Tools/platforms they integrate with
- certifications: SOC2, ISO, HIPAA, etc.
- awards: Any awards or recognitions mentioned

**content_themes**
- 5-8 recurring content topics from their blog/resources section

**prompts** (THIS IS THE MOST IMPORTANT SECTION)

Generate exactly 100 prompts total, distributed across these 10 categories (10 prompts each).
These prompts simulate what real users would type into AI answer engines like ChatGPT, Perplexity, or Gemini.

Rules for prompt generation:
1. Write prompts in natural conversational language (how a human would actually ask an AI)
2. Mix question styles: "What is...", "Help me find...", "Compare...", "I need...", "Which is better..."
3. Include the brand name in ~30% of prompts (not all — we need to test organic discovery too)
4. Prompts must be specific enough to trigger mentions of this brand or its competitors
5. Include industry-specific jargon where appropriate
6. Vary between short (5-8 words) and long (15-25 words) prompts
7. Each prompt should be a string in the array

Categories:

- discovery: Prompts where someone is discovering solutions in this space for the first time
  Example: "What tools can help me manage remote teams?"

- comparison: Direct comparison prompts between this brand and competitors
  Example: "Slack vs Microsoft Teams for small startups"

- recommendation: Prompts asking for recommendations where this brand should appear
  Example: "Best project management tool for agile teams in 2025"

- problem_solution: Prompts describing a problem this brand solves
  Example: "My team wastes too much time in status update meetings, what can I use instead?"

- review_sentiment: Prompts asking about quality, reviews, or opinions about this brand
  Example: "Is Notion good for enterprise use? What are the downsides?"

- industry_landscape: Broader industry questions where this brand should be mentioned
  Example: "How is AI changing the project management software market?"

- use_case_specific: Prompts for specific use cases this brand serves
  Example: "I need to track time across 5 client projects with billing integration"

- negative_reputation: Prompts that could surface negative sentiment or issues
  Example: "Why are people switching away from [brand]? What are common complaints?"

- feature_deep_dive: Prompts about specific features or capabilities
  Example: "Does [brand] support SSO and role-based access control?"

- buying_decision: Prompts from someone actively evaluating a purchase
  Example: "Is [brand] worth it for a 50-person company? What's the ROI?"

CRITICAL RULES:
- Every array must have the specified number of items.
- All string values must be filled (no empty strings unless truly unknown).
- Do not hallucinate competitors — only list real companies that actually compete.
- Prompts must be diverse and non-repetitive.
- If you cannot find information for a field, use "unknown" for strings, null for numbers, [] for arrays.

Now analyze this website: `;
