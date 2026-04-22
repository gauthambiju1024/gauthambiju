import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MapPin, Mail, ArrowUpRight, RotateCw, RotateCcw } from "lucide-react";

const strengths = [
  { title: "Systems Thinking", desc: "I see connections between moving parts — business, product, user, tech — and design for the whole, not just one surface." },
  { title: "Fast Learning", desc: "I ramp up quickly on new domains, tools, and frameworks. From AI workflows to healthcare ops — I learn by building." },
  { title: "Structured Problem Solving", desc: "I break ambiguity into frameworks, prioritize ruthlessly, and move from insight to action with clarity." },
];

const focusAreas = ["Product Thinking", "AI-Enabled Workflows", "Business × UX"];

const AboutSection = () => {
  const [flipped, setFlipped] = useState(false);
  const reduce = useReducedMotion();

  return (
    <section className="px-6 md:px-16 py-20 md:py-28">
      {/* Section label */}
      <div className="flex items-center gap-3 mb-14 max-w-5xl mx-auto">
        <div className="h-px flex-1 bg-[hsl(var(--gold)/0.25)]" />
        <span className="text-[10px] tracking-[0.3em] uppercase font-mono text-[hsl(var(--gold)/0.7)]">
          The Card on the Desk
        </span>
        <div className="h-px flex-1 bg-[hsl(var(--gold)/0.25)]" />
      </div>

      {/* Card stage */}
      <div className="business-card-stage mx-auto" style={{ perspective: "1800px" }}>
        <motion.div
          className="business-card-inner"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          style={{ transformStyle: "preserve-3d" }}
          whileHover={reduce ? undefined : { rotateZ: 0, y: -6 }}
          initial={{ rotateZ: -1.8 }}
        >
          {/* FRONT */}
          <div
            className="business-card business-card-face"
            style={{ backfaceVisibility: "hidden" }}
            onClick={() => setFlipped(true)}
          >
            {/* Corner monogram */}
            <div className="absolute top-6 right-7 flex items-center gap-2">
              <span className="text-[9px] tracking-[0.3em] font-mono text-[hsl(var(--ink)/0.5)] uppercase">
                Est. 2024
              </span>
              <div className="w-9 h-9 rounded-full border border-[hsl(var(--gold)/0.5)] flex items-center justify-center card-foil">
                <span className="font-serif-display text-sm font-bold">GB</span>
              </div>
            </div>

            {/* Top-left punch holes (subtle) */}
            <div className="absolute top-6 left-7 flex gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[hsl(var(--ink)/0.25)]" />
              <span className="w-1 h-1 rounded-full bg-[hsl(var(--ink)/0.25)]" />
              <span className="w-1 h-1 rounded-full bg-[hsl(var(--ink)/0.25)]" />
            </div>

            <div className="h-full flex flex-col justify-center px-10 md:px-16 py-14">
              <p className="text-[10px] tracking-[0.4em] uppercase font-mono text-[hsl(var(--ink)/0.55)] mb-4">
                Builder · Operator · Designer
              </p>
              <h2 className="font-serif-display text-4xl md:text-6xl text-[hsl(var(--ink))] leading-[0.95] mb-5">
                Gautham <span className="card-foil-text">Biju</span>
              </h2>

              <div className="flex items-center gap-3 mb-5">
                <span className="block h-px w-14 card-foil-bg" />
                <span className="text-[11px] tracking-[0.25em] uppercase font-mono text-[hsl(var(--ink)/0.7)]">
                  Product · Strategy · Systems
                </span>
              </div>

              <p className="font-handwritten text-2xl text-[hsl(var(--ink)/0.7)] italic mb-8 max-w-md">
                "Build with intent. Ship what matters."
              </p>

              {/* Contact chips */}
              <div className="flex flex-wrap gap-2">
                <ContactChip icon={<MapPin className="w-3 h-3" />} label="India" />
                <ContactChip icon={<Mail className="w-3 h-3" />} label="hello@gauthambiju.com" />
                <ContactChip icon={<ArrowUpRight className="w-3 h-3" />} label="linkedin / gauthambiju" />
              </div>
            </div>

            {/* Flip affordance */}
            <button
              onClick={(e) => { e.stopPropagation(); setFlipped(true); }}
              className="absolute bottom-5 right-6 flex items-center gap-1.5 text-[10px] tracking-[0.25em] uppercase font-mono text-[hsl(var(--ink)/0.5)] hover:text-[hsl(var(--ink))] transition-colors"
              aria-label="Flip card"
            >
              Flip <RotateCw className="w-3 h-3" />
            </button>
          </div>

          {/* BACK */}
          <div
            className="business-card business-card-face business-card-back"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
            onClick={() => setFlipped(false)}
          >
            <div className="h-full flex flex-col px-8 md:px-12 py-10 overflow-hidden">
              <div className="flex items-center justify-between mb-5">
                <span className="text-[10px] tracking-[0.3em] uppercase font-mono text-[hsl(var(--ink)/0.55)]">
                  How I Work
                </span>
                <div className="card-foil text-[10px] tracking-[0.25em] uppercase font-mono px-2 py-0.5 rounded-sm border border-[hsl(var(--gold)/0.5)]">
                  Reverse
                </div>
              </div>

              <p className="font-body text-[13px] leading-relaxed text-[hsl(var(--ink)/0.8)] mb-2">
                I'm a product-minded builder at the intersection of technology, business, and design.
                I want to understand <em className="not-italic border-b border-[hsl(var(--gold)/0.5)]">why</em> something
                should exist before figuring out <em className="not-italic border-b border-[hsl(var(--gold)/0.5)]">how</em>.
              </p>
              <p className="font-body text-[13px] leading-relaxed text-[hsl(var(--ink)/0.65)] mb-5">
                I gravitate toward ambiguity — that's where the most meaningful work lives.
              </p>

              {/* Traits */}
              <div className="space-y-1.5 mb-5">
                {strengths.map((s, i) => (
                  <div key={s.title} className="flex items-start gap-3 group">
                    <span className="text-[10px] font-mono card-foil-text mt-1">0{i + 1}</span>
                    <div>
                      <h4 className="font-display text-[13px] font-semibold text-[hsl(var(--ink))]">{s.title}</h4>
                      <p className="text-[11px] text-[hsl(var(--ink)/0.55)] leading-snug">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Focus pills + facts */}
              <div className="mt-auto grid md:grid-cols-2 gap-5">
                <div>
                  <p className="text-[9px] tracking-[0.3em] uppercase font-mono text-[hsl(var(--ink)/0.5)] mb-2">Focus</p>
                  <div className="flex flex-wrap gap-1.5">
                    {focusAreas.map((a) => (
                      <span key={a} className="px-2 py-0.5 text-[10px] font-mono tracking-wide text-[hsl(var(--ink)/0.75)] border border-[hsl(var(--ink)/0.2)] rounded-sm">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[9px] tracking-[0.3em] uppercase font-mono text-[hsl(var(--ink)/0.5)] mb-2">Facts</p>
                  <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-[hsl(var(--ink)/0.7)]">
                    <div><span className="text-[hsl(var(--ink)/0.45)]">Based</span> India</div>
                    <div><span className="text-[hsl(var(--ink)/0.45)]">Edu</span> IIM Indore</div>
                    <div><span className="text-[hsl(var(--ink)/0.45)]">Field</span> Product</div>
                    <div><span className="text-[hsl(var(--ink)/0.45)]">Now</span> Building</div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); setFlipped(false); }}
              className="absolute bottom-5 right-6 flex items-center gap-1.5 text-[10px] tracking-[0.25em] uppercase font-mono text-[hsl(var(--ink)/0.5)] hover:text-[hsl(var(--ink))] transition-colors"
              aria-label="Flip back"
            >
              <RotateCcw className="w-3 h-3" /> Flip back
            </button>
          </div>
        </motion.div>

        {/* Desk shadow under the card */}
        <div className="business-card-shadow" />
      </div>

      <p className="text-center mt-10 text-[10px] tracking-[0.3em] uppercase font-mono text-[hsl(var(--gold)/0.55)]">
        Tap card to flip
      </p>
    </section>
  );
};

const ContactChip = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <span className="group inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono text-[hsl(var(--ink)/0.75)] border border-[hsl(var(--ink)/0.18)] rounded-sm bg-[hsl(36_30%_92%)] hover:-translate-y-0.5 hover:border-[hsl(var(--gold)/0.6)] transition-all duration-200">
    <span className="text-[hsl(var(--gold))]">{icon}</span>
    <span className="relative">
      {label}
      <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-[hsl(var(--gold))] group-hover:w-full transition-all duration-300" />
    </span>
  </span>
);

export default AboutSection;
