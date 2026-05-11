import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

/**
 * AssemblyHeaderMobile — 56px companion to AssemblyHeader.
 *
 * Renders below the 800px breakpoint (desktop header is hidden there).
 * Reuses the same factory voice / brass ink palette / progress + stage math
 * but drops the conveyor belt, robot arms, sparks and design canvas, which
 * don't fit a phone. Tap "☰" to open a full-screen station picker.
 */

const INK = "hsl(38 50% 58%)";
const INK_BRIGHT = "hsl(38 55% 65%)";
const INK_DIM = "hsl(38 35% 52%)";
const BORDER_DASH = "hsl(38 40% 45%)";

const NAV = [
  { key: "home", label: "Home" },
  { key: "about", label: "About" },
  { key: "work", label: "Work" },
  { key: "think", label: "Think" },
  { key: "skill", label: "Skill" },
  { key: "path", label: "Path" },
  { key: "write", label: "Write" },
  { key: "send", label: "Send" },
];

type Props = {
  panelIds: string[];
};

export function AssemblyHeaderMobile({ panelIds }: Props) {
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      setProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Lock body scroll while the sheet is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const stage = Math.min(7, Math.floor(progress * 8));
  const stageProg = progress * 8 - stage;
  const partCount = Math.min(8, stage + (stageProg > 0 ? 1 : 0));
  const activeLabel = NAV[stage]?.label ?? "Home";

  const jumpTo = (i: number) => {
    const target = document.getElementById(panelIds[i]);
    setOpen(false);
    if (!target) return;
    // Bypass global `[id] { scroll-margin-top: 100px }` like the desktop header.
    const top = target.getBoundingClientRect().top + window.scrollY - 56;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: "hsla(220, 15%, 12%, 0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: `0.5px solid ${BORDER_DASH}`,
        }}
      >
        {/* Progress bar — same data as desktop spine, horizontal */}
        <div
          className="h-[2px] w-full"
          style={{ background: "hsl(38 25% 20% / 0.5)" }}
        >
          <div
            className="h-full transition-[width] duration-150 ease-out"
            style={{
              width: `${progress * 100}%`,
              background: INK_BRIGHT,
              opacity: 0.85,
            }}
          />
        </div>

        {/* Status row */}
        <div className="flex items-center justify-between px-3 h-[54px] gap-2">
          <div
            className="flex items-center gap-2 min-w-0"
            style={{
              fontFamily: "monospace",
              fontSize: 10,
              letterSpacing: "1px",
              color: INK,
            }}
          >
            <span style={{ color: INK_BRIGHT }}>●</span>
            <span className="whitespace-nowrap">GB·BUILD.OS</span>
            <span className="opacity-60 whitespace-nowrap hidden min-[380px]:inline">
              PARTS·
              <span style={{ color: INK_BRIGHT }}>
                {String(partCount).padStart(2, "0")}
              </span>
              /08
            </span>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 h-11 px-3 -mr-1"
            style={{
              fontFamily: "Playfair Display, Georgia, serif",
              fontStyle: "italic",
              fontSize: 14,
              color: "hsl(38 65% 74%)",
              border: `0.5px solid ${BORDER_DASH}`,
              background: "transparent",
            }}
            aria-label="Open navigation"
          >
            <span className="max-w-[90px] truncate">{activeLabel}</span>
            <Menu size={16} strokeWidth={1.5} style={{ color: INK_BRIGHT }} />
          </button>
        </div>
      </div>

      {/* Full-screen station sheet */}
      {open && (
        <div
          className="fixed inset-0 z-[60] flex flex-col"
          style={{
            background: "hsla(220, 15%, 10%, 0.97)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          {/* Sheet header */}
          <div
            className="flex items-center justify-between px-3 h-[56px]"
            style={{ borderBottom: `0.5px dashed ${BORDER_DASH}` }}
          >
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 10,
                color: INK,
                letterSpacing: "1.5px",
              }}
            >
              ─── STATIONS ·{" "}
              <span style={{ color: INK_DIM }}>
                {String(stage + 1).padStart(2, "0")}/08
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close navigation"
              className="flex items-center justify-center h-11 w-11 -mr-2"
              style={{ color: INK_DIM }}
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>

          {/* Station list */}
          <ul className="flex-1 overflow-y-auto px-6 py-6 space-y-1">
            {NAV.map((item, i) => {
              const isActive = i === stage;
              const isDone = i < stage;
              const color = isActive
                ? "hsl(38 65% 74%)"
                : isDone
                  ? "hsl(38 52% 62%)"
                  : INK;
              return (
                <li key={item.key}>
                  <button
                    onClick={() => jumpTo(i)}
                    className="w-full flex items-baseline gap-4 py-3 text-left"
                    style={{ color }}
                  >
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: 11,
                        color: INK_DIM,
                        letterSpacing: "1px",
                        minWidth: 28,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      style={{
                        fontFamily: "Playfair Display, Georgia, serif",
                        fontStyle: "italic",
                        fontSize: 32,
                        fontWeight: isActive ? 500 : 400,
                        lineHeight: 1.1,
                      }}
                    >
                      {item.label}
                    </span>
                    {isActive && (
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontSize: 9,
                          color: INK_BRIGHT,
                          letterSpacing: "1.5px",
                          marginLeft: "auto",
                        }}
                      >
                        ● ACTIVE
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Sheet footer — instrumentation line */}
          <div
            className="px-4 py-3 flex items-center justify-between"
            style={{
              borderTop: `0.5px dashed ${BORDER_DASH}`,
              fontFamily: "monospace",
              fontSize: 9,
              color: INK_DIM,
              letterSpacing: "1px",
            }}
          >
            <span>
              PARTS·
              <span style={{ color: INK_BRIGHT }}>
                {String(partCount).padStart(2, "0")}
              </span>
              /08
            </span>
            <span>BUILD·{Math.round(progress * 100)}%</span>
          </div>
        </div>
      )}
    </>
  );
}
