import { NextResponse } from "next/server";
import { groqSummarize } from "@/lib/groq";
import { sendEmail } from "@/lib/email";
import { getSupabase } from "@/lib/supabase";
import { recordHandoff } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * POST /api/handoff — the "send this conversation / booking to the team" pipe.
 *
 * 1. Groq summarizes the transcript (when keyed).
 * 2. Stored as an inquiry: Supabase when configured, SQLite otherwise.
 * 3. Emailed to CONTACT_EMAIL via Resend (or parked in the outbox).
 *
 * Body: {
 *   type: 'conversation' | 'booking',
 *   transcript?: [{role, content}],
 *   name?, email?, brief?    (booking collects these; chat may not)
 * }
 */

function transcriptText(
  transcript: { role?: string; content?: string }[] | undefined,
): string {
  if (!Array.isArray(transcript)) return "";
  return transcript
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => `${m.role === "user" ? "CLIENT" : "ASSISTANT"}: ${m.content}`)
    .join("\n")
    .slice(0, 12000);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      type?: string;
      transcript?: { role?: string; content?: string }[];
      name?: string;
      email?: string;
      brief?: string;
    };

    const type = body.type === "booking" ? "booking" : "conversation";
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : undefined;
    const email = typeof body.email === "string" ? body.email.trim().slice(0, 200) : undefined;
    const brief = typeof body.brief === "string" ? body.brief.trim().slice(0, 4000) : "";
    const transcript = transcriptText(body.transcript);

    if (type === "booking" && (!name || !email || !brief)) {
      return NextResponse.json({ ok: false, error: "name, email and brief required" }, { status: 400 });
    }
    if (type === "conversation" && !transcript) {
      return NextResponse.json({ ok: false, error: "nothing to send" }, { status: 400 });
    }

    // 1. summarize (Groq when available)
    const summary =
      (await groqSummarize(
        [brief, transcript].filter(Boolean).join("\n\n---\n\n"),
      )) ?? null;

    // 2. store (Supabase → SQLite fallback)
    const sb = getSupabase();
    if (sb) {
      try {
        await sb.from("inquiries").insert({
          source: type,
          name: name ?? null,
          email: email ?? null,
          brief: brief || "(chat conversation)",
          summary,
          transcript: transcript || null,
        });
      } catch {
        recordHandoff({ source: type === "booking" ? "booking" : "chat", name, email, brief: brief || "(chat)", summary: summary ?? undefined, transcript: transcript || undefined });
      }
    } else {
      recordHandoff({ source: type === "booking" ? "booking" : "chat", name, email, brief: brief || "(chat)", summary: summary ?? undefined, transcript: transcript || undefined });
    }

    // 3. email the team
    const subject =
      type === "booking"
        ? `🔧 New booking request — ${name}${summary ? " (AI-summarized)" : ""}`
        : `💬 Chat handoff — ${name || "anonymous visitor"}${summary ? " (AI-summarized)" : ""}`;
    const bodyText = [
      summary ? `AI SUMMARY:\n${summary}` : null,
      name ? `\nNAME: ${name}` : null,
      email ? `\nEMAIL: ${email}` : null,
      brief ? `\nBRIEF:\n${brief}` : null,
      transcript ? `\n--- FULL TRANSCRIPT ---\n${transcript}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const { delivered } = await sendEmail(subject, bodyText);

    return NextResponse.json({ ok: true, summary, emailed: delivered });
  } catch {
    return NextResponse.json({ ok: false, error: "bad request" }, { status: 400 });
  }
}
