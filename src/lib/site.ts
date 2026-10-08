export const site = {
  name: "Notch",
  suffix: "team",
  fullName: "Notch Team",
  domain: "notch.team",
  tagline: "We build software that holds.",
  description:
    "A small engineering team that builds fast, reliable software — platforms, developer tools, and interfaces people don't have to think about.",
  email: "hello@notch.team",
  location: "Ondo · Lagos · Remote-first",
  /** Single-page site: the nav links are anchors into the landing page. */
  nav: [{ label: "Our Services", href: "/#services" }],
  cta: { label: "Let’s Build", href: "/#start" },
  social: {
    github: "https://github.com/topnotchteam",
    x: "https://x.com/topnotchteam",
    linkedin: "https://linkedin.com/company/topnotchteam",
  },
} as const;
