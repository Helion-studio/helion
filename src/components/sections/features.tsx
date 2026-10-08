"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { featureGroups, features, options, type FeatureGroup } from "@/lib/content";
import { Tactile } from "@/components/tactile";

/**
 * INFRASTRUCTURE — one section, two jobs (the hero's "View infrastructure"
 * and the nav's "Cloud servers" both land here): the option list, then the
 * included-by-default features with a group switcher. Text only, no art.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

const rise = (rm: boolean | null, delay: number) => ({
  initial: rm ? false : { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-8% 0px" },
  transition: rm ? { duration: 0 } : { delay, duration: 0.55, ease: EASE },
});

const animate = (rm: boolean | null) =>
  rm ? {} : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, ease: EASE } };

export function Infrastructure() {
  const rm = useReducedMotion();
  const [group, setGroup] = useState<FeatureGroup>("Hardware");
  const shown = features.filter((f) => f.group === group);

  return (
    <section id="infrastructure" className="relative py-24 md:py-28">
      <span id="features" aria-hidden className="absolute -top-24" />
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div {...rise(rm, 0)} className="max-w-2xl">
          <p className="eyebrow">Infrastructure</p>
          <h2 className="mt-4 font-display text-hero leading-[1.02] font-light tracking-[-0.03em] text-balance text-white">
            The essentials, <span className="font-medium">already included</span>
          </h2>
          <p className="mt-5 max-w-[50ch] text-pretty text-lead leading-relaxed text-white/60">
            Configurations calibrated for actual usage, automatic daily backup to protect the data,
            NVMe under everything — and one click to upgrade when your requirements move.
          </p>
        </motion.div>

        {/* group switcher */}
        <div className="mt-12 flex flex-wrap gap-2" role="tablist" aria-label="Feature groups">
          {featureGroups.map((g) => {
            const active = g === group;
            return (
              <button
                key={g}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setGroup(g)}
                className={`group-tab${active ? " is-on" : ""}`}
              >
                {g}
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((f, i) => (
            <motion.article key={f.title} {...animate(rm)} className="feature-card" style={{ animationDelay: `${i * 40}ms` }}>
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-[1.02rem] font-medium leading-snug tracking-[-0.01em] text-white">
                  {f.title}
                </h3>
                <span className={`tier-tag tier-tag--${f.tier}`}>{f.tier === "included" ? "Included" : "Optional"}</span>
              </div>
              <p className="mt-2.5 text-body leading-relaxed text-white/55">{f.body}</p>
            </motion.article>
          ))}
        </div>

        {/* paid options, so the "included" claim stays honest */}
        <motion.div {...rise(rm, 0.1)} className="mt-10">
          <p className="font-display text-micro font-medium tracking-[0.14em] text-white/35 uppercase">
            Add-ons
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {options.map((o) => (
              <div key={o.title} className="option-row">
                <div>
                  <h4 className="font-display text-body font-medium text-white">{o.title}</h4>
                  <p className="mt-1 text-micro leading-relaxed tracking-[0.02em] text-white/45">{o.body}</p>
                </div>
                <span className="font-mono text-micro whitespace-nowrap text-arc">{o.price}</span>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Tactile href="#plans" variant="ghost" className="!px-5 !py-2.5 !text-[0.8rem]">
              Back to the plans
              <ArrowUpRight className="size-3.5" />
            </Tactile>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
