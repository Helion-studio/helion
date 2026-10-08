"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check, ShoppingCart } from "lucide-react";
import { pillars, plans, range, plansIntro, specKeys, type Plan } from "@/lib/content";
import { site } from "@/lib/site";
import { Tactile } from "@/components/tactile";

/**
 * THE STORE — plan cards in the OVH layout (year chip → name → From price →
 * Configure → spec checklist), with one addition on top: press a card and it
 * tells you which configuration it would open. That is the whole "responsive"
 * ask, kept to a state flip instead of an animation loop.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

const rise = (rm: boolean | null, delay: number) => ({
  initial: rm ? false : { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-8% 0px" },
  transition: rm ? { duration: 0 } : { delay, duration: 0.55, ease: EASE },
});

function PlanCard({ plan, i }: { plan: Plan; i: number }) {
  const rm = useReducedMotion();
  const [pending, setPending] = useState(false);

  return (
    <motion.article {...rise(rm, i * 0.06)} id={plan.slug} className="vps-card" aria-label={`${plan.name} plan`}>
      <div className="vps-card__top">
        <span className="vps-chip">{range}</span>
        <h3 className="mt-4 font-display text-[1.75rem] font-medium leading-none tracking-[-0.02em] text-white">
          {plan.name}
        </h3>

        <p className="mt-5 font-display text-tag font-medium tracking-[0.12em] text-white/45 uppercase">
          From
        </p>
        <p className="mt-1 flex items-baseline gap-1.5">
          {plan.price ? (
            <>
              <span className="font-display text-[2rem] font-semibold leading-none tracking-[-0.02em] text-arc">
                {plan.price}
              </span>
              <span className="text-body text-white/45">{plan.period}</span>
            </>
          ) : (
            <span className="font-display text-[1.35rem] font-medium leading-none text-white/80">{range}</span>
          )}
        </p>

        <Tactile
          variant="configure"
          onClick={() => setPending(true)}
          className="mt-6 w-full justify-center"
          ariaLabel={`Configure ${plan.name}`}
        >
          {pending ? (
            <>
              {plan.name} · opening configurator
              <Check className="size-4" />
            </>
          ) : (
            <>
              <ShoppingCart className="size-4" />
              Configure
            </>
          )}
        </Tactile>
      </div>

      <ul className="vps-specs" aria-label={`${plan.name} included`}>
        {specKeys.map((s) => (
          <li key={s.key}>
            <Check className="size-4 shrink-0 text-arc" />
            <span>{plan[s.key]}</span>
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

export function Plans() {
  const rm = useReducedMotion();

  return (
    <section id="plans" className="relative overflow-hidden py-24 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-28 left-1/2 h-[340px] w-[720px] -translate-x-1/2 rounded-full bg-arc/[0.06] blur-3xl"
      />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <motion.div {...rise(rm, 0)} className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-hero leading-[1.02] font-light tracking-[-0.03em] text-balance text-white">
            {range}
          </h2>
          <p className="mx-auto mt-5 max-w-[52ch] text-pretty text-lead leading-relaxed text-white/60">
            {plansIntro}
          </p>
        </motion.div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {plans.map((p, i) => (
            <PlanCard key={p.slug} plan={p} i={i} />
          ))}
        </div>

        <motion.div {...rise(rm, 0.12)} className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="pillar">
              <h3 className="font-display text-[1.05rem] font-medium tracking-[-0.01em] text-white">
                {pillar.title}
              </h3>
              <p className="mt-2 text-body leading-relaxed text-white/55">{pillar.body}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/** Final CTA — same chrome orb, pointed at the plan grid. */
export function FinalCta() {
  const rm = useReducedMotion();
  return (
    <section id="start" className="relative overflow-hidden py-24 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-[360px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-arc/[0.08] blur-3xl"
      />
      <div className="relative mx-auto max-w-3xl px-5 md:px-8">
        <motion.div {...rise(rm, 0)}>
          <div className="glass-panel mx-auto max-w-2xl p-9 text-center md:p-12">
            <span aria-hidden className="orb mx-auto size-12" />
            <p className="eyebrow mt-7 justify-center">Ready when you are</p>
            <h2 className="mt-4 font-display text-hero font-light leading-[1] tracking-[-0.03em] text-balance">
              Pick a size. <span className="font-medium">Boot it now.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-[46ch] text-lead leading-relaxed text-white/60">
              Daily backups, unlimited traffic and anti-DDoS are already in the price. Cancel or
              scale in one click — nothing here needs a support ticket.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Tactile href="/#plans">
                Explore VPS plans
                <ArrowRight className="size-4" />
              </Tactile>
              <Tactile href={`mailto:${site.email}`} variant="ghost">
                Contact sales
              </Tactile>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
