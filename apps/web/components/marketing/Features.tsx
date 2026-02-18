import SectionHeading from "@/components/marketing/SectionHeading";
import SectionIndicator from "@/components/marketing/SectionIndicator";
import { Search, Users, FileCheck, BarChart3, Bell, Zap } from "lucide-react";

const features = [
  {
    icon: Search,
    label: "No blind spots",
    title: "Multi-Engine Tracking",
    description:
      "Monitor your visibility across ChatGPT, Perplexity, and Google AI Overviews from a single dashboard.",
  },
  {
    icon: Users,
    label: "Know your rivals",
    title: "Competitor Intelligence",
    description:
      "See who outranks you in AI responses, identify gaps, and track competitor movements in real-time.",
  },
  {
    icon: FileCheck,
    label: "Optimize content",
    title: "Content Scoring",
    description:
      "Score any URL for AI-engine optimization and get actionable recommendations to improve visibility.",
  },
  {
    icon: BarChart3,
    label: "Track trends",
    title: "Analytics & Trends",
    description:
      "Track visibility scores over time with detailed charts, breakdowns by engine, and trend analysis.",
  },
  {
    icon: Bell,
    label: "Stay informed",
    title: "Smart Alerts",
    description:
      "Get notified when your visibility changes, competitors make moves, or new opportunities arise.",
  },
  {
    icon: Zap,
    label: "Build on top",
    title: "API Access",
    description:
      "Integrate AI visibility data into your existing tools and workflows with our comprehensive API.",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative">
      {/* Dot pattern background */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.3]"
        style={{
          backgroundImage: `radial-gradient(circle, #d2dbe7 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="max-w-6xl mx-auto flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-24">
        <SectionIndicator number="01" total="06" label="Main Features" />

        {/* Section heading */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <SectionHeading
            lead="Everything you need to"
            highlight="own AI search"
            size="md"
            centered
            className="mb-5"
          />
          <p className="text-lg text-text-secondary leading-relaxed">
            Comprehensive tools to understand and optimize your presence across
            all major AI search engines.
          </p>
        </div>

        {/* Features grid — Firecrawl-style 2-column cards with border separators */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border/50 border border-border rounded-2xl overflow-hidden">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white p-8 lg:p-10 hover:bg-surface/50 transition-colors group"
              >
                {/* Label tag */}
                <div className="flex items-center gap-2 mb-4">
                  <Icon className="w-4 h-4 text-indigo-300" />
                  <span className="text-xs font-mono uppercase tracking-wider text-text-tertiary">
                    {feature.label}
                  </span>
                </div>

                {/* Title — bold first part, Firecrawl style */}
                <h3 className="text-xl font-heading text-primary-500 mb-3">
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
