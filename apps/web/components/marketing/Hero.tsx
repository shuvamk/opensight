import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/marketing/SectionHeading";
import GetStartedDialog from "@/components/marketing/GetStartedDialog";
import { site } from "@/lib/site-config";
import { BorderBeam } from "@/registry/magicui/border-beam";
import { ArrowRight, ExternalLink } from "lucide-react";
import AIBeamNetwork from "@/components/marketing/AIBeamNetwork";
import { Badge } from "../ui/badge";

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
      <div className="absolute top-32 left-[15%] text-text-tertiary/30 text-xs font-mono hidden lg:block">
        [ AI ]
      </div>
      <div className="absolute top-48 right-[12%] text-text-tertiary/30 text-xs font-mono hidden lg:block">
        [ VISIBILITY ]
      </div>
      <div className="absolute bottom-40 left-[10%] text-text-tertiary/30 text-xs font-mono hidden lg:block">
        [ TRACK ]
      </div>
      <div className="absolute bottom-32 right-[15%] text-text-tertiary/30 text-xs font-mono hidden lg:block">
        [ SCORE ]
      </div>

      {/* Decorative dashed boxes like Firecrawl */}
      <div className="absolute top-20 left-[8%] w-32 h-32 border border-dashed border-border/30 rounded-2xl hidden lg:block" />
      <div className="absolute top-40 right-[6%] w-40 h-28 border border-dashed border-border/30 rounded-2xl hidden lg:block" />
      <div className="absolute bottom-20 left-[5%] w-36 h-36 border border-dashed border-border/30 rounded-2xl hidden lg:block" />
      <div className="absolute bottom-28 right-[8%] w-28 h-32 border border-dashed border-border/30 rounded-2xl hidden lg:block" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Announcement badge — Firecrawl style pill with glowing underline */}
          <div className="relative inline-block rounded-full">
            <Badge
              size="lg"
              variant="outline"
              className="rounded-full border-primary-500/20 bg-white/80 px-4 py-4 text-sm font-medium text-primary-500 shadow-sm backdrop-blur-sm"
            >
              Open-source AI visibility platform
              <ArrowRight className="h-3.5 w-3.5 text-primary-500/70" />
            </Badge>
            <BorderBeam
              size={30}
              duration={6}
              borderWidth={1.5}
              colorFrom="#ffaa40"
              colorTo="#9c40ff"
              className="opacity-60"
            />
          </div>

          <SectionHeading
            lead="See how AI talks about"
            highlight="your brand"
            as="h1"
            size="lg"
            className="max-w-xl animate-slide-up"
          />

          {/* Subheading */}
          <p className="max-w-2xl mx-auto text-base text-text-secondary leading-relaxed animate-slide-up">
            Track your brand visibility across ChatGPT, Perplexity, and Google
            AI Overviews. Open-source analytics for the AI-first web.
          </p>

          {/* CTA Buttons — Firecrawl style: primary solid + secondary outline */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2 animate-slide-up">
            <GetStartedDialog>
              <Button size="lg">
                Start for free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </GetStartedDialog>
            <a href={site.links.repo} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg">
                View on GitHub
                <ExternalLink className="w-4 h-4" />
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
              <div className="w-1.5 h-1.5 rounded-full bg-success" />3 AI
              engines
            </span>
          </div>
        </div>

        {/* AI network visual */}
        <AIBeamNetwork />
      </div>
    </section>
  );
}
