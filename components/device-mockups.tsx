/**
 * Layered device composition: desktop browser mockup as the base layer,
 * with a tablet overlapping bottom-left and a phone overlapping bottom-right.
 *
 * Built from divs (no image assets) so it stays crisp at any size.
 * The screens show representative product UI — swap the inner content
 * for real screenshots when you have them.
 */

const BARS = [38, 62, 45, 80, 58, 95, 72, 88, 54, 70];

function DesktopMockup() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_28px_60px_-24px_rgba(16,24,40,0.28)]">
      {/* browser chrome */}
      <div className="flex items-center gap-3 border-b border-line bg-canvas-alt/70 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="mx-auto flex w-40 items-center justify-center rounded-md border border-line bg-white px-3 py-1">
          <span className="text-[9px] text-subtle">helion.studio</span>
        </div>
      </div>

      {/* app */}
      <div className="flex">
        {/* sidebar */}
        <div className="hidden w-36 shrink-0 border-r border-line p-4 sm:block">
          <div className="h-2 w-16 rounded-full bg-ink/15" />
          <div className="mt-4 space-y-2.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${
                  i === 1 ? "bg-accent-soft" : ""
                }`}
              >
                <span
                  className={`size-2 rounded-sm ${i === 1 ? "bg-accent" : "bg-ink/15"}`}
                />
                <span
                  className={`h-1.5 w-14 rounded-full ${i === 1 ? "bg-accent/40" : "bg-ink/10"}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* main */}
        <div className="flex-1 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="h-2.5 w-24 rounded-full bg-ink/20" />
            <div className="h-5 w-16 rounded-md bg-accent/10" />
          </div>

          {/* stat cards */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { v: "12.4k", l: "Requests" },
              { v: "99.9%", l: "Uptime" },
              { v: "48ms", l: "Latency" },
            ].map((s) => (
              <div key={s.l} className="rounded-lg border border-line bg-canvas-alt/50 p-2.5">
                <div className="text-[11px] font-semibold text-ink/70">{s.v}</div>
                <div className="mt-1 h-1 w-full rounded-full bg-ink/10" />
                <div className="mt-1.5 text-[8px] uppercase tracking-wide text-subtle">
                  {s.l}
                </div>
              </div>
            ))}
          </div>

          {/* chart */}
          <div className="mt-4 rounded-lg border border-line bg-canvas-alt/50 p-3">
            <div className="flex h-20 items-end gap-1.5">
              {BARS.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm"
                  style={{
                    height: `${h}%`,
                    background: i > 6 ? "#1e55fe" : "rgba(30,85,254,0.28)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* rows */}
          <div className="mt-4 space-y-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 rounded-md border border-line px-2.5 py-2"
              >
                <span className="size-3 rounded-full bg-accent/20" />
                <span className="h-1.5 flex-1 rounded-full bg-ink/10" />
                <span className="h-1.5 w-8 rounded-full bg-ink/10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TabletMockup() {
  return (
    <div className="rounded-2xl border border-line bg-white p-2 shadow-[0_18px_38px_-14px_rgba(16,24,40,0.30)]">
      <div className="rounded-xl border border-line bg-canvas-alt/40 p-3">
        <div className="h-2 w-12 rounded-full bg-ink/15" />
        {/* kanban columns */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[0, 1, 2].map((col) => (
            <div key={col} className="space-y-1.5">
              <div
                className="h-1.5 w-full rounded-full"
                style={{
                  background: col === 0 ? "rgba(30,85,254,0.5)" : "rgba(14,18,28,0.12)",
                }}
              />
              {Array.from({ length: col === 1 ? 3 : 2 }).map((_, r) => (
                <div key={r} className="rounded-md border border-line bg-white p-1.5">
                  <div className="h-1 w-full rounded-full bg-ink/10" />
                  <div className="mt-1 h-1 w-2/3 rounded-full bg-ink/10" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileMockup() {
  return (
    <div className="rounded-[1.4rem] border border-line bg-white p-1.5 shadow-[0_16px_34px_-12px_rgba(16,24,40,0.32)]">
      <div className="overflow-hidden rounded-[1.1rem] border border-line bg-canvas-alt/40 p-2.5">
        {/* notch */}
        <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-ink/15" />
        <div className="flex items-center justify-between">
          <div className="h-1.5 w-8 rounded-full bg-ink/20" />
          <div className="size-3 rounded-full bg-accent/25" />
        </div>
        <div className="mt-2.5 rounded-lg bg-accent/10 p-2">
          <div className="text-[10px] font-bold text-accent">+24.8%</div>
          <div className="mt-1 h-1 w-full rounded-full bg-white/70" />
        </div>
        <div className="mt-2 space-y-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-ink/10" />
              <span className="h-1 flex-1 rounded-full bg-ink/10" />
            </div>
          ))}
        </div>
        {/* tab bar */}
        <div className="mt-3 flex items-center justify-around border-t border-line pt-2">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`size-1.5 rounded-full ${i === 0 ? "bg-accent" : "bg-ink/15"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function DeviceMockups() {
  return (
    <div className="relative mx-auto w-full max-w-[620px] pb-16">
      <DesktopMockup />

      {/* tablet overlapping bottom-left */}
      <div className="absolute bottom-0 left-0 z-20 w-[42%]">
        <TabletMockup />
      </div>

      {/* phone overlapping bottom-right */}
      <div className="absolute bottom-2 right-0 z-20 w-[21%]">
        <MobileMockup />
      </div>
    </div>
  );
}
