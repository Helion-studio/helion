import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  CloudCog,
  Gamepad2,
  MonitorSmartphone,
  ServerCog,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/reveal";
import { ModelPane } from "@/components/3d/model-pane";
import { services, type Service } from "@/lib/content";

/**
 * SERVICES — "What We Build". Text and image alternate sides every row
 * (never the same place twice); images are rim-lit 3D panes. Ends with
 * the Custom Ecosystems open layer and the final call to action.
 */

const ICONS: Record<Service["icon"], LucideIcon> = {
  game: Gamepad2,
  cloud: CloudCog,
  server: ServerCog,
  frontend: MonitorSmartphone,
  ai: BrainCircuit,
  data: BarChart3,
  security: ShieldCheck,
  custom: Wrench,
};

function ServiceRow({ s, i }: { s: Service; i: number }) {
  const Icon = ICONS[s.icon];
  const flip = i % 2 === 1; // alternate sides — no row repeats a layout
  const isCustom = s.icon === "custom";

  return (
    <Reveal>
      <div
        id={s.slug}
        className={`group/row relative grid items-center gap-8 py-14 md:gap-14 lg:grid-cols-2 lg:py-20`}
      >
        {/* ghost numeral behind the text — editorial rhythm */}
        <span
          aria-hidden
          className={`ghost-index font-display ${flip ? "lg:order-2" : "lg:order-1"}`}
        >
          {String(i + 1).padStart(2, "0")}
        </span>

        {/* text — left or right, alternating */}
        <div className={`relative ${flip ? "lg:order-2" : "lg:order-1"}`}>
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-[#9ccbff] transition-colors duration-300 group-hover/row:border-arc/40 group-hover/row:text-white">
              <Icon className="size-5" />
            </span>
            <span className="font-mono text-micro tracking-[0.14em] text-arc uppercase">
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>
          <h3 className="mt-5 font-display text-[clamp(1.5rem,2.6vw,2.1rem)] leading-tight font-medium tracking-[-0.02em] text-white">
            {s.title}
          </h3>
          <p className="mt-2 font-display text-lead font-light text-[#9ccbff]/90">{s.tagline}</p>
          <p className="mt-4 max-w-[50ch] text-pretty text-body leading-relaxed text-white/60">
            {s.body}
          </p>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Ecosystem">
            {s.ecosystem.map((e) => (
              <li key={e} className="chip">
                {e}
              </li>
            ))}
          </ul>
        </div>

        {/* visual — opposite the text (3D for car + server, image otherwise) */}
        <div className={flip ? "lg:order-1" : "lg:order-2"}>
          {s.slug === "game-development" ? (
            <ModelPane kind="car" label={`${s.title} — live 3D`} />
          ) : s.slug === "backend-baas" ? (
            <ModelPane kind="server" label={`${s.title} — live 3D`} />
          ) : (
            <div className="group pane-3d aspect-[16/10]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.image}
                alt={`${s.title} — ${s.tagline}`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </div>
          )}
        </div>
      </div>
    </Reveal>
  );
}

export function Services() {
  const main = services.filter((s) => s.icon !== "custom");
  const custom = services.find((s) => s.icon === "custom")!;

  return (
    <section id="services" aria-label="Our services" className="relative overflow-hidden py-24 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-arc/[0.05] blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <p className="eyebrow">
            <span className="font-mono text-arc">02</span> Services
          </p>
          <h2 className="mt-5 max-w-2xl font-display text-hero leading-[1.0] font-light tracking-[-0.03em] text-white">
            What We <span className="font-medium">Build</span>
          </h2>
          <p className="mt-6 max-w-[54ch] text-pretty text-lead leading-relaxed text-white/60">
            We deliver robust development, infrastructure, and security solutions across the
            entire tech ecosystem.
          </p>
        </Reveal>

        <div className="mt-8 md:mt-14">
          {main.map((s, i) => (
            <div key={s.slug}>
              <div aria-hidden className="row-rule" />
              <ServiceRow s={s} i={i} />
            </div>
          ))}
          <div aria-hidden className="row-rule" />
          <ServiceRow s={custom} i={main.length} />
        </div>
      </div>
    </section>
  );
}

/** Final call to action — the last word before the footer. */
export function FinalCta() {
  return (
    <section className="relative overflow-hidden py-28 md:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-arc/[0.07] blur-3xl"
      />
      <div className="relative mx-auto max-w-3xl px-5 md:px-8">
        <Reveal>
          <div className="glass-panel mx-auto max-w-2xl p-10 text-center md:p-14">
            <span aria-hidden className="orb mx-auto size-14" />
            <p className="eyebrow mt-8 justify-center">03 — Start</p>
            <h2 className="mt-5 font-display text-hero font-light leading-[0.98] tracking-[-0.03em] text-balance">
              Ready to engineer <span className="font-medium">your ambition?</span>
            </h2>
            <p className="mx-auto mt-6 max-w-[52ch] text-lead leading-relaxed text-white/60">
              Let&rsquo;s discuss your project requirements and build something built to last.
            </p>
            <div className="mt-10 flex justify-center">
              <Link href="/contact" className="btn-primary">
                Schedule a Consultation
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
