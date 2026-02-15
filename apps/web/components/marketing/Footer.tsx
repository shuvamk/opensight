import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

const footerSections = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Docs", href: "https://docs.opensight.ai" },
      { label: "API Reference", href: "https://docs.opensight.ai/api" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Help Center", href: "/help" },
      { label: "Community", href: "https://github.com/yourusername/opensight/discussions" },
      { label: "Status", href: "https://status.opensight.ai" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "mailto:hello@opensight.ai" },
      { label: "Brand", href: "/brand" },
    ],
  },
];

const socialLinks = [
  { icon: Github, href: "https://github.com/yourusername/opensight", label: "GitHub" },
  { icon: Twitter, href: "https://twitter.com/opensight", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com/company/opensight", label: "LinkedIn" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Security", href: "/security" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-border">
      {/* Main footer content */}
      <div className="container-tight section-padding pb-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 lg:gap-16">
          {/* Logo and description */}
          <div className="col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary-900 flex items-center justify-center">
                <span className="text-white font-bold text-xs tracking-wider">OS</span>
              </div>
              <span className="font-semibold text-primary-900 text-lg">OpenSight</span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
              Open-source AI visibility analytics. Track how AI search engines talk about your brand.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-text-secondary hover:text-primary-900 hover:border-primary-300 transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-primary-900 mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("http") || link.href.startsWith("mailto") ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-text-secondary hover:text-primary-900 transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-text-secondary hover:text-primary-900 transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container-tight py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-text-tertiary">
            &copy; {currentYear} OpenSight. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-text-tertiary hover:text-text-secondary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
