import Link from "next/link";
import { Button } from "@/components/ui/button";
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
    <section className="section-padding bg-surface">
      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-medium mb-6">
            Pricing
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-primary-900 mb-5 text-balance">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-text-secondary leading-relaxed">
            Start free. Scale as you grow. No credit card required.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl border transition-all duration-300 ${
                plan.highlighted
                  ? "border-accent-300 bg-white shadow-large ring-1 ring-accent-200 md:scale-[1.02]"
                  : "border-border bg-white shadow-soft hover:shadow-medium"
              }`}
            >
              {/* Recommended badge */}
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2">
                  <div className="bg-accent-500 text-white px-4 py-1 rounded-full text-xs font-semibold">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-7 flex flex-col h-full">
                {/* Plan name */}
                <h3 className="text-xl font-bold text-primary-900 mb-1">
                  {plan.name}
                </h3>

                {/* Description */}
                <p className="text-text-secondary text-sm mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-7">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-primary-900">
                      ${plan.price}
                    </span>
                    <span className="text-text-secondary text-sm">/month</span>
                  </div>
                  <p className="text-xs text-text-tertiary mt-1.5">
                    Billed monthly or annually
                  </p>
                </div>

                {/* CTA Button */}
                <Link href={plan.ctaLink} className="mb-7">
                  <Button
                    className="w-full"
                    variant={plan.highlighted ? "accent" : "outline"}
                    size="lg"
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>

                {/* Features list */}
                <div className="space-y-4 flex-grow">
                  <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                    What&apos;s included
                  </p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-primary-700"
                      >
                        <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center">
                          <Check className="w-3 h-3 text-emerald-600" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Self-host option */}
        <div className="mt-12">
          <div className="bg-white rounded-2xl border border-border p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-soft">
            <div>
              <h3 className="text-lg font-semibold text-primary-900 mb-1.5">
                Self-host for free
              </h3>
              <p className="text-text-secondary text-sm">
                Always free &mdash; unlimited everything. Perfect for teams managing
                their own infrastructure.
              </p>
            </div>
            <a
              href="https://github.com/yourusername/opensight"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline">
                View Docs
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
