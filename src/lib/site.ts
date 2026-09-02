export const site = {
  name: "Helion",
  suffix: "studio",
  fullName: "Helion Studio",
  domain: "helionstudio.com",
  tagline: "Engineering studio for systems that hold.",
  description:
    "We design and build production software — real-time platforms, developer tooling and interfaces that feel instant on every device.",
  email: "hello@helionstudio.com",
  location: "Ibadan · Lagos · Remote-first",
  nav: [
    { label: "Capabilities", href: "#capabilities" },
    { label: "Work", href: "#work" },
    { label: "Studio", href: "#studio" },
    { label: "Process", href: "#process" },
  ],
  cta: { label: "Start a project", href: "#contact" },
  social: {
    github: "https://github.com/helionstudio",
    x: "https://x.com/helionstudio",
    linkedin: "https://linkedin.com/company/helionstudio",
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
