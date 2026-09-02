# Helion Studio — website

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · shadcn (**Radix base**) · Motion · React Three Fiber.
Static-prerendered, **Vercel-ready** (`npx vercel --prod`).

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # passes clean
```

## Brand

Palette sampled straight off the mark — defined once in `src/lib/site.ts`, `globals.css`
(`--color-helion-*`) and `tailwind.config.ts`:

| Token | Hex | Use |
|---|---|---|
| `helion-ice` | `#dce6ef` | highlights, gradient top |
| `helion-mist` | `#b4c8d8` | primary accent |
| `helion-steel` | `#8ba2b8` | secondary accent, particles |
| `helion-slate` | `#5b7085` | mid tones |
| `helion-deep` | `#3c4854` | surfaces |
| `helion-ink` | `#232c38` | text on light buttons |
| `helion-void` | `#12161d` | page background |

Logo assets: `public/logo.png` (white background removed, transparent),
`src/app/icon.png` + `apple-icon.png` (auto favicon / touch icon).
Use `<Logo />` or `<Wordmark />` from `src/components/logo.tsx`.

## Hero (step 1, done)

- **3D** — R3F particle globe (5,000 pts desktop / 1,800 mobile) on a custom GLSL shader,
  recoloured to ice→steel, plus **two interlocking hexagonal rings** echoing the logo.
- **Perf** — `ssr:false` dynamic import, `PerformanceMonitor` + `AdaptiveDpr` drop
  resolution not frames, canvas is `pointer-events:none` + `touch-action:pan-y`
  so it can never hijack scroll on mobile, `prefers-reduced-motion` halts the loop.
- **2D** — Motion staggered blur-in, AuroraText, shiny badge, masked grid, stat strip.
- The mark floats above the headline with a soft steel halo.

## Adding components

👉 **`docs/ADDING-COMPONENTS.md`** — read this before pasting anything.

Short version: paste 21st.dev / Aceternity / MagicUI code **as-is**. The project is
configured for maximum compatibility:

- shadcn uses **`--base radix`** → components support **`asChild`**
- both `framer-motion` and `motion` are installed → either import path works
- `tailwind.config.ts` is loaded via `@config` → **v3-style `theme.extend` keyframes work**
  (verified: `animate-marquee` compiles into the production CSS)
- `cn`, `cva`, `clsx`, `tailwind-merge`, `lucide-react`, `@tabler/icons-react`,
  `next-themes`, `sonner`, `three`/`fiber`/`drei` all present

Registries wired in `components.json`: `@21st` (needs `TWENTY_FIRST_API_KEY` in
`.env.local`), `@magicui`, `@aceternity`, `@coss` (originui's new home).

## Structure

```
src/
  app/            layout, globals.css, page.tsx, icons
  components/
    logo.tsx      <Logo /> + <Wordmark />
    site-header.tsx
    sections/     our composed sections  (hero.tsx)
    blocks/       ← paste third-party sections here
    three/        R3F scenes
    ui/           primitives
  lib/site.ts     all copy, nav, brand colours
tailwind.config.ts  v3 compat bridge
docs/ADDING-COMPONENTS.md
```

## Roadmap

- [x] 0 — Foundation + registries + paste-compat layer
- [x] 1 — Hero + nav + full Helion branding
- [ ] 2 — Capabilities
- [ ] 3 — Work / case studies
- [ ] 4 — Studio / team
- [ ] 5 — Process + contact (server action)
- [ ] 6 — SEO, OG image, analytics
