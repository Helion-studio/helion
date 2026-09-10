import { Reveal } from "@/components/reveal";
import { stats } from "@/lib/content";

/**
 * Track record — big numbers on thin rules (no cards), lit from above.
 */
export function StatsBand() {
  return (
    <section aria-label="Track record" className="relative py-24 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 h-[380px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-arc/[0.05] blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <p className="eyebrow">
            <span className="font-mono text-arc">03</span> Track record
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.07}>
              <div className="border-l border-white/10 pl-6">
                <p className="font-display text-[clamp(2.4rem,5vw,3.4rem)] leading-none font-light tracking-[-0.02em] text-white">
                  {s.k}
                </p>
                <p className="mt-3 text-micro font-medium tracking-[0.1em] text-white/40 uppercase">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
