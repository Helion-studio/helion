/**
 * SINGLE SOURCE OF TRUTH FOR SITE COPY
 * ------------------------------------
 * Every piece of text lives here — rewrite copy without touching components.
 * Anything marked `REPLACE:` is placeholder that must be swapped before launch.
 *
 * Voice rule: always plural. We / our / us. Never I / me / my.
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
    // REPLACE: real GitHub org / repo URL
    url: "https://github.com/helion-studio",
    handle: "github.com/helion-studio",
  },
};

export const nav = [
  { label: "Services", href: "#services" },
  { label: "Open source", href: site.repo.url, external: true },
  { label: "Contact", href: "#contact" },
];

/* ------------------------------------------------------------------ */
/* HERO                                                                */
/* ------------------------------------------------------------------ */

export const hero = {
  /** Conversational entry point — micro-label with emoji prefix. */
  microLabel: { emoji: "👋", text: "Hello, we're Helion" },

  /** Two-line headline. Line 1 = accent blue, Line 2 = near-black and heavier. */
  headline: {
    lead: "We build software",
    tail: "that survives growth.",
  },

  subhead:
    "Helion Studio is a full-stack product team — backend, frontend, design, AI and motion under one roof. We take products from first commit to production, and keep them standing as you scale.",

  primaryCta: { label: "Start your project", href: "#contact" },
  secondaryCta: { label: "Visit our repo", href: site.repo.url, external: true },

  /** Feature tease row beneath the buttons: icon + bold label + micro-copy. */
  trust: [
    { icon: "motion", title: "Animation", description: "Motion that feels alive" },
    { icon: "git", title: "Open source", description: "A repo that keeps growing" },
    { icon: "zap", title: "Fast delivery", description: "Weeks, not quarters" },
    { icon: "gamepad", title: "Game servers", description: "Real-time backends in Go" },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* STATS BAR                                                           */
/* ------------------------------------------------------------------ */

export const stats = [
  { value: "48+", label: "Projects delivered", note: "REPLACE: real count" },
  { value: "98%", label: "Client satisfaction", note: "REPLACE: real figure" },
  { value: "6+", label: "Years building", note: "REPLACE: real figure" },
];

/* ------------------------------------------------------------------ */
/* SERVICES                                                            */
/* ------------------------------------------------------------------ */

export const services = {
  eyebrow: "What we do",
  headline: "One team, every layer of the stack.",
  subtitle:
    "We plug in as your product team — from the first architecture decision to the release that scales.",
  items: [
    {
      icon: "server",
      title: "Backend engineering",
      description:
        "Node.js and Spring Boot services, plus real-time game servers in Go.",
    },
    {
      icon: "code",
      title: "Frontend development",
      description: "Web and mobile interfaces built to hold up in production.",
    },
    {
      icon: "layers",
      title: "UI/UX design",
      description: "Interfaces designed alongside the engineers who build them.",
    },
    {
      icon: "sparkle",
      title: "AI integration",
      description: "LLMs, RAG pipelines and agents shipped into real products.",
    },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* CLOSING CTA — navy band, bookends the header                        */
/* ------------------------------------------------------------------ */

export const closingCta = {
  icon: "chat",
  heading: "Have a product to build?",
  body: "Let's talk about scope, timeline and the team you need.",
  button: { label: "Start your project", href: "#contact" },
};
