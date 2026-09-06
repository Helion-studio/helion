"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Lightweight first-party analytics beacon.
 *
 * Generates and persists:
 *   browser id  → localStorage   ("tnt.bid")  — one per browser
 *   session id  → sessionStorage ("tnt.sid")  — one per tab session
 * and POSTs a pageview to /api/visit on mount and on every route change.
 * The server stores it all in SQLite (visitors / sessions / events).
 * Fire-and-forget with keepalive; failures are silently ignored.
 */
export function VisitTracker() {
  const pathname = usePathname();
  const bid = useRef<string>("");
  const sid = useRef<string>("");

  useEffect(() => {
    try {
      bid.current = localStorage.getItem("tnt.bid") ?? "";
      if (!bid.current) {
        bid.current = crypto.randomUUID();
        localStorage.setItem("tnt.bid", bid.current);
      }
      sid.current = sessionStorage.getItem("tnt.sid") ?? "";
      if (!sid.current) {
        sid.current = crypto.randomUUID();
        sessionStorage.setItem("tnt.sid", sid.current);
      }
    } catch {
      return; // storage blocked — no tracking, no problem
    }

    const send = () => {
      fetch("/api/visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          browserId: bid.current,
          sessionId: sid.current,
          path: pathname,
          referrer: document.referrer || undefined,
          language: navigator.language,
          platform:
            (navigator as Navigator & { userAgentData?: { platform?: string } })
              .userAgentData?.platform ?? navigator.platform,
          screen: `${window.screen.width}x${window.screen.height}`,
        }),
      }).catch(() => {});
    };

    send();
  }, [pathname]);

  return null;
}
