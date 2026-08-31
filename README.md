# Helion Studio — site

Next.js 15 (App Router) · React 19 · Tailwind CSS v4 · TypeScript

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (verified passing)
npm start        # serve the production build
```

## Deploy to Vercel

Zero config needed — the project is fully static.

```bash
npx vercel        # preview
npx vercel --prod # production
```

Or push to GitHub and import the repo at [vercel.com/new](https://vercel.com/new). Vercel auto-detects Next.js.

| Setting | Value |
| --- | --- |
| Framework preset | Next.js (auto) |
| Build command | `npm run build` |
| Output directory | `.next` (auto) |
| Node version | 18.18+ (`engines` pinned) |
| Env vars | none required |

Verified: `npm run build` → compiled, types valid, 5/5 static pages, **103 kB First Load JS**.

## Where things live

| Path | What it is |
| --- | --- |
| `lib/site.ts` | **All copy, nav, specializations, links.** Edit this first. |
| `app/globals.css` | Design tokens (colours, fonts) + textures + keyframes. |
| `components/brand.tsx` | **Logo mark + wordmark.** Replace the SVG to rebrand everything. |
| `components/site-header.tsx` | Navy header band (86px — matches reference). |
| `components/hero.tsx` | Hero + "We specialize in" card. |
| `components/closing-cta.tsx` | Navy closing CTA band. |
| `components/site-footer.tsx` | Footer. |
| `components/solar-ring.tsx` | Decorative rotating wireframe. |
| `components/icons.tsx` | Arrow + GitHub icons. |

## Design system

Extracted from the client reference. Light canvas, navy bands, **one** blue accent — nothing else.

| Token | Value | Use |
| --- | --- | --- |
| `canvas` | `#f9fbfe` | Page background |
| `surface` | `#ffffff` | Cards |
| `canvas-alt` | `#f2f5fd` | Recessed panels |
| `navy` | `#000719` | Header / footer / CTA bands |
| `ink` | `#0e121c` | Headings + body text |
| `muted` | `#5a6474` | Secondary text |
| `subtle` | `#8b93a3` | Labels, meta |
| `accent` | `#1e55fe` | **The only colour** — buttons, dots, links |
| `accent-deep` | `#1848f0` | Accent hover |
| `accent-soft` | `#eef2ff` | Accent tint backgrounds |
| `line` | `#e6eaf0` | Hairline borders |
| `line-strong` | `#d5dbe6` | Button outlines |

**Changing the accent:** edit `--color-accent` (+ `-deep`, `-soft`) in `app/globals.css`. Every button, dot and link follows. Keep it to one hue — that's what makes it read as professional.

## Before launch

Everything flagged `REPLACE:` in `lib/site.ts` is placeholder:

1. `site.repo.url` / `site.repo.handle` — real GitHub org URL
2. `site.email`, `site.url` — real contact + domain
3. Swap the placeholder mark in `components/brand.tsx` for the approved logo

## Notes

- Motion is hand-written CSS keyframes, staggered 60→440ms, disabled under `prefers-reduced-motion`. No animation dependencies.
- `npm audit` → 0 vulnerabilities (`postcss` / `sharp` pinned via `overrides`).
- `npx tsc --noEmit` → clean.
# helion
# helion
