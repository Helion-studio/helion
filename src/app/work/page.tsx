import type { Metadata } from "next";
import { Reveal, PageHead } from "@/components/reveal";
import { projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected work by Top-notch Team — real-time platforms, developer tooling and performance rescues, with the numbers to back them.",
};

export default function WorkPage() {
  return (
    <main className="flex-1 bg-void">
      <PageHead
        index="01"
        eyebrow="Work"
        title={
          <>
            Shipped, measured, <span className="font-medium">still running.</span>
          </>
        }
        lead="A selection of what we've built lately. Every project below is in production — and every number is one the client can verify."
      />

      <div className="mx-auto grid max-w-7xl gap-6 px-5 pb-28 md:grid-cols-2 md:px-8">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 2) * 0.08}>
            <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-[#0a0e15] p-8 transition-colors duration-300 hover:border-white/20 md:p-9">
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-mono text-micro tracking-[0.14em] text-arc uppercase">
                  {String(i + 1).padStart(2, "0")} — {p.year}
                </span>
                <span className="text-micro font-medium tracking-[0.1em] text-white/35 uppercase">
                  {p.category}
                </span>
              </div>

              <h2 className="mt-5 font-display text-[1.75rem] leading-tight font-medium tracking-[-0.02em] text-white">
                {p.name}
              </h2>
              <p className="mt-3 text-body leading-relaxed text-white/60">{p.blurb}</p>
              <p className="mt-3 text-body leading-relaxed text-white/45">{p.detail}</p>

              <div className="mt-7 grid grid-cols-3 gap-3 border-t border-white/[0.07] pt-6">
                {p.metrics.map((m) => (
                  <div key={m.label}>
                    <p className="font-display text-[1.35rem] leading-none font-medium text-white">
                      {m.k}
                    </p>
                    <p className="mt-1.5 text-micro tracking-[0.06em] text-white/40 uppercase">
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>

              <ul className="mt-6 flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <li
                    key={s}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-micro text-white/50"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </main>
  );
}
