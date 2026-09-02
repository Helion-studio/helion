"use client";

import React, { useState } from "react";
import { ArrowRight, ArrowUpRight, Menu, Play, X } from "lucide-react";

interface NavLink {
  label: string;
  href: string;
  isActive?: boolean;
}

interface Partner {
  logoUrl: string;
  href: string;
  name?: string;
}

interface ResponsiveHeroBannerProps {
  logoUrl?: string;
  logoAlt?: string;
  backgroundImageUrl?: string;
  navLinks?: NavLink[];
  ctaButtonText?: string;
  ctaButtonHref?: string;
  badgeText?: string;
  badgeLabel?: string;
  title?: string;
  titleLine2?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  partnersTitle?: string;
  partners?: Partner[];
}

const ResponsiveHeroBanner: React.FC<ResponsiveHeroBannerProps> = ({
  logoUrl = "/logo.png",
  logoAlt = "Logo",
  // The author's original artwork, vendored into /public so it can't rot
  backgroundImageUrl = "/hero/hero-bg-blue.jpg",
  navLinks = [
    { label: "Home", href: "#", isActive: true },
    { label: "Work", href: "#work" },
    { label: "Team", href: "#team" },
    { label: "Process", href: "#process" },
    { label: "Contact", href: "#contact" },
  ],
  ctaButtonText = "Start a project",
  ctaButtonHref = "#contact",
  badgeLabel = "New",
  badgeText = "Booking Q4 builds",
  title = "Journey Beyond Earth",
  titleLine2 = "Into the Cosmos",
  description = "Experience the cosmos like never before.",
  primaryButtonText = "Get started",
  primaryButtonHref = "#contact",
  secondaryButtonText = "Watch reel",
  secondaryButtonHref = "#work",
  partnersTitle = "Partnering with leading space agencies worldwide",
  partners = [
    { logoUrl: "/hero/partner-1.png", href: "#", name: "Nova" },
    { logoUrl: "/hero/partner-2.png", href: "#", name: "Forge" },
    { logoUrl: "/hero/partner-3.png", href: "#", name: "Flux" },
    { logoUrl: "/hero/partner-4.png", href: "#", name: "Beam" },
    { logoUrl: "/hero/partner-5.png", href: "#", name: "Echo" },
  ],
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <section className="w-full isolate min-h-screen overflow-hidden relative">
      {/* background artwork: base layer + a screen-blended copy masked to a
          travelling band, so light runs along the arc without touching hue */}
      <div className="absolute inset-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={backgroundImageUrl}
          alt=""
          className="hero-bg-base w-full h-full object-cover absolute top-0 right-0 bottom-0 left-0"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={backgroundImageUrl}
          alt=""
          aria-hidden
          className="hero-bg-sweep w-full h-full object-cover absolute top-0 right-0 bottom-0 left-0"
        />
        {/* soft bloom that breathes with the arc */}
        <div
          aria-hidden
          className="hero-glow pointer-events-none absolute -right-[10%] top-[8%] h-[85%] w-[70%]
            [background:radial-gradient(closest-side,rgba(47,163,255,0.28),transparent_72%)]"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 ring-1 ring-black/30" />

      <header className="z-20 xl:top-4 relative">
        <div className="mx-6">
          <div className="flex items-center justify-between pt-4">
            <a href="#" className="inline-flex items-center gap-2.5" aria-label={logoAlt}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoUrl} alt={logoAlt} className="h-10 w-10 object-contain" />
              <span className="font-sans text-base font-medium text-white">
                Helion Studio
              </span>
            </a>

            <nav className="hidden md:flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-full bg-white/5 px-1 py-1 ring-1 ring-white/10 backdrop-blur">
                {navLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className={`px-3 py-2 text-sm font-medium hover:text-white font-sans transition-colors ${
                      link.isActive ? "text-white/90" : "text-white/80"
                    }`}
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href={ctaButtonHref}
                  className="ml-1 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-sm font-medium text-neutral-900 hover:bg-white/90 font-sans transition-colors"
                >
                  {ctaButtonText}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </nav>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-white/90" />
              ) : (
                <Menu className="h-5 w-5 text-white/90" />
              )}
            </button>
          </div>

          {/* NOTE: the published component toggles `mobileMenuOpen` but never
              renders a panel, so the burger does nothing. Panel added here. */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-3 rounded-2xl bg-black/70 p-2 ring-1 ring-white/10 backdrop-blur-xl">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 font-sans text-base text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={ctaButtonHref}
                onClick={() => setMobileMenuOpen(false)}
                className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 font-sans text-sm font-medium text-neutral-900"
              >
                {ctaButtonText}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>
      </header>

      <div className="z-10 relative">
        <div className="sm:pt-28 md:pt-32 lg:pt-40 max-w-7xl mx-auto pt-28 px-6 pb-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-white/10 px-2.5 py-2 ring-1 ring-white/15 backdrop-blur animate-fade-slide-in-1">
              <span className="inline-flex items-center text-xs font-medium text-neutral-900 bg-white/90 rounded-full py-0.5 px-2 font-sans">
                {badgeLabel}
              </span>
              <span className="text-sm font-medium text-white/90 font-sans">
                {badgeText}
              </span>
            </div>

            <h1 className="sm:text-5xl md:text-6xl lg:text-7xl leading-tight text-4xl text-white tracking-tight font-instrument-serif font-normal animate-fade-slide-in-2">
              {title}
              <br className="hidden sm:block" />
              {titleLine2}
            </h1>

            <p className="sm:text-lg animate-fade-slide-in-3 text-base text-white/80 max-w-2xl mt-6 mx-auto">
              {description}
            </p>

            <div className="flex flex-col sm:flex-row sm:gap-4 mt-10 gap-3 items-center justify-center animate-fade-slide-in-4">
              <a
                href={primaryButtonHref}
                className="inline-flex items-center gap-2 hover:bg-white/15 text-sm font-medium text-white bg-white/10 ring-white/15 ring-1 rounded-full py-3 px-5 font-sans transition-colors"
              >
                {primaryButtonText}
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={secondaryButtonHref}
                className="inline-flex items-center gap-2 rounded-full bg-transparent px-5 py-3 text-sm font-medium text-white/90 hover:text-white font-sans transition-colors"
              >
                {secondaryButtonText}
                <Play className="w-4 h-4" />
              </a>
            </div>
          </div>

          {partners.length > 0 && (
            <div className="mx-auto mt-20 max-w-5xl">
              <p className="animate-fade-slide-in-1 text-sm text-white/70 text-center">
                {partnersTitle}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 animate-fade-slide-in-2 text-white/70 mt-6 items-center justify-items-center gap-4">
                {partners.map((partner, index) => (
                  <a
                    key={index}
                    href={partner.href}
                    aria-label={partner.name ?? `Partner ${index + 1}`}
                    className="inline-flex items-center justify-center bg-center w-[120px] h-[36px] bg-cover rounded-full opacity-80 hover:opacity-100 transition-opacity"
                    style={{ backgroundImage: `url(${partner.logoUrl})` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ResponsiveHeroBanner;
