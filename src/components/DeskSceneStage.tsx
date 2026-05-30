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
 *   0.85–1.00  lamp glow
 */

const easeInOut = (x: number) => x * x * (3 - 2 * x);
const clamp = (x: number, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
const seg = (a: number, b: number, x: number) => clamp((x - a) / (b - a));

const DeskSceneStage = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const { posts } = useBlogPosts(true);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let raf = 0;
    const tick = () => {
      const p = clamp(Number((window as any).__deskProgress ?? 0));
      root.style.opacity = String(easeInOut(seg(0.02, 0.16, p)));

      // === Desk decoration draw-ins ===
      const set = (sel: string, v: number, ty = 0) => {
        const el = root.querySelector<HTMLElement>(sel);
        if (!el) return;
        el.style.opacity = String(v);
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
      set(".dsk-laptop", tLap, (1 - tLap) * 30);

      const tMug = easeInOut(seg(0.55, 0.75, p));
      set(".dsk-mug", tMug, (1 - tMug) * 16);

      const tNotes = easeInOut(seg(0.65, 0.9, p));
      set(".dsk-notes", tNotes, (1 - tNotes) * -20);

      set(".dsk-lamp", easeInOut(seg(0.8, 1.0, p)) * 0.9);

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

  const topPosts = posts.slice(0, 3);

  return (
        <div ref={rootRef} className="absolute inset-0 pointer-events-none" style={{ opacity: 0, zIndex: 20 }} aria-label="Contact & Writing desk">

          {/* Wall / table tonal split */}
          <div
            className="dsk-wall absolute inset-0 pointer-events-none"
            style={{
              opacity: 0,
              background:
                "linear-gradient(to bottom, rgba(10,14,18,0.0) 0%, rgba(10,14,18,0.0) 78%, rgba(0,0,0,0.55) 80%, rgba(14,11,7,0.35) 82%, rgba(14,11,7,0.0) 100%)",
            }}
          />

          {/* Table horizon line */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 1600 900"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="goldStrokeDesk" x1="0" x2="1">
                <stop offset="0" stopColor="#8a6a2a" stopOpacity="0.0" />
                <stop offset="0.2" stopColor="#b8924a" stopOpacity="0.9" />
                <stop offset="0.8" stopColor="#b8924a" stopOpacity="0.9" />
                <stop offset="1" stopColor="#8a6a2a" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path className="dsk-edge" d="M 0 720 L 1600 720" stroke="url(#goldStrokeDesk)" strokeWidth="1.5" fill="none" />
          </svg>

          {/* Scene wrapper */}
          <div className="absolute inset-0 flex items-end justify-center">
            <div className="relative w-full max-w-[1400px] h-[80vh] mx-auto">

              {/* LAMP GLOW */}
              <div
                className="dsk-lamp absolute pointer-events-none"
                style={{
                  right: "8%", bottom: "22%", width: "360px", height: "360px", opacity: 0,
                  background: "radial-gradient(circle, rgba(255,200,120,0.16), transparent 60%)",
                  filter: "blur(8px)",
                }}
              />

              {/* FIELD NOTES — top-right behind/above laptop */}
              {/* FIELD NOTES — top, only left corner peeks behind laptop */}
              <div
                className="dsk-notes absolute pointer-events-auto"
                style={{ right: "4%", top: "2%", width: "min(40%, 520px)", opacity: 0, willChange: "transform, opacity" }}
              >
                <div
                  className="relative rounded-md border p-5"
                  style={{
                    background: "rgba(8,14,18,0.88)",
                    borderColor: "rgba(184,146,74,0.35)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(184,146,74,0.08)",
                  }}
                >
                  <span className="absolute -top-1 -left-1 w-3 h-3 border-t border-l" style={{ borderColor: "#b8924a" }} />
                  <span className="absolute -top-1 -right-1 w-3 h-3 border-t border-r" style={{ borderColor: "#b8924a" }} />
                  <span className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l" style={{ borderColor: "#b8924a" }} />
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r" style={{ borderColor: "#b8924a" }} />

                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#7fb18a" }} />
                    <span className="text-[10px] tracking-[0.25em] font-mono" style={{ color: "#7fb18a" }}>FIELD NOTES</span>
                  </div>
                  <p className="text-xs mb-4 font-mono" style={{ color: "rgba(184,146,74,0.7)" }}>
                    Thoughts, essays and product reflections.
                  </p>
                  <div className="h-px mb-4" style={{ background: "rgba(184,146,74,0.25)" }} />

                  <div className="grid grid-cols-3 gap-3">
                    {(topPosts.length ? topPosts : [
                      { id: "a", slug: "#", title: "Why Good Products Feel Obvious", excerpt: "Friction, timing, and context in adoption." },
                      { id: "b", slug: "#", title: "Designing AI Products Users Can Trust", excerpt: "Explainability, confidence, and human control." },
                      { id: "c", slug: "#", title: "The Interview Is Not the Insight", excerpt: "Turning messy conversations into product decisions." },
                    ] as any[]).map((post, i) => (
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
                    <Link to="/blog" className="text-[10px] font-mono tracking-wider hover:text-[#e8c98a]" style={{ color: "#7fb18a" }}>
                      VIEW ALL WRITING ↗
                    </Link>
                  </div>
                </div>
              </div>

              {/* PLANT POT — behind toolbox */}
              <div
                className="dsk-plant absolute pointer-events-none"
                style={{ left: "9%", bottom: "26%", width: "120px", opacity: 0, willChange: "transform, opacity" }}
              >
                <svg viewBox="0 0 120 160" className="w-full h-auto">
                  <g stroke="#7fb18a" strokeWidth="1.2" fill="none" opacity="0.85">
                    <path d="M 60 90 C 30 70, 28 40, 45 20" />
                    <path d="M 60 90 C 90 70, 92 40, 75 20" />
                    <path d="M 60 90 C 50 60, 55 30, 60 10" />
                    <ellipse cx="42" cy="40" rx="10" ry="18" transform="rotate(-25 42 40)" />
                    <ellipse cx="78" cy="40" rx="10" ry="18" transform="rotate(25 78 40)" />
                    <ellipse cx="60" cy="22" rx="9" ry="16" />
                    <ellipse cx="36" cy="62" rx="9" ry="14" transform="rotate(-40 36 62)" />
                    <ellipse cx="84" cy="62" rx="9" ry="14" transform="rotate(40 84 62)" />
                  </g>
                  <path d="M 32 92 L 88 92 L 82 150 L 38 150 Z" stroke="#b8924a" strokeWidth="1.3" fill="rgba(20,16,12,0.7)" />
                  <line x1="30" y1="98" x2="90" y2="98" stroke="#b8924a" strokeWidth="1" />
                </svg>
              </div>

              {/* TOOLBOX SLOT — invisible target the actor lands on */}
              <div
                className="dsk-toolbox-slot absolute pointer-events-none"
                style={{ left: "18%", bottom: "18%", width: "220px", height: "140px" }}
              />

              {/* LAPTOP — CSS 3D */}
              <div
                className="dsk-laptop absolute pointer-events-auto"
                style={{
                  left: "34%", bottom: "10%", width: "min(44%, 600px)",
                  opacity: 0, willChange: "transform, opacity",
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
                    className="absolute inset-x-0 bottom-0 rounded-xl flex flex-col p-3 sm:p-4"
                    style={{
                      height: "65%", zIndex: 10,
                      background: "rgba(10,14,18,0.96)",
                      border: "1px solid rgba(184,146,74,0.30)",
                      boxShadow: "0 30px 60px rgba(0,0,0,0.8)",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <div
                      className="w-full flex-grow rounded-md mt-1 flex flex-col gap-1 p-2"
                      style={{ background: "#040608", border: "1px solid rgba(184,146,74,0.15)" }}
                    >
                      {[...Array(5)].map((_, r) => (
                        <div key={r} className="flex gap-1 w-full flex-1">
                          {[...Array(12)].map((_, c) => (
                            <div key={c} className="flex-1 rounded-[2px]" style={{ background: "rgba(184,146,74,0.05)", border: "1px solid rgba(184,146,74,0.1)" }} />
                          ))}
                        </div>
                      ))}
                      <div className="flex gap-1 w-full flex-1">
                        {[...Array(4)].map((_, c) => (
                          <div key={`l-${c}`} className="flex-1 rounded-[2px]" style={{ background: "rgba(184,146,74,0.05)", border: "1px solid rgba(184,146,74,0.1)" }} />
                        ))}
                        <div className="flex-[4] rounded-[2px]" style={{ background: "rgba(184,146,74,0.05)", border: "1px solid rgba(184,146,74,0.1)" }} />
                        {[...Array(4)].map((_, c) => (
                          <div key={`r-${c}`} className="flex-1 rounded-[2px]" style={{ background: "rgba(184,146,74,0.05)", border: "1px solid rgba(184,146,74,0.1)" }} />
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-center mt-2 mb-1">
                      <div className="w-1/3 rounded-md" style={{ aspectRatio: "2.5 / 1", border: "1px solid rgba(184,146,74,0.15)" }} />
                    </div>
                  </div>

                  {/* Screen */}
                  <div
                    className="dsk-screen absolute inset-x-0 rounded-t-2xl flex p-2 sm:p-3"
                    style={{
                      bottom: "65%", height: "85%", zIndex: 20,
                      background: "rgba(12,16,21,0.98)",
                      border: "1px solid rgba(184,146,74,0.40)",
                      transform: "rotateX(-55deg)",
                      transformOrigin: "bottom",
                      opacity: 0,
                    }}
                  >
                    <div
                      className="w-full h-full rounded-lg overflow-hidden relative flex flex-col p-3 sm:p-4"
                      style={{
                        background: "#05080a",
                        border: "1px solid rgba(184,146,74,0.30)",
                        boxShadow: "inset 0 0 20px rgba(0,0,0,0.5)",
                      }}
                    >
                      <div
                        className="absolute inset-0 opacity-[0.04]"
                        style={{
                          backgroundImage:
                            "linear-gradient(rgba(239,231,213,1) 1px, transparent 1px), linear-gradient(90deg, rgba(239,231,213,1) 1px, transparent 1px)",
                          backgroundSize: "24px 24px",
                        }}
                      />
                      <div className="flex justify-between items-start z-10 w-full mb-2">
                        <h5 className="font-mono text-[9px] sm:text-[10px] tracking-widest uppercase flex items-center gap-2" style={{ color: "#7fb18a" }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#7fb18a" }} /> BUILD.OS / CONTACT
                        </h5>
                        <div className="opacity-50 font-serif text-xl sm:text-2xl border px-2 rounded-sm" style={{ color: "#e8c98a", borderColor: "rgba(184,146,74,0.3)", background: "rgba(0,0,0,0.3)" }}>GB</div>
                      </div>
                      <div className="z-10 mt-1">
                        <h2 className="text-lg sm:text-xl font-serif mb-1" style={{ color: "#efe7d5" }}>Gautham Biju</h2>
                        <p className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] mb-2 uppercase" style={{ color: "#b8924a" }}>Product · Strategy · Systems</p>
                        <p className="text-[10px] sm:text-[11px] leading-relaxed max-w-[80%] font-serif" style={{ color: "rgba(239,231,213,0.6)" }}>
                          Building thoughtful products with AI, design and business logic.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] mt-3 z-10" style={{ color: "#efe7d5" }}>
                        <span className="border rounded-sm px-1.5 py-0.5 text-[8px] sm:text-[9px]" style={{ color: "#7fb18a", borderColor: "rgba(127,177,138,0.4)" }}>✉</span>
                        <a href="mailto:gauthambiju02@gmail.com" className="hover:text-[#e8c98a]">gauthambiju02@gmail.com</a>
                      </div>
                      <div className="flex gap-2 mt-auto z-10 w-full">
                        <a href="mailto:gauthambiju02@gmail.com" className="flex-1 text-center flex items-center justify-center gap-1.5 h-8 sm:h-9 rounded font-mono text-[9px] sm:text-[10px] uppercase hover:bg-[rgba(184,146,74,0.08)] transition-colors" style={{ border: "1px solid rgba(184,146,74,0.38)", color: "#efe7d5" }}>
                          <Mail className="w-3 h-3" /> EMAIL
                        </a>
                        <a href="https://www.linkedin.com/in/gauthambiju" target="_blank" rel="noreferrer" className="flex-1 text-center flex items-center justify-center gap-1.5 h-8 sm:h-9 rounded font-mono text-[9px] sm:text-[10px] uppercase hover:bg-[rgba(184,146,74,0.08)] transition-colors" style={{ border: "1px solid rgba(184,146,74,0.38)", color: "#efe7d5" }}>
                          <Linkedin className="w-3 h-3" /> LINKEDIN
                        </a>
                        <a href="/resume.pdf" className="flex-1 text-center flex items-center justify-center gap-1.5 h-8 sm:h-9 rounded font-mono text-[9px] sm:text-[10px] uppercase hover:bg-[rgba(184,146,74,0.08)] transition-colors" style={{ border: "1px solid rgba(184,146,74,0.38)", color: "#efe7d5" }}>
                          <FileText className="w-3 h-3" /> RESUME
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* COFFEE MUG */}
              <div
                className="dsk-mug absolute pointer-events-none"
                style={{ right: "10%", bottom: "16%", width: "110px", opacity: 0, willChange: "transform, opacity" }}
              >
                <svg viewBox="0 0 120 130" className="w-full h-auto">
                  <g stroke="rgba(184,146,74,0.45)" strokeWidth="1" fill="none">
                    <path d="M 45 18 q -6 -10 2 -20" />
                    <path d="M 60 14 q 6 -10 -2 -20" />
                    <path d="M 75 18 q -6 -10 2 -20" />
                  </g>
                  <path d="M 24 40 L 96 40 L 90 110 L 30 110 Z" fill="#0e1114" stroke="#b8924a" strokeWidth="1.3" />
                  <ellipse cx="60" cy="40" rx="36" ry="6" fill="#1a1d22" stroke="#b8924a" strokeWidth="1.1" />
                  <path d="M 96 50 q 18 6 14 28 q -2 14 -16 16" stroke="#b8924a" strokeWidth="1.3" fill="none" />
                  <text x="60" y="82" textAnchor="middle" fontFamily="Playfair Display, serif" fontSize="22" fill="rgba(184,146,74,0.75)">GB</text>
                </svg>
              </div>

            </div>
          </div>
        </div>
  );
};

export default DeskSceneStage;
