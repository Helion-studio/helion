# TOP-NOTCH TEAM — Portal Roadmap

_Saved 2026-09-10 so we never lose the plan. Update as we ship._

## Integration status (as reported by the team)

| Service   | Status | Notes |
| --------- | ------ | ----- |
| Resend    | ✅ working | email handoffs deliver |
| Supabase  | ❌ not connecting | keys were added but no connection — debug: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, run `supabase/migrations/001_init.sql`, check RLS |
| Groq      | ❌ not working | verify `GROQ_API_KEY`; `/api/ai` should then report `chat: true` |

Quick health check once keys are in:

```bash
curl localhost:3000/api/ai   # → {"chat":true,"tts":true,"stt":true,"email":true,"supabase":true}
```

## Next features (the plan, step by step)

1. **Live chat — better Supabase connection** — chat sessions/messages persist
   reliably to Supabase; reconnect logic; visible delivery state.
2. **Website renaming** — new name coming; `src/lib/site.ts` is the single
   switch (fullName/name/suffix/domain/email) + nav & footer labels.
3. **Logo changing** — new mark coming; swap `public/logo.png`,
   `src/app/icon.png`, `src/app/apple-icon.png`, deck back-face in
   `flip-deck.tsx`.
4. **Dev admin dashboard** — internal view over inquiries, chat sessions,
   visitors, projects (data already flowing into Supabase + SQLite).
5. **Telegram bot as the admin dashboard** — the team's remote control:
   - live chat feed + handoff notifications
   - upload new projects (name, copy, thumbnails, repo/viewer URLs)
   - manage inquiries / bookings / mark read
   - site stats (visitors, sessions, pageviews)

## Rollback — 2026-09-10 (later the same day)

The picture-era landing (deck showcase, stats/CTA bands, wordmark footer,
/work thumbnails + detail pages, chat widget) tested badly on mobile.
Everything from the screenshots round onward was rolled back to the
approved pre-pictures site, keeping only invisible optimizations
(fast cursor v2 + magnetic v2, lean CSS, Sora/Manrope, SQLite tracking).

**Shelved, not deleted** — in `src/components/shelved/`:
- flip-deck.tsx, showcase.tsx, stats-band.tsx, cta-band.tsx
- project-page.tsx (the /work/[slug] detail page with iframe viewer)

Kept in the repo (unmounted, invisible): Groq/Supabase/Resend libs + API
routes (`/api/chat`, `/api/ai`, `/api/handoff`), chat-widget.tsx,
public/work/* screenshots + ledgerline demo. When we rebuild the work
showcase and live chat (roadmap items above), it all comes back online.

Landing now: Hero → Story (dark cards) → footer. Matches the version the
team approved on mobile.
