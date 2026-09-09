import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

/** Site footer — brand, routes, contact, socials. */
export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-void">
      <div className="mx-auto max-w-7xl px-5 pt-12 md:px-8">
        <p
          aria-hidden
          className="font-display text-[clamp(2.4rem,9vw,6.5rem)] leading-none font-light tracking-tight text-white/[0.05] select-none"
        >
          TOP-NOTCH TEAM
        </p>
      </div>
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="" width={26} height={26} className="h-6.5 w-6.5 object-contain" />
            <span className="font-display text-sm font-semibold tracking-tight text-white">
              Top-notch <span className="text-white/50">Team</span>
            </span>
          </div>
          <p className="mt-4 max-w-sm text-body leading-relaxed text-white/50">
            {site.description}
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-3">
          <p className="font-display text-micro font-medium tracking-[0.14em] text-white/35 uppercase">
            Site
          </p>
          {site.nav.map((l) => (
            <Link key={l.href} href={l.href} className="text-body text-white/60 transition-colors hover:text-white">
              {l.label}
            </Link>
          ))}
          <Link href="/contact" className="text-body text-white/60 transition-colors hover:text-white">
            Contact
          </Link>
        </nav>

        <div className="flex flex-col gap-3">
          <p className="font-display text-micro font-medium tracking-[0.14em] text-white/35 uppercase">
            Reach us
          </p>
          <a
            href={`mailto:${site.email}`}
            className="text-body text-white/60 transition-colors hover:text-white"
          >
            {site.email}
          </a>
          <p className="text-body text-white/60">{site.location}</p>
          <div className="mt-2 flex gap-5">
            <a href={site.social.github} className="text-micro tracking-wide text-white/40 uppercase transition-colors hover:text-white">
              GitHub
            </a>
            <a href={site.social.x} className="text-micro tracking-wide text-white/40 uppercase transition-colors hover:text-white">
              X
            </a>
            <a href={site.social.linkedin} className="text-micro tracking-wide text-white/40 uppercase transition-colors hover:text-white">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-5 md:px-8">
          <p className="text-micro tracking-wide text-white/35">
            © {new Date().getFullYear()} {site.fullName}. All rights reserved.
          </p>
          <p className="text-micro tracking-wide text-white/35">
            Engineered in-house. No templates were harmed.
          </p>
        </div>
      </div>
    </footer>
  );
}
