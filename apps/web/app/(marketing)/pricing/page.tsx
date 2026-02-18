"use client";

import { useState } from "react";
import { site } from "@/lib/site-config";
import { ChevronDown } from "lucide-react";
import PricingTable from "@/components/marketing/PricingTable";

const faqItems = [
  {
    question: "Can I change plans anytime?",
    answer:
      "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately for upgrades and at the next billing cycle for downgrades.",
  },
  {
    question: "Do you offer annual billing discounts?",
    answer:
      "Yes, we offer 20% off when you pay annually. Most customers save around $120/year by switching to annual billing.",
  },
  {
    question: "Is there a trial period?",
    answer:
      "All plans come with a 14-day free trial. No credit card required. You get full access to all features during the trial period.",
  },
  {
    question: "What happens if I exceed my plan limits?",
    answer:
      "We'll notify you when you're approaching your limits. You can upgrade anytime, and overage charges apply at the same rate as your plan until you upgrade.",
  },
  {
    question: "Can I self-host OpenSight?",
    answer:
      "Absolutely! OpenSight is open-source and free to self-host. You get unlimited everything when you self-host. Check our documentation for setup instructions.",
  },
  {
    question: "Do you have a dedicated support plan?",
    answer:
      "Growth plan customers get priority email support. For dedicated support, Slack integration, or custom SLAs, please contact our sales team.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express), and can arrange wire transfers for annual plans.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "We offer a 30-day money-back guarantee if you're not satisfied. After 30 days, monthly subscriptions can be canceled anytime.",
  },
];

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full px-0 py-5 flex items-center justify-between hover:opacity-80 transition-opacity"
      >
        <span className="text-left font-semibold text-primary-500 text-sm">
          {question}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-text-tertiary flex-shrink-0 transition-transform duration-300 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="pb-5">
          <p className="text-sm text-text-secondary leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function PricingPage() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0]));

  const toggleItem = (index: number) => {
    const newOpen = new Set(openItems);
    if (newOpen.has(index)) {
      newOpen.delete(index);
    } else {
      newOpen.add(index);
    }
    setOpenItems(newOpen);
  };

  return (
    <>
      {/* Pricing section */}
      <div className="pt-12">
        <PricingTable />
      </div>

      {/* FAQ Section — Firecrawl-style clean list */}
      <section className="relative">
        <div
          className="absolute inset-0 -z-10 opacity-[0.2]"
          style={{
            backgroundImage: `radial-gradient(circle, #d2dbe7 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          {/* Section heading */}
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold text-primary-500 mb-5 text-balance">
              Frequently asked{" "}
              <span className="text-gradient">questions</span>
            </h2>
            <p className="text-lg text-text-secondary">
              Can&apos;t find the answer you&apos;re looking for? Feel free to reach out
              to our support team.
            </p>
          </div>

          {/* FAQ items — Firecrawl clean divider style */}
          <div className="border-t border-border">
            {faqItems.map((item, index) => (
              <FAQItem
                key={index}
                question={item.question}
                answer={item.answer}
                isOpen={openItems.has(index)}
                onToggle={() => toggleItem(index)}
              />
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-16 text-center space-y-4 p-8 rounded-2xl border border-border bg-white">
            <h3 className="text-lg font-semibold text-primary-500">
              Still have questions?
            </h3>
            <p className="text-sm text-text-secondary">
              Our team is happy to help. Reach out to us at{" "}
              <a
                href={site.links.support}
                className="text-indigo-300 hover:text-indigo-400 font-medium"
              >
                {site.display.supportEmail}
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
