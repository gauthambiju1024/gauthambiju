/**
 * FinalWorkbench — desk-scene closing frame.
 * Adapted from the uploaded source. Background scenery (constellation SVG,
 * radial gradient wrapper, .desk-plane) is intentionally REMOVED so this
 * scene inherits the existing site's walnut + ghost-grid background.
 */

const Leaf = ({ x, y, angle, scale = 1 }: { x: number; y: number; angle: number; scale?: number }) => (
  <g transform={`translate(${x}, ${y}) rotate(${angle}) scale(${scale})`}>
    <path d="M0,0 C-18,-15 -22,-35 0,-55 C22,-35 18,-15 0,0 Z" stroke="rgba(130, 180, 130, 0.9)" strokeWidth="1.5" fill="rgba(130, 180, 130, 0.15)" strokeLinejoin="round" />
    <path d="M0,0 C-4,-20 4,-40 0,-53" stroke="rgba(130, 180, 130, 0.6)" strokeWidth="1" fill="none" strokeLinecap="round" />
    <path d="M0,-12 Q-8,-20 -12,-20 M0,-25 Q-12,-30 -14,-30 M0,-38 Q-8,-43 -10,-43" stroke="rgba(130, 180, 130, 0.5)" strokeWidth="1" fill="none" strokeLinecap="round" />
    <path d="M0,-15 Q8,-22 12,-22 M0,-28 Q12,-32 14,-32 M0,-40 Q8,-45 10,-45" stroke="rgba(130, 180, 130, 0.5)" strokeWidth="1" fill="none" strokeLinecap="round" />
  </g>
);

export function FinalWorkbench() {
  return (
    <section id="contact" className="send-workbench-section pointer-events-auto">
      {/* Target element for the toolbox 3D landing position */}
      <div className="final-toolbox pointer-events-none" />

      <div className="workbench-plant">
        <svg viewBox="0 0 160 260" width="100%" height="100%">
          <path d="M80 180 L80 15" stroke="rgba(130, 180, 130, 0.8)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <Leaf x={80} y={35} angle={0} scale={0.8} />
          <Leaf x={80} y={60} angle={40} scale={1} />
          <Leaf x={80} y={70} angle={-45} scale={0.9} />
          <Leaf x={80} y={100} angle={50} scale={1.2} />
          <Leaf x={80} y={110} angle={-55} scale={1.1} />
          <Leaf x={80} y={140} angle={60} scale={0.95} />
          <Leaf x={80} y={145} angle={-65} scale={1.05} />
          <Leaf x={80} y={170} angle={70} scale={0.6} />
          <Leaf x={80} y={175} angle={-75} scale={0.5} />
          <path d="M45 180 C45 174, 115 174, 115 180" stroke="rgba(184,146,74,0.3)" strokeWidth="1.5" fill="none" />
          <path d="M45 180 C45 186, 115 186, 115 180 L102 245 C102 250, 58 250, 58 245 Z" stroke="rgba(184,146,74,0.6)" strokeWidth="1.5" fill="rgba(8,11,15,0.96)" />
          <path d="M45 180 C45 186, 115 186, 115 180" stroke="rgba(184,146,74,0.8)" strokeWidth="1.5" fill="none" />
        </svg>
      </div>

      <div className="contact-laptop [perspective:1200px]">
        <div className="relative w-full aspect-[16/11] [transform-style:preserve-3d] [transform:rotateX(55deg)_rotateZ(0deg)] origin-center">
          <div className="absolute inset-x-0 bottom-0 h-[65%] bg-[rgba(10,14,18,0.96)] border border-[rgba(184,146,74,0.30)] rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] [transform-style:preserve-3d] z-10 flex flex-col p-4 sm:p-6">
            <div className="absolute top-full left-0 right-0 h-3 bg-[#05070a] border border-t-0 border-[rgba(184,146,74,0.30)] rounded-b-xl [transform:rotateX(-90deg)] origin-top"></div>
            <div className="w-full flex-grow border border-[rgba(184,146,74,0.15)] rounded-md mt-2 flex flex-col gap-1 p-2 bg-[#040608]">
              {[...Array(5)].map((_, r) => (
                <div key={r} className="flex gap-1 w-full flex-1">
                  {[...Array(12)].map((_, c) => (
                    <div key={c} className="flex-1 bg-[rgba(184,146,74,0.05)] rounded-[2px] border border-[rgba(184,146,74,0.1)]"></div>
                  ))}
                </div>
              ))}
              <div className="flex gap-1 w-full flex-1">
                {[...Array(4)].map((_, c) => (
                  <div key={`l-${c}`} className="flex-1 bg-[rgba(184,146,74,0.05)] rounded-[2px] border border-[rgba(184,146,74,0.1)]"></div>
                ))}
                <div className="flex-[4] bg-[rgba(184,146,74,0.05)] rounded-[2px] border border-[rgba(184,146,74,0.1)]"></div>
                {[...Array(4)].map((_, c) => (
                  <div key={`r-${c}`} className="flex-1 bg-[rgba(184,146,74,0.05)] rounded-[2px] border border-[rgba(184,146,74,0.1)]"></div>
                ))}
              </div>
            </div>
            <div className="flex justify-center mt-3 mb-1">
              <div className="w-1/3 aspect-[2.5/1] border border-[rgba(184,146,74,0.15)] rounded-md"></div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-[65%] h-[85%] bg-[rgba(12,16,21,0.98)] border border-[rgba(184,146,74,0.40)] rounded-t-2xl [transform:rotateX(-55deg)] origin-bottom z-20 flex p-3">
            <div className="w-full h-full bg-[#05080a] border border-[rgba(184,146,74,0.30)] rounded-lg overflow-hidden relative flex flex-col p-4 sm:p-6 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
              <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(239,231,213,1)_1px,transparent_1px),linear-gradient(90deg,rgba(239,231,213,1)_1px,transparent_1px)] bg-[length:24px_24px]"></div>

              <div className="flex justify-between items-start z-10 w-full mb-3 sm:mb-4">
                <h5 className="text-[var(--bd-green)] font-mono text-[9px] sm:text-[10px] tracking-widest uppercase flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--bd-green)]" /> BUILD.OS / CONTACT
                </h5>
                <div className="text-[var(--bd-gold-hi)] opacity-40 font-serif text-2xl sm:text-3xl border border-[var(--bd-line-soft)] px-2 rounded-sm bg-black/20">GB</div>
              </div>

              <div className="z-10 mt-1 sm:mt-2">
                <h2 className="text-xl sm:text-[24px] font-mono text-[var(--bd-cream)] mb-1">Gautham Biju</h2>
                <p className="text-[var(--bd-gold)] font-mono text-[9px] sm:text-[10px] tracking-[0.2em] mb-2 sm:mb-4 uppercase">Product · Strategy · Systems</p>
                <p className="text-[#efe7d5] opacity-60 text-[10px] sm:text-[11px] leading-relaxed max-w-[85%] sm:max-w-[75%] font-serif">
                  Building thoughtful products with AI, design and business logic.
                </p>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 text-[#efe7d5] font-mono text-[10px] sm:text-[11px] mt-4 sm:mt-6 z-10 pointer-events-auto selection:bg-[#6f9b6d]/30">
                <span className="text-[var(--bd-green)] border border-[var(--bd-green-soft)] rounded-sm px-1.5 py-0.5 text-[8px] sm:text-[9px]">✉</span> gauthambiju02@gmail.com
              </div>

              <div className="flex gap-2 sm:gap-4 mt-auto z-10 w-full pointer-events-auto">
                <a href="mailto:gauthambiju02@gmail.com" className="flex-1 text-center flex items-center justify-center h-8 sm:h-10 border border-[rgba(184,146,74,0.38)] hover:border-[var(--bd-gold)] hover:bg-[rgba(184,146,74,0.08)] transition-colors rounded block font-mono text-[9px] sm:text-[10px] uppercase text-[var(--bd-cream)] cursor-pointer">
                  EMAIL
                </a>
                <a href="#" className="flex-1 text-center flex items-center justify-center h-8 sm:h-10 border border-[rgba(184,146,74,0.38)] hover:border-[var(--bd-gold)] hover:bg-[rgba(184,146,74,0.08)] transition-colors rounded block font-mono text-[9px] sm:text-[10px] uppercase text-[var(--bd-cream)] cursor-pointer">
                  LINKEDIN
                </a>
                <a href="#" className="flex-1 text-center flex items-center justify-center h-8 sm:h-10 border border-[rgba(184,146,74,0.38)] hover:border-[var(--bd-gold)] hover:bg-[rgba(184,146,74,0.08)] transition-colors rounded block font-mono text-[9px] sm:text-[10px] uppercase text-[var(--bd-cream)] cursor-pointer">
                  RESUME
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="field-notes-board p-6 flex flex-col">
        <div className="absolute top-2 left-2 w-1.5 h-1.5 border border-[var(--bd-line)] rounded-full" />
        <div className="absolute top-2 right-2 w-1.5 h-1.5 border border-[var(--bd-line)] rounded-full" />
        <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border border-[var(--bd-line)] rounded-full" />
        <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border border-[var(--bd-line)] rounded-full" />

        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(239,231,213,1)_1px,transparent_1px),linear-gradient(90deg,rgba(239,231,213,1)_1px,transparent_1px)] bg-[length:22px_22px] rounded-[14px]"></div>

        <div className="flex justify-between items-start z-10">
          <div>
            <h3 className="text-[var(--bd-green)] font-mono text-[11px] tracking-[0.2em] uppercase mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--bd-green)]" /> FIELD NOTES
            </h3>
            <p className="text-[var(--bd-cream)] opacity-60 text-[12px] font-serif mb-6 leading-tight">
              Thoughts, essays and<br />product reflections.
            </p>
          </div>
        </div>

        <div className="w-6 h-px bg-[var(--bd-line-soft)] mb-6 z-10" />

        <div className="flex gap-[3%] z-10 h-full max-h-[160px]">
          {[
            { id: '01', title: 'Why Good Products Feel Obvious', desc: 'Friction, timing, and context in adoption.' },
            { id: '02', title: 'Designing AI Products Users Can Trust', desc: 'Explainability, confidence, and human control.' },
            { id: '03', title: 'The Interview Is Not the Insight', desc: 'Turning messy conversations into product decisions.' },
          ].map((blog) => (
            <div key={blog.id} className="w-[30%] bg-[rgba(10,14,18,0.9)] border border-[var(--bd-line-soft)] hover:border-[var(--bd-line)] p-4 cursor-pointer relative group flex flex-col transition-all overflow-hidden rounded-sm">
              <span className="text-[var(--bd-green)] font-mono text-[10px] block mb-2">{blog.id}</span>
              <h4 className="text-[var(--bd-cream)] text-[11px] font-serif mb-2 leading-snug line-clamp-3">{blog.title}</h4>
              <div className="w-3 h-px bg-[var(--bd-line-soft)] group-hover:bg-[var(--bd-line)] transition-colors mb-2" />
              <p className="text-[var(--bd-cream)] opacity-50 text-[9px] leading-relaxed line-clamp-3">{blog.desc}</p>
              <div className="absolute right-3 bottom-3 text-[var(--bd-line-soft)] group-hover:text-[var(--bd-line)] text-xs transition-colors group-hover:translate-x-1">→</div>
            </div>
          ))}
        </div>

        <div className="mt-8 z-10 flex justify-end pr-2">
          <a href="#" className="text-[var(--bd-green)] hover:text-[var(--bd-gold-hi)] font-mono text-[10px] tracking-widest uppercase flex items-center gap-2 transition-colors">
            VIEW ALL WRITING ↗
          </a>
        </div>

        <div className="absolute -right-2 top-4 w-[90px] h-[110px] bg-[#b7a88b] -rotate-3 p-3 flex flex-col items-center justify-center shadow-[4px_6px_12px_rgba(0,0,0,0.6)] cursor-pointer hover:rotate-0 transition-transform">
          <div className="absolute -top-3 w-8 h-3 bg-[rgba(0,0,0,0.15)] backdrop-blur-sm -rotate-2" />
          <p className="font-mono text-[#1a1208] text-[10px] leading-snug text-center font-bold">
            Ship<br />useful<br />things.
          </p>
        </div>
      </div>

      <div className="desk-lamp">
        <svg viewBox="0 0 180 330" width="100%" height="auto">
          <ellipse cx="140" cy="300" rx="40" ry="12" fill="rgba(12,16,21,0.96)" stroke="var(--bd-line-soft)" strokeWidth="1.5" />
          <ellipse cx="140" cy="296" rx="40" ry="12" fill="rgba(12,16,21,0.96)" stroke="var(--bd-line-soft)" strokeWidth="1.5" />
          <line x1="140" y1="296" x2="160" y2="150" stroke="var(--bd-line)" strokeWidth="2" />
          <line x1="160" y1="150" x2="60" y2="100" stroke="var(--bd-line)" strokeWidth="2" />
          <circle cx="160" cy="150" r="5" fill="none" stroke="var(--bd-line)" strokeWidth="1.5" />
          <circle cx="140" cy="296" r="4" fill="none" stroke="var(--bd-line)" strokeWidth="1.5" />
          <circle cx="60" cy="100" r="4" fill="none" stroke="var(--bd-line)" strokeWidth="1.5" />
          <path d="M50 100 L-40 280 A 100 20 0 0 0 80 300 Z" fill="rgba(229,196,122,0.06)" />
          <path d="M60 95 Q40 90 20 130 C10 150 70 180 80 150 C90 120 70 100 60 95 Z" fill="rgba(12,16,21,0.96)" stroke="var(--bd-line)" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="workbench-mug">
        <svg viewBox="0 0 110 110" width="100%" height="auto">
          <path d="M40 30 Q45 15 35 0 M55 35 Q60 20 50 5" stroke="var(--bd-line-soft)" strokeWidth="1.5" fill="none" opacity="0.6" className="animate-pulse" />
          <ellipse cx="50" cy="90" rx="35" ry="10" fill="rgba(7,10,13,0.9)" stroke="var(--bd-line-soft)" strokeWidth="1" />
          <path d="M75 55 C100 55 100 75 75 80" fill="none" stroke="rgba(12,16,21,0.96)" strokeWidth="8" />
          <path d="M75 55 C100 55 100 75 75 80" fill="none" stroke="var(--bd-line-soft)" strokeWidth="1.5" />
          <path d="M25 40 L25 80 Q25 90 50 90 Q75 90 75 80 L75 40 Z" fill="rgba(12,16,21,0.96)" stroke="var(--bd-line)" strokeWidth="1.5" />
          <ellipse cx="50" cy="40" rx="25" ry="5" fill="rgba(12,16,21,0.96)" stroke="var(--bd-line)" strokeWidth="1.5" />
          <text x="50" y="70" fontFamily="serif" fontSize="16" fill="var(--bd-gold)" textAnchor="middle" opacity="0.8">GB</text>
        </svg>
      </div>

      <div className="notebook-pen">
        <svg viewBox="0 0 190 150" width="100%" height="auto">
          <g transform="translate(20, 20) rotate(-12)">
            <rect x="3" y="-3" width="110" height="90" rx="4" fill="rgba(220, 220, 220, 0.2)" stroke="var(--bd-line-soft)" strokeWidth="0.5" />
            <rect x="2" y="-2" width="110" height="90" rx="4" fill="rgba(200, 200, 200, 0.2)" />
            <rect x="1" y="-1" width="110" height="90" rx="4" fill="rgba(180, 180, 180, 0.2)" />
            <rect x="0" y="0" width="110" height="90" rx="4" fill="rgba(14,19,25,0.96)" stroke="var(--bd-line-soft)" strokeWidth="1.5" />
            <line x1="15" y1="10" x2="15" y2="80" stroke="var(--bd-line-soft)" strokeWidth="0.5" />
            {[...Array(6)].map((_, i) => (
              <circle key={i} cx="0" cy={15 + i * 12} r="3" fill="none" stroke="var(--bd-line)" strokeWidth="1" />
            ))}
            <text x="60" y="45" fontFamily="monospace" fontSize="12" fill="var(--bd-gold)" textAnchor="middle" opacity="0.8" letterSpacing="2">IDEAS</text>
            <line x1="45" y1="52" x2="75" y2="52" stroke="var(--bd-line-soft)" strokeWidth="1" />
          </g>
          <g transform="translate(130, 40) rotate(25)">
            <rect x="-2" y="2" width="8" height="80" rx="4" fill="rgba(0,0,0,0.5)" />
            <rect x="0" y="0" width="8" height="80" rx="4" fill="rgba(12,16,21,0.96)" stroke="var(--bd-line-soft)" strokeWidth="1.5" />
            <path d="M0 80 L4 90 L8 80 Z" fill="rgba(12,16,21,0.96)" stroke="var(--bd-line-soft)" strokeWidth="1.5" />
            <line x1="4" y1="10" x2="4" y2="70" stroke="var(--bd-line-soft)" strokeWidth="0.5" />
          </g>
        </svg>
      </div>
    </section>
  );
}

export default FinalWorkbench;
