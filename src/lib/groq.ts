/**
 * Groq AI — chat, summarization, TTS (playai-tts) and STT (whisper).
 *
 * OpenAI-compatible REST, straight fetch — no SDK. Every helper returns
 * null when GROQ_API_KEY is unset so routes can degrade gracefully.
 *
 * .env.local:
 *   GROQ_API_KEY=gsk_...
 *   GROQ_CHAT_MODEL=llama-3.3-70b-versatile     (optional)
 *   GROQ_TTS_VOICE=Chip-PlayAI                  (optional)
 */

const BASE = "https://api.groq.com/openai/v1";

const CHAT_MODEL = process.env.GROQ_CHAT_MODEL || "llama-3.3-70b-versatile";
const FAST_MODEL = process.env.GROQ_FAST_MODEL || "llama-3.1-8b-instant";
const TTS_MODEL = "playai-tts";
const TTS_VOICE = process.env.GROQ_TTS_VOICE || "Chip-PlayAI";
const STT_MODEL = "whisper-large-v3-turbo";

export const groqEnabled = () => Boolean(process.env.GROQ_API_KEY);

const key = () => process.env.GROQ_API_KEY;

export type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

/** Chat completion → assistant text (null on any failure). */
export async function groqChat(messages: ChatMessage[]): Promise<string | null> {
  if (!key()) return null;
  try {
    const res = await fetch(`${BASE}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key()}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: CHAT_MODEL, messages, temperature: 0.6, max_tokens: 600 }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    return json.choices?.[0]?.message?.content?.trim() ?? null;
  } catch {
    return null;
  }
}

/** Summarize a chat transcript / brief into a tight handoff paragraph. */
export async function groqSummarize(text: string): Promise<string | null> {
  if (!key()) return null;
  try {
    const res = await fetch(`${BASE}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key()}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: FAST_MODEL,
        temperature: 0.2,
        max_tokens: 300,
        messages: [
          {
            role: "system",
            content:
              "Summarize this client conversation for an engineering team's inbox. Capture: who the client is, what they want, urgency, budget/timeline signals if any, and the single recommended next step. Max 6 sentences, plain text, no preamble.",
          },
          { role: "user", content: text.slice(0, 12000) },
        ],
      }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    return json.choices?.[0]?.message?.content?.trim() ?? null;
  } catch {
    return null;
  }
}

/** Text → spoken audio (WAV bytes), or null when unavailable. */
export async function groqTTS(text: string): Promise<ArrayBuffer | null> {
  if (!key()) return null;
  try {
    const res = await fetch(`${BASE}/audio/speech`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key()}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: TTS_MODEL,
        voice: TTS_VOICE,
        input: text.slice(0, 1500),
        response_format: "wav",
      }),
    });
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

/** Audio blob (webm/ogg/wav/mp3…) → transcript text, or null. */
export async function groqSTT(file: Blob, filename: string): Promise<string | null> {
  if (!key()) return null;
  try {
    const form = new FormData();
    form.append("file", file, filename);
    form.append("model", STT_MODEL);
    form.append("response_format", "json");
    const res = await fetch(`${BASE}/audio/transcriptions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key()}` },
      body: form,
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { text?: string };
    return json.text?.trim() ?? null;
  } catch {
    return null;
  }
}
