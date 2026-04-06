import { useState } from "react";
import { motion } from "framer-motion";

const strengths = [
  { title: "Systems Thinking", desc: "I see connections between moving parts — business, product, user, tech — and design for the whole system, not just one surface." },
  { title: "Fast Learning", desc: "I ramp up quickly on new domains, tools, and frameworks. From AI workflows to healthcare ops — I learn by building." },
  { title: "Structured Problem Solving", desc: "I break ambiguity into frameworks, prioritize ruthlessly, and move from insight to action with clarity." },
];

const focusAreas = [
  "Product Thinking",
  "AI-Enabled Workflows",
  "Business × UX Intersection",
];

const AboutSection = () => {
  const [hoveredStrength, setHoveredStrength] = useState<number | null>(null);

  return (
    <section className="px-6 md:px-16 py-16 md:py-24">
      {/* Section label */}
      <div className="flex items-center gap-3 mb-12">
        <div className="h-px flex-1" style={{ background: 'hsl(var(--ruler-accent) / 0.15)' }} />
        <span className="dimension-label">About</span>
      </div>

      <div className="grid md:grid-cols-2 gap-12 md:gap-16">
        {/* Left — Narrative */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif-display text-3xl md:text-4xl mb-8 leading-tight"
            style={{ color: 'hsl(var(--paper))' }}>
            Notes on How I Work
          </h2>

          <div className="space-y-4 font-body text-base leading-relaxed" style={{ color: 'hsl(var(--paper) / 0.55)' }}>
            <p>
              I'm a product-minded builder who operates at the intersection of technology, business, and design.
              I don't just want to ship features — I want to understand <em className="not-italic border-b" style={{ color: 'hsl(var(--paper) / 0.8)', borderColor: 'hsl(var(--ruler-accent) / 0.3)' }}>why</em> something
              should exist before figuring out <em className="not-italic border-b" style={{ color: 'hsl(var(--paper) / 0.8)', borderColor: 'hsl(var(--ruler-accent) / 0.3)' }}>how</em> to build it.
            </p>
            <p>
              My approach is rooted in structured thinking — breaking complex problems into clear frameworks,
              validating assumptions early, and iterating with intent. I gravitate toward ambiguity because
              that's where the most meaningful work lives.
            </p>
            <p>
              I believe the best products emerge when you combine deep user empathy with systems-level thinking
              and business acumen. That's the space I'm building my career in.
            </p>
          </div>

          {/* Philosophy quote — paper note pinned to mat */}
          <div className="mt-10 p-4 paper-card relative">
            <div className="absolute -top-1.5 left-6 w-3 h-3 rounded-full" style={{ background: 'hsl(var(--ruler-accent) / 0.6)', boxShadow: '0 1px 3px hsl(0 0% 0% / 0.3)' }} />
            <p className="font-handwritten text-xl" style={{ color: 'hsl(var(--card-foreground) / 0.6)' }}>
              "Build with intent. Document deeply. Ship what matters."
            </p>
          </div>
        </motion.div>

        {/* Right — Structured breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="space-y-10"
        >
          {/* Strengths */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-4 rounded-full" style={{ background: 'hsl(var(--ruler-accent) / 0.4)' }} />
              <span className="dimension-label">Traits</span>
            </div>
            <div className="space-y-3">
              {strengths.map((s, i) => (
                <motion.div
                  key={s.title}
                  className="group p-4 rounded-sm border border-transparent transition-all duration-300 cursor-default"
                  style={{ background: 'transparent' }}
                  onHoverStart={() => setHoveredStrength(i)}
                  onHoverEnd={() => setHoveredStrength(null)}
                  whileHover={{ background: 'hsl(var(--mat-grid) / 0.2)' }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-mono mt-0.5" style={{ color: 'hsl(var(--ruler-accent) / 0.6)' }}>[0{i + 1}]</span>
                    <div>
                      <h4 className="font-display text-sm font-semibold" style={{ color: 'hsl(var(--paper) / 0.85)' }}>{s.title}</h4>
                      <motion.p
                        initial={false}
                        animate={{ height: hoveredStrength === i ? "auto" : 0, opacity: hoveredStrength === i ? 1 : 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden text-xs font-body mt-1 leading-relaxed"
                        style={{ color: 'hsl(var(--paper) / 0.4)' }}
                      >
                        {s.desc}
                      </motion.p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Focus areas */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-4 rounded-full" style={{ background: 'hsl(var(--ruler-accent) / 0.4)' }} />
              <span className="dimension-label">Focus</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {focusAreas.map((area) => (
                <span
                  key={area}
                  className="px-3 py-1.5 text-xs font-mono tracking-wide rounded-sm border"
                  style={{
                    background: 'hsl(var(--ruler-accent) / 0.08)',
                    color: 'hsl(var(--ruler-accent))',
                    borderColor: 'hsl(var(--ruler-accent) / 0.2)',
                  }}
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* Quick facts */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-4 rounded-full" style={{ background: 'hsl(var(--ruler-accent) / 0.4)' }} />
              <span className="dimension-label">Quick Facts</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono" style={{ color: 'hsl(var(--paper) / 0.4)' }}>
              <div><span style={{ color: 'hsl(var(--paper) / 0.6)' }}>Based in</span> India</div>
              <div><span style={{ color: 'hsl(var(--paper) / 0.6)' }}>Education</span> IIM Indore</div>
              <div><span style={{ color: 'hsl(var(--paper) / 0.6)' }}>Focus</span> Product · Strategy</div>
              <div><span style={{ color: 'hsl(var(--paper) / 0.6)' }}>Currently</span> Building</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
