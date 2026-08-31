import { hero } from "@/lib/site";
import { DeviceMockups } from "@/components/device-mockups";
import { ArrowRight, GitHubMark, Icon } from "@/components/icons";
import { btnGhost, btnPrimary } from "@/components/ui";

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-canvas">
      {/* ---------------- ambient background ---------------- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid mask-fade-b absolute inset-0 opacity-60" />
        <div className="absolute -top-[22%] right-[-10%] size-[820px] rounded-full bg-[radial-gradient(circle,rgba(30,85,254,0.07),transparent_62%)] blur-2xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* asymmetric two-column split, ~45 / 55 */}
        <div className="grid items-center gap-16 pb-20 pt-[calc(72px+3.5rem)] lg:grid-cols-[minmax(0,45fr)_minmax(0,55fr)] lg:gap-12 lg:pb-28 lg:pt-[calc(86px+4.5rem)]">
          {/* ---------------- LEFT: content ---------------- */}
          <div>
            {/* micro-label */}
            <div className="rise inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2">
              <span aria-hidden="true" className="text-[13px] leading-none">
                {hero.microLabel.emoji}
              </span>
              <span className="text-[13px] text-muted">{hero.microLabel.text}</span>
            </div>

            {/* two-tone stacked headline */}
            <h1 className="mt-6 text-[clamp(2.5rem,5vw,4rem)] leading-[1.06] tracking-[-0.035em]">
              <span className="rise block font-semibold text-accent" style={{ animationDelay: "80ms" }}>
                {hero.headline.lead}
              </span>
              <span
                className="rise block font-extrabold text-ink"
                style={{ animationDelay: "160ms" }}
              >
                {hero.headline.tail}
              </span>
            </h1>

            {/* subheadline — shorter line length */}
            <p
              className="rise mt-6 max-w-lg text-[17px] leading-relaxed text-muted"
              style={{ animationDelay: "240ms" }}
            >
              {hero.subhead}
            </p>

            {/* dual-action button row */}
            <div
              className="rise mt-9 flex flex-col gap-3 sm:flex-row"
              style={{ animationDelay: "320ms" }}
            >
              <a href={hero.primaryCta.href} className={`group ${btnPrimary}`}>
                {hero.primaryCta.label}
                <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href={hero.secondaryCta.href}
                target="_blank"
                rel="noreferrer noopener"
                className={btnGhost}
              >
                <GitHubMark className="size-4" />
                {hero.secondaryCta.label}
              </a>
            </div>

            {/* trust / feature-tease row */}
            <ul
              className="rise mt-10 grid grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-4"
              style={{ animationDelay: "400ms" }}
            >
              {hero.trust.map((item) => (
                <li key={item.title}>
                  <div className="flex size-9 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    <Icon name={item.icon} className="size-[18px]" />
                  </div>
                  <p className="mt-2.5 text-[13px] font-semibold leading-snug text-ink">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[11.5px] leading-snug text-muted">
                    {item.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* ---------------- RIGHT: layered device mockups ---------------- */}
          <div className="rise" style={{ animationDelay: "300ms" }}>
            <DeviceMockups />
          </div>
        </div>
      </div>
    </section>
  );
}
