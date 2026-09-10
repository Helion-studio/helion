# Reference study — activetheory.net (2026-09-10)

_Use as direction, not template. Analyzed from live source + their site data file._

## What it actually is (under the hood)

- **The DOM is empty.** The whole site renders inside ONE WebGL canvas (`#Stage`).
  Even text/UI is drawn in-canvas; a hidden "GLA11y" DOM clone exists purely for
  screen readers. Scroll is virtual (`touch-action:none` — the page hijacks it).
- **Custom in-house engine** ("UIL", versioned site v6, one cache-busted app.js).
  Years of tooling, not a framework you can npm-install.
- **Scene-based structure:** Home → Work → WorkDetail → About → Contact, plus
  hidden "rooms" (CleanRoom, TreeScene). One continuous 3D world.
- **Cameras lerp between scenes** — speeds 0.07–0.1. Navigation feels like
  flying through one space, not switching pages.
- **Shader-graph pipeline:** PBR + lightmaps + env maps, glass refraction,
  volumetric light (god rays), Unreal-style bloom **tuned per scene**
  (home 0.6 / work 0.5 / contact 0.8), KTX2 compressed textures.
- **Particles are the brand:** their logo is made of particle matter — curl
  noise, spatial hashing, GPGPU, and a **fluid sim reacting to the mouse**.
- **Typography: ONE family, 3 weights** (NB Architekt Light/Regular/Bold).
  That's it. Hierarchy from size + spacing, not extra fonts.

## Principles we take (direction)

1. **One living canvas is the spine** — the site IS the scene; UI floats over
   it, quiet and thin. Not "sections with WebGL bits between them".
2. **Camera travel = navigation.** Lerp 0.07–0.1 between scenes; you fly
   through one continuous world.
3. **The page always feels you.** Mouse is a physics input — particles yield
   and swirl where you move. Constant, subtle aliveness.
4. **Per-scene lighting mood** — same world, but bloom/tint shift slightly per
   section. Coherent, not monotone.
5. **Extreme restraint** — near-empty screens, tiny UI, one type family,
   three weights, massive negative space.
6. **Performance discipline** — compressed textures, single bundle, feature
   detects, degraded paths for weak devices.
7. **Let the work BE the content** — almost no marketing prose on the home
   page. The experience carries the pitch.

## What we deliberately DON'T take

- **No empty-DOM / all-canvas site.** Kills SEO, accessibility, maintenance,
  and mobile budgets. We keep real SSR'd DOM (that's our advantage — they had
  to build GLA11y to fake what we get free).
- **No custom engine.** We stay on Next.js + three.js + motion.
- **Not their identity.** Particle-matter logo + dark void is *theirs*. Ours
  is the blue arc + spring staircase. We borrow structure, not looks.

## How it maps to Top-notch Team (proposal)

| # | Move | Effort | Impact |
| - | ---- | ------ | ------ |
| 1 | **One canvas, one journey** — merge hero arc + story staircase into a single continuous scroll-driven scene; camera lerps (0.08) from arc into the helix | high | the "wow" — site stops feeling stitched |
| 2 | **Mouse-reactive particles** — add gentle curl-noise flow + mouse repulsion to our existing particle layer (2D, cheap, no fluid sim) | low | constant aliveness, AT's signature feel |
| 3 | **Scene lighting** — formalize per-section glow/bloom mood (hero bright, story cooler/dimmer, contact warm) | low | coherence |
| 4 | **Typography diet** — Sora down to 3 weights, quieter/thinner nav chrome | low | restraint = premium |
| 5 | **Home page copy diet** — cut prose, let the canvas + one-liners carry it (matches the humanized-copy goal AND the AI-detector issue) | low | confidence |
| 6 | Mobile keeps the current lean path — everything above is desktop-pointer luxury, phone stays fast | — | protects what we just fixed |

Decision pending from team: run all six, or start with 2–4 (cheap wins) first.
