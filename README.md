# Orbit Node — VPS store landing page

One page, no routes: **Hero → provisioning spiral → Plans (VPS-1…VPS-4) →
Infrastructure → CTA.** Next.js 16 (App Router) · React 19 · TypeScript ·
Tailwind v4 · Motion · raw `three.js` for the spiral only.

**There are no images in this repo.** `public/` is empty by design: the sky,
planet, atmosphere arc, chrome orb and the brand mark are all CSS gradients, and
`next/image` is not imported anywhere. Nothing to optimise, nothing to license,
nothing to ship.

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # compiles + prerenders clean
npm run lint      # 0 errors
npm run typecheck
```

## Two switches, that's the whole CMS

| File | What it controls |
| --- | --- |
| `src/lib/site.ts` | name / suffix / domain / tagline / description / email / nav / CTA / socials. Navbar, footer, `<title>`+OG, every `mailto:` read from here. |
| `src/lib/content.ts` | the `range` label ("VPS 2027"), `plans[]`, the spec checklist order, `heroStats`, `pillars`, `features` (grouped: Hardware / Software / Network & IP / Services), `options` add-ons. |

⚠️ **The prices in `content.ts` are placeholders copied from OVHcloud's VPS page**
(`$4.54 / $8.50 / $12.32 / $23.37`) so the cards look real while you build.
Set `price: ""` and the card falls back to showing the range name instead —
no other change needed.

## Hero (matches the approved mockup, text-for-text)

`LIVE — 4 VPS plans online` badge → `Infrastructure,` / `elevated.` (second line
carries the blue→white gradient) → *"High-performance VPS hosting for projects
that refuse to slow down."* → `[Explore VPS plans]` `[View infrastructure]` →
`99.99% uptime · NVMe storage · 24/7 support`, with the `Chat with us` pill
bottom-right and a scroll cue.

Background, in order (`.hero-sky`, `.hero-planet`, `.hero-rim`, `.hero-fade`):
a layered radial-gradient star field, a 155vmax sphere offset off the bottom
right corner so only its limb shows, and **one** masked-border ring for the
atmosphere. The ring breathes (`rimBreathe`, opacity+blur only) — that is the
whole animation budget. The WebGL curve overlay and the `hero-bg-blue.jpg`
artwork it sat on are both gone.

## Responsive / interaction budget

| Effect | Where | Cost | Reduced motion |
| --- | --- | --- | --- |
| Shine on pointer, spring press to 0.975, ripple from the touch point | `components/tactile.tsx` (used by every button, incl. **Configure**) | 2 CSS vars + 1 self-removing span | static button |
| Card lift + border glow on hover | `.vps-card` | transform/box-shadow | none |
| Feature group switcher | `sections/features.tsx` | one `useState` | instant swap |
| Star particle field | `components/hero/particles.tsx` | canvas, desktop pointers only, pauses off-screen | not mounted |
| Chrome spiral | `sections/chrome-spiral.tsx` | three.js, DPR-capped, pauses off-screen | static frame |

Copy stays the product of `https://www.ovhcloud.com/en/vps/`: plan matrix,
"Daily backup of the previous 24 hours / Unlimited traffic / N Gbps public
bandwidth", the four pillars, and the four feature groups. Structure follows
theirs (year chip → name → From price → Configure → checklist). **No competitor
name, logo or asset appears in the UI or the code comments** — replace the copy
with your own before you go public.

## Fonts

System-first so the build needs no network. The Sora/Manrope `next/font`
snippet is documented at the top of `src/app/layout.tsx`.

## Deleting the last of the "VPS store ≠ node store" leftovers

Nothing in the UI says "node" except the brand. If you would rather not ship
`Orbit Node` as the name at all, `src/lib/site.ts` is the only place it is
defined.
