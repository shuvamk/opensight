import { Search, Users, FileCheck, BarChart3, Bell, Zap } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Multi-Engine Tracking",
    description:
      "Monitor your visibility across ChatGPT, Perplexity, and Google AI Overviews from a single dashboard.",
  },
  {
    icon: Users,
    title: "Competitor Intelligence",
    description:
      "See who outranks you in AI responses, identify gaps, and track competitor movements in real-time.",
  },
  {
    icon: FileCheck,
    title: "Content Scoring",
    description:
      "Score any URL for AI-engine optimization and get actionable recommendations to improve visibility.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Trends",
    description:
      "Track visibility scores over time with detailed charts, breakdowns by engine, and trend analysis.",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description:
      "Get notified when your visibility changes, competitors make moves, or new opportunities arise.",
  },
  {
    icon: Zap,
    title: "API Access",
    description:
      "Integrate AI visibility data into your existing tools and workflows with our comprehensive API.",
  },
];

export default function Features() {
  return (
    <section id="features" className="section-padding bg-white">
      <div className="container-tight">
        {/* Section heading */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-medium mb-6">
            Features
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-primary-900 mb-5 text-balance">
            Everything you need to own AI search
          </h2>
          <p className="text-lg text-text-secondary leading-relaxed">
            Comprehensive tools to understand and optimize your presence across
            all major AI search engines.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group flex flex-col p-7 rounded-2xl border border-border bg-white card-hover"
              >
                {/* Icon */}
                <div className="mb-5 inline-flex w-11 h-11 items-center justify-center rounded-xl bg-accent-50 group-hover:bg-accent-100 transition-colors">
                  <Icon className="w-5 h-5 text-accent-600" />
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-primary-900 mb-2">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
