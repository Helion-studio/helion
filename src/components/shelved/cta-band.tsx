import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Magnetic } from "@/components/hero/magnetic";

/**
 * Closing statement — one big line, one glow, two ways forward.
 */
export function CtaBand() {
  return (
    <section className="relative overflow-hidden py-28 md:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-arc/[0.07] blur-3xl"
      />

      <div className="relative mx-auto max-w-3xl px-5 text-center md:px-8">
        <Reveal>
          <p className="eyebrow justify-center">04 — Start</p>
          <h2 className="mt-6 font-display text-hero font-light leading-[0.98] tracking-[-0.03em] text-balance">
            Have something ambitious?{" "}
            <span className="font-medium">Let&rsquo;s build it.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-[52ch] text-lead leading-relaxed text-white/60">
            Tell us what you&rsquo;re building. An actual engineer gets back to you — usually
            the same day.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Magnetic>
              <Link href="/contact" className="btn-primary">
                Start your project
                <ArrowRight className="size-4" />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href="/work" className="btn-ghost">
                See our work
                <ArrowUpRight className="size-4" />
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
