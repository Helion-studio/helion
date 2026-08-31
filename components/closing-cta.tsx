import { closingCta, site } from "@/lib/site";
import { ArrowRight, GitHubMark } from "@/components/icons";

export function ClosingCta() {
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent("Project enquiry")}`;

  return (
    <section id="contact" className="bg-navy">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 py-16 lg:flex-row lg:items-center lg:px-10 lg:py-20">
        <div>
          <h2 className="text-[clamp(1.5rem,3vw,2.125rem)] font-semibold tracking-[-0.025em] text-white">
            {closingCta.heading}
          </h2>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/60">
            {closingCta.body}
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <a
            href={mailto}
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-accent-deep"
          >
            {closingCta.primary.label}
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <a
            href={closingCta.secondary.href}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-white/[0.07]"
          >
            <GitHubMark className="size-4" />
            {closingCta.secondary.label}
          </a>
        </div>
      </div>
    </section>
  );
}
