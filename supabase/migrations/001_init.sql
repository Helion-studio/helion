-- =====================================================================
-- TOP-NOTCH TEAM — Supabase schema
-- Run in Supabase Studio → SQL Editor (or `supabase db push`).
-- Safe to re-run (idempotent).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. PROJECTS — powers /work and the landing-page showcase
--    type: 'web'     → detail page embeds viewer_url in an iframe
--         'software' → detail page links straight to the repository
-- ---------------------------------------------------------------------
create table if not exists public.projects (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  name         text not null,
  category     text not null,
  year         text not null,
  blurb        text not null,
  detail       text not null,
  type         text not null default 'web' check (type in ('web', 'software')),
  metrics      jsonb not null default '[]',   -- [{k,label}]
  stack        text[] not null default '{}',
  thumbnail_url text,                          -- storage path or absolute URL
  gallery_urls text[] not null default '{}',
  repo_url     text,                           -- GitHub repo
  viewer_url   text,                           -- embeddable deployment (GitHub Pages etc.)
  featured     boolean not null default false, -- shown on the landing showcase
  sort         integer not null default 0,
  created_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 2. AI CHAT — sessions + transcripts (Groq-powered widget)
-- ---------------------------------------------------------------------
create table if not exists public.chat_sessions (
  id         uuid primary key default gen_random_uuid(),
  browser_id text,
  started_at timestamptz not null default now(),
  last_at    timestamptz not null default now(),
  status     text not null default 'open' check (status in ('open', 'handed_off', 'closed'))
);

create table if not exists public.chat_messages (
  id         bigint generated always as identity primary key,
  session_id uuid not null references public.chat_sessions(id) on delete cascade,
  role       text not null check (role in ('user', 'assistant')),
  content    text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 3. INQUIRIES — contact form + chat handoffs + bookings
--    source: 'form' | 'chat' | 'booking'
-- ---------------------------------------------------------------------
create table if not exists public.inquiries (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  source     text not null default 'form' check (source in ('form', 'chat', 'booking')),
  name       text,
  email      text,
  company    text,
  brief      text not null,
  summary    text,                             -- Groq summary of a chat transcript
  transcript text,                             -- full chat transcript when source <> 'form'
  read       boolean not null default false
);

-- ---------------------------------------------------------------------
-- 4. EMAIL OUTBOX — every notification we attempted to send
-- ---------------------------------------------------------------------
create table if not exists public.email_outbox (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  to_address text not null,
  subject    text not null,
  body       text not null,
  delivered  boolean not null default false,   -- true when a provider accepted it
  provider   text                              -- 'resend' | null (stored only)
);

-- ---------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- All writes go through our Next.js API routes using the service-role
-- key, so anon access only needs read on projects.
-- ---------------------------------------------------------------------
alter table public.projects      enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;
alter table public.inquiries     enable row level security;
alter table public.email_outbox  enable row level security;

drop policy if exists "projects are public" on public.projects;
create policy "projects are public"
  on public.projects for select
  to anon, authenticated
  using (true);

-- ---------------------------------------------------------------------
-- 5. STORAGE — project thumbnails & screenshots
--    Create bucket "project-assets" (public) in Studio → Storage,
--    then upload thumbnails and set thumbnail_url to the object path
--    (e.g. "thumbnails/ledgerline.jpg").
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('project-assets', 'project-assets', true)
on conflict (id) do nothing;

drop policy if exists "project assets are public" on storage.objects;
create policy "project assets are public"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'project-assets');
