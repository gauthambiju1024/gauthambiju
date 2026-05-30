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

              {/* PLANT POT — botanical line-art, positioned so toolbox occludes lower-right (3D depth) */}
              <div
                className="dsk-plant absolute pointer-events-none"
                style={{ left: "3%", bottom: "12%", width: "150px", opacity: 0, willChange: "transform, opacity", zIndex: 5 }}
              >
                <svg viewBox="0 0 140 240" className="w-full h-auto">
                  {/* central curved stem */}
                  <path
                    d="M 70 140 C 68 110, 74 78, 70 48 C 68 30, 72 18, 70 12"
                    stroke="#7fb18a" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.85"
                  />

                  {/* leaf pairs — bottom (largest, drooping) → top (smallest, vertical) */}
                  <g stroke="#7fb18a" strokeWidth="1.1" fill="rgba(127,177,138,0.16)" strokeLinejoin="round">
                    {/* pair 1 — bottom, drooping out */}
                    <path d="M 70 128 C 50 140, 30 142, 18 132 C 32 122, 54 120, 70 128 Z" />
                    <line x1="70" y1="128" x2="22" y2="134" stroke="#7fb18a" strokeWidth="0.6" opacity="0.7" />
                    <path d="M 70 128 C 90 140, 110 142, 122 132 C 108 122, 86 120, 70 128 Z" />
                    <line x1="70" y1="128" x2="118" y2="134" stroke="#7fb18a" strokeWidth="0.6" opacity="0.7" />

                    {/* pair 2 — near horizontal */}
                    <path d="M 70 104 C 50 108, 30 102, 22 90 C 38 86, 58 92, 70 104 Z" />
                    <line x1="70" y1="104" x2="24" y2="94" stroke="#7fb18a" strokeWidth="0.6" opacity="0.7" />
                    <path d="M 70 104 C 90 108, 110 102, 118 90 C 102 86, 82 92, 70 104 Z" />
                    <line x1="70" y1="104" x2="116" y2="94" stroke="#7fb18a" strokeWidth="0.6" opacity="0.7" />

                    {/* pair 3 — angled up */}
                    <path d="M 70 80 C 54 78, 36 70, 28 56 C 44 54, 60 64, 70 80 Z" />
                    <line x1="70" y1="80" x2="32" y2="60" stroke="#7fb18a" strokeWidth="0.6" opacity="0.7" />
                    <path d="M 70 80 C 86 78, 104 70, 112 56 C 96 54, 80 64, 70 80 Z" />
                    <line x1="70" y1="80" x2="108" y2="60" stroke="#7fb18a" strokeWidth="0.6" opacity="0.7" />

                    {/* pair 4 — smaller, angled up */}
                    <path d="M 70 56 C 58 50, 44 40, 40 28 C 54 30, 66 42, 70 56 Z" />
                    <line x1="70" y1="56" x2="42" y2="32" stroke="#7fb18a" strokeWidth="0.6" opacity="0.7" />
                    <path d="M 70 56 C 82 50, 96 40, 100 28 C 86 30, 74 42, 70 56 Z" />
                    <line x1="70" y1="56" x2="98" y2="32" stroke="#7fb18a" strokeWidth="0.6" opacity="0.7" />

                    {/* pair 5 — smallest, nearly vertical */}
                    <path d="M 70 32 C 62 24, 56 14, 58 6 C 66 10, 70 20, 70 32 Z" />
                    <path d="M 70 32 C 78 24, 84 14, 82 6 C 74 10, 70 20, 70 32 Z" />

                    {/* terminal leaf */}
                    <path d="M 70 14 C 66 8, 66 2, 70 -2 C 74 2, 74 8, 70 14 Z" />
                  </g>

                  {/* terracotta pot */}
                  <path
                    d="M 38 140 L 102 140 L 96 215 L 44 215 Z"
                    fill="rgba(20,16,12,0.85)" stroke="#b8924a" strokeWidth="1.4"
                  />
                  {/* wider rim band */}
                  <path
                    d="M 32 140 L 108 140 L 106 152 L 34 152 Z"
                    fill="rgba(30,22,14,0.9)" stroke="#b8924a" strokeWidth="1.3"
                  />
                  <line x1="38" y1="152" x2="102" y2="152" stroke="#b8924a" strokeWidth="0.8" opacity="0.6" />
                  {/* ground shadow */}
                  <ellipse cx="70" cy="218" rx="34" ry="3" fill="#000" opacity="0.55" />
                </svg>
              </div>

              {/* TOOLBOX SLOT — invisible target the actor lands on (left of laptop) */}
              <div
                className="dsk-toolbox-slot absolute pointer-events-none"
                style={{ left: "10%", bottom: "14%", width: "200px", height: "130px" }}
              />

              {/* LAPTOP — CSS 3D */}
              <div
                className="dsk-laptop absolute pointer-events-auto"
                style={{
                  left: "34%", bottom: "6%", width: "min(44%, 600px)",
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

                  {/* Screen — "Let's Connect" text layout */}
                  <div
                    className="dsk-screen absolute inset-x-0 rounded-t-2xl flex p-2 sm:p-3"
                    style={{
                      bottom: "65%", height: "85%", zIndex: 20,
                      background: "rgba(12,16,21,0.98)",
                      border: "1px solid rgba(184,146,74,0.40)",
                      transform: "rotateX(-55deg)",
                      transformOrigin: "bottom",
                    }}
                  >
                    <div
                      className="w-full h-full rounded-lg overflow-hidden relative flex flex-col items-center justify-center px-6 py-5"
                      style={{
                        background: "#070b10",
                        border: "1px solid rgba(184,146,74,0.30)",
                        boxShadow: "inset 0 0 30px rgba(0,0,0,0.6)",
                      }}
                    >
                      {/* subtle dot grid */}
                      <div
                        className="absolute inset-0 opacity-[0.06]"
                        style={{
                          backgroundImage: "radial-gradient(rgba(184,146,74,0.6) 1px, transparent 1px)",
                          backgroundSize: "18px 18px",
                        }}
                      />

                      <h2 className="relative z-10 font-serif text-2xl sm:text-3xl md:text-4xl mb-2 text-center" style={{ color: "#cbd5e1", letterSpacing: "0.01em" }}>
                        Let's Connect
                      </h2>
                      <p className="relative z-10 text-[10px] sm:text-[11px] md:text-xs text-center max-w-[80%] mb-4 leading-relaxed" style={{ color: "rgba(203,213,225,0.55)" }}>
                        I'm always open to conversations about product, technology, and building things that matter.
                      </p>

                      <div className="relative z-10 w-full max-w-[78%] flex flex-col gap-2">
                        {[
                          { icon: Mail, label: "Email", value: "gauthambiju02@gmail.com", href: "mailto:gauthambiju02@gmail.com" },
                          { icon: Linkedin, label: "LinkedIn", value: "in/gauthambiju", href: "https://www.linkedin.com/in/gauthambiju" },
                          { icon: FileText, label: "Resume", value: "view / download", href: "/resume.pdf" },
                          { icon: Mail, label: "Twitter", value: "@gauthambiju", href: "https://twitter.com/gauthambiju" },
                        ].map((item, i) => {
                          const Icon = item.icon;
                          return (
                            <a
                              key={i}
                              href={item.href}
                              target={item.href.startsWith("http") ? "_blank" : undefined}
                              rel="noreferrer"
                              className="flex items-center justify-between gap-3 rounded-md px-3 py-1.5 font-mono text-[10px] sm:text-[11px] transition-colors hover:bg-[rgba(184,146,74,0.06)]"
                              style={{ border: "1px solid rgba(148,163,184,0.22)", color: "rgba(203,213,225,0.85)" }}
                            >
                              <span className="flex items-center gap-2">
                                <Icon className="w-3 h-3" style={{ color: "rgba(148,163,184,0.55)" }} />
                                <span style={{ color: "rgba(148,163,184,0.7)" }}>{item.label}</span>
                              </span>
                              <span className="flex items-center gap-2" style={{ color: "rgba(203,213,225,0.9)" }}>
                                {item.value}
                                <span style={{ color: "rgba(148,163,184,0.5)" }}>↗</span>
                              </span>
                            </a>
                          );
                        })}
                      </div>

                      <p className="relative z-10 mt-4 font-serif italic text-[11px]" style={{ color: "rgba(148,163,184,0.45)" }}>— GB</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* COFFEE MUG */}
              <div
                className="dsk-mug absolute pointer-events-none"
                style={{ right: "10%", bottom: "10%", width: "110px", opacity: 0, willChange: "transform, opacity" }}
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
