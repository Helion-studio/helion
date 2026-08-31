/**
 * SINGLE SOURCE OF TRUTH FOR SITE COPY
 * ------------------------------------
 * Every piece of text lives here — rewrite copy without touching components.
 * Anything marked `REPLACE:` is placeholder that must be swapped before launch.
 */

export const site = {
  name: "Helion Studio",
  shortName: "Helion",
  tagline: "Full-stack product engineering",
  description:
    "Helion Studio is a full-stack product team — backend, frontend, design, AI and motion — building software that survives contact with the market.",
  url: "https://helion.studio",
  email: "hello@helion.studio",
  repo: {
    label: "Visit our repo",
    // REPLACE: your real GitHub org / repo URL
    url: "https://github.com/helion-studio",
    handle: "github.com/helion-studio",
  },
};

export const nav = [
  { label: "Specializations", href: "#specializations" },
  { label: "Work", href: "#work" },
  { label: "Team", href: "#team" },
  { label: "Open source", href: site.repo.url },
];

export const hero = {
  eyebrow: "Full-stack product studio",
  availability: "Booking Q4 2026",
  headline: ["One team for", "every layer of your product."],
  subhead:
    "Helion Studio is a senior product team — backend, frontend, design, AI and motion under one roof. We take products from first commit to production, and keep them standing as you scale.",
  primaryCta: { label: "Start your project", href: "#contact" },
  secondaryCta: { label: "Visit our repo", href: site.repo.url },
};

export type Specialization = {
  title: string;
  description: string;
  href?: string;
};

/** The "We specialize in" list — the six things Helion does. */
export const specializations: Specialization[] = [
  {
    title: "Backend development",
    description: "From Node.js to Spring Boot, to game servers in Go.",
  },
  {
    title: "UI/UX design",
    description: "Interfaces your engineers can actually build.",
  },
  {
    title: "Frontend development",
    description: "Web and mobile apps built to last.",
  },
  {
    title: "AI integration",
    description: "LLMs, RAG and agents shipped into production.",
  },
  {
    title: "Animation",
    description: "Motion that makes a product feel alive.",
  },
  {
    title: "Open source",
    description: "We're actively growing our repo of production-ready tools.",
    href: site.repo.url,
  },
];

export const closingCta = {
  heading: "Ready to start your project?",
  body: "Tell us what you're building. We'll come back with a plan, a team and a timeline.",
  primary: { label: "Start your project", href: "#contact" },
  secondary: { label: "Visit our repo", href: site.repo.url },
};
