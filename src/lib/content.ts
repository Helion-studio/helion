/**
 * Site content — real data for the Work / Process / More pages.
 * Single source of truth so copy stays consistent everywhere.
 */

export type Project = {
  name: string;
  category: string;
  year: string;
  blurb: string;
  detail: string;
  metrics: { k: string; label: string }[];
  stack: string[];
};

export const projects: Project[] = [
  {
    name: "Ledgerline",
    category: "Real-time fintech platform",
    year: "2025",
    blurb: "A payments operations desk that streams live ledger events instead of refreshing dashboards.",
    detail:
      "We rebuilt a legacy reporting stack into a single real-time platform: event ingestion, streaming aggregates and an operations UI that stays under 40ms at p95 while 1.2M ledger events per minute flow through it.",
    metrics: [
      { k: "1.2M", label: "events / min" },
      { k: "38ms", label: "p95 latency" },
      { k: "99.99%", label: "uptime" },
    ],
    stack: ["Next.js", "WebSockets", "Rust", "Postgres", "Redis"],
  },
  {
    name: "Forge CLI",
    category: "Developer tooling",
    year: "2025",
    blurb: "A command-line toolchain that turned a 40-minute release ritual into a four-minute one.",
    detail:
      "Designed and shipped an internal CLI + dashboard pair that standardized builds, previews and rollbacks across 14 services. Adoption was voluntary — it hit every team in a quarter because it made the old workflow obsolete.",
    metrics: [
      { k: "4×", label: "faster releases" },
      { k: "14", label: "services onboarded" },
      { k: "100%", label: "team adoption" },
    ],
    stack: ["Go", "TypeScript", "OCI", "GitHub Actions"],
  },
  {
    name: "Atlas Relay",
    category: "IoT telemetry platform",
    year: "2024",
    blurb: "Telemetry ingestion for 60k field devices — readable, replayable, and boringly stable.",
    detail:
      "Time-series pipeline with backpressure handling, replay-from-anywhere storage and a live fleet map. Survived a Black-Friday traffic spike at 9× normal volume without paging anyone.",
    metrics: [
      { k: "60k", label: "devices live" },
      { k: "9×", label: "spike absorbed" },
      { k: "0", label: "incidents" },
    ],
    stack: ["Elixir", "TimescaleDB", "MQTT", "Grafana"],
  },
  {
    name: "Northwind",
    category: "Marketplace rebuild",
    year: "2024",
    blurb: "A storefront so heavy customers left before the homepage painted. Now it lands in under a second.",
    detail:
      "Full frontend rebuild with streamed rendering, edge caching and an image pipeline tuned per device. Conversion followed speed: bounce rate fell by a third in the first month.",
    metrics: [
      { k: "0.9s", label: "LCP (was 3.1s)" },
      { k: "−34%", label: "bounce rate" },
      { k: "+21%", label: "conversion" },
    ],
    stack: ["Next.js", "Edge", "Cloudflare", "Sanity"],
  },
  {
    name: "Quorum",
    category: "Collaboration platform",
    year: "2023",
    blurb: "A multiplayer canvas where sixty cursors feel like one fluid conversation.",
    detail:
      "CRDT-backed collaborative workspace with presence, comments and versioned snapshots. Conflict-free sync engine written from scratch because the off-the-shelf options choked past twenty editors.",
    metrics: [
      { k: "60", label: "live editors / doc" },
      { k: "<16ms", label: "sync round-trip" },
      { k: "0", label: "lost writes" },
    ],
    stack: ["TypeScript", "CRDTs", "WebRTC", "Yjs"],
  },
  {
    name: "Beacon",
    category: "Status & incident platform",
    year: "2023",
    blurb: "Incident management that turns 3 a.m. chaos into a checklist that runs itself.",
    detail:
      "Status pages, on-call routing and a timeline builder that assembles incident reports as the incident happens. Built for teams who'd rather sleep than hero.",
    metrics: [
      { k: "MTTR −47%", label: "faster recovery" },
      { k: "300+", label: "incidents run" },
      { k: "4.9/5", label: "on-call rating" },
    ],
    stack: ["Remix", "tRPC", "Postgres", "Twilio"],
  },
];

export type Phase = {
  n: string;
  title: string;
  duration: string;
  what: string;
  deliverables: string[];
};

export const phases: Phase[] = [
  {
    n: "01",
    title: "Discover",
    duration: "1–2 weeks",
    what: "We map the real problem before touching design or code — goals, constraints, users, and what 'done' actually means to you.",
    deliverables: ["Technical audit", "Success metrics", "Scoped brief & estimate"],
  },
  {
    n: "02",
    title: "Design",
    duration: "2–3 weeks",
    what: "Flows, interface prototypes and system design grow together, so what you approve is what can actually be built — at speed.",
    deliverables: ["Interactive prototype", "System architecture", "Interface system"],
  },
  {
    n: "03",
    title: "Build",
    duration: "4–12 weeks",
    what: "Weekly ships to real environments. You watch the product grow live — no big-bang reveals, no months of radio silence.",
    deliverables: ["Weekly releases", "Staging environment", "Demo + decision log"],
  },
  {
    n: "04",
    title: "Harden",
    duration: "1–2 weeks",
    what: "Load tests, observability, accessibility and failure drills. We break it on purpose so it doesn't break on your users.",
    deliverables: ["Load test report", "Dashboards & alerts", "A11y + perf audit"],
  },
  {
    n: "05",
    title: "Ship & operate",
    duration: "ongoing",
    what: "Production rollout with rollback plans, then monitoring and iteration. We stay on the pager for what we ship.",
    deliverables: ["Production deploy", "Runbooks", "SLA & on-call option"],
  },
];

export const stats = [
  { k: "40+", label: "projects shipped" },
  { k: "99.99%", label: "uptime maintained" },
  { k: "60ms", label: "median API latency" },
  { k: "11", label: "countries served" },
];

export const values = [
  {
    title: "Speed is the feature",
    body: "Fast software is respectful software. Every millisecond we shave is trust we earn back for you.",
  },
  {
    title: "Own the outcome",
    body: "We don't hand off tickets. We own problems end to end — from first whiteboard to 3 a.m. pager.",
  },
  {
    title: "Small ships fast",
    body: "A tight senior crew outpaces a crowded room. Fewer handoffs, faster decisions, better software.",
  },
  {
    title: "Boring reliability",
    body: "We get excited about systems so stable they're dull. Drama belongs in movies, not production.",
  },
];

export const faqs = [
  {
    q: "How do engagements start?",
    a: "With a conversation, then a paid discovery (1–2 weeks) that ends in a scoped brief, an estimate and a prototype direction. If we're not the right fit, the audit is still yours to keep.",
  },
  {
    q: "How big is the team?",
    a: "A tight senior core — more than four, fewer than you'd need a org chart for — backed by a deep bench of specialists we've shipped with for years. The crew scales to the work, not the invoice.",
  },
  {
    q: "What does it cost?",
    a: "Fixed-scope projects are priced after discovery. Retainers start at a quarter-time engineering pod. You'll never see an hourly rate surprise from us.",
  },
  {
    q: "Which stack do you work in?",
    a: "TypeScript, React/Next.js, Rust and Go on the backend, Postgres and the edge for infrastructure — but we choose per problem, not per preference. We've shipped in everything from Elixir to Elixir's exact opposite.",
  },
  {
    q: "Do you maintain what you build?",
    a: "Yes — that's the default, not an upsell. Every project ships with runbooks, monitoring and an SLA option. We're still on the pager for systems we built years ago.",
  },
];
