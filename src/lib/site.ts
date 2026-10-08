/**
 * Dannystore — the single switch for the brand. Rename here and the whole
 * site follows (nav, footer, metadata, mailto).
 */
export const site = {
  name: "Danny",
  suffix: "store",
  fullName: "Dannystore",
  domain: "dannystore.dev",
  tagline: "Instant VPS, no ceremony.",
  description:
    "SSD-backed virtual servers deployed in under a minute. Full root, hourly snapshots, a private network that does not charge you for talking to itself.",
  email: "hello@dannystore.dev",
  location: "Lagos · Frankfurt · Ashburn · Singapore",
  /** Single-page store: every link is an anchor into the landing page. */
  nav: [
    { label: "Plans", href: "/#plans" },
    { label: "Network", href: "/#network" },
  ],
  cta: { label: "Deploy a node", href: "/#plans" },
  social: {
    github: "https://github.com/dannystore",
    x: "https://x.com/dannystore",
    status: "https://status.dannystore.dev",
  },
} as const;

export type SiteConfig = typeof site;
