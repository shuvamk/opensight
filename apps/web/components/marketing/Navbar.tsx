"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HoverPill } from "@/components/ui/hover-pill";
import {
  NavMenuRoot,
  NavMenuList,
  NavMenuItem,
  NavMenuTrigger,
  NavMenuContent,
  NavMenuLink,
  NavMenuPortal,
  NavMenuPositioner,
  NavMenuPopup,
  triggerClassName,
} from "@/components/ui/navigation-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { site } from "@/lib/site-config";
import { useAuthProfile } from "@/hooks/useAuth";
import { useGitHubRepo } from "@/hooks/useGitHubRepo";
import { Github, Menu, X } from "lucide-react";
import { useState } from "react";
import OsIcon from "../ui/OsIcon";

const featuresLinks = [
  { title: "AI Overviews", description: "Track visibility in Google AI Overviews.", href: "/#features" },
  { title: "ChatGPT", description: "Monitor brand mentions in ChatGPT.", href: "/#features" },
  { title: "Perplexity", description: "Analytics for Perplexity AI.", href: "/#features" },
  { title: "Analytics", description: "Open-source analytics for the AI-first web.", href: "/#features" },
];

const docsLinks = [
  { title: "Documentation", href: site.links.docs, external: true },
  { title: "GitHub", href: site.links.repo, external: true },
];

const blogLinks = [
  { title: "Latest posts", href: "/blog", external: false },
  { title: "Changelog", href: `${site.links.repo}/releases`, external: true },
  { title: "Community", href: site.links.discussions, external: true },
];

const navItems: Array<
  | { id: string; label: string; type: "link"; href: string }
  | {
      id: string;
      label: string;
      type: "dropdown";
      links: Array<{ title: string; href: string; external?: boolean; description?: string }>;
      grid?: boolean;
    }
> = [
  { id: "features", label: "Features", type: "dropdown", links: featuresLinks, grid: true },
  { id: "docs", label: "Docs", type: "dropdown", links: docsLinks },
  { id: "blog", label: "Blog", type: "dropdown", links: blogLinks },
  { id: "pricing", label: "Pricing", type: "link", href: "/pricing" },
];

const mobileNavLinks = [
  { label: "Features", href: "/#features", external: false },
  { label: "Docs", href: site.links.docs, external: true },
  { label: "Blog", href: "/blog", external: false },
  { label: "Pricing", href: "/pricing", external: false },
];

const APP_HOME = "/dashboard";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: user } = useAuthProfile();
  const { data: repo } = useGitHubRepo();
  const isLoggedIn = !!user;

  return (
    <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between py-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 shrink-0">
            <OsIcon className="size-5 text-foreground" />
            <span className="font-medium font-heading tracking-tight text-lg">
              {site.name}
            </span>
          </Link>

          {/* Center nav — Navigation Menu (hover dropdowns) + shared hover pill */}
          <div className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2">
            <NavMenuRoot>
              <HoverPill tabSelector="[data-nav-item]" className="flex items-center">
                <NavMenuList>
                  {navItems.map((item) =>
                    item.type === "link" ? (
                      <NavMenuItem key={item.id}>
                        <NavMenuLink
                          href={item.href}
                          render={<Link href={item.href} />}
                          className={triggerClassName}
                          data-nav-item
                        >
                          {item.label}
                        </NavMenuLink>
                      </NavMenuItem>
                    ) : (
                      <NavMenuItem key={item.id}>
                        <NavMenuTrigger>{item.label}</NavMenuTrigger>
                        <NavMenuContent>
                          <ul
                            className={
                              item.grid
                                ? "grid min-[32rem]:grid-cols-2 gap-1 list-none p-0 m-0"
                                : "flex flex-col gap-0.5 list-none p-0 m-0"
                            }
                          >
                            {item.links.map((link) => (
                              <li key={link.title}>
                                {"external" in link && link.external ? (
                                  <NavMenuLink
                                    href={link.href}
                                    render={
                                      <a href={link.href} target="_blank" rel="noopener noreferrer" />
                                    }
                                    className={
                                      "description" in link && link.description
                                        ? "flex flex-col gap-0.5 py-2"
                                        : undefined
                                    }
                                  >
                                    {"description" in link && link.description ? (
                                      <>
                                        <span className="font-normal text-foreground">{link.title}</span>
                                        <span className="text-xs text-muted-foreground">{link.description}</span>
                                      </>
                                    ) : (
                                      link.title
                                    )}
                                  </NavMenuLink>
                                ) : (
                                  <NavMenuLink
                                    href={link.href}
                                    render={<Link href={link.href} />}
                                    className={
                                      "description" in link && link.description
                                        ? "flex flex-col gap-0.5 py-2"
                                        : undefined
                                    }
                                  >
                                    {"description" in link && link.description ? (
                                      <>
                                        <span className="font-normal text-foreground">{link.title}</span>
                                        <span className="text-xs text-muted-foreground">{link.description}</span>
                                      </>
                                    ) : (
                                      link.title
                                    )}
                                  </NavMenuLink>
                                )}
                              </li>
                            ))}
                          </ul>
                        </NavMenuContent>
                      </NavMenuItem>
                    ),
                  )}
                </NavMenuList>
              </HoverPill>

              <NavMenuPortal>
                <NavMenuPositioner>
                  <NavMenuPopup />
                </NavMenuPositioner>
              </NavMenuPortal>
            </NavMenuRoot>
          </div>

          {/* Right side — Theme + GitHub + Sign up */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Button render={<Link href={site.links.repo} target="_blank" />} variant="outline" size="sm">
              <Github className="w-4 h-4" />
              Star
              {repo?.stargazers_count != null && (
                <span>
                  {repo.stargazers_count.toLocaleString()}
                </span>
              )}
            </Button>
            {isLoggedIn ? (
              <Link href={APP_HOME}>
                <Button size="sm">
                  Launch app
                </Button>
              </Link>
            ) : (
              <Link href="/register">
                <Button size="sm">
                  Sign up
                </Button>
              </Link>
            )}
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
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm font-medium text-muted-foreground">Theme</span>
                <ThemeToggle />
              </div>
              {mobileNavLinks.map(({ label, href, external }) =>
                external ? (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-surface hover:text-primary-500 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {label}
                  </a>
                ) : (
                  <Link
                    key={label}
                    href={href}
                    className="px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-surface hover:text-primary-500 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {label}
                  </Link>
                )
              )}
              <Button render={<Link href={site.links.repo} />} variant="outline" className="w-full" size="sm">
                <Github className="w-4 h-4" />
                Star
                {repo?.stargazers_count != null && (
                  <span className="ml-1.5 font-medium tabular-nums">
                    {repo.stargazers_count.toLocaleString()}
                  </span>
                )}
              </Button>
              <div className="flex gap-2 mt-2">
                {isLoggedIn ? (
                  <Link href={APP_HOME} className="flex-1" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full" size="sm">
                      Launch app
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login" className="flex-1">
                      <Button variant="outline" className="w-full" size="sm">
                        Sign in
                      </Button>
                    </Link>
                    <Link href="/register" className="flex-1">
                      <Button className="w-full" size="sm">
                        Sign up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav >
  );
}
