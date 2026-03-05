"use client";

import GetStartedDialog from "@/components/marketing/GetStartedDialog";
import PageDescription from "@/components/marketing/PageDescription";
import PageHeading from "@/components/marketing/PageHeading";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site-config";
import { useAuthProfile } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { BorderBeam } from "@/registry/magicui/border-beam";
import { motion } from "motion/react";
import { ArrowRight, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";
import OpenSightLogoAnimation from "../ui/logo-animation";
import Image from "next/image";

const APP_HOME = "/dashboard";

export default function Hero() {
  const { data: user } = useAuthProfile();
  const isLoggedIn = !!user;
  return (
    <section className="relative overflow-hidden">
      {/* Firecrawl-style dot pattern background */}
      <div className="absolute inset-0 -z-10 dark:opacity-20">
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

      <div className="max-w-7xl z-0  mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="group z-10  text-center space-y-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative inline-block rounded-sm"
          >
            <Badge
              size="lg"
              variant="outline"
            >
              Open-source AI visibility platform
              <ArrowRight className="h-3.5 w-3.5" />
            </Badge>
            <BorderBeam
              size={12}
              duration={4}
              borderWidth={1}
              colorFrom="#72727200"
              colorTo="#378277"
              className="opacity-60"
            />
          </motion.div>

          <div className="w-screen flex justify-between absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <OpenSightLogoAnimation key={i} className={cn(
                "size-60 text-muted transition-transform duration-500 ease-out group-hover:rotate-24",
                i === 0 && "group-hover:rotate-36 hover:rotate-12 md:block hidden duration-800",
                i === 1 && "group-hover:-rotate-24 hover:rotate-12 duration-600",
                i === 2 && "group-hover:rotate-36 hover:rotate-12 md:block hidden duration-400",
                i === 3 && "group-hover:-rotate-48 hover:rotate-12 md:block hidden duration-700",
                i === 4 && "group-hover:rotate-60 hover:rotate-12 duration-600",
                i === 5 && "group-hover:-rotate-36 hover:rotate-12 md:block hidden duration-500",
              )}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <PageHeading as="h1" size="lg">
              Watch how <span className="font-heading">AI talks</span> about
              <span className="font-heading"> your brand</span>
            </PageHeading>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <PageDescription>
              Track your brand visibility across ChatGPT, Perplexity, and Google
              AI Overviews. Open-source analytics for the AI-first web.
            </PageDescription>
          </motion.div>

          {/* CTA Buttons — Firecrawl style: primary solid + secondary outline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col sm:flex-row gap-2 justify-center items-center pt-2"
          >
            {isLoggedIn ? (
              <Link href={APP_HOME} className="sm:w-fit w-full max-w-xs">
                <Button size="lg" className="w-full">
                  Launch app
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <GetStartedDialog>
                <Button size="lg" className="sm:w-fit w-full max-w-xs">
                  Start for free
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </GetStartedDialog>
            )}
            <Button variant="outline" size="lg" render={<Link href={site.links.repo} target="_blank" rel="noopener noreferrer"></Link>} className="sm:w-fit w-full max-w-xs">
              View on GitHub
              <SquareArrowOutUpRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative z-20 mt-8 border-6 border-border/30 rounded-xl mx-auto w-full min-w-[700px]"
        >
          <Image
            src="/assets/dashboard-black.png"
            alt="Dashboard preview"
            width={1000}
            height={1000}
            className="rounded-xl overflow-hidden shadow-lg w-full h-full object-contain hidden dark:block"
          />
          <Image
            src="/assets/dashboard-white.png"
            alt="Dashboard preview"
            width={1000}
            height={1000}
            className="rounded-xl overflow-hidden shadow-lg w-full h-full object-contain block dark:hidden"
          />
        </motion.div>
      </div>
    </section >
  );
}
