import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

/**
 * Tiny SQLite layer for site analytics + contact messages.
 * File lives at ./data/tnt.db (gitignored). Every call is wrapped so a
 * read-only or missing filesystem degrades to a no-op instead of a crash.
 *
 * Schema:
 *   visitors  — one row per browser (browser_id), first/last seen, hits
 *   sessions  — one row per browsing session, tied to a browser
 *   events    — one row per pageview
 *   messages  — contact form submissions
 */

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "tnt.db");

let db: Database.Database | null = null;

function getDb(): Database.Database | null {
  if (db) return db;
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    db = new Database(DB_FILE);
    db.pragma("journal_mode = WAL");
    db.exec(`
      CREATE TABLE IF NOT EXISTS visitors (
        browser_id   TEXT PRIMARY KEY,
        first_seen   TEXT NOT NULL,
        last_seen    TEXT NOT NULL,
        visits       INTEGER NOT NULL DEFAULT 1,
        user_agent   TEXT,
        language     TEXT,
        platform     TEXT,
        screen       TEXT
      );
      CREATE TABLE IF NOT EXISTS sessions (
        id         TEXT PRIMARY KEY,
        browser_id TEXT NOT NULL,
        started_at TEXT NOT NULL,
        last_at    TEXT NOT NULL,
        pages      INTEGER NOT NULL DEFAULT 1,
        referrer   TEXT,
        landing    TEXT
      );
      CREATE TABLE IF NOT EXISTS events (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        ts         TEXT NOT NULL,
        browser_id TEXT NOT NULL,
        session_id TEXT NOT NULL,
        path       TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS messages (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at TEXT NOT NULL,
        name       TEXT NOT NULL,
        email      TEXT NOT NULL,
        company    TEXT,
        brief      TEXT NOT NULL,
        read       INTEGER NOT NULL DEFAULT 0
      );
      CREATE TABLE IF NOT EXISTS email_outbox (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at TEXT NOT NULL,
        to_address TEXT NOT NULL,
        subject    TEXT NOT NULL,
        body       TEXT NOT NULL,
        delivered  INTEGER NOT NULL DEFAULT 0,
        provider   TEXT
      );
    `);
    return db;
  } catch {
    return null;
  }
}

const now = () => new Date().toISOString();

export type VisitPayload = {
  browserId: string;
  sessionId: string;
  path: string;
  referrer?: string;
  userAgent?: string;
  language?: string;
  platform?: string;
  screen?: string;
};

export function recordVisit(p: VisitPayload): boolean {
  const d = getDb();
  if (!d) return false;
  try {
    const ts = now();
    d.prepare(
      `INSERT INTO visitors (browser_id, first_seen, last_seen, visits, user_agent, language, platform, screen)
       VALUES (@b, @ts, @ts, 1, @ua, @lang, @plat, @screen)
       ON CONFLICT(browser_id) DO UPDATE SET
         last_seen = @ts,
         visits = visits + 1,
         user_agent = COALESCE(@ua, user_agent),
         language  = COALESCE(@lang, language),
         platform  = COALESCE(@plat, platform),
         screen    = COALESCE(@screen, screen)`,
    ).run({
      b: p.browserId,
      ts,
      ua: p.userAgent ?? null,
      lang: p.language ?? null,
      plat: p.platform ?? null,
      screen: p.screen ?? null,
    });

    d.prepare(
      `INSERT INTO sessions (id, browser_id, started_at, last_at, pages, referrer, landing)
       VALUES (@s, @b, @ts, @ts, 1, @ref, @path)
       ON CONFLICT(id) DO UPDATE SET last_at = @ts, pages = pages + 1`,
    ).run({ s: p.sessionId, b: p.browserId, ts, ref: p.referrer ?? null, path: p.path });

    d.prepare(
      `INSERT INTO events (ts, browser_id, session_id, path) VALUES (@ts, @b, @s, @path)`,
    ).run({ ts, b: p.browserId, s: p.sessionId, path: p.path });

    return true;
  } catch {
    return false;
  }
}

export type MessagePayload = {
  name: string;
  email: string;
  company?: string;
  brief: string;
};

export function recordMessage(p: MessagePayload): boolean {
  const d = getDb();
  if (!d) return false;
  try {
    d.prepare(
      `INSERT INTO messages (created_at, name, email, company, brief)
       VALUES (@ts, @name, @email, @company, @brief)`,
    ).run({
      ts: now(),
      name: p.name.slice(0, 120),
      email: p.email.slice(0, 200),
      company: p.company ? String(p.company).slice(0, 160) : null,
      brief: p.brief.slice(0, 4000),
    });
    return true;
  } catch {
    return false;
  }
}

/** Email outbox — every notification we attempted (delivered or stored-only). */
export function recordOutbox(
  to: string,
  subject: string,
  body: string,
  delivered: boolean,
  provider: string | null,
): boolean {
  const d = getDb();
  if (!d) return false;
  try {
    d.prepare(
      `INSERT INTO email_outbox (created_at, to_address, subject, body, delivered, provider)
       VALUES (?, ?, ?, ?, ?, ?)`,
    ).run(now(), to, subject.slice(0, 300), body.slice(0, 20000), delivered ? 1 : 0, provider);
    return true;
  } catch {
    return false;
  }
}

/** Chat handoff / booking fallback when Supabase isn't configured. */
export function recordHandoff(args: {
  source: "chat" | "booking";
  name?: string;
  email?: string;
  brief: string;
  summary?: string;
  transcript?: string;
}): boolean {
  const d = getDb();
  if (!d) return false;
  try {
    d.prepare(
      `INSERT INTO messages (created_at, name, email, company, brief)
       VALUES (?, ?, ?, ?, ?)`,
    ).run(
      now(),
      args.name?.slice(0, 120) || "Chat visitor",
      args.email?.slice(0, 200) || "(no email left)",
      `[${args.source}]`,
      (args.summary ? `SUMMARY: ${args.summary}\n\n` : "") +
        args.brief.slice(0, 3000) +
        (args.transcript ? `\n\n--- TRANSCRIPT ---\n${args.transcript.slice(0, 12000)}` : ""),
    );
    return true;
  } catch {
    return false;
  }
}
