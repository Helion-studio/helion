"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";

/**
 * Project inquiry form → POST /api/contact → stored in the site's SQLite
 * (messages table). No third-party service, no client PII beyond what the
 * visitor types.
 */
export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("bad status");
      setState("done");
      form.reset();
    } catch {
      setState("error");
    }
  }

  const field =
    "w-full rounded-xl border border-white/10 bg-[#060a10] px-4 py-3 text-body text-white placeholder:text-white/30 outline-none transition-colors focus:border-arc/60 focus:ring-2 focus:ring-arc/20";
  const label =
    "mb-2 block font-display text-micro font-medium tracking-[0.12em] text-white/45 uppercase";

  if (state === "done") {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-arc/15 text-[#9ccbff]">
          <Check className="size-6" />
        </span>
        <h2 className="mt-6 font-display text-section font-light tracking-[-0.02em] text-white">
          Message received.
        </h2>
        <p className="mt-3 max-w-[40ch] text-body text-white/60">
          An engineer will reply within one business day. Talk soon.
        </p>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="mt-8 font-display text-nav font-medium text-white/60 underline-offset-4 transition-colors hover:text-white hover:underline"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className={label}>
            Name
          </label>
          <input id="cf-name" name="name" required maxLength={120} placeholder="Ada Obi" className={field} />
        </div>
        <div>
          <label htmlFor="cf-email" className={label}>
            Email
          </label>
          <input
            id="cf-email"
            name="email"
            type="email"
            required
            maxLength={200}
            placeholder="ada@company.com"
            className={field}
          />
        </div>
      </div>
      <div>
        <label htmlFor="cf-company" className={label}>
          Company <span className="text-white/25">— optional</span>
        </label>
        <input id="cf-company" name="company" maxLength={160} placeholder="Company / product" className={field} />
      </div>
      <div>
        <label htmlFor="cf-brief" className={label}>
          What are you building?
        </label>
        <textarea
          id="cf-brief"
          name="brief"
          required
          rows={5}
          maxLength={4000}
          placeholder="The problem, the timeline, what success looks like — anything helps."
          className={`${field} resize-y`}
        />
      </div>

      {state === "error" && (
        <p className="text-body text-[#ff8f8f]" role="alert">
          Something broke on the way — mail us directly at hello@topnotch.team instead.
        </p>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="group inline-flex items-center justify-center gap-2 self-start rounded-full bg-white px-7 py-3.5 font-display text-nav font-medium text-void transition-[transform,box-shadow,opacity] duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(59,130,246,0.25)] disabled:opacity-60"
      >
        {state === "sending" ? "Sending…" : "Send the brief"}
        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
      </button>
    </form>
  );
}
