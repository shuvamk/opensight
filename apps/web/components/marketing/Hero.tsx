import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.08),transparent)]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container-tight py-24 sm:py-32 lg:py-40">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-50 border border-accent-200 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-accent-500" />
            <span className="text-sm font-medium text-accent-700">
              Open-source AI visibility platform
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-primary-900 leading-[1.1] text-balance animate-slide-up">
            See how AI talks about your brand
          </h1>

          {/* Subheading */}
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-text-secondary leading-relaxed animate-slide-up">
            Track your brand visibility across ChatGPT, Perplexity, and Google AI Overviews. 
            Open-source analytics for the AI-first web.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2 animate-slide-up">
            <Link href="/register">
              <Button size="xl">
                Start Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a
              href="https://github.com/yourusername/opensight"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="xl">
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

        {/* Dashboard preview */}
        <div className="mt-20 mx-auto max-w-5xl animate-slide-up">
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-accent-200 via-accent-100 to-accent-200 rounded-3xl opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-500" />

            {/* Screenshot container */}
            <div className="relative bg-white rounded-2xl border border-border shadow-large overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-300" />
                  <div className="w-3 h-3 rounded-full bg-amber-300" />
                  <div className="w-3 h-3 rounded-full bg-emerald-300" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-white rounded-lg border border-border px-3 py-1.5 text-xs text-text-tertiary max-w-md mx-auto">
                    app.opensight.ai/dashboard
                  </div>
                </div>
              </div>

              {/* Dashboard mockup */}
              <div className="p-6 bg-surface aspect-[16/9]">
                <div className="space-y-4">
                  {/* Metric cards row */}
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: "Visibility Score", value: "78.5%", color: "bg-accent-100" },
                      { label: "Total Mentions", value: "1,247", color: "bg-emerald-100" },
                      { label: "Sentiment", value: "92.1%", color: "bg-amber-100" },
                      { label: "Active Prompts", value: "48", color: "bg-purple-100" },
                    ].map((card, i) => (
                      <div key={i} className="bg-white rounded-xl border border-border p-4">
                        <div className="text-[10px] text-text-tertiary font-medium">{card.label}</div>
                        <div className="text-lg font-bold text-primary-900 mt-1">{card.value}</div>
                        <div className={`h-1 ${card.color} rounded-full mt-2 w-3/4`} />
                      </div>
                    ))}
                  </div>

                  {/* Chart area */}
                  <div className="bg-white rounded-xl border border-border p-4 h-40">
                    <div className="text-xs font-medium text-primary-900 mb-3">Visibility Over Time</div>
                    <div className="h-24 flex items-end gap-1">
                      {[40, 45, 42, 58, 55, 62, 68, 65, 72, 78, 75, 82, 85, 80, 88, 92].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-accent-200 rounded-t transition-all hover:bg-accent-400"
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
