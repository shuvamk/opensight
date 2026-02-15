import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

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
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing.
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start free. Scale as you grow. No credit card required to get started.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl border transition-all duration-300 ${
                plan.highlighted
                  ? "md:scale-105 border-blue-600 bg-blue-50 shadow-2xl"
                  : "border-gray-200 bg-white hover:border-gray-300 shadow-lg hover:shadow-xl"
              }`}
            >
              {/* Recommended badge */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Recommended
                  </div>
                </div>
              )}

              <div className="p-8 flex flex-col h-full">
                {/* Plan name */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-gray-900">
                      ${plan.price}
                    </span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Billed monthly or annually
                  </p>
                </div>

                {/* CTA Button */}
                <Link href={plan.ctaLink} className="mb-8">
                  <Button
                    className={`w-full ${
                      plan.highlighted
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                    }`}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </Link>

                {/* Features list */}
                <div className="space-y-4 flex-grow">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    What's included
                  </p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-gray-700"
                      >
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
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
        <div className="mt-16 pt-12 border-t border-gray-200">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Self-host
              </h3>
              <p className="text-gray-600">
                Always free — unlimited everything. Perfect for teams managing
                their own infrastructure.
              </p>
            </div>
            <a
              href="https://github.com/yourusername/opensight"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 rounded-lg border border-gray-300 text-gray-900 hover:bg-white transition-colors font-medium whitespace-nowrap"
            >
              View Docs
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
