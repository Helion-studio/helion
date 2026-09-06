import type { Metadata } from "next";
import { Reveal, PageHead } from "@/components/reveal";
import { stats, values, faqs } from "@/lib/content";

export const metadata: Metadata = {
  title: "More",
  description:
    "Numbers, values and answers — the rest of what Top-notch Team is about.",
};

export default function MorePage() {
  return (
    <main className="flex-1 bg-void">
      <PageHead
        index="03"
        eyebrow="More"
        title={
          <>
            The numbers, the values, <span className="font-medium">the answers.</span>
          </>
        }
        lead="Everything that didn't fit on the other pages: how we measure ourselves, what we believe, and the questions clients ask before they sign."
      />

      {/* stats */}
      <section className="mx-auto max-w-7xl px-5 md:px-8" aria-label="Studio in numbers">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06} className="bg-[#0a0e15]">
              <div className="p-8 md:p-9">
                <p className="font-display text-[2.6rem] leading-none font-light tracking-[-0.02em] text-white">
                  {s.k}
                </p>
                <p className="mt-3 text-micro font-medium tracking-[0.1em] text-white/40 uppercase">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* values */}
      <section className="mx-auto max-w-7xl px-5 pt-24 md:px-8" aria-label="Values">
        <Reveal>
          <h2 className="flex items-center gap-3 font-display text-tag font-medium tracking-[0.14em] text-white/40 uppercase">
            <span className="font-mono text-arc">3.1</span>
            <span aria-hidden className="h-px w-10 bg-white/15" />
            What we believe
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={(i % 2) * 0.08}>
              <div className="h-full rounded-2xl border border-white/10 bg-[#0a0e15] p-8">
                <h3 className="font-display text-lead font-medium text-white">{v.title}</h3>
                <p className="mt-3 max-w-[46ch] text-body leading-relaxed text-white/60">{v.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* faq */}
      <section className="mx-auto max-w-7xl px-5 pt-24 pb-28 md:px-8" aria-label="Frequently asked questions">
        <Reveal>
          <h2 className="flex items-center gap-3 font-display text-tag font-medium tracking-[0.14em] text-white/40 uppercase">
            <span className="font-mono text-arc">3.2</span>
            <span aria-hidden className="h-px w-10 bg-white/15" />
            Asked before signing
          </h2>
        </Reveal>
        <div className="mt-8 divide-y divide-white/[0.07] rounded-2xl border border-white/10 bg-[#0a0e15]">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.04}>
              <details className="group p-6 md:p-8" {...(i === 0 ? { open: true } : {})}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-body font-medium text-white marker:hidden [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span
                    aria-hidden
                    className="flex size-7 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/50 transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-[64ch] text-body leading-relaxed text-white/60">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
