"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Menu, X } from "lucide-react";

/* lucide-react removed brand icons, so the GitHub mark is inlined. */
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 .5C5.73.5.99 5.24.99 11.51c0 4.87 3.16 9 7.54 10.46.55.1.75-.24.75-.53l-.01-1.86c-3.07.67-3.72-1.48-3.72-1.48-.5-1.28-1.23-1.62-1.23-1.62-1-.69.08-.67.08-.67 1.11.08 1.69 1.14 1.69 1.14.99 1.69 2.6 1.2 3.23.92.1-.72.39-1.2.7-1.48-2.45-.28-5.03-1.23-5.03-5.46 0-1.21.43-2.19 1.14-2.96-.11-.28-.49-1.41.11-2.94 0 0 .93-.3 3.05 1.13a10.5 10.5 0 0 1 5.56 0c2.12-1.43 3.05-1.13 3.05-1.13.6 1.53.22 2.66.11 2.94.71.77 1.14 1.75 1.14 2.96 0 4.24-2.58 5.17-5.04 5.45.4.34.75 1.01.75 2.04l-.01 3.03c0 .29.2.64.76.53 4.37-1.46 7.53-5.59 7.53-10.46C23.01 5.24 18.27.5 12 .5Z" />
    </svg>
  );
}

import { Logo } from "@/components/logo";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Home", href: "#hero" },
  { label: "Work", href: "#work" },
  { label: "Team", href: "#team" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState("#hero");

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // active link tracking
  React.useEffect(() => {
    const ids = LINKS.map((l) => l.href.slice(1));
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vis) setActive(`#${vis.target.id}`);
      },
      { threshold: [0.25, 0.6], rootMargin: "-20% 0px -60% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-x-0 top-0 z-50 bg-transparent"
    >
      <nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 md:px-12 lg:px-16">
        {/* left block */}
        <div className="flex items-center gap-4">
          <a
            href="#hero"
            className="flex items-center gap-2.5"
            aria-label={site.fullName}
          >
            <Logo size={26} priority />
            <span className="font-display text-[18px] font-medium leading-none text-white">
              Helion Team
            </span>
          </a>

          <a
            href={site.social.github}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1.5 rounded-full border border-white/50 px-3 py-1 text-[12px]
              text-white/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-white hover:text-white sm:inline-flex"
          >
            <GithubIcon className="size-3" />
            Visit our repo
          </a>
        </div>

        {/* right block */}
        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => {
            const isActive = active === l.href;
            return (
              <a
                key={l.href}
                href={l.href}
                className={cn(
                  "relative text-[14px] font-normal transition-opacity duration-200",
                  isActive
                    ? "text-white opacity-100"
                    : "text-white/70 opacity-70 hover:opacity-100",
                )}
              >
                {l.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1.5 left-0 right-0 h-px bg-white/80"
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  />
                )}
              </a>
            );
          })}
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="grid size-9 place-items-center rounded-full border border-white/20 text-white transition-colors hover:border-white/50 md:hidden"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </nav>

      {/* mobile drawer */}
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="overflow-hidden bg-black/80 backdrop-blur-md md:hidden"
      >
        <div className="flex flex-col px-6 pb-6 pt-2">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="border-b border-white/10 py-4 text-base text-white/70 transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
          <a
            href={site.social.github}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-white/50 py-3 text-sm text-white/80"
          >
            <GithubIcon className="size-3.5" />
            Visit our repo
          </a>
        </div>
      </motion.div>
    </motion.header>
  );
}
