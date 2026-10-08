"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check, Copy } from "lucide-react";
import { flow, included, plans, specKeys, type Plan } from "@/lib/content";
import { Lottie, makeAnim, popScale, pulseOpacity } from "@/components/lottie";
import { Tactile } from "@/components/tactile";

/**
 * THE STORE — everything that replaced the eight "What We Build" rows and
 * the Custom Ecosystems block. Four spec-only cards (no prices to keep
 * honest), a three-beat deploy flow on hand-written lottie, and the
 * included-with-every-node strip. Deliberately compact: one screen of
 * decisions, not a brochure.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

const rise = (rm: boolean | null, delay: number) => ({
  initial: rm ? false : { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-8% 0px" },
  transition: rm ? { duration: 0 } : { delay, duration: 0.6, ease: EASE },
});

/** pointer spotlight + a whisper of tilt; both are transform/opacity only */
function useCardTilt<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const rm = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || rm) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty("--gx", `${((nx + 0.5) * 100).toFixed(1)}%`);
      el.style.setProperty("--gy", `${((ny + 0.5) * 100).toFixed(1)}%`);
      el.style.setProperty("--tilt", `${(-ny * 3.4).toFixed(2)}deg`);
      el.style.setProperty("--tilt-y", `${(nx * 4.2).toFixed(2)}deg`);
      el.classList.add("is-lit");
    };
    const leave = () => {
      el.classList.remove("is-lit");
      el.style.setProperty("--tilt", "0deg");
      el.style.setProperty("--tilt-y", "0deg");
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [rm]);

  return ref;
}

function PlanCard({ plan, i }: { plan: Plan; i: number }) {
  const ref = useCardTilt<HTMLElement>();
  const rm = useReducedMotion();
  const [deployed, setDeployed] = useState(false);

  // the "deployed" beat is a 3-frame state, not an animation — cheap and final
  useEffect(() => {
    if (!deployed) return;
    const t = setTimeout(() => setDeployed(false), 2600);
    return () => clearTimeout(t);
  }, [deployed]);

  return (
    <motion.article
      {...rise(rm, i * 0.07)}
      ref={ref}
      id={plan.slug}
      aria-label={`${plan.name} plan`}
      className={`plan-card${plan.popular ? " plan-card--hot" : ""}`}
    >
      <div className="plan-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={plan.image} alt="" loading="lazy" decoding="async" className="plan-img" />
        <span aria-hidden className="plan-media-fade" />
        {plan.popular && (
          <span className="plan-badge">
            <span aria-hidden className="animate-pulse-dot size-1.5 rounded-full bg-energy" />
            Most deployed
          </span>
        )}
      </div>

      <div className="plan-body">
        <header className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-[1.35rem] font-medium tracking-[-0.02em] text-white">
            {plan.name}
          </h3>
          <span className="font-mono text-micro tracking-[0.14em] text-arc uppercase">
            {plan.tier}
          </span>
        </header>

        <p className="mt-2 text-body leading-relaxed text-white/55">{plan.blurb}</p>

        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">
          {specKeys.map((s) => (
            <div key={s.key} className="plan-spec">
              <dt>{s.label}</dt>
              <dd>{plan[s.key]}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex items-center gap-2">
          <Tactile
            variant={plan.popular ? "primary" : "ghost"}
            onClick={() => setDeployed(true)}
            className="flex-1 justify-center"
          >
            {deployed ? (
              <>
                Spinning up
                <Check className="size-4" />
              </>
            ) : (
              <>
                Deploy {plan.name}
                <ArrowRight className="size-4" />
              </>
            )}
          </Tactile>
        </div>
      </div>
    </motion.article>
  );
}

/** three small generated lottie files — swap for real exports via `src` */
const flowAnims = [
  makeAnim(90, [{ nm: "ring", o: pulseOpacity(90) }, { nm: "dot", o: pulseOpacity(90), s: popScale(90) }]),
  makeAnim(90, [{ nm: "bolt", o: pulseOpacity(90), s: popScale(90) }, { nm: "halo", o: pulseOpacity(90) }]),
  makeAnim(90, [{ nm: "globe", o: pulseOpacity(90) }, { nm: "node", o: pulseOpacity(90), s: popScale(90) }]),
];

export function Plans() {
  const rm = useReducedMotion();

  return (
    <section id="plans" className="relative overflow-hidden py-24 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-[360px] w-[760px] -translate-x-1/2 rounded-full bg-arc/[0.07] blur-3xl"
      />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <motion.div {...rise(rm, 0)} className="max-w-2xl">
          <p className="eyebrow">
            <span className="font-mono text-arc">02</span> Plans
          </p>
          <h2 className="mt-4 font-display text-hero leading-[1] font-light tracking-[-0.03em] text-balance text-white">
            Root access. <span className="font-medium">NVMe. No ceremony.</span>
          </h2>
          <p className="mt-5 max-w-[46ch] text-pretty text-lead leading-relaxed text-white/60">
            Four sizes, billed by the hour, live in about forty seconds. Pick the one that
            matches today&rsquo;s load — resizing is a button, not a support ticket.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {plans.map((p, i) => (
            <PlanCard key={p.slug} plan={p} i={i} />
          ))}
        </div>

        <motion.ul
          {...rise(rm, 0.1)}
          className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3"
          aria-label="Included with every node"
        >
          {included.map((item) => (
            <li key={item} className="flex items-center gap-2 text-micro tracking-[0.06em] text-white/50 uppercase">
              <Check className="size-3.5 text-arc" />
              {item}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

/** Deploy flow — the lottie block that replaces the old process page. */
export function Flow() {
  const rm = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const cmd = "ssh root@node.dannystore.dev";

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopied(true);
    } catch {
      /* clipboard blocked (http preview, permissions) — select instead */
      setCopied(false);
    }
  };

  return (
    <section id="flow" className="relative py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-center">
          <motion.div {...rise(rm, 0)}>
            <p className="eyebrow">
              <span className="font-mono text-arc">03</span> Flow
            </p>
            <h2 className="mt-4 font-display text-section leading-[1.05] font-light tracking-[-0.025em] text-white">
              Console to <span className="font-medium">command line</span> in one breath
            </h2>
            <p className="mt-5 max-w-[44ch] text-pretty text-body leading-relaxed text-white/55">
              No invoice approvals, no provisioning queue. The key pair lands the moment the
              hypervisor starts the box.
            </p>

            <div className="term mt-7">
              <div className="flex items-center gap-2.5">
                <span aria-hidden className="size-2 rounded-full bg-energy/80" />
                <code className="font-mono text-micro tracking-[0.02em] text-white/70">{cmd}</code>
                <button
                  type="button"
                  onClick={copy}
                  className="term-copy ml-auto inline-flex items-center gap-1.5"
                  aria-label={copied ? "Copied" : "Copy the command"}
                >
                  {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="mt-2.5 font-mono text-micro leading-relaxed text-arc/90">
                {copied ? "# node reachable · 14 ms to gateway" : "# press ⏎ — instance is yours"}
              </p>
            </div>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-3">
            {flow.map((step, i) => (
              <motion.div
                key={step.title}
                {...rise(rm, 0.06 * (i + 1))}
                className="flow-step"
              >
                <Lottie
                  data={flowAnims[i]}
                  label={`${step.title} animation`}
                  className={`flow-lottie flow-lottie--${step.icon}`}
                />
                <span className="font-mono text-micro tracking-[0.14em] text-white/35">
                  0{i + 1}
                </span>
                <h3 className="mt-2 font-display text-[1.05rem] font-medium tracking-[-0.01em] text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-body leading-relaxed text-white/55">{step.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Final CTA — same chrome orb as before, now pointed at the store. */
export function FinalCta() {
  const rm = useReducedMotion();
  return (
    <section id="start" className="relative overflow-hidden py-24 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-[380px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-arc/[0.09] blur-3xl"
      />
      <div className="relative mx-auto max-w-3xl px-5 md:px-8">
        <motion.div {...rise(rm, 0)}>
          <div className="glass-panel mx-auto max-w-2xl p-9 text-center md:p-12">
            <span aria-hidden className="orb mx-auto size-12" />
            <p className="eyebrow mt-7 justify-center">04 — Start</p>
            <h2 className="mt-4 font-display text-hero font-light leading-[1] tracking-[-0.03em] text-balance">
              Your node is <span className="font-medium">40 seconds away</span>
            </h2>
            <p className="mx-auto mt-5 max-w-[46ch] text-lead leading-relaxed text-white/60">
              Spin one up, break it, spin another. Everything is disposable on purpose —
              that is what a server should be.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Tactile href="/#plans">
                Choose a plan
                <ArrowRight className="size-4" />
              </Tactile>
              <Tactile href="mailto:hello@dannystore.dev" variant="ghost">
                Talk to an engineer
              </Tactile>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
