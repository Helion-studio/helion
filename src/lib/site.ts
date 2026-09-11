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
  nav: [
    { label: "Our Services", href: "/#services" },
    { label: "Our Work", href: "/work" },
    { label: "Contact Us", href: "/contact" },
  ],
  cta: { label: "Let\u2019s Build", href: "/contact" },
  social: {
    github: "https://github.com/topnotchteam",
    x: "https://x.com/topnotchteam",
    linkedin: "https://linkedin.com/company/topnotchteam",
  },
} as const;

/** Palette sampled directly from the Helion mark. */
export const brand = {
  ice: "#dce6ef",
  mist: "#b4c8d8",
  steel: "#8ba2b8",
  slate: "#5b7085",
  deep: "#3c4854",
  ink: "#232c38",
  void: "#12161d",
} as const;

export type SiteConfig = typeof site;
