"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Mic, Send, Sparkles, Square, Volume2, VolumeX, X } from "lucide-react";
import { site } from "@/lib/site";

/**
 * The site-wide AI chat widget.
 *
 * - Talks to /api/chat (Groq when keyed, content-aware fallback otherwise)
 * - STT: hold-to-talk via MediaRecorder → /api/ai?op=stt
 * - TTS: speak replies via /api/ai?op=tts (toggle + per-message button)
 * - "Send to team": hands the transcript to /api/handoff → summary → email
 * - "Book a project": mini form → /api/handoff type=booking
 * Voice controls auto-hide when the AI endpoints report unavailable.
 */

type Msg = { role: "user" | "assistant"; content: string };
type Caps = { chat: boolean; tts: boolean; stt: boolean; email: boolean };

const QUICK = ["Who's the team?", "How do you work?", "What does it cost?", "Book a project"];

export function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [caps, setCaps] = useState<Caps>({ chat: true, tts: false, stt: false, email: false });
  const [speak, setSpeak] = useState(false);
  const [recording, setRecording] = useState(false);
  const [panel, setPanel] = useState<"none" | "handoff" | "book" | "sent">("none");
  const [hName, setHName] = useState("");
  const [hEmail, setHEmail] = useState("");
  const [hBrief, setHBrief] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const sessionIdRef = useRef<string>("");

  // capabilities + persistent session id
  useEffect(() => {
    fetch("/api/ai")
      .then((r) => r.json())
      .then((c: Caps) => setCaps(c))
      .catch(() => {});
    try {
      let sid = sessionStorage.getItem("tnt.chat.sid") ?? "";
      if (!sid) {
        sid = crypto.randomUUID();
        sessionStorage.setItem("tnt.chat.sid", sid);
      }
      sessionIdRef.current = sid;
    } catch {}
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, panel, open]);

  const greet: Msg = {
    role: "assistant",
    content: `Hey — I'm the ${site.name} assistant. Ask me about the team, our process, what we've shipped… or say "book" and I'll set you up with the engineers directly.`,
  };

  async function say(text: string) {
    if (!caps.tts || !speak) return;
    try {
      const res = await fetch("/api/ai?op=tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => URL.revokeObjectURL(url);
      await audio.play().catch(() => {});
    } catch {}
  }

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || busy) return;
    setInput("");
    setBusy(true);
    const next = [...(msgs.length ? msgs : [greet]), { role: "user" as const, content }];
    setMsgs(next);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.filter((m) => m !== greet).map(({ role, content: c }) => ({ role, content: c })),
          sessionId: sessionIdRef.current,
        }),
      });
      const json = (await res.json()) as { reply?: string };
      const reply = json.reply ?? "I tripped over a cable — try that again?";
      setMsgs([...next, { role: "assistant", content: reply }]);
      void say(reply);
    } catch {
      setMsgs([...next, { role: "assistant", content: "Network hiccup — once more?" }]);
    } finally {
      setBusy(false);
    }
  }

  async function toggleRecording() {
    if (recording) {
      recorderRef.current?.stop();
      setRecording(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        if (!blob.size) return;
        setBusy(true);
        try {
          const form = new FormData();
          form.append("audio", blob, "speech.webm");
          const res = await fetch("/api/ai?op=stt", { method: "POST", body: form });
          const json = (await res.json()) as { text?: string };
          if (json.text) setInput((v) => (v ? `${v} ${json.text}` : (json.text as string)));
        } catch {
        } finally {
          setBusy(false);
        }
      };
      recorderRef.current = rec;
      rec.start();
      setRecording(true);
    } catch {
      // mic denied — ignore
    }
  }

  async function handoff() {
    setBusy(true);
    try {
      const res = await fetch("/api/handoff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: panel === "book" ? "booking" : "conversation",
          name: hName || undefined,
          email: hEmail || undefined,
          brief: panel === "book" ? hBrief : undefined,
          transcript: msgs.map(({ role, content }) => ({ role, content })),
        }),
      });
      const json = (await res.json()) as { ok?: boolean };
      setPanel(json.ok ? "sent" : "none");
    } catch {
      setPanel("none");
    } finally {
      setBusy(false);
    }
  }

  const field =
    "w-full rounded-lg border border-white/10 bg-[#060a10] px-3 py-2 text-[13px] text-white placeholder:text-white/30 outline-none transition-colors focus:border-arc/60";

  return (
    <>
      {/* launcher */}
      <motion.button
        type="button"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.5, ease: "backOut" }}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Chat with us"}
        className="fixed right-5 bottom-5 z-[80] flex size-13 items-center justify-center rounded-full border border-white/10 bg-[#0a0e15] text-white shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-colors hover:border-arc/50 hover:shadow-[0_0_24px_rgba(59,130,246,0.3)]"
      >
        {open ? (
          <X className="size-5" />
        ) : (
          <span className="relative">
            <Sparkles className="size-5 text-[#9ccbff]" />
            <span
              aria-hidden
              className="animate-pulse-dot absolute -top-1 -right-1 size-2 rounded-full bg-energy"
            />
          </span>
        )}
      </motion.button>

      {/* panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            role="dialog"
            aria-label="Chat with Top-notch Team"
            className="fixed right-5 bottom-21 z-[80] flex h-[min(560px,72svh)] w-[calc(100vw-2.5rem)] max-w-[400px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0e15] shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
          >
            {/* header */}
            <div className="flex items-center gap-3 border-b border-white/[0.07] px-4 py-3">
              <span className="flex size-8 items-center justify-center rounded-full bg-arc/15 text-[#9ccbff]">
                <Sparkles className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-[13px] font-semibold text-white">
                  {site.fullName}
                </p>
                <p className="flex items-center gap-1.5 text-micro text-white/40">
                  <span
                    aria-hidden
                    className={`size-1.5 rounded-full ${caps.chat ? "bg-energy" : "bg-white/30"}`}
                  />
                  {caps.chat ? "AI online — answers in seconds" : "Assistant (offline mode)"}
                </p>
              </div>
              {caps.tts && (
                <button
                  type="button"
                  onClick={() => setSpeak((v) => !v)}
                  aria-label={speak ? "Mute voice replies" : "Speak replies aloud"}
                  title={speak ? "Mute replies" : "Speak replies"}
                  className={`flex size-8 items-center justify-center rounded-full border border-white/10 transition-colors ${
                    speak ? "text-[#9ccbff]" : "text-white/40 hover:text-white"
                  }`}
                >
                  {speak ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
                </button>
              )}
            </div>

            {/* messages */}
            <div ref={scrollRef} className="chat-scroll flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {(msgs.length ? msgs : [greet]).map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`group max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                      m.role === "user"
                        ? "rounded-br-md bg-arc/20 text-white"
                        : "rounded-bl-md bg-white/[0.05] text-white/85"
                    }`}
                  >
                    {m.content}
                    {m.role === "assistant" && caps.tts && (
                      <button
                        type="button"
                        onClick={() => say(m.content)}
                        aria-label="Play this reply"
                        className="mt-1.5 flex items-center gap-1 text-micro text-white/35 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <Volume2 className="size-3" /> play
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {busy && (
                <div className="flex justify-start">
                  <div className="flex gap-1 rounded-2xl rounded-bl-md bg-white/[0.05] px-4 py-3">
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className="size-1.5 animate-bounce rounded-full bg-white/40"
                        style={{ animationDelay: `${d * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* quick actions */}
              {msgs.length === 0 &&
                QUICK.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => (q === "Book a project" ? (setPanel("book"), setOpen(true)) : send(q))}
                    className="block w-full rounded-xl border border-white/10 bg-white/[0.02] px-3.5 py-2.5 text-left text-[13px] text-white/70 transition-colors hover:border-arc/40 hover:text-white"
                  >
                    {q}
                  </button>
                ))}

              {/* handoff / booking panel */}
              {panel === "handoff" || panel === "book" ? (
                <div className="space-y-2.5 rounded-xl border border-white/10 bg-[#060a10] p-3.5">
                  <p className="font-display text-micro font-medium tracking-[0.1em] text-white/45 uppercase">
                    {panel === "book" ? "Book a project" : "Send this conversation"}
                  </p>
                  <input
                    value={hName}
                    onChange={(e) => setHName(e.target.value)}
                    placeholder={panel === "book" ? "Your name *" : "Your name (optional)"}
                    className={field}
                  />
                  <input
                    value={hEmail}
                    onChange={(e) => setHEmail(e.target.value)}
                    type="email"
                    placeholder={panel === "book" ? "Email *" : "Email (optional)"}
                    className={field}
                  />
                  {panel === "book" && (
                    <textarea
                      value={hBrief}
                      onChange={(e) => setHBrief(e.target.value)}
                      rows={3}
                      placeholder="What are you building? *"
                      className={`${field} resize-y`}
                    />
                  )}
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handoff}
                      disabled={busy || (panel === "book" && (!hName || !hEmail || !hBrief))}
                      className="flex-1 rounded-lg bg-white px-3 py-2 font-display text-[13px] font-medium text-void transition-opacity disabled:opacity-40"
                    >
                      {busy ? "Sending…" : panel === "book" ? "Send booking" : "Send to team"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPanel("none")}
                      className="rounded-lg border border-white/10 px-3 py-2 text-[13px] text-white/50 transition-colors hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : null}

              {panel === "sent" && (
                <div className="rounded-xl border border-arc/30 bg-arc/10 p-4 text-[13px] text-white/80">
                  Sent. An engineer will reply within one business day — usually much faster.
                </div>
              )}
            </div>

            {/* footer actions */}
            <div className="flex items-center gap-2 border-t border-white/[0.07] px-3 py-2.5">
              {msgs.length > 0 && panel === "none" && (
                <button
                  type="button"
                  onClick={() => setPanel("handoff")}
                  className="rounded-full border border-white/10 px-3 py-1.5 text-micro font-medium tracking-[0.06em] text-white/55 uppercase transition-colors hover:border-arc/40 hover:text-white"
                >
                  Send to team
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setPanel("book");
                }}
                className="rounded-full border border-white/10 px-3 py-1.5 text-micro font-medium tracking-[0.06em] text-white/55 uppercase transition-colors hover:border-arc/40 hover:text-white"
              >
                Book
              </button>
            </div>

            {/* input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void send();
              }}
              className="flex items-center gap-2 border-t border-white/[0.07] p-3"
            >
              {caps.stt && (
                <button
                  type="button"
                  onClick={toggleRecording}
                  aria-label={recording ? "Stop recording" : "Speak your message"}
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    recording
                      ? "border-energy bg-energy/15 text-energy"
                      : "border-white/10 text-white/50 hover:text-white"
                  }`}
                >
                  {recording ? <Square className="size-3.5" /> : <Mic className="size-4" />}
                </button>
              )}
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={recording ? "Listening…" : "Ask anything…"}
                className="min-w-0 flex-1 rounded-full border border-white/10 bg-[#060a10] px-4 py-2.5 text-[13px] text-white placeholder:text-white/30 outline-none transition-colors focus:border-arc/60"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Send message"
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-void transition-opacity disabled:opacity-40"
              >
                <Send className="size-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
