"use client";

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
import GetStartedDialog from "@/components/marketing/GetStartedDialog";
import ScrollReveal from "@/components/marketing/ScrollReveal";
import { BorderBeam } from "@/registry/magicui/border-beam";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site-config";
import { motion } from "motion/react";
import { Check, ArrowRight, Sparkles } from "lucide-react";

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

function PricingCard({ plan, index }: { plan: PricingPlan; index: number }) {
  return (
    <ScrollReveal delay={0.15 * index} y={30}>
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className={cn(
          "relative flex flex-col h-full rounded-2xl border transition-shadow duration-500",
          plan.highlighted
            ? "bg-linear-to-b from-primary-500/4 to-transparent dark:from-primary-500/8 border-primary-500/25 shadow-[0_0_40px_-12px] shadow-primary-500/15"
            : "bg-card border-border hover:border-border/80 hover:shadow-lg hover:shadow-black/3 dark:hover:shadow-white/2"
        )}
      >
        {plan.highlighted && (
          <BorderBeam
            size={80}
            duration={8}
            borderWidth={1.5}
            colorFrom="#72727200"
            colorTo="oklch(0.5562 0.0763 182.42)"
            className="opacity-50"
          />
        )}

        <div className="p-7 pb-0 flex flex-col h-full">
          {/* Badge */}
          {plan.highlighted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="mb-4"
            >
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider bg-primary-500/10 text-primary-500 px-2.5 py-1 rounded-full">
                <Sparkles className="w-3 h-3" />
                Most Popular
              </span>
            </motion.div>
          )}

          {/* Plan name */}
          <h3 className={cn(
            "text-xl font-heading",
            plan.highlighted ? "text-primary-500" : "text-text-primary"
          )}>
            {plan.name}
          </h3>

          {/* Description */}
          <p className="text-text-secondary text-sm mt-1 mb-6">{plan.description}</p>

          {/* Price */}
          <div className="mb-7">
            <div className="flex items-baseline gap-1">
              <span className={cn(
                "text-5xl font-mono tracking-tight",
                plan.highlighted ? "text-primary-500" : "text-text-primary"
              )}>
                ${plan.price}
              </span>
              <span className="text-text-tertiary font-mono text-sm">/mo</span>
            </div>
            <p className="text-xs text-text-tertiary mt-2">
              Billed monthly or annually
            </p>
          </div>

          {/* CTA Button */}
          <div className="mb-7">
            {plan.price === 0 ? (
              <GetStartedDialog>
                <Button
                  className={cn(
                    "w-full transition-all duration-300",
                    plan.highlighted
                      ? "shadow-md shadow-primary-500/20 hover:shadow-lg hover:shadow-primary-500/30"
                      : ""
                  )}
                  variant={plan.highlighted ? "default" : "outline"}
                  size="lg"
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </GetStartedDialog>
            ) : (
              <Link href={plan.ctaLink}>
                <Button
                  className={cn(
                    "w-full transition-all duration-300",
                    plan.highlighted
                      ? "shadow-md shadow-primary-500/20 hover:shadow-lg hover:shadow-primary-500/30"
                      : ""
                  )}
                  variant={plan.highlighted ? "default" : "outline"}
                  size="lg"
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-border mb-6" />

          {/* Features list */}
          <div className="space-y-4 grow pb-7">
            <p className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider">
              What&apos;s included
            </p>
            <ul className="space-y-3">
              {plan.features.map((feature, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + idx * 0.06, duration: 0.35 }}
                  className="flex items-start gap-3"
                >
                  <div className={cn(
                    "shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-300",
                    plan.highlighted
                      ? "bg-primary-500/10"
                      : "bg-surface"
                  )}>
                    <Check className={cn(
                      "w-3 h-3",
                      plan.highlighted ? "text-primary-500" : "text-text-tertiary"
                    )} />
                  </div>
                  <span className="text-sm text-text-secondary">{feature}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </ScrollReveal>
  );
}

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
        <ScrollReveal className="flex justify-center">
          <SectionIndicator number="03" total="06" label="Pricing" className="justify-center" />
        </ScrollReveal>
        {/* Section heading */}
        <ScrollReveal delay={0.1}>
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
        </ScrollReveal>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 mb-12 items-start">
          {plans.map((plan, index) => (
            <PricingCard key={plan.name} plan={plan} index={index} />
          ))}
        </div>

        {/* Self-host option */}
        <ScrollReveal className="mt-12">
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
        </ScrollReveal>
      </div>
    </section>
  );
}
