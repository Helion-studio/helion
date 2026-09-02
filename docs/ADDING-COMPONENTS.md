# Adding components (21st.dev, npm, or raw paste)

The project is set up so you can drop in third-party UI **without rewriting it**.
Three paths — pick whichever the source gives you.

---

## 1. shadcn registry (preferred)

Registries are pre-wired in `components.json`:

```bash
npx shadcn@latest add @21st/<author>/<component>   # needs API key, see below
npx shadcn@latest add @magicui/marquee
npx shadcn@latest add @aceternity/spotlight
npx shadcn@latest add @coss/p-navigation-2         # originui, now "coss ui"
npx shadcn@latest add button dialog                # plain shadcn
```

### 21st.dev API key
Their registry rejects unauthenticated CLI requests (`401 Authentication required`).
Grab your key from 21st.dev → settings, then:

```bash
echo 'TWENTY_FIRST_API_KEY=sk_xxx' > .env.local
```

`components.json` already sends it as `Authorization: Bearer ${TWENTY_FIRST_API_KEY}`.
Nothing else to change. (Runtime doesn't need the key — build/deploy works without it.)

---

## 2. npm package

```bash
npm i <package>
```
Then import normally. If it ships its own CSS, add `@import "<pkg>/styles.css";`
near the top of `src/app/globals.css`.

---

## 3. Raw paste

Drop the file in `src/components/ui/` (primitives) or `src/components/blocks/`
(marketing sections). It should compile as-is because of the compatibility layer below.

---

## Compatibility layer — why pasted code just works

| Thing third-party code assumes | How we satisfy it |
|---|---|
| `@/components/ui/button` with **`asChild`** | shadcn initialised with `--base radix`, so components are classic Radix + Slot — not the new base-ui API |
| `import { motion } from "framer-motion"` | `framer-motion` **and** `motion` are both installed; either import path resolves |
| `cn()` from `@/lib/utils` | present |
| `cva`, `clsx`, `tailwind-merge` | installed |
| `lucide-react` / `@tabler/icons-react` | both installed |
| Tailwind **v3-style `theme.extend`** keyframes | `tailwind.config.ts` is loaded via `@config` in `globals.css` — paste any `theme.extend` block straight in |
| `next-themes`, `sonner` toasts | installed |
| Three.js / R3F scenes | `three`, `@react-three/fiber`, `@react-three/drei` installed |

### Common gotchas

- **`"use client"`** — anything with hooks, Motion, or event handlers needs it at the top of the file. Our `page.tsx` is a Server Component.
- **WebGL / Canvas components** — always mount via
  `dynamic(() => import("..."), { ssr: false })` so they don't break SSR or block first paint. See `sections/hero.tsx`.
- **Brand colours** — use `helion-ice / mist / steel / slate / deep / ink / void`
  (defined in both `globals.css` and `tailwind.config.ts`), or the `brand` object in `src/lib/site.ts`.
- **Images from third-party demos** point at `images.unsplash.com` etc. Add the host to
  `next.config.ts → images.remotePatterns` (a few are pre-allowed) or swap for local files.

---

## Where things live

```
src/components/ui/       primitives (shadcn + registry installs)
src/components/blocks/   pasted marketing sections — paste here
src/components/sections/ our composed page sections
src/components/three/    R3F scenes
src/lib/site.ts          all copy, nav, brand colours
tailwind.config.ts       v3 compat bridge for pasted keyframes
```

Just paste and tell me the file — I'll wire it into the page and match it to the brand.
