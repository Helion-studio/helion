import { hero, site, specializations } from "@/lib/site";
import { SolarRing } from "@/components/solar-ring";
import { ArrowRight, GitHubMark } from "@/components/icons";

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-canvas">
      {/* ---------------- ambient background ---------------- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid mask-fade-b absolute inset-0 opacity-70" />
        <div className="absolute -top-[20%] right-[-12%] size-[840px] rounded-full bg-[radial-gradient(circle,rgba(30,85,254,0.07),transparent_62%)] blur-2xl" />
        <SolarRing className="mask-radial absolute left-[62%] top-1/2 hidden size-[980px] -translate-x-1/2 -translate-y-1/2 opacity-50 xl:block" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid items-center gap-14 pb-20 pt-[calc(72px+3rem)] lg:min-h-[100svh] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16 lg:pb-24 lg:pt-[calc(86px+3.5rem)]">
          {/* ---------------- copy ---------------- */}
          <div>
            <div
              className="rise inline-flex items-center gap-2.5 rounded-full border border-line bg-white/70 py-1.5 pl-3 pr-4 backdrop-blur-sm"
              style={{ animationDelay: "60ms" }}
            >
              <span className="pulse-dot size-1.5 rounded-full bg-accent" />
              <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted">
                {hero.eyebrow}
              </span>
              <span className="h-3 w-px bg-line-strong" />
              <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-subtle">
                {hero.availability}
              </span>
            </div>

            <h1 className="mt-7 text-[clamp(2.5rem,5.4vw,4.25rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-ink">
              <span className="rise block" style={{ animationDelay: "140ms" }}>
                {hero.headline[0]}
              </span>
              <span className="rise block" style={{ animationDelay: "220ms" }}>
                {hero.headline[1]}
              </span>
            </h1>

            <p
              className="rise mt-6 max-w-xl text-[17px] leading-relaxed text-muted"
              style={{ animationDelay: "300ms" }}
            >
              {hero.subhead}
            </p>

            <div
              className="rise mt-9 flex flex-col gap-3 sm:flex-row"
              style={{ animationDelay: "380ms" }}
            >
              <a
                href={hero.primaryCta.href}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-accent-deep"
              >
                {hero.primaryCta.label}
                <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href={hero.secondaryCta.href}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-line-strong bg-white px-7 py-3.5 text-sm font-medium text-ink transition-colors duration-200 hover:bg-canvas-alt"
              >
                <GitHubMark className="size-4" />
                {hero.secondaryCta.label}
              </a>
            </div>

            <p
              className="rise mt-5 flex items-center gap-2 text-[13px] text-subtle"
              style={{ animationDelay: "440ms" }}
            >
              <span className="size-1 rounded-full bg-accent/60" />
              We reply within 24 hours — NDA on request.
            </p>
          </div>

          {/* ---------------- specialisations card ---------------- */}
          <div id="specializations" className="rise w-full lg:justify-self-end" style={{ animationDelay: "320ms" }}>
            <div className="rounded-2xl border border-line bg-surface p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_18px_40px_-20px_rgba(16,24,40,0.18)] sm:p-7">
              <div className="flex items-baseline justify-between border-b border-line pb-4">
                <h2 className="text-[15px] font-semibold tracking-tight text-ink">
                  We specialize in
                </h2>
                <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-subtle">
                  0{specializations.length}
                </span>
              </div>

              <ul className="mt-5 grid gap-x-7 gap-y-5 sm:grid-cols-2">
                {specializations.map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-accent" />
                    <div>
                      <p className="text-[13.5px] font-semibold leading-snug text-ink">
                        {item.title}
                      </p>
                      <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <a
                href={site.repo.url}
                target="_blank"
                rel="noreferrer noopener"
                className="group mt-6 flex items-center justify-between gap-3 rounded-xl border border-line bg-canvas-alt px-4 py-3 transition-colors duration-200 hover:border-line-strong hover:bg-accent-soft"
              >
                <span className="flex items-center gap-2.5">
                  <GitHubMark className="size-4 text-ink" />
                  <span className="font-mono text-[12px] text-muted">{site.repo.handle}</span>
                </span>
                <ArrowRight className="size-3.5 text-subtle transition-transform duration-300 group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
