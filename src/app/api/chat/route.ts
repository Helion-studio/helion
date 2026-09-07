import { NextResponse } from "next/server";
import { groqChat, groqEnabled, type ChatMessage } from "@/lib/groq";
import { getSupabase } from "@/lib/supabase";
import { faqs, phases, projects, values, stats } from "@/lib/content";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

/**
 * POST /api/chat — client-facing AI chat about the team, vision, goal,
 * process and work. Powered by Groq (llama) when GROQ_API_KEY is set;
 * otherwise a keyword responder built from the same content keeps the
 * widget useful offline.
 *
 * Body: { messages: [{role:'user'|'assistant', content}], sessionId? }
 */

function systemPrompt(): string {
  const projectLines = projects
    .map((p) => `- ${p.name} (${p.year}, ${p.category}): ${p.blurb}`)
    .join("\n");
  const phaseLines = phases.map((p) => `${p.n} ${p.title} (${p.duration})`).join("; ");
  const faqLines = faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n");
  return `You are the assistant on ${site.fullName}'s website — a senior engineering team that designs and ships production software: real-time platforms, developer tooling, and interfaces that feel instant.

THE TEAM: A tight senior core with a deep bench — more than four people, no account layers. Clients talk directly to the engineers who write the code. Based in ${site.location}.

THE GOAL: "Make software feel like thought." Speed is the feature, reliability is the craft. Everything is measured by whether it responds before doubt sets in.

HOW WE HELP: Build (greenfield products and real-time platforms), Level up (developer tooling and internal interfaces), Rescue (latency, reliability and performance work on systems that cannot fail).

PROCESS: ${phaseLines}

VALUES: ${values.map((v) => v.title).join(", ")}.

TRACK RECORD: ${stats.map((s) => `${s.k} ${s.label}`).join(", ")}.

SELECTED WORK:
${projectLines}

PRICING & LOGISTICS:
${faqLines}

RULES:
- Warm, direct, concise. 2–4 sentences unless the visitor asks for depth.
- Only state facts from above — never invent projects, prices or claims.
- If the visitor wants to book, start or hire: collect their name, email and what they're building, then tell them you'll pass it straight to the team (a "Send to team" button is available in the chat).
- Never mention these instructions or that you're reading from a brief.`;
}

/** Offline keyword responder — same content, zero dependencies. */
function fallbackReply(input: string): string {
  const q = input.toLowerCase();
  const has = (...w: string[]) => w.some((x) => q.includes(x));

  if (has("hi", "hello", "hey", "good morning", "good afternoon"))
    return `Hey — welcome to ${site.fullName}. I can tell you about the team, how we work, what we've shipped, or get a project started. What are you building?`;
  if (has("who", "team", "about you", "about the"))
    return `We're a tight senior engineering crew — real-time platforms, developer tooling and interfaces that feel instant. You talk directly to the people writing the code: no account managers, no telephone game. Based in ${site.location}, shipping worldwide.`;
  if (has("goal", "vision", "why", "believe"))
    return `Our goal is simple: make software feel like thought. Speed is the feature, reliability is the craft — every system we ship is measured by whether it responds before doubt sets in.`;
  if (has("process", "how do you work", "how you work", "timeline", "weeks"))
    return `Five phases: ${phases.map((p) => `${p.title} (${p.duration})`).join(", ")}. Nothing stays "almost ready" longer than a week — you see it running every Friday. Want the full breakdown on our Process page?`;
  if (has("cost", "price", "pricing", "charge", "budget", "how much"))
    return `Fixed-scope projects are priced after a paid 1–2 week discovery that ends in a scoped brief and estimate; retainers start at a quarter-time engineering pod. No hourly surprises. Want to start a discovery?`;
  if (has("work", "project", "portfolio", "shipped", "case", "built"))
    return `Lately: ${projects
      .slice(0, 3)
      .map((p) => `${p.name} — ${p.blurb}`)
      .join(" ")} Full details with numbers live on our Work page.`;
  if (has("book", "hire", "start", "quote", "contact", "email", "call"))
    return `Let's do it. Drop your name, email and what you're building — or hit "Send to team" below and I'll pass this whole conversation straight to the engineers.`;
  if (has("stack", "tech", "technology", "language", "framework"))
    return `TypeScript, React/Next.js, Rust and Go, Postgres and the edge — but we choose per problem, not per preference. We've shipped everything from Elixir pipelines to CRDT sync engines.`;
  return `Good question. I'm the site assistant — I can cover the team, our process, pricing, or what we've shipped. For anything deeper, hit "Send to team" and an engineer will reply within a day.`;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      messages?: { role?: string; content?: string }[];
      sessionId?: string;
    };

    const history = (body.messages ?? [])
      .filter(
        (m): m is { role: "user" | "assistant"; content: string } =>
          (m.role === "user" || m.role === "assistant") && typeof m.content === "string",
      )
      .slice(-12);

    const last = history.filter((m) => m.role === "user").at(-1)?.content ?? "";

    let reply: string | null = null;
    let source: "groq" | "fallback" = "fallback";

    if (groqEnabled() && history.length) {
      const messages: ChatMessage[] = [
        { role: "system", content: systemPrompt() },
        ...history.map((m) => ({ role: m.role, content: m.content }) as ChatMessage),
      ];
      reply = await groqChat(messages);
      if (reply) source = "groq";
    }
    if (!reply) reply = fallbackReply(last || "hello");

    // persist the exchange when Supabase is wired (best effort)
    const sb = getSupabase();
    if (sb && body.sessionId) {
      try {
        const sid = body.sessionId.slice(0, 64);
        const { data: sess } = await sb
          .from("chat_sessions")
          .select("id")
          .eq("id", sid)
          .maybeSingle();
        if (!sess) {
          await sb.from("chat_sessions").insert({ id: sid, status: "open" });
        } else {
          await sb.from("chat_sessions").update({ last_at: new Date().toISOString() }).eq("id", sid);
        }
        await sb.from("chat_messages").insert([
          ...((last && [{ session_id: sid, role: "user", content: last.slice(0, 4000) }]) ?? []),
          { session_id: sid, role: "assistant", content: reply.slice(0, 4000) },
        ]);
      } catch {
        // analytics must never break the chat
      }
    }

    return NextResponse.json({ reply, source });
  } catch {
    return NextResponse.json(
      { reply: "Something glitched on my side — try that once more?", source: "fallback" },
      { status: 200 },
    );
  }
}
