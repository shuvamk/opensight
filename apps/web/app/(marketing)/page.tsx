import Link from "next/link";
import { Button } from "@/components/ui/button";
import Hero from "@/components/marketing/Hero";
import Features from "@/components/marketing/Features";
import PricingTable from "@/components/marketing/PricingTable";
import { site } from "@/lib/site-config";
import { TrendingUp, Users, Zap, ArrowRight, Github } from "lucide-react";

const stats = [
  {
    icon: TrendingUp,
    label: "3 AI Engines",
    description: "ChatGPT, Perplexity, Google AI Overviews",
  },
  {
    icon: Users,
    label: "Competitor Intelligence",
    description: "Track your competitive landscape in real-time",
  },
  {
    icon: Zap,
    label: "API on Every Plan",
    description: "Integrate AI visibility into your workflows",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Problem/Solution Section — Firecrawl-style clean layout */}
      <section className="relative">
        <div
          className="absolute inset-0 -z-10 opacity-[0.2]"
          style={{
            backgroundImage: `radial-gradient(circle, #d2dbe7 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          {/* Section indicator */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-0.5 h-5 bg-indigo-300 rounded-full" />
            <span className="section-indicator">
              <span className="text-indigo-300">00</span> / 06
            </span>
            <span className="text-xs font-medium uppercase tracking-widest text-text-tertiary">
              The Problem
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Problem description */}
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-primary-500 text-balance">
                AI search is the new front door.{" "}
                <span className="text-gradient">Are you invisible?</span>
              </h2>
              <div className="space-y-4">
                <p className="text-text-secondary leading-relaxed">
                  ChatGPT, Perplexity, and Google AI are changing how people
                  discover information. Your traditional SEO doesn&apos;t tell the
                  full story.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  Without AI visibility data, you&apos;re flying blind. You need to know
                  how often your content is cited, what recommendations AI engines
                  make, and where competitors outrank you.
                </p>
              </div>
              <Link href="/register">
                <Button>
                  Start tracking for free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Right: Stats cards — Firecrawl-style bordered grid */}
            <div className="grid grid-cols-1 gap-px bg-border/50 border border-border rounded-2xl overflow-hidden">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="bg-white p-6 hover:bg-surface/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <Icon className="w-5 h-5 text-indigo-300" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-primary-500 mb-1">
                          {stat.label}
                        </h3>
                        <p className="text-sm text-text-secondary">
                          {stat.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Features />

      {/* Open Source Banner — Firecrawl "Get Started" CTA style */}
      <section className="relative">
        <div
          className="absolute inset-0 -z-10 opacity-[0.3]"
          style={{
            backgroundImage: `radial-gradient(circle, #d2dbe7 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
        {/* Decorative dashed boxes */}
        <div className="absolute top-12 left-[8%] w-40 h-32 border border-dashed border-border/30 rounded-2xl hidden lg:block" />
        <div className="absolute bottom-12 right-[6%] w-36 h-28 border border-dashed border-border/30 rounded-2xl hidden lg:block" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          {/* Section indicator */}
          <div className="flex items-center gap-3 mb-8 justify-center">
            <div className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center">
              <span className="text-white font-bold text-[10px] tracking-wider">OS</span>
            </div>
            <span className="text-xs font-medium uppercase tracking-widest text-text-tertiary">
              Get started
            </span>
          </div>

          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl sm:text-5xl font-bold text-primary-500 text-balance">
              Ready to{" "}
              <span className="text-gradient">build?</span>
            </h2>
            <p className="text-lg text-text-secondary leading-relaxed">
              OpenSight is open-source and community-driven. Start tracking for free
              and scale seamlessly as your project expands.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
              <Link href="/register">
                <Button size="lg">
                  Start for free
                </Button>
              </Link>
              <a
                href={site.links.repo}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg">
                  <Github className="w-4 h-4 mr-2" />
                  View on GitHub
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <PricingTable />
    </>
  );
}
