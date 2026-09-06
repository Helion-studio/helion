import type { Metadata } from "next";
import { PageHead, Reveal } from "@/components/reveal";
import { ContactForm } from "@/components/contact-form";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a project with Top-notch Team — tell us what you're building.",
};

export default function ContactPage() {
  return (
    <main className="flex-1 bg-void">
      <PageHead
        index="04"
        eyebrow="Contact"
        title={
          <>
            Tell us what you're <span className="font-medium">building.</span>
          </>
        }
        lead="The more context you give, the sharper our first answer. We reply within one business day — usually much faster."
      />

      <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-28 md:grid-cols-[1.5fr_1fr] md:px-8">
        <Reveal>
          <div className="rounded-2xl border border-white/10 bg-[#0a0e15] p-8 md:p-10">
            <ContactForm />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex h-full flex-col gap-8">
            <div className="rounded-2xl border border-white/10 bg-[#0a0e15] p-8">
              <p className="font-display text-tag font-medium tracking-[0.14em] text-white/40 uppercase">
                Direct
              </p>
              <a
                href={`mailto:${site.email}`}
                className="mt-4 block font-display text-lead font-medium text-white transition-colors hover:text-accent"
              >
                {site.email}
              </a>
              <p className="mt-3 text-body text-white/55">{site.location}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#0a0e15] p-8">
              <p className="font-display text-tag font-medium tracking-[0.14em] text-white/40 uppercase">
                Response time
              </p>
              <p className="mt-4 font-display text-[2.4rem] leading-none font-light text-white">
                &lt; 24h
              </p>
              <p className="mt-3 text-body leading-relaxed text-white/55">
                Every message lands in front of an engineer — not a funnel.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
