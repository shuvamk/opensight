"use client";

import {
  Globe,
  Building2,
  Package,
  Target,
  Users,
  Search,
  Swords,
  Star,
  BookOpen,
  Sparkles,
  Award,
  Link2,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";

interface BrandAnalysis {
  brand: {
    name: string;
    domain: string;
    tagline: string;
    description: string;
    founded_year: number | null;
    headquarters: string;
    brand_voice: string;
    mission_statement: string;
  };
  classification: {
    industry: string;
    sub_industry: string;
    business_model: string;
    pricing_tier: string;
    company_size_estimate: string;
    geographic_focus: string[];
  };
  products_and_services: Array<{
    name: string;
    description: string;
    category: string;
    is_flagship: boolean;
  }>;
  value_propositions: Array<{
    statement: string;
    supporting_evidence: string;
  }>;
  target_audience: {
    primary_personas: Array<{
      role: string;
      industry: string;
      pain_points: string[];
      goals: string[];
    }>;
    company_size_target: string[];
    decision_makers: string[];
  };
  keywords: {
    primary: string[];
    secondary: string[];
    branded_terms: string[];
    problem_terms: string[];
    comparison_terms: string[];
  };
  competitors: Array<{
    name: string;
    domain: string;
    relationship: string;
    overlap_area: string;
  }>;
  differentiators: string[];
  social_proof: {
    notable_customers: string[];
    integrations: string[];
    certifications: string[];
    awards: string[];
  };
  content_themes: string[];
  prompts: Record<string, string[]>;
}

interface Report {
  id: string;
  slug: string;
  title: string;
  reportType: string;
  status: string;
  data: BrandAnalysis;
  summary: string | null;
  createdAt: string;
  completedAt: string | null;
}

const promptCategoryLabels: Record<string, string> = {
  discovery: "Discovery",
  comparison: "Comparison",
  recommendation: "Recommendation",
  problem_solution: "Problem & Solution",
  review_sentiment: "Reviews & Sentiment",
  industry_landscape: "Industry Landscape",
  use_case_specific: "Use Case Specific",
  negative_reputation: "Reputation Risks",
  feature_deep_dive: "Feature Deep Dive",
  buying_decision: "Buying Decision",
};

const relationshipColors: Record<string, string> = {
  direct: "bg-red-50 text-red-700",
  indirect: "bg-amber-50 text-amber-700",
  adjacent: "bg-blue-50 text-blue-700",
};

export function ReportViewer({ report }: { report: Report }) {
  const data = report.data;
  const { brand, classification, keywords, social_proof } = data;

  const promptCount = Object.values(data.prompts).reduce(
    (sum, arr) => sum + arr.length,
    0,
  );

  const formatLabel = (str: string) =>
    str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <span className="font-semibold text-indigo-600">OpenSight</span>
                <span>/</span>
                <span>AI Visibility Report</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{report.title}</h1>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-sm text-gray-500">Generated</p>
              <p className="text-sm font-medium text-gray-700">
                {formatDateTime(report.completedAt ?? report.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Brand Overview */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex flex-wrap items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <Globe className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900">{brand.name}</h2>
              <p className="text-sm text-gray-500">
                {brand.domain} · {classification.industry} · {classification.sub_industry}
              </p>
              {brand.tagline && (
                <p className="text-sm text-indigo-600 font-medium mt-1">&ldquo;{brand.tagline}&rdquo;</p>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{brand.description}</p>

          {/* Quick stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            <QuickStat label="Industry" value={classification.industry} />
            <QuickStat label="Business Model" value={formatLabel(classification.business_model)} />
            <QuickStat label="Pricing" value={formatLabel(classification.pricing_tier)} />
            <QuickStat label="Size" value={formatLabel(classification.company_size_estimate)} />
          </div>

          {brand.mission_statement && brand.mission_statement !== "unknown" && (
            <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Mission</p>
              <p className="text-sm text-gray-700 italic">{brand.mission_statement}</p>
            </div>
          )}
        </section>

        {/* Quick Numbers */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <MetricTile icon={<Swords className="w-4 h-4 text-red-500" />} label="Competitors" value={data.competitors.length} />
          <MetricTile icon={<Package className="w-4 h-4 text-indigo-500" />} label="Products" value={data.products_and_services.length} />
          <MetricTile icon={<MessageSquare className="w-4 h-4 text-emerald-500" />} label="Tracking Prompts" value={promptCount} />
          <MetricTile icon={<Search className="w-4 h-4 text-amber-500" />} label="Keywords" value={keywords.primary.length + keywords.secondary.length} />
        </div>

        {/* Value Propositions */}
        {data.value_propositions.length > 0 && (
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <SectionHeader icon={<Sparkles className="w-4 h-4 text-indigo-500" />} title="Value Propositions" />
            <div className="space-y-4">
              {data.value_propositions.map((vp, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-indigo-600">{i + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{vp.statement}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{vp.supporting_evidence}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Products & Services */}
        {data.products_and_services.length > 0 && (
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <SectionHeader icon={<Package className="w-4 h-4 text-violet-500" />} title="Products & Services" />
            <div className="grid gap-3 sm:grid-cols-2">
              {data.products_and_services.map((product, i) => (
                <div key={i} className={`rounded-lg border p-4 ${product.is_flagship ? "border-indigo-200 bg-indigo-50/30" : "border-gray-100 bg-gray-50"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900">{product.name}</span>
                    {product.is_flagship && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-medium">Flagship</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                  <p className="text-sm text-gray-600">{product.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Competitors */}
        {data.competitors.length > 0 && (
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <SectionHeader icon={<Swords className="w-4 h-4 text-red-500" />} title="Competitive Landscape" />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                    <th className="pb-2 pr-4">Competitor</th>
                    <th className="pb-2 pr-4">Domain</th>
                    <th className="pb-2 pr-4">Type</th>
                    <th className="pb-2">Overlap Area</th>
                  </tr>
                </thead>
                <tbody>
                  {data.competitors.map((comp, i) => (
                    <tr key={i} className="border-b border-gray-50 last:border-0">
                      <td className="py-2.5 pr-4 font-medium text-gray-900">{comp.name}</td>
                      <td className="py-2.5 pr-4 text-gray-500">{comp.domain}</td>
                      <td className="py-2.5 pr-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${relationshipColors[comp.relationship] ?? "bg-gray-100 text-gray-600"}`}>
                          {comp.relationship}
                        </span>
                      </td>
                      <td className="py-2.5 text-gray-600">{comp.overlap_area}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Target Audience */}
        {data.target_audience.primary_personas.length > 0 && (
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <SectionHeader icon={<Target className="w-4 h-4 text-emerald-500" />} title="Target Audience" />
            <div className="grid gap-4 sm:grid-cols-2">
              {data.target_audience.primary_personas.map((persona, i) => (
                <div key={i} className="rounded-lg border border-gray-100 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-900">{persona.role}</span>
                    <span className="text-xs text-gray-400">· {persona.industry}</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-medium text-gray-400 mb-1">Pain Points</p>
                      <div className="flex flex-wrap gap-1">
                        {persona.pain_points.map((p, j) => (
                          <span key={j} className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600">{p}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400 mb-1">Goals</p>
                      <div className="flex flex-wrap gap-1">
                        {persona.goals.map((g, j) => (
                          <span key={j} className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">{g}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {data.target_audience.decision_makers.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-medium text-gray-400 mb-2">Decision Makers</p>
                <div className="flex flex-wrap gap-2">
                  {data.target_audience.decision_makers.map((dm, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">{dm}</span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Keywords */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <SectionHeader icon={<Search className="w-4 h-4 text-amber-500" />} title="Keyword Intelligence" />
          <div className="space-y-4">
            <KeywordGroup label="Primary Keywords" keywords={keywords.primary} color="indigo" />
            <KeywordGroup label="Secondary Keywords" keywords={keywords.secondary} color="blue" />
            <KeywordGroup label="Branded Terms" keywords={keywords.branded_terms} color="violet" />
            <KeywordGroup label="Problem Terms" keywords={keywords.problem_terms} color="red" />
            <KeywordGroup label="Comparison Terms" keywords={keywords.comparison_terms} color="amber" />
          </div>
        </section>

        {/* Differentiators */}
        {data.differentiators.length > 0 && (
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <SectionHeader icon={<Star className="w-4 h-4 text-amber-500" />} title="Key Differentiators" />
            <div className="space-y-2">
              {data.differentiators.map((d, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-amber-600">{i + 1}</span>
                  </div>
                  <p className="text-sm text-gray-700">{d}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Social Proof */}
        {(social_proof.notable_customers.length > 0 ||
          social_proof.integrations.length > 0 ||
          social_proof.certifications.length > 0 ||
          social_proof.awards.length > 0) && (
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <SectionHeader icon={<Award className="w-4 h-4 text-cyan-500" />} title="Social Proof" />
            <div className="grid gap-4 sm:grid-cols-2">
              {social_proof.notable_customers.length > 0 && (
                <ProofGroup icon={<Building2 className="w-3.5 h-3.5 text-gray-400" />} label="Notable Customers" items={social_proof.notable_customers} />
              )}
              {social_proof.integrations.length > 0 && (
                <ProofGroup icon={<Link2 className="w-3.5 h-3.5 text-gray-400" />} label="Integrations" items={social_proof.integrations} />
              )}
              {social_proof.certifications.length > 0 && (
                <ProofGroup icon={<ShieldCheck className="w-3.5 h-3.5 text-gray-400" />} label="Certifications" items={social_proof.certifications} />
              )}
              {social_proof.awards.length > 0 && (
                <ProofGroup icon={<Award className="w-3.5 h-3.5 text-gray-400" />} label="Awards" items={social_proof.awards} />
              )}
            </div>
          </section>
        )}

        {/* Content Themes */}
        {data.content_themes.length > 0 && (
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <SectionHeader icon={<BookOpen className="w-4 h-4 text-teal-500" />} title="Content Themes" />
            <div className="flex flex-wrap gap-2">
              {data.content_themes.map((theme, i) => (
                <span key={i} className="text-sm px-3 py-1.5 rounded-full bg-teal-50 text-teal-700 font-medium">{theme}</span>
              ))}
            </div>
          </section>
        )}

        {/* AI Tracking Prompts */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <SectionHeader icon={<MessageSquare className="w-4 h-4 text-indigo-500" />} title={`AI Tracking Prompts (${promptCount})`} />
          <p className="text-sm text-gray-500 mb-4">
            These prompts simulate real user queries across ChatGPT, Perplexity, and Google AI to track how your brand appears.
          </p>
          <div className="space-y-6">
            {Object.entries(data.prompts).map(([category, prompts]) => (
              <div key={category}>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                  {promptCategoryLabels[category] ?? formatLabel(category)}
                  <span className="text-gray-400 font-normal ml-1">({prompts.length})</span>
                </h4>
                <div className="space-y-1">
                  {prompts.map((prompt, i) => (
                    <div key={i} className="flex gap-2 items-start text-sm py-1.5 px-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <span className="text-gray-300 flex-shrink-0 w-5 text-right">{i + 1}.</span>
                      <span className="text-gray-700">{prompt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl p-8 text-center">
          <h3 className="text-lg font-bold text-white mb-2">Start monitoring your AI visibility</h3>
          <p className="text-sm text-indigo-200 mb-5 max-w-md mx-auto">
            Track these {promptCount} prompts across ChatGPT, Perplexity & Google AI in real-time. Get alerts when your brand mentions change.
          </p>
          <a
            href="/register"
            className="inline-block px-6 py-2.5 bg-white text-indigo-700 text-sm font-semibold rounded-lg hover:bg-indigo-50 transition-colors"
          >
            Sign up free
          </a>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-gray-200">
          <p className="text-sm text-gray-400">
            Generated by <span className="font-semibold text-indigo-600">OpenSight</span> · Open-source AI visibility platform
          </p>
          <p className="text-xs text-gray-300 mt-1">Report ID: {report.slug}</p>
        </footer>
      </main>
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      {icon}
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
    </div>
  );
}

function MetricTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-gray-50 p-3">
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function KeywordGroup({ label, keywords, color }: { label: string; keywords: string[]; color: string }) {
  if (keywords.length === 0) return null;
  const bgClass = `bg-${color}-50`;
  const textClass = `text-${color}-700`;
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {keywords.map((kw, i) => (
          <span key={i} className={`text-xs px-2.5 py-1 rounded-full ${bgClass} ${textClass} font-medium`}>{kw}</span>
        ))}
      </div>
    </div>
  );
}

function ProofGroup({ icon, label, items }: { icon: React.ReactNode; label: string; items: string[] }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        {icon}
        <p className="text-xs font-semibold text-gray-500">{label}</p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, i) => (
          <span key={i} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">{item}</span>
        ))}
      </div>
    </div>
  );
}

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
