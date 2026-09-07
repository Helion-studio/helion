import { NextResponse } from "next/server";
import { recordMessage } from "@/lib/db";
import { getSupabase } from "@/lib/supabase";
import { sendEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

/**
 * POST /api/contact — project inquiry from the contact form.
 * Stores in Supabase `inquiries` (fallback: SQLite `messages`) and
 * notifies the team by email (Resend when keyed, outbox otherwise).
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const brief = typeof body.brief === "string" ? body.brief.trim() : "";
    const company = typeof body.company === "string" ? body.company.trim() : undefined;

    if (!name || !brief || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "invalid payload" }, { status: 400 });
    }

    const sb = getSupabase();
    if (sb) {
      try {
        await sb.from("inquiries").insert({
          source: "form",
          name,
          email,
          company: company ?? null,
          brief,
        });
      } catch {
        recordMessage({ name, email, company, brief });
      }
    } else {
      recordMessage({ name, email, company, brief });
    }

    await sendEmail(
      `📩 New project inquiry — ${name}${company ? ` (${company})` : ""}`,
      `NAME: ${name}\nEMAIL: ${email}\nCOMPANY: ${company ?? "—"}\n\nBRIEF:\n${brief}`,
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "bad request" }, { status: 400 });
  }
}
