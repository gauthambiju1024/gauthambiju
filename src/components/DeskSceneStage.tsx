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
                    <path d="M48 261 L172 261 L166 278 L54 278 Z" stroke="rgba(184,146,74,0.82)" strokeWidth="1.55" fill="rgba(23,16,10,0.9)" />
                    <path d="M56 278 L70 331 C72 337 148 337 150 331 L164 278" stroke="rgba(184,146,74,0.68)" strokeWidth="1.55" fill="rgba(8,11,15,0.98)" />
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
                  opacity: 0, willChange: "transform, opacity",
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
                      style={{ background: "#05070a", border: "1px solid rgba(184,146,74,0.30)", borderTop: 0, transform: "rotateX(-90deg)", transformOrigin: "top" }}
                    />
                    <div
                      className="w-full flex-grow rounded-md mt-2 flex flex-col gap-1 p-2"
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
                    <div className="flex justify-center mt-3 mb-1">
                      <div className="w-1/3 rounded-md" style={{ aspectRatio: "2.5 / 1", border: "1px solid rgba(184,146,74,0.15)" }} />
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
                      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(239,231,213,1) 1px, transparent 1px), linear-gradient(90deg,rgba(239,231,213,1) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
                      <div className="relative z-10 flex justify-between items-start w-full mb-3">
                        <h5 className="font-mono text-[10px] tracking-widest uppercase flex items-center gap-2" style={{ color: "#6f9b6d" }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#6f9b6d" }} /> BUILD.OS / CONTACT
                        </h5>
                        <div className="font-serif text-3xl border px-2 rounded-sm" style={{ color: "rgba(229,196,122,0.42)", borderColor: "rgba(214,173,101,0.24)", background: "rgba(0,0,0,0.2)" }}>GB</div>
                      </div>
                      <div className="relative z-10 mt-1">
                        <h2 className="font-mono text-[24px] mb-1" style={{ color: "#efe7d5" }}>Gautham Biju</h2>
                        <p className="font-mono text-[10px] tracking-[0.2em] mb-4 uppercase" style={{ color: "#b8924a" }}>Product · Strategy · Systems</p>
                        <p className="text-[11px] leading-relaxed max-w-[75%] font-serif" style={{ color: "rgba(239,231,213,0.6)" }}>
                          Building thoughtful products with AI, design and business logic.
                        </p>
                      </div>
                      <div className="relative z-10 flex items-center gap-3 font-mono text-[11px] mt-6" style={{ color: "#efe7d5" }}>
                        <span className="rounded-sm px-1.5 py-0.5 text-[9px] border" style={{ color: "#6f9b6d", borderColor: "rgba(111,155,109,0.22)" }}>✉</span>
                        gauthambiju02@gmail.com
                      </div>
                      <div className="relative z-10 flex gap-4 mt-auto w-full pointer-events-auto">
                        {[
                          { label: "EMAIL", href: "mailto:gauthambiju02@gmail.com" },
                          { label: "LINKEDIN", href: "https://www.linkedin.com/in/gauthambiju" },
                          { label: "RESUME", href: "/resume.pdf" },
                        ].map((item) => (
                          <a key={item.label} href={item.href} className="flex-1 text-center flex items-center justify-center h-10 border rounded font-mono text-[10px] uppercase transition-colors" style={{ borderColor: "rgba(184,146,74,0.38)", color: "#efe7d5" }}>
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
                  <ellipse cx="79" cy="135" rx="54" ry="11" fill="rgba(6,9,12,0.74)" stroke="rgba(184,146,74,0.72)" strokeWidth="1.35" />
                  <path d="M 40 52 L 119 52 L 113 124 C 111 133 48 133 46 124 Z" fill="rgba(11,15,18,0.97)" stroke="#b8924a" strokeWidth="1.45" />
                  <ellipse cx="79.5" cy="52" rx="39.5" ry="8.5" fill="rgba(14,18,22,0.98)" stroke="#b8924a" strokeWidth="1.35" />
                  <ellipse cx="79.5" cy="52" rx="31" ry="4.4" fill="rgba(5,7,9,0.92)" stroke="rgba(184,146,74,0.28)" strokeWidth="0.8" />
                  <path d="M 119 64 C 148 66 148 109 118 111" stroke="#b8924a" strokeWidth="1.45" fill="none" />
                  <path d="M 119 75 C 136 77 136 99 118 101" stroke="rgba(184,146,74,0.55)" strokeWidth="1" fill="none" />
                  <path d="M 49 123 C 65 130 96 130 111 123" stroke="rgba(184,146,74,0.36)" strokeWidth="0.9" fill="none" />
                  <text x="80" y="94" textAnchor="middle" fontFamily="Playfair Display, serif" fontSize="34" fill="rgba(184,146,74,0.76)">GB</text>
                </svg>
              </div>

            </div>
          </div>
        </div>
  );
};

export default DeskSceneStage;
