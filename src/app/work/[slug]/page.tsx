import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Code2, ExternalLink, Play } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { getProject, getProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProject(slug);
  if (!p) return { title: "Work" };
  return { title: p.name, description: p.blurb };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await getProject(slug);
  if (!p) notFound();
  const others = (await getProjects()).filter((x) => x.slug !== p.slug).slice(0, 3);

  return (
    <main className="flex-1 bg-void">
      <div className="mx-auto max-w-7xl px-5 pt-32 pb-24 md:px-8 md:pt-40">
        <Reveal>
          <Link
            href="/work"
            className="inline-flex items-center gap-2 font-display text-nav font-medium text-white/50 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" />
            All work
          </Link>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-mono text-micro tracking-[0.14em] text-arc uppercase">
                {p.category} — {p.year}
              </p>
              <h1 className="mt-4 font-display text-hero leading-[0.98] font-light tracking-[-0.03em] text-white">
                {p.name}
              </h1>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <a
                href={p.repoUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 font-display text-nav font-medium text-white transition-colors hover:border-white/25"
              >
                <Code2 className="size-4" />
                View repository
                <ArrowUpRight className="size-3.5 text-white/50" />
              </a>
              {p.viewerUrl && (
                <a
                  href={p.viewerUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-display text-nav font-medium text-void transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(59,130,246,0.25)]"
                >
                  <ExternalLink className="size-4" />
                  Open full screen
                </a>
              )}
            </div>
          </div>

          <p className="mt-6 max-w-[62ch] text-lead leading-relaxed tracking-[-0.01em] text-white/65">
            {p.blurb}
          </p>
        </Reveal>

        {/* the project itself — embedded web viewer or repo-first presentation */}
        <Reveal delay={0.08}>
          <div className="mt-12">
            {p.viewerUrl ? (
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0e15]">
                <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-2.5">
                  <span className="flex gap-1.5">
                    <span className="size-2.5 rounded-full bg-white/10" />
                    <span className="size-2.5 rounded-full bg-white/10" />
                    <span className="size-2.5 rounded-full bg-white/10" />
                  </span>
                  <span className="ml-2 flex items-center gap-1.5 truncate font-mono text-micro text-white/40">
                    <Play className="size-3 text-energy" />
                    {p.name.toLowerCase().replace(/\s+/g, "-")}.topnotch.team
                  </span>
                  <span className="ml-auto rounded-full bg-energy/15 px-2.5 py-0.5 text-micro font-medium tracking-[0.08em] text-energy uppercase">
                    Live
                  </span>
                </div>
                <iframe
                  src={p.viewerUrl}
                  title={`${p.name} — live preview`}
                  loading="lazy"
                  className="h-[68vh] min-h-96 w-full bg-[#030508]"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.thumbnail}
                  alt={`${p.name} — ${p.category}`}
                  className="aspect-[16/10] w-full object-cover"
                />
                <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0a0e15] px-6 py-4">
                  <p className="text-body text-white/60">
                    {p.type === "software"
                      ? "This is a backend / software project — the code lives in the repository."
                      : "Live preview for this project is being wired up — visit the repo meanwhile."}
                  </p>
                  <a
                    href={p.repoUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-display text-nav font-medium text-void transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(59,130,246,0.25)]"
                  >
                    <Code2 className="size-4" />
                    Open the repository
                  </a>
                </div>
              </div>
            )}
          </div>
        </Reveal>

        {/* detail + metrics */}
        <div className="mt-16 grid gap-10 md:grid-cols-[1.5fr_1fr]">
          <Reveal>
            <div>
              <h2 className="font-display text-tag font-medium tracking-[0.14em] text-white/40 uppercase">
                What we did
              </h2>
              <p className="mt-5 max-w-[62ch] text-body leading-relaxed text-white/65">{p.detail}</p>
              <ul className="mt-7 flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <li
                    key={s}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 font-mono text-micro text-white/50"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-white/10 bg-[#0a0e15] p-8">
              <h2 className="font-display text-tag font-medium tracking-[0.14em] text-white/40 uppercase">
                By the numbers
              </h2>
              <div className="mt-6 space-y-6">
                {p.metrics.map((m) => (
                  <div key={m.label} className="border-b border-white/[0.07] pb-5 last:border-0 last:pb-0">
                    <p className="font-display text-[2rem] leading-none font-light tracking-[-0.02em] text-white">
                      {m.k}
                    </p>
                    <p className="mt-2 text-micro font-medium tracking-[0.1em] text-white/40 uppercase">
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* more work */}
        <Reveal>
          <div className="mt-20 border-t border-white/[0.07] pt-12">
            <h2 className="font-display text-tag font-medium tracking-[0.14em] text-white/40 uppercase">
              Next
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              {others.map((o) => (
                <Link
                  key={o.slug}
                  href={`/work/${o.slug}`}
                  className="group overflow-hidden rounded-xl border border-white/10 bg-[#0a0e15] transition-colors hover:border-white/25"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={o.thumbnail}
                      alt={`${o.name} — ${o.category}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3 px-4 py-3.5">
                    <div>
                      <p className="font-display text-[14px] font-semibold text-white">{o.name}</p>
                      <p className="mt-0.5 text-micro tracking-[0.06em] text-white/40 uppercase">
                        {o.year}
                      </p>
                    </div>
                    <ArrowUpRight className="size-4 text-white/30 transition-all duration-300 group-hover:rotate-45 group-hover:text-white" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
