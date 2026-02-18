"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center">
              <span className="text-white font-bold text-[10px] tracking-wider">OS</span>
            </div>
            <span className="font-semibold text-primary-500 text-lg">
              OpenSight
            </span>
          </Link>

          {/* Center nav links — Firecrawl style with subtle dot separator */}
          <div className="hidden md:flex items-center gap-1">
            <a
              href="/#features"
              className="px-4 py-2 text-text-secondary hover:text-primary-500 transition-colors text-sm font-medium"
            >
              Features
            </a>
            <Link
              href="/pricing"
              className="px-4 py-2 text-text-secondary hover:text-primary-500 transition-colors text-sm font-medium"
            >
              Pricing
            </Link>
            <a
              href="https://docs.opensight.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-text-secondary hover:text-primary-500 transition-colors text-sm font-medium"
            >
              Docs
            </a>
            <a
              href="https://github.com/yourusername/opensight"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-text-secondary hover:text-primary-500 transition-colors text-sm font-medium"
            >
              Blog
            </a>
          </div>

          {/* Right side — GitHub stars + Sign up like Firecrawl */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://github.com/yourusername/opensight"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary-500 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span className="font-medium">Star</span>
            </a>
            <Link href="/register">
              <Button size="sm" className="rounded-full bg-primary-500 hover:bg-indigo-500 text-white px-5">
                Sign up
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-surface transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-border/40 animate-fade-in">
            <div className="flex flex-col gap-1">
              <a
                href="/#features"
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-surface hover:text-primary-500 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Features
              </a>
              <Link
                href="/pricing"
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-surface hover:text-primary-500 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Pricing
              </Link>
              <a
                href="https://docs.opensight.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-surface hover:text-primary-500 transition-colors"
              >
                Docs
              </a>
              <a
                href="https://github.com/yourusername/opensight"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-surface hover:text-primary-500 transition-colors flex items-center gap-1.5"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
              <div className="flex gap-3 mt-3 px-3">
                <Link href="/login" className="flex-1">
                  <Button variant="outline" className="w-full" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link href="/register" className="flex-1">
                  <Button className="w-full rounded-full" size="sm">
                    Sign up
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
