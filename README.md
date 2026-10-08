# Notch Team — landing page

Landing-page-only build of the site: Next.js 16 (App Router) · React 19 · TypeScript ·
Tailwind v4 · Motion · three.js (raw, procedural — no GLTF models, no R3F).
Static-prerendered, Vercel-ready (`npx vercel --prod`).

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # passes clean
npm run lint
```

## What's in here

One route, `/`. Everything else (Work / Process / More / Contact pages, the chat
widget, Supabase · Groq · Resend · SQLite integrations, all API routes, the shadcn
UI kit, the `.glb` car + server scenes, and the whole `components/shelved/` folder)
was deleted on the `chore/landing-only` branch — the previous full site is intact
on `main`.

```
src/app
  layout.tsx        fonts note, metadata, Navbar + Footer + AmbientBackground
  page.tsx          Hero → ChromeSpiral → Services → FinalCta
  globals.css       design tokens + every custom class the landing page uses
src/components
  ambient-background.tsx
  hero/{cursor,magnetic,particles}.tsx
  sections/{hero,chrome-spiral,services,navbar,footer}.tsx
src/lib
  content.ts        the services list (single source of truth)
  site.ts           name / domain / tagline / nav / CTA / socials
```

## Landing flow

| Section | File | Notes |
| --- | --- | --- |
| Hero | `sections/hero.tsx` | `/hero/hero-bg-blue*.jpg` artwork on a pointer-driven tilt, canvas particle field, custom cursor, Motion stagger |
| The approach | `sections/chrome-spiral.tsx` | chrome helix built from `THREE.TubeGeometry` + scroll-driven ball, glass value-prop panel, HUD |
| Services | `sections/services.tsx` | 8 alternating rows, rim-lit image panes (`public/services/*.jpg`), pure-CSS orb in the final CTA |
| Nav / footer | `sections/navbar.tsx`, `sections/footer.tsx` | fixed glass bar, anchor links only |

Because the site is one page now, every CTA is either an anchor (`#services`,
`#start`) or a `mailto:` — no dead routes.

## Brand tokens

Defined once in `src/lib/site.ts` and `src/app/globals.css`:
`--color-void #030508`, `--color-arc #3b82f6`, `--color-accent #60a5fa`,
`--color-energy #22d3ee`, plus the fluid type scale (`--text-micro … --text-hero`).

Logo asset: `public/logo.png` (transparent). Favicon/touch icon:
`src/app/icon.png`, `src/app/apple-icon.png`.

## Fonts

The build is system-font-first so it never needs the network. To bring back the
Sora / Manrope pairing, follow the snippet documented at the top of
`src/app/layout.tsx` — it needs `fonts.googleapis.com` reachable at build time.

## Perf guards kept

`prefers-reduced-motion` halts every loop and animation, the hero canvas is
`pointer-events:none` + `touch-action:pan-y`, the spiral caps device pixel ratio
and pauses off-screen, images are lazy + `decoding="async"`.
