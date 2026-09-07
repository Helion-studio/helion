import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Code2, ExternalLink } from "lucide-react";
import { Reveal, PageHead } from "@/components/reveal";
import { getProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected work by Top-notch Team — real-time platforms, developer tooling and performance rescues, with the numbers to back them.",
};

export const dynamic = "force-dynamic";

export default async function WorkPage() {
  const projects = await getProjects();

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

      <div className="mx-auto max-w-7xl px-5 pb-28 md:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 2) * 0.08}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0e15] transition-colors duration-300 hover:border-white/20">
                {/* thumbnail */}
                <Link href={`/work/${p.slug}`} className="relative block aspect-[16/10] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.thumbnail}
                    alt={`${p.name} — ${p.category}`}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0e15]/80 via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 rounded-full border border-white/15 bg-[#030508]/70 px-3 py-1 text-micro font-medium tracking-[0.08em] text-white/70 uppercase backdrop-blur-sm">
                    {p.type === "web" ? "Web" : "Software"}
                  </span>
                </Link>

                <div className="flex flex-1 flex-col p-8 md:p-9">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-mono text-micro tracking-[0.14em] text-arc uppercase">
                      {String(i + 1).padStart(2, "0")} — {p.year}
                    </span>
                    <span className="text-micro font-medium tracking-[0.1em] text-white/35 uppercase">
                      {p.category}
                    </span>
                  </div>

                  <h2 className="mt-4 font-display text-[1.75rem] leading-tight font-medium tracking-[-0.02em] text-white">
                    <Link href={`/work/${p.slug}`} className="transition-colors hover:text-accent">
                      {p.name}
                    </Link>
                  </h2>
                  <p className="mt-3 text-body leading-relaxed text-white/60">{p.blurb}</p>

                  <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/[0.07] pt-5">
                    {p.metrics.map((m) => (
                      <div key={m.label}>
                        <p className="font-display text-[1.3rem] leading-none font-medium text-white">
                          {m.k}
                        </p>
                        <p className="mt-1.5 text-micro tracking-[0.06em] text-white/40 uppercase">
                          {m.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* actions: embedded viewer for web, repo for everything */}
                  <div className="mt-6 flex flex-wrap gap-2.5 pt-1">
                    <Link
                      href={`/work/${p.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-4 py-2 font-display text-nav font-medium text-white transition-colors hover:border-arc/50 hover:text-accent"
                    >
                      {p.viewerUrl ? <ExternalLink className="size-3.5" /> : <Code2 className="size-3.5" />}
                      {p.viewerUrl ? "Live preview" : "Case file"}
                    </Link>
                    <a
                      href={p.repoUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-4 py-2 font-display text-nav font-medium text-white/60 transition-colors hover:border-white/25 hover:text-white"
                    >
                      <ArrowUpRight className="size-3.5" />
                      Repo
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </main>
  );
}
