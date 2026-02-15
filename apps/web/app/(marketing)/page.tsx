import Link from "next/link";
import { Button } from "@/components/ui/button";
import Hero from "@/components/marketing/Hero";
import Features from "@/components/marketing/Features";
import PricingTable from "@/components/marketing/PricingTable";
import { TrendingUp, Users, Zap } from "lucide-react";

const stats = [
  {
    icon: TrendingUp,
    label: "3 AI Engines",
    description: "ChatGPT, Perplexity, Google AI",
  },
  {
    icon: Users,
    label: "Competitor Intelligence",
    description: "Track your competitive landscape",
  },
  {
    icon: Zap,
    label: "API on Every Plan",
    description: "Automate your AI visibility",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Problem/Solution Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Problem description */}
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900">
                AI search is the new front door. Are you invisible?
              </h2>
              <div className="space-y-4">
                <p className="text-lg text-gray-600">
                  ChatGPT, Perplexity, and Google AI are changing how people
                  discover information. Your traditional SEO doesn't tell the
                  full story.
                </p>
                <p className="text-lg text-gray-600">
                  You need to know: Are your competitors appearing in AI search
                  results? How often is your content cited? What recommendations
                  are AI engines making about your industry?
                </p>
                <p className="text-lg text-gray-600">
                  Without this data, you're flying blind in the AI-first world.
                </p>
              </div>
            </div>

            {/* Right: Stats cards */}
            <div className="grid grid-cols-1 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {stat.label}
                        </h3>
                        <p className="text-sm text-gray-600">
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Built in the open. No vendor lock-in.
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Opensight is open-source and community-driven. Deploy it yourself,
            contribute improvements, and maintain full control of your data.
          </p>
          <a
            href="https://github.com/yourusername/opensight"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-700 text-white hover:bg-gray-800 transition-colors font-medium"
          >
            View on GitHub
          </a>
        </div>
      </section>

      {/* Pricing Preview */}
      <PricingTable />

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Stop guessing. Start tracking.
          </h2>
          <p className="text-xl text-gray-600">
            Join teams that are already monitoring their AI visibility across
            every major platform.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
