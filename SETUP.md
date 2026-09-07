# Top-notch Team — backend setup

Everything works offline with seed data + SQLite. Add keys to `.env.local`
to switch each layer on. The site never breaks when a key is missing.

## 1. Supabase (projects, chat transcripts, inquiries)

1. Create a project at [supabase.com](https://supabase.com) (free tier is fine).
2. **SQL Editor** → paste `supabase/migrations/001_init.sql` → Run.
   Creates tables `projects`, `chat_sessions`, `chat_messages`, `inquiries`,
   `email_outbox` + the public `project-assets` storage bucket.
3. **Settings → API** → copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `service_role` secret → `SUPABASE_SERVICE_ROLE_KEY`
4. Fill the `projects` table (or keep the seed data as fallback). Columns map
   1:1 to what `/work` renders. For thumbnails, upload images to the
   `project-assets` bucket and set `thumbnail_url` to the object path
   (e.g. `thumbnails/ledgerline.jpg`) — the site resolves public URLs.
   - `type: 'web'` + `viewer_url` set → project page embeds the URL in an
     iframe ("live preview"). Point it at the repo's deployment
     (GitHub Pages / Cloudflare Pages / Vercel).
   - `type: 'software'` (or no viewer_url) → project page links straight to
     `repo_url`.
   - `featured: true` rows appear on the landing showcase (seed shows all).

## 2. Groq (AI chat, TTS, STT, summaries)

1. Create a key at [console.groq.com/keys](https://console.groq.com/keys).
2. `GROQ_API_KEY=gsk_...` in `.env.local`.

That's it. Chat uses `llama-3.3-70b-versatile`, summaries use
`llama-3.1-8b-instant`, voice-out is `playai-tts` (voice `Chip-PlayAI`),
voice-in is `whisper-large-v3-turbo`. Override with `GROQ_CHAT_MODEL` /
`GROQ_TTS_VOICE` if you want different ones.
Without a key the chat still works via a content-aware offline responder.

## 3. Email handoffs (chat → inbox)

1. Create a key at [resend.com](https://resend.com) and verify your domain
   (or use their `onboarding@resend.dev` sender for testing).
2. `RESEND_API_KEY=re_...`, `CONTACT_EMAIL=you@yourdomain.com`,
   and optionally `EMAIL_FROM="Top-notch Team <hello@yourdomain.com>"`.

Every chat "Send to team", booking, and contact-form submission is:
Groq-summarized → stored (Supabase `inquiries`, or SQLite locally) →
emailed. Without Resend the email lands in the `email_outbox` table
(SQLite: `data/tnt.db`) so nothing is lost.

## 4. Local data (always on)

`data/tnt.db` (SQLite) records visitors, sessions, pageviews, contact
messages, chat handoffs and the email outbox. Inspect with:

```bash
node -e "const db=require('better-sqlite3')('data/tnt.db');console.log(db.prepare('SELECT * FROM visitors').all())"
```

## Vercel note

SQLite is read-only on serverless — add the same env vars in Vercel and
Supabase takes over as the system of record. `recordOutbox`/`recordHandoff`
already degrade to no-ops there instead of crashing.
