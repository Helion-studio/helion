import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { recordVisit } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * POST /api/visit — records a pageview.
 * Body: { browserId, sessionId, path, referrer?, language?, platform?, screen? }
 * The user-agent is taken server-side from request headers (never trusted
 * from the client). Always returns 200 so analytics never breaks the UX.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const browserId = typeof body.browserId === "string" ? body.browserId.slice(0, 64) : "";
    const sessionId = typeof body.sessionId === "string" ? body.sessionId.slice(0, 64) : "";
    const path = typeof body.path === "string" ? body.path.slice(0, 200) : "/";

    if (!browserId || !sessionId) {
      return NextResponse.json({ ok: false, error: "missing ids" }, { status: 400 });
    }

    const h = await headers();
    const ok = recordVisit({
      browserId,
      sessionId,
      path,
      referrer: typeof body.referrer === "string" ? body.referrer.slice(0, 300) : undefined,
      userAgent: (h.get("user-agent") ?? undefined)?.slice(0, 300),
      language: typeof body.language === "string" ? body.language.slice(0, 40) : undefined,
      platform: typeof body.platform === "string" ? body.platform.slice(0, 80) : undefined,
      screen: typeof body.screen === "string" ? body.screen.slice(0, 20) : undefined,
    });

    return NextResponse.json({ ok });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
