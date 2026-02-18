import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SectionHeading from "@/components/marketing/SectionHeading";
import SectionIndicator from "@/components/marketing/SectionIndicator";
import { site } from "@/lib/site-config";
import { Check, ArrowRight } from "lucide-react";

interface PricingPlan {
  name: string;
  price: number;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
  ctaLink: string;
}

const plans: PricingPlan[] = [
  {
    name: "Free",
    price: 0,
    description: "Perfect for exploring AI visibility",
    features: [
      "25 prompts/month",
      "ChatGPT only",
      "2 competitors",
      "5 content scores/day",
      "100 API requests/day",
      "1 brand",
    ],
    cta: "Get Started Free",
    ctaLink: "/register",
  },
  {
    name: "Starter",
    price: 49,
    description: "For serious AI visibility tracking",
    features: [
      "100 prompts/month",
      "All 3 engines",
      "5 competitors",
      "25 content scores/day",
      "1,000 API requests/day",
      "3 brands",
    ],
    highlighted: true,
    cta: "Start Free Trial",
    ctaLink: "/register",
  },
  {
    name: "Growth",
    price: 149,
    description: "For enterprises and agencies",
    features: [
      "250 prompts/month",
      "All 3 engines",
      "5 competitors",
      "100 content scores/day",
      "10,000 API requests/day",
      "10 brands",
    ],
    cta: "Start Free Trial",
    ctaLink: "/register",
  },
];

export default function PricingTable() {
  return (
    <section className="relative">
      {/* Dot pattern background */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.25]"
        style={{
          backgroundImage: `radial-gradient(circle, #d2dbe7 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <SectionIndicator number="03" total="06" label="Pricing" className="justify-center" />
        {/* Section heading */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <SectionHeading
            lead="Simple, transparent"
            highlight="pricing"
            size="md"
            centered
            className="mb-5"
          />
          <p className="text-lg text-text-secondary leading-relaxed">
            Start free. Scale as you grow. No credit card required.
          </p>
        </div>

        {/* Pricing cards — Firecrawl-style clean cards with subtle borders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border/50 border border-border rounded-2xl overflow-hidden mb-12">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white p-7 flex flex-col ${plan.highlighted ? "relative" : ""
                }`}
            >
              {/* Recommended badge */}
              {plan.highlighted && (
                <div className="absolute -top-px left-0 right-0 h-1 bg-gradient-to-r from-indigo-300 to-accent-400" />
              )}

              {/* Plan name */}
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-heading text-primary-500">
                  {plan.name}
                </h3>
                {plan.highlighted && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-300 px-2 py-0.5 rounded-full">
                    Popular
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-text-secondary text-sm mb-6">{plan.description}</p>

              {/* Price */}
              <div className="mb-7">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-mono text-primary-500">
                    ${plan.price}
                  </span>
                  <span className="text-text-secondary font-mono text-sm">/month</span>
                </div>
                <p className="text-xs text-text-tertiary mt-1.5">
                  Billed monthly or annually
                </p>
              </div>

              {/* CTA Button */}
              <Link href={plan.ctaLink} className="mb-7">
                <Button
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                  size="lg"
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>

              {/* Features list */}
              <div className="space-y-4 grow">
                <p className="text-xs font-medium text-text-tertiary tracking-wider">
                  What&apos;s included
                </p>
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-accent-600"
                    >
                      <div className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center">
                        <Check className="w-3 h-3 text-emerald-600" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Self-host option */}
        <div className="mt-12">
          <Card>
            <CardHeader className="gap-1.5">
              <CardTitle className="text-primary-500 font-heading">
                Self-host for free
              </CardTitle>
              <CardDescription className="text-text-secondary">
                Always free - unlimited everything. Perfect for teams
                managing their own infrastructure.
              </CardDescription>
              <CardAction>
                <a
                  href={site.links.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline">
                    View Docs
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
              </CardAction>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
}
