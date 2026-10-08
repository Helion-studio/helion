# Dannystore — VPS store landing page

One page, no routes: **Hero → Cold-to-shell spiral → Plans → Flow → Final CTA.**
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · Motion · raw
`three.js` for the light effects. Static-prerendered, Vercel-ready.

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # compiles + prerenders clean
npm run lint      # 0 errors
npm run typecheck
```

## Rename the brand in one place

`src/lib/site.ts` — `fullName`, `domain`, `tagline`, `description`, `email`,
`location`, `nav`, `cta`, `social`. The navbar, footer, `mailto:` links, the
`<title>`/OG block and the region count in the hero badge all read from it, so
a rebrand is one file. The copy data (plan matrix, deploy flow, included strip)
lives in `src/lib/content.ts` — **no prices anywhere** on purpose: tiers are
spec-only, so nothing drifts out of sync with billing.

## Landing flow

| # | Section | File | What's in it |
| --- | --- | --- | --- |
| — | Hero | `sections/hero.tsx` | The approved artwork/composition, kept intact. Copy is the store's. Blue is now real light (see below) instead of a blurred circle. |
| 01 | Cold to shell | `sections/chrome-spiral.tsx` | Chrome helix, scroll-driven ball, glass panel with the provisioning pitch. Procedural `TubeGeometry` — no model files. |
| 02 | Plans | `sections/plans.tsx` | 4 compact cards (Nano/Micro/Core/Titan): image top, vCPU · RAM · NVMe · network grid, "Most deployed" badge, deploy button. Plus the included-with-every-node strip. |
| 03 | Flow | `sections/plans.tsx` | Copyable `ssh` terminal chip + three workflow steps driven by the mini lottie runtime. |
| 04 | Start | `sections/plans.tsx` | Final CTA with the pure-CSS chrome orb. |

## The blue, and why it's cheap

- **`hero/limb-glow.tsx`** — one `THREE.ShaderMaterial` on a single fullscreen
  quad: horizon arc, a light band that travels along the limb, breathing bloom.
  Half resolution, pixel ratio capped (1.5 desktop / 1 mobile), ~45fps ceiling,
  intensity drops to 0 once the hero scrolls away. Zero new dependencies (three
  was already in the bundle for the spiral) and zero bytes of image data.
- **`.hero-limb`** in `globals.css` — the same arc drawn with a clip-path, used
  when `prefers-reduced-motion` is on or WebGL is unavailable. Static, still glowy.
- **Contrast** — the shared blue token moved `#3b82f6 → #4a9dff` and the hero
  bloom's alpha/opacity range was raised, so the light reads as light, not mud.

## Motion / interaction budget

| Effect | Cost | Reduced-motion behaviour |
| --- | --- | --- |
| Tactile buttons (`tactile.tsx`) | pointer shine = 2 CSS vars; ripple = 1 span, self-removes | plain static button |
| Card tilt + spotlight (`plans.tsx`) | transform/opacity only, fine pointers only | no tilt, no spotlight |
| Lottie player (`lottie.tsx`) | ~1.5 KB runtime, rAF → `transform`/`opacity` writes, pauses off-screen | holds a legible static frame |
| Particle field, spiral | existing; already pause off-screen / skip touch | static frame |

## Lottie files

The runtime understands a small subset (opacity/position/scale keyframes), so
we generate the three flow animations in code via `makeAnim()`. To use a real
export instead, drop the JSON in `public/vps/` and swap the prop:

```tsx
<Lottie src="/vps/deploy.lottie.json" label="Deploy in ~40s" />
```

Anything the interpreter doesn't understand renders as its first frame — a real
After Effects file can never break the layout, it just stops animating the
parts we skip. If you want full fidelity later, install `lottie-web` (~250 KB)
and point the same `<Lottie>` at it.

## Fonts

System-first so the build needs no network. The Sora/Manrope snippet is at the
top of `src/app/layout.tsx` — it needs `fonts.googleapis.com` reachable at build
time.

## What was deleted to get here

Everything outside the landing page's import graph: the Work/Process/More/Contact
pages, all API routes, Supabase · Groq · Resend · SQLite integrations, the
external `.glb` car + server scenes and their GLTF loaders, the eight "What We
Build" service rows and the Custom Ecosystems block, the shadcn UI kit, all of
`components/shelved/`, and 14 packages. The full previous site is intact on
`main`.
