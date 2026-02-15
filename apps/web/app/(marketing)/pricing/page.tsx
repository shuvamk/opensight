"use client";

import { useState } from "react";
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
    question: "Can I self-host Opensight?",
    answer:
      "Absolutely! Opensight is open-source and free to self-host. You get unlimited everything when you self-host. Check our documentation for setup instructions.",
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
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="text-left font-semibold text-gray-900">
          {question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-gray-600 leading-relaxed">{answer}</p>
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

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          {/* Section heading */}
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Frequently asked questions
            </h2>
            <p className="text-lg text-gray-600">
              Can't find the answer you're looking for? Feel free to reach out
              to our support team.
            </p>
          </div>

          {/* FAQ items */}
          <div className="space-y-4">
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
          <div className="mt-16 text-center space-y-4 p-8 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
            <h3 className="text-xl font-semibold text-gray-900">
              Still have questions?
            </h3>
            <p className="text-gray-600">
              Our team is happy to help. Reach out to us at{" "}
              <a
                href="mailto:support@opensight.ai"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                support@opensight.ai
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
