import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Mail, Linkedin, FileText } from "lucide-react";
import { useBlogPosts } from "@/hooks/useSiteData";

/**
 * Desk Scene Stage — final viewport after the Toolbox→Skills reveal.
 *
 * A 2D illustrated desk in dark walnut + gold linework, matching the
 * inspiration. As the user scrolls into this pinned section, elements
 * "draw in" one by one with a stroke-dash reveal while the closed toolbox
 * (already placed, slightly smaller, shifted left) settles onto the table.
 *
 * Order of draw-in (scroll progress p):
 *   0.00–0.15  table edge + blueprint perspective lines
 *   0.10–0.30  toolbox settles down + casts shadow
 *   0.20–0.40  plant pot (behind toolbox)
 *   0.30–0.55  laptop body + keyboard
 *   0.45–0.65  laptop screen contact panel fades in
 *   0.55–0.75  coffee mug
 *   0.65–0.90  field notes panel with blog cards
 *   0.85–1.00  lamp glow + final ambient settle
 */

const easeInOut = (x: number) => x * x * (3 - 2 * x);
const clamp = (x: number, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
const seg = (a: number, b: number, x: number) => clamp((x - a) / (b - a));

const DeskSceneStage = () => {
  const pinRef = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const { posts } = useBlogPosts(true);

  useEffect(() => {
    const pin = pinRef.current;
    const root = rootRef.current;
    if (!pin || !root) return;

    let raf = 0;
    const tick = () => {
      const rect = pin.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = Math.max(1, rect.height - vh);
      const p = clamp(-rect.top / total);

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

      // Table + perspective lines (stroke draw)
      const tEdge = easeInOut(seg(0.0, 0.15, p));
      setStroke(".dsk-edge", tEdge);
      setStroke(".dsk-persp-1", easeInOut(seg(0.03, 0.18, p)));
      setStroke(".dsk-persp-2", easeInOut(seg(0.05, 0.2, p)));
      setStroke(".dsk-persp-3", easeInOut(seg(0.07, 0.22, p)));

      // Toolbox settle: drop in & shadow
      const tboxIn = easeInOut(seg(0.1, 0.3, p));
      set(".dsk-toolbox", tboxIn, (1 - tboxIn) * -24);
      set(".dsk-toolbox-shadow", tboxIn * 0.55);

      // Plant pot
      const tPlant = easeInOut(seg(0.2, 0.4, p));
      set(".dsk-plant", tPlant, (1 - tPlant) * 18);

      // Laptop
      const tLap = easeInOut(seg(0.3, 0.55, p));
      set(".dsk-laptop", tLap, (1 - tLap) * 30);
      // Laptop screen content
      set(".dsk-screen", easeInOut(seg(0.45, 0.65, p)));

      // Mug
      const tMug = easeInOut(seg(0.55, 0.75, p));
      set(".dsk-mug", tMug, (1 - tMug) * 16);

      // Field notes
      const tNotes = easeInOut(seg(0.65, 0.9, p));
      set(".dsk-notes", tNotes, (1 - tNotes) * -20);

      // Lamp glow
      set(".dsk-lamp", easeInOut(seg(0.85, 1.0, p)));

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const topPosts = posts.slice(0, 3);

  return (
    <section
      ref={pinRef}
      id="desk-scene"
      aria-label="Workbench desk scene"
      style={{ height: "260vh" }}
      className="relative"
    >
      <div className="sticky top-0 w-full overflow-hidden" style={{ height: "100vh", background: "#0a0d10" }}>
        <div ref={rootRef} className="absolute inset-0">
          {/* Ghost constellation backdrop */}
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, rgba(184,146,74,0.06) 0, transparent 40%), radial-gradient(circle at 70% 60%, rgba(184,146,74,0.05) 0, transparent 45%)",
            }}
          />

          {/* Blueprint perspective lines + table edge */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="goldStroke" x1="0" x2="1">
                <stop offset="0" stopColor="#8a6a2a" stopOpacity="0.0" />
                <stop offset="0.2" stopColor="#b8924a" stopOpacity="0.9" />
                <stop offset="0.8" stopColor="#b8924a" stopOpacity="0.9" />
                <stop offset="1" stopColor="#8a6a2a" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {/* perspective lines vanishing toward upper centre */}
            <path className="dsk-persp-1" d="M -50 900 L 800 470" stroke="rgba(184,146,74,0.18)" strokeWidth="1" fill="none" />
            <path className="dsk-persp-2" d="M 1650 900 L 800 470" stroke="rgba(184,146,74,0.18)" strokeWidth="1" fill="none" />
            <path className="dsk-persp-3" d="M 800 900 L 800 470" stroke="rgba(184,146,74,0.10)" strokeWidth="1" fill="none" strokeDasharray="4 6" />
            {/* table edge */}
            <path className="dsk-edge" d="M 0 720 L 1600 720" stroke="url(#goldStroke)" strokeWidth="1.5" fill="none" />
            <path className="dsk-edge" d="M 0 724 L 1600 724" stroke="rgba(184,146,74,0.18)" strokeWidth="1" fill="none" />
          </svg>

          {/* Scene wrapper — all elements positioned absolutely on a stage */}
          <div className="absolute inset-0 flex items-end justify-center">
            <div className="relative w-full max-w-[1400px] h-[80vh] mx-auto">

              {/* FIELD NOTES — behind & above the laptop */}
              <div
                className="dsk-notes absolute"
                style={{
                  right: "4%",
                  top: "8%",
                  width: "min(46%, 620px)",
                  opacity: 0,
                  transition: "transform 0.05s linear",
                  willChange: "transform, opacity",
                }}
              >
                <div
                  className="relative rounded-md border p-5 md:p-6"
                  style={{
                    background: "rgba(8,18,16,0.85)",
                    borderColor: "rgba(184,146,74,0.35)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(184,146,74,0.08)",
                  }}
                >
                  {/* corner brackets */}
                  <span className="absolute -top-1 -left-1 w-3 h-3 border-t border-l" style={{ borderColor: "#b8924a" }} />
                  <span className="absolute -top-1 -right-1 w-3 h-3 border-t border-r" style={{ borderColor: "#b8924a" }} />
                  <span className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l" style={{ borderColor: "#b8924a" }} />
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r" style={{ borderColor: "#b8924a" }} />

                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#7fb18a" }} />
                    <span className="text-[10px] tracking-[0.25em] font-mono" style={{ color: "#7fb18a" }}>FIELD NOTES</span>
                  </div>
                  <p className="text-xs md:text-sm mb-4" style={{ color: "rgba(184,146,74,0.7)", fontFamily: "var(--font-mono)" }}>
                    Thoughts, essays and product reflections.
                  </p>
                  <div className="h-px mb-4" style={{ background: "rgba(184,146,74,0.25)" }} />

                  <div className="grid grid-cols-3 gap-3">
                    {(topPosts.length ? topPosts : [
                      { id: "a", slug: "#", title: "Why Good Products Feel Obvious", excerpt: "Friction, timing, and context in adoption." },
                      { id: "b", slug: "#", title: "Designing AI Products Users Can Trust", excerpt: "Explainability, confidence, and human control." },
                      { id: "c", slug: "#", title: "The Interview Is Not the Insight", excerpt: "Turning messy conversations into product decisions." },
                    ] as any[]).map((p, i) => (
                      <Link
                        key={p.id}
                        to={p.slug && p.slug !== "#" ? `/blog/${p.slug}` : "/blog"}
                        className="group block rounded-sm border p-3 transition-colors"
                        style={{
                          background: "rgba(10,22,20,0.6)",
                          borderColor: "rgba(184,146,74,0.25)",
                          color: "rgba(184,146,74,0.85)",
                        }}
                      >
                        <div className="text-[9px] font-mono mb-2" style={{ color: "rgba(127,177,138,0.7)" }}>
                          {String(i + 1).padStart(2, "0")}
                        </div>
                        <h4 className="text-[11px] md:text-xs font-medium leading-snug mb-2 group-hover:text-[#e8c98a]" style={{ color: "#d6b56a" }}>
                          {p.title}
                        </h4>
                        <p className="text-[10px] leading-snug" style={{ color: "rgba(184,146,74,0.55)" }}>
                          {p.excerpt?.slice(0, 60)}
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
                className="dsk-plant absolute"
                style={{ left: "8%", bottom: "26%", width: "120px", opacity: 0, willChange: "transform, opacity" }}
              >
                <svg viewBox="0 0 120 160" className="w-full h-auto">
                  {/* leaves */}
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
                  {/* pot */}
                  <path d="M 32 92 L 88 92 L 82 150 L 38 150 Z" stroke="#b8924a" strokeWidth="1.3" fill="rgba(20,16,12,0.7)" />
                  <line x1="30" y1="98" x2="90" y2="98" stroke="#b8924a" strokeWidth="1" />
                </svg>
              </div>

              {/* TOOLBOX — small, shifted left, closed */}
              <div
                className="dsk-toolbox absolute"
                style={{ left: "16%", bottom: "16%", width: "230px", opacity: 0, willChange: "transform, opacity" }}
              >
                <svg viewBox="0 0 240 160" className="w-full h-auto">
                  {/* top face (slight perspective) */}
                  <polygon points="32,42 208,42 222,30 46,30" fill="#15181c" stroke="#b8924a" strokeWidth="1.2" />
                  {/* body */}
                  <rect x="32" y="42" width="176" height="86" fill="#1a1d22" stroke="#b8924a" strokeWidth="1.2" />
                  {/* handle */}
                  <path d="M 88 30 Q 120 6, 152 30" stroke="#b8924a" strokeWidth="1.6" fill="none" />
                  {/* lid seam */}
                  <line x1="32" y1="62" x2="208" y2="62" stroke="#b8924a" strokeWidth="0.8" opacity="0.6" />
                  {/* latches */}
                  <rect x="60" y="58" width="22" height="18" fill="#0e1114" stroke="#b8924a" strokeWidth="0.9" />
                  <rect x="158" y="58" width="22" height="18" fill="#0e1114" stroke="#b8924a" strokeWidth="0.9" />
                  {/* nameplate */}
                  <rect x="92" y="88" width="56" height="22" fill="#0e1114" stroke="#b8924a" strokeWidth="0.9" />
                  <text x="120" y="103" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#b8924a" letterSpacing="2">TOOLS</text>
                  {/* corner brackets */}
                  <path d="M 32 42 L 32 50 M 32 42 L 40 42" stroke="#b8924a" strokeWidth="1.2" />
                  <path d="M 208 42 L 208 50 M 208 42 L 200 42" stroke="#b8924a" strokeWidth="1.2" />
                  <path d="M 32 128 L 32 120 M 32 128 L 40 128" stroke="#b8924a" strokeWidth="1.2" />
                  <path d="M 208 128 L 208 120 M 208 128 L 200 128" stroke="#b8924a" strokeWidth="1.2" />
                </svg>
              </div>
              {/* toolbox shadow */}
              <div
                className="dsk-toolbox-shadow absolute"
                style={{
                  left: "16%",
                  bottom: "14%",
                  width: "230px",
                  height: "18px",
                  opacity: 0,
                  background: "radial-gradient(ellipse, rgba(0,0,0,0.7), transparent 70%)",
                  filter: "blur(6px)",
                }}
              />

              {/* LAPTOP — in front-centre, 3D perspective */}
              <div
                className="dsk-laptop absolute"
                style={{ left: "32%", bottom: "8%", width: "min(46%, 620px)", opacity: 0, willChange: "transform, opacity" }}
              >
                <svg viewBox="0 0 620 380" className="w-full h-auto">
                  {/* screen back panel with perspective */}
                  <polygon points="60,30 560,30 540,250 80,250" fill="#0e1114" stroke="#b8924a" strokeWidth="1.3" />
                  {/* screen inner */}
                  <polygon points="78,46 542,46 524,236 96,236" fill="#0a0d10" stroke="rgba(184,146,74,0.4)" strokeWidth="0.8" />
                  {/* keyboard deck (perspective trapezoid) */}
                  <polygon points="40,250 580,250 610,320 10,320" fill="#15181c" stroke="#b8924a" strokeWidth="1.3" />
                  {/* trackpad */}
                  <polygon points="240,290 380,290 388,312 232,312" fill="#0e1114" stroke="rgba(184,146,74,0.4)" strokeWidth="0.8" />
                  {/* keyboard keys (rows in perspective) */}
                  <g stroke="rgba(184,146,74,0.35)" strokeWidth="0.6" fill="rgba(14,17,20,0.9)">
                    {[0, 1, 2].map((row) => {
                      const y0 = 256 + row * 9;
                      const yh = 7;
                      const inset = 50 + row * 3;
                      const w = 540 - row * 6;
                      const keys = 12;
                      return (
                        <g key={row}>
                          {Array.from({ length: keys }).map((_, k) => {
                            const x = inset + (k * w) / keys;
                            const kw = w / keys - 2;
                            return <rect key={k} x={x} y={y0} width={kw} height={yh} rx="1" />;
                          })}
                        </g>
                      );
                    })}
                  </g>
                </svg>

                {/* SCREEN CONTENT overlay — absolutely on top of screen polygon */}
                <div
                  className="dsk-screen absolute"
                  style={{
                    left: "12.6%", top: "12%", width: "75%", height: "50%",
                    opacity: 0, pointerEvents: "auto",
                  }}
                >
                  <div className="w-full h-full p-3 md:p-4 flex flex-col" style={{ color: "rgba(184,146,74,0.9)" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#7fb18a" }} />
                      <span className="text-[9px] tracking-[0.25em] font-mono" style={{ color: "#7fb18a" }}>BUILD.OS / CONTACT</span>
                    </div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-serif text-xl md:text-2xl leading-tight" style={{ color: "#e8c98a" }}>Gautham Biju</h3>
                        <p className="text-[10px] md:text-xs font-mono mt-0.5" style={{ color: "rgba(184,146,74,0.7)" }}>
                          Product · Strategy · Systems
                        </p>
                      </div>
                      <div className="font-serif text-2xl md:text-3xl" style={{ color: "rgba(184,146,74,0.9)" }}>GB</div>
                    </div>
                    <p className="text-[10px] md:text-xs mt-2 leading-relaxed" style={{ color: "rgba(184,146,74,0.65)" }}>
                      Building thoughtful products with AI, design and business logic.
                    </p>
                    <a href="mailto:gauthambiju02@gmail.com" className="mt-2 text-[10px] md:text-xs font-mono flex items-center gap-1.5 hover:text-[#e8c98a]" style={{ color: "rgba(184,146,74,0.85)" }}>
                      <Mail className="w-3 h-3" /> gauthambiju02@gmail.com
                    </a>
                    <div className="mt-auto pt-2 flex gap-2">
                      <a href="mailto:gauthambiju02@gmail.com" className="flex-1 flex items-center justify-center gap-1.5 border rounded-sm py-1.5 text-[10px] font-mono hover:bg-[rgba(184,146,74,0.1)]" style={{ borderColor: "rgba(184,146,74,0.4)" }}>
                        <Mail className="w-3 h-3" /> EMAIL
                      </a>
                      <a href="https://www.linkedin.com/in/gauthambiju" target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-1.5 border rounded-sm py-1.5 text-[10px] font-mono hover:bg-[rgba(184,146,74,0.1)]" style={{ borderColor: "rgba(184,146,74,0.4)" }}>
                        <Linkedin className="w-3 h-3" /> LINKEDIN
                      </a>
                      <a href="/resume.pdf" className="flex-1 flex items-center justify-center gap-1.5 border rounded-sm py-1.5 text-[10px] font-mono hover:bg-[rgba(184,146,74,0.1)]" style={{ borderColor: "rgba(184,146,74,0.4)" }}>
                        <FileText className="w-3 h-3" /> RESUME
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* COFFEE MUG — right of laptop */}
              <div
                className="dsk-mug absolute"
                style={{ right: "12%", bottom: "16%", width: "110px", opacity: 0, willChange: "transform, opacity" }}
              >
                <svg viewBox="0 0 120 130" className="w-full h-auto">
                  {/* steam */}
                  <g stroke="rgba(184,146,74,0.4)" strokeWidth="1" fill="none">
                    <path d="M 45 18 q -6 -10 2 -20" />
                    <path d="M 60 14 q 6 -10 -2 -20" />
                    <path d="M 75 18 q -6 -10 2 -20" />
                  </g>
                  {/* body */}
                  <path d="M 24 40 L 96 40 L 90 110 L 30 110 Z" fill="#0e1114" stroke="#b8924a" strokeWidth="1.3" />
                  <ellipse cx="60" cy="40" rx="36" ry="6" fill="#1a1d22" stroke="#b8924a" strokeWidth="1.1" />
                  {/* handle */}
                  <path d="M 96 50 q 18 6 14 28 q -2 14 -16 16" stroke="#b8924a" strokeWidth="1.3" fill="none" />
                  {/* monogram */}
                  <text x="60" y="82" textAnchor="middle" fontFamily="Playfair Display, serif" fontSize="22" fill="rgba(184,146,74,0.7)">GB</text>
                </svg>
              </div>

              {/* LAMP GLOW behind mug area */}
              <div
                className="dsk-lamp absolute pointer-events-none"
                style={{
                  right: "10%", bottom: "20%", width: "300px", height: "300px", opacity: 0,
                  background: "radial-gradient(circle, rgba(255,200,120,0.15), transparent 60%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeskSceneStage;
