import Link from "next/link";

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
    title: "Use Cases",
    links: [
      { label: "Brand Monitoring", href: "/use-cases/brand-monitoring" },
      { label: "Competitor Analysis", href: "/use-cases/competitor-analysis" },
      { label: "Content Optimization", href: "/use-cases/content-optimization" },
      { label: "Agency Reporting", href: "/use-cases/agency-reporting" },
      { label: "Enterprise", href: "/use-cases/enterprise" },
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

const legalLinks = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Security", href: "/security" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-border">
      {/* Main footer content — Firecrawl-style 4-column grid with dividers */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-primary-500 mb-5">
                {section.title}
              </h3>
              <ul className="space-y-3.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("http") || link.href.startsWith("mailto") ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-text-secondary hover:text-primary-500 transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-text-secondary hover:text-primary-500 transition-colors"
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

      {/* Bottom bar — Firecrawl style */}
      <div className="border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-text-tertiary">
            &copy; {currentYear} OpenSight
          </p>
          <div className="flex items-center gap-8">
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

      {/* Status indicator like Firecrawl */}
      <div className="border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-sm text-emerald-600 font-medium">All systems normal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
