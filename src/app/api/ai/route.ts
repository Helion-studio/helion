import { NextResponse } from "next/server";
import { groqEnabled, groqTTS, groqSTT } from "@/lib/groq";
import { getSupabase, supabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * GET  /api/ai         → capability flags for the chat widget UI
 * POST /api/ai?op=tts  → { text }  → audio/wav (Groq playai-tts)
 * POST /api/ai?op=stt  → FormData { audio } → { text } (whisper-large-v3-turbo)
 *
 * Both POST ops return 503 with { ok:false } when GROQ_API_KEY is unset,
 * so the widget can hide voice controls gracefully.
 */

export async function GET() {
  return NextResponse.json({
    chat: groqEnabled(),
    tts: groqEnabled(),
    stt: groqEnabled(),
    email: Boolean(process.env.RESEND_API_KEY),
    supabase: supabaseConfigured,
  });
}

export async function POST(req: Request) {
  const op = new URL(req.url).searchParams.get("op");

  if (op === "tts") {
    if (!groqEnabled()) {
      return NextResponse.json({ ok: false, error: "tts unavailable" }, { status: 503 });
    }
    try {
      const { text } = (await req.json()) as { text?: string };
      if (!text || typeof text !== "string") {
        return NextResponse.json({ ok: false, error: "text required" }, { status: 400 });
      }
      const audio = await groqTTS(text);
      if (!audio) {
        return NextResponse.json({ ok: false, error: "tts failed" }, { status: 502 });
      }
      return new Response(audio, {
        headers: { "Content-Type": "audio/wav", "Cache-Control": "no-store" },
      });
    } catch {
      return NextResponse.json({ ok: false, error: "bad request" }, { status: 400 });
    }
  }

  if (op === "stt") {
    if (!groqEnabled()) {
      return NextResponse.json({ ok: false, error: "stt unavailable" }, { status: 503 });
    }
    try {
      const form = await req.formData();
      const audio = form.get("audio");
      if (!(audio instanceof Blob) || audio.size === 0) {
        return NextResponse.json({ ok: false, error: "audio required" }, { status: 400 });
      }
      if (audio.size > 15 * 1024 * 1024) {
        return NextResponse.json({ ok: false, error: "audio too large" }, { status: 413 });
      }
      const text = await groqSTT(audio, "speech.webm");
      if (text === null) {
        return NextResponse.json({ ok: false, error: "stt failed" }, { status: 502 });
      }
      return NextResponse.json({ ok: true, text });
    } catch {
      return NextResponse.json({ ok: false, error: "bad request" }, { status: 400 });
    }
  }

  return NextResponse.json({ ok: false, error: "unknown op" }, { status: 400 });
}

// keep tree-shaking honest — getSupabase referenced for future ops
void getSupabase;
