import Link from "next/link";
import { Button } from "@/components/ui/button";
import Hero from "@/components/marketing/Hero";
import Features from "@/components/marketing/Features";
import PricingTable from "@/components/marketing/PricingTable";
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

      {/* Problem/Solution Section */}
      <section className="section-padding bg-surface">
        <div className="container-tight">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Problem description */}
            <div className="space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-medium">
                The Problem
              </div>
              <h2 className="text-4xl font-bold text-primary-900 text-balance">
                AI search is the new front door. Are you invisible?
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
                <Button className="mt-2">
                  Start tracking for free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Right: Stats cards */}
            <div className="grid grid-cols-1 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-6 border border-border card-hover"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-accent-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-primary-900 mb-1">
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

      {/* Open Source Banner */}
      <section className="section-padding bg-primary-900">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-balance">
            Built in the open. No vendor lock-in.
          </h2>
          <p className="text-lg text-primary-300 max-w-2xl mx-auto leading-relaxed">
            OpenSight is open-source and community-driven. Deploy it yourself,
            contribute improvements, and maintain full control of your data.
          </p>
          <a
            href="https://github.com/yourusername/opensight"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-primary-700 text-white hover:bg-primary-800 transition-colors font-medium"
          >
            <Github className="w-5 h-5" />
            View on GitHub
          </a>
        </div>
      </section>

      {/* Pricing Preview */}
      <PricingTable />

      {/* Final CTA Section */}
      <section className="section-padding bg-white">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-primary-900 text-balance">
            Stop guessing. Start tracking.
          </h2>
          <p className="text-lg text-text-secondary leading-relaxed">
            Join teams that are already monitoring their AI visibility across
            every major platform.
          </p>
          <Link href="/register">
            <Button size="xl">
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
