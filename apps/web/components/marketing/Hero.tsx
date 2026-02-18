import Link from "next/link";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site-config";
import { ArrowRight, ExternalLink } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Firecrawl-style dot pattern background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: `radial-gradient(circle, #d2dbe7 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
        {/* Subtle radial fade from center */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(28,37,65,0.04),transparent)]" />
      </div>

      {/* Firecrawl-style floating decorative elements */}
      <div className="absolute top-32 left-[15%] text-text-tertiary/30 text-xs font-mono hidden lg:block">[ AI ]</div>
      <div className="absolute top-48 right-[12%] text-text-tertiary/30 text-xs font-mono hidden lg:block">[ VISIBILITY ]</div>
      <div className="absolute bottom-40 left-[10%] text-text-tertiary/30 text-xs font-mono hidden lg:block">[ TRACK ]</div>
      <div className="absolute bottom-32 right-[15%] text-text-tertiary/30 text-xs font-mono hidden lg:block">[ SCORE ]</div>

      {/* Decorative dashed boxes like Firecrawl */}
      <div className="absolute top-20 left-[8%] w-32 h-32 border border-dashed border-border/30 rounded-2xl hidden lg:block" />
      <div className="absolute top-40 right-[6%] w-40 h-28 border border-dashed border-border/30 rounded-2xl hidden lg:block" />
      <div className="absolute bottom-20 left-[5%] w-36 h-36 border border-dashed border-border/30 rounded-2xl hidden lg:block" />
      <div className="absolute bottom-28 right-[8%] w-28 h-32 border border-dashed border-border/30 rounded-2xl hidden lg:block" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Announcement badge — Firecrawl style pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border/60 animate-fade-in">
            <span className="text-sm text-text-secondary">
              Open-source AI visibility platform
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-text-tertiary" />
          </div>

          {/* Heading — Firecrawl large centered heading with colored keyword */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tighter font-heading text-primary-500 leading-[1.08] text-balance animate-slide-up">
            See how AI talks about{" "}
            <span className="text-gradient">your brand</span>
          </h1>

          {/* Subheading */}
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-text-secondary leading-relaxed animate-slide-up">
            Track your brand visibility across ChatGPT, Perplexity, and Google AI Overviews.
            Open-source analytics for the AI-first web.
          </p>

          {/* CTA Buttons — Firecrawl style: primary solid + secondary outline */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2 animate-slide-up">
            <Link href="/register">
              <Button size="lg">
                Start for free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a
              href={site.links.repo}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg">
                View on GitHub
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-8 pt-8 text-sm text-text-tertiary animate-fade-in">
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-success" />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-success" />
              Self-host available
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-success" />
              3 AI engines
            </span>
          </div>
        </div>

        {/* Dashboard preview — Firecrawl-style browser mockup with dashed outlines */}
        <div className="mt-20 mx-auto max-w-5xl animate-slide-up">
          <div className="relative group">
            {/* Screenshot container */}
            <div className="relative bg-white rounded-2xl border border-border shadow-large overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-300/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-300/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-300/80" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-white rounded-lg border border-border px-3 py-1.5 text-xs text-text-tertiary max-w-md mx-auto">
                    {site.display.appDashboardUrl}
                  </div>
                </div>
              </div>

              {/* Dashboard mockup */}
              <div className="p-6 bg-surface/30 aspect-[16/9]">
                <div className="space-y-4">
                  {/* Metric cards row */}
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: "Visibility Score", value: "78.5%", color: "bg-indigo-50" },
                      { label: "Total Mentions", value: "1,247", color: "bg-emerald-50" },
                      { label: "Sentiment", value: "92.1%", color: "bg-amber-50" },
                      { label: "Active Prompts", value: "48", color: "bg-purple-50" },
                    ].map((card, i) => (
                      <div key={i} className="bg-white rounded-xl border border-border p-4">
                        <div className="text-[10px] text-text-tertiary font-medium">{card.label}</div>
                        <div className="text-lg font-bold text-primary-500 mt-1">{card.value}</div>
                        <div className={`h-1 ${card.color} rounded-full mt-2 w-3/4`} />
                      </div>
                    ))}
                  </div>

                  {/* Chart area */}
                  <div className="bg-white rounded-xl border border-border p-4 h-40">
                    <div className="text-xs font-medium text-primary-500 mb-3">Visibility Over Time</div>
                    <div className="h-24 flex items-end gap-1">
                      {[40, 45, 42, 58, 55, 62, 68, 65, 72, 78, 75, 82, 85, 80, 88, 92].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-indigo-100 rounded-t transition-all hover:bg-indigo-200"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
