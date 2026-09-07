import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase server-side access.
 *
 * All reads/writes happen in API routes / server components with the
 * service-role key — the anon key is never used server-side. When the
 * env vars are absent (local dev, no backend yet) every helper returns
 * null and callers fall back to the seed data / SQLite.
 *
 * .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=eyJ...
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseConfigured = Boolean(url && serviceKey);

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!url || !serviceKey) return null;
  if (!client) {
    client = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}

/** Resolve a thumbnail/gallery value: absolute URL passes through,
 *  anything else is treated as a path inside the project-assets bucket. */
export function assetUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  if (/^https?:\/\//.test(value) || value.startsWith("/")) return value;
  const sb = getSupabase();
  if (!sb) return null;
  return sb.storage.from("project-assets").getPublicUrl(value).data.publicUrl;
}
