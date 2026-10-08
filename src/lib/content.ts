/**
 * Store content — the plan matrix and the deploy flow. Spec-only by design:
 * no prices live here, so nothing drifts out of date with billing.
 */

export type Plan = {
  slug: string;
  tier: "nano" | "micro" | "core" | "titan";
  name: string;
  blurb: string;
  vcpu: string;
  ram: string;
  disk: string;
  transfer: string;
  image: string;
  popular?: boolean;
};

export const plans: Plan[] = [
  {
    slug: "nano",
    tier: "nano",
    name: "Nano",
    blurb: "Side projects, bots, that one cron job you keep promising to fix.",
    vcpu: "1 vCPU",
    ram: "1 GB RAM",
    disk: "20 GB NVMe",
    transfer: "1 Gbps port",
    image: "/vps/core.jpg",
  },
  {
    slug: "micro",
    tier: "micro",
    name: "Micro",
    blurb: "Staging, APIs, small sites that behave themselves under load.",
    vcpu: "2 vCPU",
    ram: "4 GB RAM",
    disk: "80 GB NVMe",
    transfer: "2 Gbps port",
    image: "/vps/rack.jpg",
  },
  {
    slug: "core",
    tier: "core",
    name: "Core",
    blurb: "Production apps, game servers, CI runners that never sit idle.",
    vcpu: "4 vCPU",
    ram: "8 GB RAM",
    disk: "160 GB NVMe",
    transfer: "4 Gbps port",
    image: "/vps/latency.jpg",
    popular: true,
  },
  {
    slug: "titan",
    tier: "titan",
    name: "Titan",
    blurb: "Traffic spikes, data-heavy backends, clusters you run yourself.",
    vcpu: "8 vCPU",
    ram: "32 GB RAM",
    disk: "640 GB NVMe",
    transfer: "10 Gbps port",
    image: "/vps/core.jpg",
  },
];

/** Specs shown as a compact grid on every card — order matters. */
export const specKeys = [
  { label: "vCPU", key: "vcpu" },
  { label: "Memory", key: "ram" },
  { label: "NVMe", key: "disk" },
  { label: "Network", key: "transfer" },
] as const;

export type FlowIcon = "cursor" | "bolt" | "globe";

export const flow: { title: string; body: string; icon: FlowIcon }[] = [
  {
    title: "Pick a size",
    body: "Four tiers, no sales call. Resize up whenever the traffic graph gets interesting.",
    icon: "cursor",
  },
  {
    title: "Deploy in ~40s",
    body: "Ubuntu, Debian, Alpine or your own image. Root keys land before the progress bar ends.",
    icon: "bolt",
  },
  {
    title: "Snapshots + private net",
    body: "Roll back in one click, and let your nodes talk to each other for free on the LAN.",
    icon: "globe",
  },
];

/** Included-with-every-plan strip under the cards. */
export const included = [
  "Full root access",
  "Hourly snapshots",
  "Free private LAN",
  "DDoS filtering",
  "NVMe on every tier",
  "No egress surprises",
];
