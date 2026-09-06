import type { Metadata } from "next";
import { Reveal, PageHead } from "@/components/reveal";
import { phases } from "@/lib/content";

export const metadata: Metadata = {
  title: "Process",
  description:
    "How Top-notch Team works — discover, design, build, harden, ship. Weekly releases, no big-bang reveals.",
};

export default function ProcessPage() {
  return (
    <main className="flex-1 bg-void">
      <PageHead
        index="02"
        eyebrow="Process"
        title={
          <>
            No big-bang reveals. <span className="font-medium">Weekly ships.</span>
          </>
        }
        lead="Five phases, each ending in something you can see, click or deploy. You always know exactly where the project stands — because you're watching it land."
      />

      <div className="mx-auto max-w-7xl px-5 pb-28 md:px-8">
        <ol className="relative border-l border-white/10 pl-6 md:pl-10">
          {phases.map((phase, i) => (
            <Reveal key={phase.n} delay={i * 0.05}>
              <li className="relative pb-14 last:pb-0">
                {/* node */}
                <span
                  aria-hidden
                  className="absolute top-1.5 -left-[31px] size-2.5 rounded-full bg-arc ring-4 ring-void md:-left-[47px]"
                />
                <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
                  <span className="font-mono text-micro tracking-[0.14em] text-arc">
                    PHASE {phase.n}
                  </span>
                  <h2 className="font-display text-section leading-none font-medium tracking-[-0.02em] text-white">
                    {phase.title}
                  </h2>
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-micro font-medium tracking-[0.08em] text-white/45 uppercase">
                    {phase.duration}
                  </span>
                </div>
                <p className="mt-4 max-w-[62ch] text-body leading-relaxed text-white/60">
                  {phase.what}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2.5">
                  {phase.deliverables.map((d) => (
                    <li
                      key={d}
                      className="rounded-lg border border-white/10 bg-[#0a0e15] px-3.5 py-2 text-micro font-medium tracking-[0.04em] text-white/60"
                    >
                      {d}
                    </li>
                  ))}
                </ul>
              </li>
            </Reveal>
          ))}
        </ol>

        <Reveal>
          <div className="mt-8 rounded-2xl border border-white/10 bg-[#0a0e15] p-8 md:p-10">
            <p className="font-display text-tag font-medium tracking-[0.14em] text-white/40 uppercase">
              The rule behind all five
            </p>
            <p className="mt-4 max-w-[56ch] font-display text-lead leading-relaxed font-light text-white/80">
              Nothing is "almost ready" for longer than a week. If we can't show it running, we
              don't talk about it — we go quiet, build, and show you on Friday.
            </p>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
