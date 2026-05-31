import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Mail, Linkedin, FileText } from "lucide-react";
import { useBlogPosts } from "@/hooks/useSiteData";

/**
 * Desk Stage decorations for the final contact + writing viewport.
 *
 * IMPORTANT: this component does NOT render a toolbox. Toolbox continuity is
 * owned by ToolboxToSkillsBridge so the exact same actor that closes after the
 * skills view shrinks and lands into .dsk-toolbox-slot.
 *
 * Phases (p):
 *   0.00–0.15  table edges + perspective lines draw
 *   0.10–0.35  toolbox shrinks + lands on desk-slot
 *   0.20–0.40  plant draws in
 *   0.30–0.55  laptop body fades in
 *   0.45–0.65  laptop screen contact content fades in
 *   0.55–0.75  coffee mug
 *   0.65–0.90  field notes board
 */

const easeInOut = (x: number) => x * x * (3 - 2 * x);
const clamp = (x: number, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
const seg = (a: number, b: number, x: number) => clamp((x - a) / (b - a));
const WORKBENCH_LAYOUT_KEY = "gb-workbench-layout-v3";
const DESIGN_W = 2048;
const DESIGN_H = 1536;

const isWorkbenchEditMode = () =>
  typeof window !== "undefined" && new URLSearchParams(window.location.search).has("workbenchEdit");

type WorkbenchLayout = Record<string, any>;

const getWorkbenchBucket = () => {
  if (typeof window === "undefined") return "desktop";
  const params = new URLSearchParams(window.location.search);
  const forced = params.get("workbenchBucket") || params.get("workbenchViewport");
  if (forced === "desktop" || forced === "laptop" || forced === "mobile") return forced;
  if (window.innerWidth < 900) return "mobile";
  if (window.innerWidth < 1200) return "laptop";
  return "desktop";
};

const getWorkbenchEditWidth = () => {
  if (typeof window === "undefined" || !isWorkbenchEditMode()) return null;
  const params = new URLSearchParams(window.location.search);
  const explicit = Number(params.get("workbenchWidth"));
  if (Number.isFinite(explicit) && explicit > 240) return Math.round(explicit);
  const viewport = params.get("workbenchViewport") || params.get("workbenchBucket");
  if (viewport === "mobile") return 820;
  if (viewport === "laptop") return 1100;
  if (viewport === "desktop") return 1280;
  return null;
};

const workbenchEditables = [
  { key: "horizon", label: "DESK LINE / SHADOW", selector: ".dsk-horizon-control" },
  { key: "notes", label: "FIELD NOTES", selector: ".dsk-notes" },
  { key: "plant", label: "PLANT", selector: ".dsk-plant" },
  { key: "sketch", label: "SKETCH CARD", selector: ".dsk-sketch-card" },
  { key: "toolbox", label: "TOOLBOX SLOT", selector: ".dsk-toolbox-slot" },
  { key: "laptop", label: "LAPTOP", selector: ".dsk-laptop" },
  { key: "mug", label: "MUG", selector: ".dsk-mug" },
];

const Leaf = ({ x, y, angle, scale = 1 }: { x: number; y: number; angle: number; scale?: number }) => (
  <g transform={`translate(${x}, ${y}) rotate(${angle}) scale(${scale})`}>
    <path
      d="M0,0 C-20,-13 -31,-36 -2,-62 C27,-36 21,-13 0,0 Z"
      stroke="rgba(130, 180, 130, 0.9)"
      strokeWidth="1.35"
      fill="rgba(130, 180, 130, 0.13)"
      strokeLinejoin="round"
    />
    <path
      d="M0,-1 C-4,-22 3,-44 -2,-60"
      stroke="rgba(130, 180, 130, 0.62)"
      strokeWidth="0.9"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M-1,-15 Q-10,-22 -17,-22 M-2,-29 Q-13,-36 -20,-37 M-2,-44 Q-10,-50 -15,-51"
      stroke="rgba(130, 180, 130, 0.48)"
      strokeWidth="0.8"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M1,-17 Q11,-24 17,-24 M0,-32 Q13,-39 20,-40 M-1,-47 Q8,-53 14,-54"
      stroke="rgba(130, 180, 130, 0.48)"
      strokeWidth="0.8"
      fill="none"
      strokeLinecap="round"
    />
  </g>
);

const DeskSceneStage = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const { posts } = useBlogPosts(true);
  const editMode = isWorkbenchEditMode();
  const workbenchBucket = getWorkbenchBucket();
  const editWidth = getWorkbenchEditWidth();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let raf = 0;
    const tick = () => {
      const p = editMode ? 1 : clamp(Number((window as any).__deskProgress ?? 0));
      root.style.opacity = editMode ? "1" : String(easeInOut(seg(0.02, 0.16, p)));

      // === Desk decoration draw-ins ===
      const set = (sel: string, v: number, ty = 0, interactive = false) => {
        const el = root.querySelector<HTMLElement>(sel);
        if (!el) return;
        el.style.opacity = String(v);
        if (editMode) return;
        // Only interactive elements get pointer events, and only when essentially visible.
        el.style.pointerEvents = interactive && v > 0.98 ? "auto" : "none";
        if (ty) el.style.transform = `translateY(${ty}px)`;
      };
      const setStroke = (sel: string, v: number) => {
        const el = root.querySelector<SVGPathElement>(sel);
        if (!el) return;
        const len = (el as any).__len || ((el as any).__len = el.getTotalLength?.() ?? 1000);
        el.style.strokeDasharray = `${len}`;
        el.style.strokeDashoffset = `${len * (1 - v)}`;
      };

      setStroke(".dsk-edge", easeInOut(seg(0.0, 0.18, p)));
      set(".dsk-wall", easeInOut(seg(0.0, 0.18, p)));

      const tPlant = easeInOut(seg(0.2, 0.4, p));
      set(".dsk-plant", tPlant, (1 - tPlant) * 18);

      const tLap = easeInOut(seg(0.3, 0.55, p));
      set(".dsk-laptop", tLap, (1 - tLap) * 30, true);

      const tMug = easeInOut(seg(0.55, 0.75, p));
      set(".dsk-mug", tMug, (1 - tMug) * 16);

      const tNotes = easeInOut(seg(0.65, 0.9, p));
      set(".dsk-notes", tNotes, (1 - tNotes) * -20, true);

      const slotEl = root.querySelector<HTMLElement>(".dsk-toolbox-slot");
      if (slotEl) {
        const tr = slotEl.getBoundingClientRect();
        if (tr.width > 0) {
          (window as any).__deskToolboxSlot = {
            left: tr.left,
            top: tr.top,
            width: tr.width,
            height: tr.height,
            cx: tr.left + tr.width / 2,
            bottom: tr.top + tr.height,
          };
        }
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const updateScale = () => {
      root.style.setProperty("--desk-scale", "1");
      root.style.setProperty("--desk-offset-x", "0px");
      root.style.setProperty("--desk-offset-y", "0px");
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !isWorkbenchEditMode()) return;

    let frame = 0;
    const cleanup: Array<() => void> = [];
    const previousPointerEvents = root.style.pointerEvents;
    root.style.pointerEvents = "auto";
    const storageKey = `${WORKBENCH_LAYOUT_KEY}:${getWorkbenchBucket()}`;

    const readLayout = (): WorkbenchLayout => {
      try {
        return JSON.parse(localStorage.getItem(storageKey) || "{}") as WorkbenchLayout;
      } catch {
        return {};
      }
    };

    const writeLayout = (layout: WorkbenchLayout) => {
      localStorage.setItem(storageKey, JSON.stringify(layout, null, 2));
      (window as any).__workbenchLayout = layout;
    };

    const currentLayout = () => {
      const next: WorkbenchLayout & { __viewport?: Record<string, any> } = {
        __viewport: {
          bucket: getWorkbenchBucket(),
          browserWidth: window.innerWidth,
          browserHeight: window.innerHeight,
          stageWidth: Math.round(root.getBoundingClientRect().width),
          stageHeight: Math.round(root.getBoundingClientRect().height),
          storageKey,
        },
      };
      for (const item of workbenchEditables) {
        const el = root.querySelector<HTMLElement>(item.selector);
        if (!el) continue;
        next[item.key] = {
          left: Math.round(parseFloat(el.style.left || "0")),
          top: Math.round(parseFloat(el.style.top || "0")),
          width: Math.round(parseFloat(el.style.width || String(el.offsetWidth))),
          height: Math.round(parseFloat(el.style.height || String(el.offsetHeight))),
        };
      }
      return next;
    };

    frame = requestAnimationFrame(() => {
      const rootRect = root.getBoundingClientRect();
      const saved = readLayout();
      const editorNodes: HTMLElement[] = [];

      const saveNow = () => writeLayout(currentLayout());
      (window as any).__getWorkbenchLayout = currentLayout;

      for (const item of workbenchEditables) {
        const el = root.querySelector<HTMLElement>(item.selector);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        const inlineLayout = {
          left: parseFloat(el.style.left),
          top: parseFloat(el.style.top),
          width: parseFloat(el.style.width),
          height: parseFloat(el.style.height),
        };
        const hasInlineLayout = Object.values(inlineLayout).every(Number.isFinite);
        const initial =
          saved[item.key] ??
          (hasInlineLayout
            ? inlineLayout
            : {
                left: rect.left - rootRect.left,
                top: rect.top - rootRect.top,
                width: rect.width,
                height: rect.height,
              });

        el.style.left = `${initial.left}px`;
        el.style.top = `${initial.top}px`;
        el.style.right = "auto";
        el.style.bottom = "auto";
        el.style.width = `${initial.width}px`;
        el.style.height = `${initial.height}px`;
        el.style.transform = "none";
        el.style.opacity = "1";
        el.style.pointerEvents = "auto";
        el.style.cursor = "move";
        el.style.outline = "1px solid rgba(127,177,138,0.82)";
        el.style.outlineOffset = "3px";
        el.dataset.workbenchEditable = item.key;
        if (item.key === "horizon") {
          root.style.setProperty("--dsk-desk-y", `${Math.round(initial.top)}px`);
        }

        const label = document.createElement("div");
        label.textContent = item.label;
        label.style.cssText = [
          "position:absolute",
          "left:0",
          "top:-22px",
          "z-index:9999",
          "padding:3px 6px",
          "font:10px/1.1 ui-monospace, SFMono-Regular, Menlo, monospace",
          "letter-spacing:.12em",
          "color:#08100b",
          "background:rgba(127,177,138,.92)",
          "border:1px solid rgba(184,146,74,.55)",
          "pointer-events:none",
        ].join(";");

        const handle = document.createElement("div");
        handle.title = "Resize";
        handle.dataset.workbenchResizeHandle = item.key;
        handle.style.cssText = [
          "position:absolute",
          "right:-7px",
          "bottom:-7px",
          "width:14px",
          "height:14px",
          "z-index:10000",
          "cursor:nwse-resize",
          "background:#b8924a",
          "border:2px solid #05080a",
          "box-shadow:0 0 0 1px rgba(127,177,138,.7)",
        ].join(";");

        el.append(label, handle);
        editorNodes.push(label, handle);

        let startX = 0;
        let startY = 0;
        let startLeft = 0;
        let startTop = 0;
        let startWidth = 0;
        let startHeight = 0;
        let mode: "drag" | "resize" | null = null;

        const onPointerMove = (event: PointerEvent) => {
          if (!mode) return;
          event.preventDefault();
          const scale = parseFloat(getComputedStyle(root).getPropertyValue("--desk-scale")) || 1;
          const dx = (event.clientX - startX) / scale;
          const dy = (event.clientY - startY) / scale;

          if (mode === "drag") {
            const nextLeft = item.key === "horizon" ? startLeft + dx : Math.max(0, startLeft + dx);
            const nextTop = Math.max(0, startTop + dy);
            el.style.left = `${nextLeft}px`;
            el.style.top = `${nextTop}px`;
            if (item.key === "horizon") {
              root.style.setProperty("--dsk-desk-y", `${Math.round(nextTop)}px`);
            }
          } else {
            el.style.width = `${Math.max(48, startWidth + dx)}px`;
            el.style.height = `${Math.max(48, startHeight + dy)}px`;
          }
        };

        const onPointerUp = () => {
          if (!mode) return;
          mode = null;
          saveNow();
          window.removeEventListener("pointermove", onPointerMove);
          window.removeEventListener("pointerup", onPointerUp);
        };

        const onPointerDown = (event: PointerEvent) => {
          const target = event.target as HTMLElement | null;
          mode = target?.dataset.workbenchResizeHandle ? "resize" : "drag";
          startX = event.clientX;
          startY = event.clientY;
          startLeft = parseFloat(el.style.left || "0");
          startTop = parseFloat(el.style.top || "0");
          startWidth = parseFloat(el.style.width || String(el.offsetWidth));
          startHeight = parseFloat(el.style.height || String(el.offsetHeight));
          event.preventDefault();
          event.stopPropagation();
          window.addEventListener("pointermove", onPointerMove);
          window.addEventListener("pointerup", onPointerUp);
        };

        el.addEventListener("pointerdown", onPointerDown);
        cleanup.push(() => el.removeEventListener("pointerdown", onPointerDown));
      }

      saveNow();

      const panel = document.createElement("div");
      panel.style.cssText = [
        "position:fixed",
        "left:16px",
        "bottom:16px",
        "z-index:2147483647",
        "width:280px",
        "padding:12px",
        "background:rgba(5,8,10,.92)",
        "border:1px solid rgba(184,146,74,.6)",
        "color:#efe7d5",
        "font:12px/1.45 ui-monospace, SFMono-Regular, Menlo, monospace",
        "box-shadow:none",
        "pointer-events:auto",
      ].join(";");
      panel.innerHTML = `
        <div style="color:#7fb18a;letter-spacing:.14em;margin-bottom:6px;">WORKBENCH EDIT</div>
        <div style="opacity:.76;margin-bottom:10px;">Drag objects. Pull the gold corner to resize. Drag DESK LINE / SHADOW vertically to ground the setup. Copy JSON for each viewport bucket.</div>
        <div style="display:flex;gap:8px;">
          <button data-copy style="flex:1;padding:7px;border:1px solid rgba(127,177,138,.5);background:#08100b;color:#efe7d5;font:inherit;cursor:pointer;">Copy JSON</button>
          <button data-reset style="flex:1;padding:7px;border:1px solid rgba(184,146,74,.55);background:#140d07;color:#efe7d5;font:inherit;cursor:pointer;">Reset</button>
        </div>
      `;
      const copyButton = panel.querySelector<HTMLButtonElement>("[data-copy]");
      const resetButton = panel.querySelector<HTMLButtonElement>("[data-reset]");
      copyButton?.addEventListener("click", () => {
        const text = JSON.stringify(currentLayout(), null, 2);
        void navigator.clipboard?.writeText(text);
        copyButton.textContent = "Copied";
        window.setTimeout(() => {
          copyButton.textContent = "Copy JSON";
        }, 900);
      });
      resetButton?.addEventListener("click", () => {
        localStorage.removeItem(storageKey);
        window.location.reload();
      });
      document.body.appendChild(panel);
      cleanup.push(() => panel.remove());
      cleanup.push(() => editorNodes.forEach((node) => node.remove()));
    });

    return () => {
      cancelAnimationFrame(frame);
      root.style.pointerEvents = previousPointerEvents;
      cleanup.forEach((fn) => fn());
    };
  }, []);

  const topPosts = posts.slice(0, 3);

  return (
    <div
      ref={rootRef}
      className="dsk-stage absolute inset-0 overflow-hidden pointer-events-none"
      data-workbench-bucket={workbenchBucket}
      style={{
        opacity: 0,
        ...(editMode && editWidth
          ? {
              left: `calc(50% - ${editWidth / 2}px)`,
              right: "auto",
              width: `${editWidth}px`,
              maxWidth: "100vw",
              outline: "1px solid rgba(184,146,74,0.55)",
            }
          : {}),
      }}
      aria-label="Contact & Writing desk"
    >
      {/* Wall / table tonal split */}
      <div
        className="dsk-wall absolute inset-0 pointer-events-none"
        style={{
          opacity: 0,
          background:
            "radial-gradient(circle at 30% 30%, rgba(111,155,109,0.08), transparent 30%), radial-gradient(circle at 80% 20%, rgba(184,146,74,0.06), transparent 32%), linear-gradient(180deg, rgba(18,24,33,0.08) 0%, rgba(11,15,20,0.28) 100%)",
        }}
      />

      <div
        className="dsk-floor absolute pointer-events-none"
        style={{
          left: "var(--dsk-horizon-left, -12vw)",
          width: "var(--dsk-horizon-width, 124vw)",
          top: "var(--dsk-desk-y, 642px)",
          height: "900px",
          transform: "perspective(1000px) rotateX(45deg)",
          transformOrigin: "top center",
          background:
            "linear-gradient(180deg, rgba(8,12,16,0.12), rgba(7,10,13,0.68)), linear-gradient(rgba(100,160,250,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(100,160,250,0.04) 1px, transparent 1px)",
          backgroundSize: "auto, 32px 32px, 32px 32px",
          borderTop: "1px solid rgba(184,146,74,0.38)",
          zIndex: 0,
        }}
      />

      <svg
        className="dsk-desk-line absolute top-0 bottom-0 h-full pointer-events-none"
        viewBox="0 0 1600 900"
        preserveAspectRatio="none"
        style={{ left: "var(--dsk-horizon-left, -12vw)", width: "var(--dsk-horizon-width, 124vw)", zIndex: 0 }}
      >
        <defs>
          <linearGradient id="goldStrokeDesk" x1="0" x2="1">
            <stop offset="0" stopColor="#8a6a2a" stopOpacity="0.0" />
            <stop offset="0.08" stopColor="#b8924a" stopOpacity="0.9" />
            <stop offset="0.92" stopColor="#b8924a" stopOpacity="0.9" />
            <stop offset="1" stopColor="#8a6a2a" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path className="dsk-edge" d="M 0 657 L 1600 657" stroke="url(#goldStrokeDesk)" strokeWidth="1.5" fill="none" />
        <path d="M 0 652 L 1600 652 L 1600 900 L 0 900 Z" fill="rgba(6,8,10,0.10)" />
      </svg>

      <div
        className="dsk-horizon-control absolute pointer-events-none"
        style={{
          left: "var(--dsk-horizon-left, -12vw)",
          top: "var(--dsk-desk-y, 642px)",
          width: "var(--dsk-horizon-width, 124vw)",
          height: "var(--dsk-horizon-height, 14px)",
          opacity: 0,
          zIndex: 2,
        }}
      />

      {/* Scene wrapper */}
      <div
        className="dsk-composition absolute pointer-events-none"
        style={{
          inset: 0,
        }}
      >
        <div className="relative w-full h-full">
          {/* FIELD NOTES — top-right behind/above laptop */}
          {/* FIELD NOTES — top, only left corner peeks behind laptop */}
          <div
            className="dsk-notes absolute pointer-events-auto"
            style={{
              left: "var(--dsk-notes-left, 664px)",
              top: "var(--dsk-notes-top, 96px)",
              width: "var(--dsk-notes-width, 693px)",
              height: "var(--dsk-notes-height, 288px)",
              opacity: 0,
              willChange: "transform, opacity",
              zIndex: 1,
            }}
          >
            <div
              className="relative h-full rounded-md border p-5 lg:p-6"
              style={{
                background: "rgba(8,14,18,0.88)",
                borderColor: "rgba(184,146,74,0.35)",
                boxShadow: "inset 0 0 0 1px rgba(184,146,74,0.08)",
              }}
            >
              <span className="absolute -top-1 -left-1 w-3 h-3 border-t border-l" style={{ borderColor: "#b8924a" }} />
              <span className="absolute -top-1 -right-1 w-3 h-3 border-t border-r" style={{ borderColor: "#b8924a" }} />
              <span
                className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l"
                style={{ borderColor: "#b8924a" }}
              />
              <span
                className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r"
                style={{ borderColor: "#b8924a" }}
              />

              <div className="flex items-center gap-2 mb-1">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#7fb18a" }} />
                <span className="text-[10px] tracking-[0.25em] font-mono" style={{ color: "#7fb18a" }}>
                  FIELD NOTES
                </span>
              </div>
              <p className="text-xs mb-4 font-mono" style={{ color: "rgba(184,146,74,0.7)" }}>
                Thoughts, essays and product reflections.
              </p>
              <div className="h-px mb-4" style={{ background: "rgba(184,146,74,0.25)" }} />

              <div
                className="absolute hidden lg:block rotate-[-3deg]"
                style={{
                  right: "6%",
                  top: "8%",
                  width: "94px",
                  height: "140px",
                  background: "#d8c08f",
                  color: "#21190d",
                  zIndex: 2,
                }}
                aria-hidden
              >
                <div className="absolute -top-2 left-1/2 h-5 w-12 -translate-x-1/2 bg-[#2d8d58] opacity-90" />
                <div className="flex h-full flex-col justify-center px-5 font-serif text-xl italic leading-tight">
                  <span>Ship</span>
                  <span>useful</span>
                  <span>things.</span>
                  <span className="mt-3 text-2xl">*</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pr-0 xl:pr-32">
                {(topPosts.length
                  ? topPosts
                  : ([
                      {
                        id: "a",
                        slug: "#",
                        title: "Why Good Products Feel Obvious",
                        excerpt: "Friction, timing, and context in adoption.",
                      },
                      {
                        id: "b",
                        slug: "#",
                        title: "Designing AI Products Users Can Trust",
                        excerpt: "Explainability, confidence, and human control.",
                      },
                      {
                        id: "c",
                        slug: "#",
                        title: "The Interview Is Not the Insight",
                        excerpt: "Turning messy conversations into product decisions.",
                      },
                    ] as any[])
                ).map((post, i) => (
                  <Link
                    key={post.id}
                    to={post.slug && post.slug !== "#" ? `/blog/${post.slug}` : "/blog"}
                    className="group block rounded-sm border p-3 transition-colors hover:bg-[rgba(184,146,74,0.06)]"
                    style={{ background: "rgba(10,18,16,0.6)", borderColor: "rgba(184,146,74,0.25)" }}
                  >
                    <div className="text-[9px] font-mono mb-2" style={{ color: "rgba(127,177,138,0.75)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <h4 className="text-[11px] font-medium leading-snug mb-2 line-clamp-3" style={{ color: "#d6b56a" }}>
                      {post.title}
                    </h4>
                    <p className="text-[10px] leading-snug line-clamp-3" style={{ color: "rgba(184,146,74,0.55)" }}>
                      {post.excerpt?.slice(0, 70)}
                    </p>
                    <div className="mt-2 text-[10px] opacity-70 group-hover:opacity-100">→</div>
                  </Link>
                ))}
              </div>

              <div className="mt-4 text-right">
                <Link
                  to="/blog"
                  className="text-[10px] font-mono tracking-wider hover:text-[#e8c98a]"
                  style={{ color: "#7fb18a" }}
                >
                  VIEW ALL WRITING ↗
                </Link>
              </div>
            </div>
          </div>

          {/* PLANT POT — botanical line-art, positioned so toolbox occludes lower-right (3D depth) */}
          <div
            className="dsk-plant absolute pointer-events-none"
            style={{
              left: "var(--dsk-plant-left, 23px)",
              top: "var(--dsk-plant-top, 267px)",
              width: "var(--dsk-plant-width, 227px)",
              height: "var(--dsk-plant-height, 369px)",
              opacity: 0,
              willChange: "transform, opacity",
              zIndex: 4,
            }}
          >
            <svg viewBox="0 0 220 340" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
              <g fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path
                  d="M110 256 C108 216 116 184 110 146 C104 105 114 67 111 27"
                  stroke="rgba(130,180,130,0.78)"
                  strokeWidth="1.65"
                />
                <path d="M110 219 C76 206 50 180 40 145" stroke="rgba(130,180,130,0.42)" strokeWidth="1" />
                <path d="M111 212 C146 199 171 171 181 135" stroke="rgba(130,180,130,0.42)" strokeWidth="1" />
                <path d="M108 176 C78 165 57 142 48 110" stroke="rgba(130,180,130,0.42)" strokeWidth="1" />
                <path d="M112 163 C143 150 163 126 172 94" stroke="rgba(130,180,130,0.42)" strokeWidth="1" />
                <path d="M108 128 C83 118 65 96 59 66" stroke="rgba(130,180,130,0.38)" strokeWidth="0.95" />
                <path d="M112 117 C136 104 151 82 157 54" stroke="rgba(130,180,130,0.38)" strokeWidth="0.95" />
              </g>
              <g
                stroke="rgba(130,180,130,0.9)"
                strokeWidth="1.35"
                fill="rgba(130,180,130,0.12)"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M111 27 C91 6 101 -12 116 2 C135 19 133 48 113 72 C105 51 102 39 111 27 Z" />
                <path d="M60 71 C28 52 19 28 43 20 C78 18 101 45 103 87 C82 83 70 79 60 71 Z" />
                <path d="M155 60 C191 44 205 54 197 77 C181 108 150 118 117 100 C128 82 140 68 155 60 Z" />
                <path d="M45 117 C9 101 5 76 32 70 C70 72 96 100 99 139 C77 137 60 130 45 117 Z" />
                <path d="M169 105 C205 95 219 112 203 136 C178 162 144 164 119 137 C136 121 151 110 169 105 Z" />
                <path d="M38 154 C3 148 0 124 26 113 C64 107 94 130 105 166 C81 171 58 168 38 154 Z" />
                <path d="M172 150 C205 151 213 171 190 190 C159 210 129 200 116 166 C137 156 154 150 172 150 Z" />
                <path d="M56 202 C25 205 17 188 37 172 C66 157 93 166 105 199 C87 206 71 207 56 202 Z" />
                <path d="M159 203 C188 212 190 230 166 240 C137 247 119 232 117 202 C134 198 148 198 159 203 Z" />
              </g>
              <g stroke="rgba(130,180,130,0.45)" strokeWidth="0.8" fill="none" strokeLinecap="round">
                <path d="M112 32 C112 47 113 58 113 70 M62 72 C75 76 88 81 101 87 M154 63 C142 75 131 87 118 100" />
                <path d="M46 118 C62 124 80 133 98 140 M170 107 C152 116 134 127 120 138" />
                <path d="M39 154 C60 157 83 162 104 166 M172 151 C151 155 132 160 117 167" />
                <path d="M57 202 C74 199 90 199 105 200 M159 204 C144 202 130 202 117 203" />
                <path d="M56 92 Q50 81 41 76 M72 79 Q69 63 58 52 M143 84 Q156 84 168 76 M133 96 Q143 103 155 105" />
                <path d="M62 138 Q50 127 39 123 M82 143 Q78 129 68 118 M154 132 Q168 130 181 121 M139 146 Q151 153 164 153" />
                <path d="M65 166 Q54 157 43 155 M86 169 Q80 158 69 150 M149 163 Q162 162 173 156 M139 175 Q149 181 161 184" />
              </g>
              <g fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M58 262 C58 254 162 254 162 262" stroke="rgba(184,146,74,0.36)" strokeWidth="1.3" />
                <path
                  d="M48 261 L172 261 L166 278 L54 278 Z"
                  stroke="rgba(184,146,74,0.82)"
                  strokeWidth="1.55"
                  fill="rgba(23,16,10,0.9)"
                />
                <path
                  d="M56 278 L70 331 C72 337 148 337 150 331 L164 278"
                  stroke="rgba(184,146,74,0.68)"
                  strokeWidth="1.55"
                  fill="rgba(8,11,15,0.98)"
                />
                <path d="M65 282 C86 289 134 289 155 282" stroke="rgba(184,146,74,0.36)" strokeWidth="0.9" />
                <path d="M76 331 C92 335 128 335 144 331" stroke="rgba(0,0,0,0.45)" strokeWidth="1" />
              </g>
            </svg>
          </div>

          {/* TOOLBOX SLOT — invisible landing target; the real 3D Toolbox actor from ToolboxToSkillsBridge lands here */}
          <div
            className="dsk-toolbox-slot absolute pointer-events-none"
            style={{
              left: "var(--dsk-toolbox-left, 106px)",
              top: "var(--dsk-toolbox-top, 502px)",
              width: "var(--dsk-toolbox-width, 364px)",
              height: "var(--dsk-toolbox-height, 165px)",
            }}
          />

          {/* LAPTOP — grounded screen + shallow base */}
          <div
            className="dsk-laptop absolute pointer-events-auto"
            style={{
              left: "var(--dsk-laptop-left, 409px)",
              top: "var(--dsk-laptop-top, 489px)",
              width: "var(--dsk-laptop-width, 580px)",
              height: "var(--dsk-laptop-height, 404px)",
              opacity: 0,
              willChange: "transform, opacity",
              zIndex: 30,
              perspective: "1200px",
            }}
          >
            <div
              className="relative w-full"
              style={{
                aspectRatio: "16 / 11",
                transformStyle: "preserve-3d",
                transform: "rotateX(55deg)",
                transformOrigin: "center",
              }}
            >
              {/* Base */}
              <div
                className="absolute inset-x-0 bottom-0 rounded-xl flex flex-col p-4"
                style={{
                  height: "65%",
                  zIndex: 10,
                  background: "rgba(10,14,18,0.96)",
                  border: "1px solid rgba(184,146,74,0.30)",
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  className="absolute top-full left-0 right-0 h-3 rounded-b-xl"
                  style={{
                    background: "#05070a",
                    border: "1px solid rgba(184,146,74,0.30)",
                    borderTop: 0,
                    transform: "rotateX(-90deg)",
                    transformOrigin: "top",
                  }}
                />
                <div
                  className="w-full flex-grow rounded-md mt-2 flex flex-col gap-1 p-2"
                  style={{ background: "#040608", border: "1px solid rgba(184,146,74,0.15)" }}
                >
                  {[...Array(5)].map((_, r) => (
                    <div key={r} className="flex gap-1 w-full flex-1">
                      {[...Array(12)].map((_, c) => (
                        <div
                          key={c}
                          className="flex-1 rounded-[2px]"
                          style={{ background: "rgba(184,146,74,0.05)", border: "1px solid rgba(184,146,74,0.1)" }}
                        />
                      ))}
                    </div>
                  ))}
                  <div className="flex gap-1 w-full flex-1">
                    {[...Array(4)].map((_, c) => (
                      <div
                        key={`l-${c}`}
                        className="flex-1 rounded-[2px]"
                        style={{ background: "rgba(184,146,74,0.05)", border: "1px solid rgba(184,146,74,0.1)" }}
                      />
                    ))}
                    <div
                      className="flex-[4] rounded-[2px]"
                      style={{ background: "rgba(184,146,74,0.05)", border: "1px solid rgba(184,146,74,0.1)" }}
                    />
                    {[...Array(4)].map((_, c) => (
                      <div
                        key={`r-${c}`}
                        className="flex-1 rounded-[2px]"
                        style={{ background: "rgba(184,146,74,0.05)", border: "1px solid rgba(184,146,74,0.1)" }}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-center mt-3 mb-1">
                  <div
                    className="w-1/3 rounded-md"
                    style={{ aspectRatio: "2.5 / 1", border: "1px solid rgba(184,146,74,0.15)" }}
                  />
                </div>
              </div>

              {/* Screen */}
              <div
                className="dsk-screen absolute inset-x-0 bottom-[65%] h-[85%] rounded-t-2xl flex p-3"
                style={{
                  zIndex: 20,
                  background: "rgba(12,16,21,0.98)",
                  border: "1px solid rgba(184,146,74,0.40)",
                  transform: "rotateX(-55deg)",
                  transformOrigin: "bottom",
                }}
              >
                <div
                  className="w-full h-full rounded-lg overflow-hidden relative flex flex-col p-4"
                  style={{ background: "#05080a", border: "1px solid rgba(184,146,74,0.30)" }}
                >
                  <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(239,231,213,1) 1px, transparent 1px), linear-gradient(90deg,rgba(239,231,213,1) 1px, transparent 1px)",
                      backgroundSize: "24px 24px",
                    }}
                  />
                  <div className="relative z-10 flex justify-between items-start w-full mb-3">
                    <h5
                      className="font-mono text-[10px] tracking-widest uppercase flex items-center gap-2"
                      style={{ color: "#6f9b6d" }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#6f9b6d" }} /> BUILD.OS / CONTACT
                    </h5>
                    <div
                      className="font-serif text-3xl border px-2 rounded-sm"
                      style={{
                        color: "rgba(229,196,122,0.42)",
                        borderColor: "rgba(214,173,101,0.24)",
                        background: "rgba(0,0,0,0.2)",
                      }}
                    >
                      GB
                    </div>
                  </div>
                  <div className="relative z-10 mt-1">
                    <h2 className="font-mono text-[24px] mb-1" style={{ color: "#efe7d5" }}>
                      Gautham Biju
                    </h2>
                    <p className="font-mono text-[10px] tracking-[0.2em] mb-4 uppercase" style={{ color: "#b8924a" }}>
                      Product · Strategy · Systems
                    </p>
                    <p
                      className="text-[11px] leading-relaxed max-w-[75%] font-serif"
                      style={{ color: "rgba(239,231,213,0.6)" }}
                    >
                      Building thoughtful products with AI, design and business logic.
                    </p>
                  </div>
                  <div
                    className="relative z-10 flex items-center gap-3 font-mono text-[11px] mt-6"
                    style={{ color: "#efe7d5" }}
                  >
                    <span
                      className="rounded-sm px-1.5 py-0.5 text-[9px] border"
                      style={{ color: "#6f9b6d", borderColor: "rgba(111,155,109,0.22)" }}
                    >
                      ✉
                    </span>
                    gauthambiju02@gmail.com
                  </div>
                  <div className="relative z-10 flex gap-4 mt-auto w-full pointer-events-auto">
                    {[
                      { label: "EMAIL", href: "mailto:gauthambiju02@gmail.com" },
                      { label: "LINKEDIN", href: "https://www.linkedin.com/in/gauthambiju" },
                      { label: "RESUME", href: "/resume.pdf" },
                    ].map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        className="flex-1 text-center flex items-center justify-center h-10 border rounded font-mono text-[10px] uppercase transition-colors"
                        style={{ borderColor: "rgba(184,146,74,0.38)", color: "#efe7d5" }}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COFFEE MUG */}
          <div
            className="dsk-mug absolute pointer-events-none"
            style={{
              left: "var(--dsk-mug-left, 1045px)",
              top: "var(--dsk-mug-top, 623px)",
              width: "var(--dsk-mug-width, 156px)",
              height: "var(--dsk-mug-height, 154px)",
              opacity: 0,
              willChange: "transform, opacity",
              zIndex: 6,
            }}
          >
            <svg viewBox="0 0 160 160" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
              <g stroke="rgba(184,146,74,0.52)" strokeWidth="1.25" fill="none" strokeLinecap="round">
                <path d="M 58 30 C 48 14 62 6 54 -8" />
                <path d="M 78 26 C 88 12 72 4 82 -10" />
                <path d="M 99 31 C 91 15 106 8 98 -7" />
              </g>
              <ellipse
                cx="79"
                cy="135"
                rx="54"
                ry="11"
                fill="rgba(6,9,12,0.74)"
                stroke="rgba(184,146,74,0.72)"
                strokeWidth="1.35"
              />
              <path
                d="M 40 52 L 119 52 L 113 124 C 111 133 48 133 46 124 Z"
                fill="rgba(11,15,18,0.97)"
                stroke="#b8924a"
                strokeWidth="1.45"
              />
              <ellipse
                cx="79.5"
                cy="52"
                rx="39.5"
                ry="8.5"
                fill="rgba(14,18,22,0.98)"
                stroke="#b8924a"
                strokeWidth="1.35"
              />
              <ellipse
                cx="79.5"
                cy="52"
                rx="31"
                ry="4.4"
                fill="rgba(5,7,9,0.92)"
                stroke="rgba(184,146,74,0.28)"
                strokeWidth="0.8"
              />
              <path d="M 119 64 C 148 66 148 109 118 111" stroke="#b8924a" strokeWidth="1.45" fill="none" />
              <path d="M 119 75 C 136 77 136 99 118 101" stroke="rgba(184,146,74,0.55)" strokeWidth="1" fill="none" />
              <path d="M 49 123 C 65 130 96 130 111 123" stroke="rgba(184,146,74,0.36)" strokeWidth="0.9" fill="none" />
              <text
                x="80"
                y="94"
                textAnchor="middle"
                fontFamily="Playfair Display, serif"
                fontSize="34"
                fill="rgba(184,146,74,0.76)"
              >
                GB
              </text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeskSceneStage;
