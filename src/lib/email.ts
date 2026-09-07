import { recordOutbox } from "@/lib/db";

/**
 * Transactional email via Resend's REST API (no SDK).
 *
 * .env.local:
 *   RESEND_API_KEY=re_...
 *   CONTACT_EMAIL=hello@topnotch.team     (where handoffs are sent)
 *
 * Without a key the email is stored in the outbox (Supabase when
 * configured, SQLite otherwise) so nothing is ever lost — it just
 * doesn't leave the building.
 */

const FROM = process.env.EMAIL_FROM || "Top-notch Team <onboarding@resend.dev>";
const TO = process.env.CONTACT_EMAIL || "hello@topnotch.team";

export async function sendEmail(subject: string, body: string): Promise<{ delivered: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;

  if (apiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: FROM,
          to: [TO],
          subject,
          text: body,
        }),
      });
      if (res.ok) {
        await recordOutbox(TO, subject, body, true, "resend");
        return { delivered: true };
      }
    } catch {
      // fall through to outbox
    }
  }

  await recordOutbox(TO, subject, body, false, null);
  return { delivered: false };
}
