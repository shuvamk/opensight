"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site-config";
import { parseGitHubRepoUrl } from "@/lib/github";
import { useGitHubRepo } from "@/hooks/useGitHubRepo";
import { Github, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: site.links.docs, external: true },
  { label: "Blog", href: site.links.repo, external: true },
];

const SCROLL_THRESHOLD = 10;

const repo = parseGitHubRepoUrl(site.links.repo);

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: githubRepo } = useGitHubRepo(repo?.owner ?? null, repo?.repo ?? null);
  const starCount = githubRepo?.stargazers_count ?? null;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="sticky top-0 z-50 px-4 py-3 sm:px-6 lg:px-8">
      <div
        className={`mx-auto max-w-6xl rounded-full border px-3 transition-all duration-300 ease-out ${
          scrolled
            ? "border-black/10 bg-white/90 shadow-sm shadow-black/10 backdrop-blur"
            : "border-black/8 bg-white/80 backdrop-blur"
        }`}
      >
        <div className="relative flex h-12 items-center gap-4 px-2 sm:px-3">
          {/* Logo */}
          <Link href="/" className="flex flex-1 shrink-0 items-center gap-2 md:flex-none">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-neutral-900">
              <span className="text-white font-bold text-[10px] tracking-wider">OS</span>
            </div>
            <span className="text-sm font-semibold tracking-tight text-neutral-900">
              {site.name}
            </span>
          </Link>

          {/* Center nav links — absolutely centered */}
          <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 md:flex">
            {navLinks.map(({ label, href, external }) => (
              <Button
                key={label}
                render={
                  external ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" />
                  ) : (
                    <Link href={href} />
                  )
                }
                variant="ghost"
                size="sm"
                className="h-8 rounded-md px-2.5 text-xs font-medium text-neutral-700 hover:bg-black/5 hover:text-neutral-900"
              >
                {label}
              </Button>
            ))}
          </div>

          {/* Right side — GitHub stars + Sign up like Firecrawl */}
          <div className="hidden shrink-0 items-center justify-end gap-2 md:flex md:flex-1">
            <Button
              render={<a href={site.links.repo} target="_blank" rel="noopener noreferrer" />}
              variant="outline"
              size="sm"
              className="h-8 rounded-md border-black/15 bg-white px-2.5 text-[11px] font-medium text-neutral-700 hover:bg-neutral-50"
            >
              <Github className="w-3.5 h-3.5" />
              GitHub
              {starCount != null && (
                <span className="ml-1.5 font-medium tabular-nums">{starCount.toLocaleString()}</span>
              )}
            </Button>
            <Link href="/register">
              <Button
                size="sm"
                className="h-8 rounded-md bg-neutral-900 px-2.5 text-[11px] font-medium text-white hover:bg-neutral-800"
              >
                Start Free
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="ml-auto rounded-md p-1.5 transition-colors hover:bg-black/5 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="animate-fade-in border-t border-black/10 px-3 pb-3 pt-2 md:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map(({ label, href, external }) =>
                external ? (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-black/5 hover:text-neutral-900"
                    onClick={() => setMobileOpen(false)}
                  >
                    {label}
                  </a>
                ) : (
                  <Link
                    key={label}
                    href={href}
                    className="rounded-md px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-black/5 hover:text-neutral-900"
                    onClick={() => setMobileOpen(false)}
                  >
                    {label}
                  </Link>
                )
              )}
              <Button
                render={<a href={site.links.repo} target="_blank" rel="noopener noreferrer" />}
                variant="outline"
                className="mt-1 h-8 w-full rounded-md border-black/15 bg-white text-xs text-neutral-700"
                size="sm"
              >
                <Github className="w-4 h-4" />
                GitHub
                {starCount != null && (
                  <span className="ml-1.5 font-medium tabular-nums">{starCount.toLocaleString()}</span>
                )}
              </Button>
              <div className="flex gap-2 mt-2">
                <Link href="/login" className="flex-1">
                  <Button variant="outline" className="h-8 w-full rounded-md border-black/15 bg-white text-xs text-neutral-700" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link href="/register" className="flex-1">
                  <Button className="h-8 w-full rounded-md bg-neutral-900 text-xs text-white hover:bg-neutral-800" size="sm">
                    Start Free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav >
  );
}
