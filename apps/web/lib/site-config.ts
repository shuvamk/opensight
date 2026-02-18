const siteConfig = {
  name: "OpenSight",
  github: "https://github.com/shuvamk/opensight",
  docs: "https://docs.opensight.ai",
  status: "https://status.opensight.ai",
  appUrl: "https://app.opensight.ai",
  email: {
    hello: "hello@opensight.ai",
    support: "support@opensight.ai",
  },
} as const;

export const site = {
  ...siteConfig,
  links: {
    repo: siteConfig.github,
    star: siteConfig.github,
    discussions: `${siteConfig.github}/discussions`,
    docs: siteConfig.docs,
    docsApi: `${siteConfig.docs}/api`,
    status: siteConfig.status,
    contact: `mailto:${siteConfig.email.hello}`,
    support: `mailto:${siteConfig.email.support}`,
  },
  display: {
    appDashboardUrl: `${siteConfig.appUrl.replace(/^https?:\/\//, "")}/dashboard`,
    supportEmail: siteConfig.email.support,
  },
} as const;

export default site;
