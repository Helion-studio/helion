/**
 * Brand — the single switch. Rename here and the whole site follows
 * (navbar, footer, mailto, metadata). No image assets: the mark is CSS.
 */
export const site = {
  name: "Orbit",
  suffix: "Node",
  fullName: "Orbit Node",
  domain: "orbitnode.com",
  tagline: "High-performance VPS hosting.",
  description:
    "VPS hosting for projects that refuse to slow down: isolated vCores, NVMe on every plan, daily backups and unlimited traffic, deployed in minutes.",
  email: "sales@orbitnode.com",
  /* The hero badge counts plans from content.ts — nothing to edit here. */
  /** "Cloud servers" is the mockup's label for the add-ons/features block —
   *  rename or repoint here when a real Cloud Servers page exists. */
  nav: [
    { label: "VPS plans", href: "/#plans" },
    { label: "Cloud servers", href: "/#infrastructure" },
    { label: "Features", href: "/#infrastructure" },
  ],
  cta: { label: "Get started", href: "/#plans" },
  social: {
    github: "https://github.com/orbitnode",
    x: "https://x.com/orbitnode",
    status: "https://status.orbitnode.com",
  },
} as const;

export type SiteConfig = typeof site;
