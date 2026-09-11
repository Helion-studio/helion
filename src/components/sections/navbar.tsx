"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";
import { site } from "@/lib/site";

/**
 * Mission-control nav — fixed 72px glass bar. Links muted → bright,
 * active route carries the cyan tick, ghost pill CTA. Hamburger on
 * mobile only (never on desktop).
 */
export function Navbar() {
  const rm = useReducedMotion();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <motion.header
      initial={rm ? false : { opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={rm ? { duration: 0 } : { delay: 0.15, duration: 0.6, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-[60] h-18 border-b border-white/[0.06] bg-[rgba(3,5,8,0.7)] backdrop-blur-[12px]"
    >
      <nav className="mx-auto flex h-full max-w-7xl items-center justify-between px-5 md:px-8">
        {/* logotype */}
        <Link href="/" className="flex items-center gap-2.5" aria-label="Notch Team — home">
          <Image src="/logo.png" alt="" width={28} height={28} className="h-7 w-7 object-contain" priority />
          <span className="font-display text-[0.95rem] font-medium tracking-tight text-white">
            Notch <span className="text-white/50">Team</span>
          </span>
        </Link>

        {/* center links — desktop only */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          {site.nav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`flex items-center gap-1.5 text-nav font-medium transition-colors duration-200 ${
                isActive(link.href) ? "text-white" : "text-white/40 hover:text-white"
              }`}
            >
              {isActive(link.href) && (
                <span aria-hidden className="size-1 rounded-full bg-energy" />
              )}
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          <Link
            href={site.cta.href}
            className="hidden rounded-full border border-white/10 px-4 py-2 font-display text-nav font-medium text-white transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.07] sm:inline-flex"
          >
            {site.cta.label}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex size-9 items-center justify-center rounded-full border border-white/10 text-white/70 transition-colors hover:text-white md:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {/* mobile panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-white/[0.06] bg-[rgba(3,5,8,0.92)] backdrop-blur-[12px] md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {site.nav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-nav font-medium transition-colors hover:bg-white/[0.05] hover:text-white ${
                    isActive(link.href) ? "text-white" : "text-white/60"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={site.cta.href}
                onClick={() => setOpen(false)}
                className="mt-2 rounded-full border border-white/10 px-4 py-2.5 text-center font-display text-nav font-medium text-white transition-colors hover:border-white/20 hover:bg-white/[0.07]"
              >
                {site.cta.label}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
