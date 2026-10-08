/**
 * Store content — the plan matrix and the marketing sections.
 *
 * ⚠️ PRICES ARE PLACEHOLDERS. They were lifted straight from the OVHcloud
 * VPS page we use as copy/structure reference, so the cards look real while
 * you build. Delete the `price` string (or set it to "") and the card falls
 * back to showing the range name instead — nothing else breaks.
 */

export type Plan = {
  slug: string;
  name: string;
  price: string;
  period: string;
  vcores: string;
  ram: string;
  storage: string;
  backup: string;
  traffic: string;
  bandwidth: string;
};

export const range = "VPS 2027";

/** Which badge the year chip shows, and where the "New" pill points. */
export const plansIntro =
  "Choose the configuration that fits your needs — web hosting, gaming, VPN, development and more.";

export const plans: Plan[] = [
  {
    slug: "vps-1",
    name: "VPS-1",
    price: "$4.54",
    period: "/month",
    vcores: "2 vCores",
    ram: "4 GB RAM",
    storage: "40 GB SSD NVMe",
    backup: "Daily backup of the previous 24 hours",
    traffic: "Unlimited traffic",
    bandwidth: "500 Mbps public bandwidth",
  },
  {
    slug: "vps-2",
    name: "VPS-2",
    price: "$8.50",
    period: "/month",
    vcores: "4 vCores",
    ram: "8 GB RAM",
    storage: "75 GB SSD NVMe",
    backup: "Daily backup of the previous 24 hours",
    traffic: "Unlimited traffic",
    bandwidth: "1 Gbps public bandwidth",
  },
  {
    slug: "vps-3",
    name: "VPS-3",
    price: "$12.32",
    period: "/month",
    vcores: "6 vCores",
    ram: "12 GB RAM",
    storage: "100 GB SSD NVMe",
    backup: "Daily backup of the previous 24 hours",
    traffic: "Unlimited traffic",
    bandwidth: "2 Gbps public bandwidth",
  },
  {
    slug: "vps-4",
    name: "VPS-4",
    price: "$23.37",
    period: "/month",
    vcores: "8 vCores",
    ram: "24 GB RAM",
    storage: "200 GB SSD NVMe",
    backup: "Daily backup of the previous 24 hours",
    traffic: "Unlimited traffic",
    bandwidth: "3 Gbps public bandwidth",
  },
];

/** Spec checklist on every card — order matters. */
export const specKeys = [
  { key: "vcores" },
  { key: "ram" },
  { key: "storage" },
  { key: "backup" },
  { key: "traffic" },
  { key: "bandwidth" },
] as const;

/** Hero stat row — small, quiet, under the buttons. */
export const heroStats = ["99.99% uptime", "NVMe storage", "24/7 support"] as const;

/** "the essentials included" pillars. */
export const pillars = [
  { title: "Performance at the right price", body: "Configurations calibrated for real usage — you pay for capacity, not for a logo." },
  { title: "Isolated environment", body: "Your vCores and RAM are yours. No noisy neighbour decides how your app answers." },
  { title: "Scalable configuration", body: "More resources in one click, no service disruption, no data migration." },
  { title: "Advanced management", body: "Control panel, API, and an integrated KVM console when SSH is not enough." },
] as const;

export type FeatureGroup = "Hardware" | "Software" | "Network & IP" | "Services";

export const featureGroups: FeatureGroup[] = ["Hardware", "Software", "Network & IP", "Services"];

type Feature = { title: string; body: string; group: FeatureGroup; tier: "included" | "optional" };

export const features: Feature[] = [
  { title: "1-click scaling", body: "Add VPS resources instantly with no service disruption or migration.", group: "Hardware", tier: "included" },
  { title: "Ultra-fast NVMe storage", body: "NVMe on every plan — up to 6× faster than standard SSDs.", group: "Hardware", tier: "included" },
  { title: "Daily automatic backup", body: "Backed up every day on a rolling 7-day basis; restore is one click.", group: "Hardware", tier: "included" },
  { title: "Premium backup option", body: "7-day restore and external storage, for data you cannot afford to re-create.", group: "Hardware", tier: "optional" },

  { title: "Any OS you want", body: "Linux, Windows, BSD and the usual distributions, in a few clicks.", group: "Software", tier: "included" },
  { title: "Anti-DDoS included", body: "Mitigation runs continuously and never asks your services to pause.", group: "Software", tier: "included" },
  { title: "Integrated panels", body: "Plesk or cPanel when you would rather manage sites from a GUI.", group: "Software", tier: "optional" },
  { title: "Panel + API", body: "Do it in the interface or script it — the same actions, both ways.", group: "Software", tier: "included" },

  { title: "Unlimited traffic", body: "No metered egress surprises at the end of the month.", group: "Network & IP", tier: "included" },
  { title: "Dedicated IPv4", body: "A unique address for compatibility and clean DNS.", group: "Network & IP", tier: "included" },
  { title: "Native IPv6", body: "Ready for the networks your users are already on.", group: "Network & IP", tier: "included" },
  { title: "Additional IPs", body: "Keep services separate on a single VPS when you need isolation.", group: "Network & IP", tier: "optional" },

  { title: "Monitoring", body: "CPU, RAM and network status for every VPS, in the panel.", group: "Services", tier: "included" },
  { title: "99.99% SLA", body: "Guaranteed availability, written down, not a vibe.", group: "Services", tier: "included" },
  { title: "Data protection", body: "Certified datacentres, GDPR-compliant, outside extraterritorial reach.", group: "Services", tier: "included" },
  { title: "Humans on support", body: "Phone and email, plus guides and an active community.", group: "Services", tier: "included" },
];

/** Options block, OVH-style: what is free and what costs extra. */
export const options = [
  { title: "Standard automatic backup", body: "Effortlessly protect your data every day.", price: "Included" },
  { title: "Premium automatic backup", body: "Rolling 7-day restore, external storage.", price: "From $1.40 /month" },
  { title: "Snapshots", body: "Back up and restore at any moment, on demand.", price: "From $0.40 /month" },
] as const;
