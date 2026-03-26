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
        <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-mono">page 02</span>
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-mono">About</span>
      </div>

      <div className="grid md:grid-cols-2 gap-12 md:gap-16">
        {/* Left page — Narrative */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif-display text-3xl md:text-4xl text-card-foreground mb-8 leading-tight">
            Notes on How I Work
          </h2>

          <div className="space-y-4 font-body text-base leading-relaxed text-card-foreground/70">
            <p>
              I'm a product-minded builder who operates at the intersection of technology, business, and design.
              I don't just want to ship features — I want to understand <em className="text-card-foreground/90 not-italic border-b border-primary/30">why</em> something
              should exist before figuring out <em className="text-card-foreground/90 not-italic border-b border-primary/30">how</em> to build it.
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

          {/* Philosophy quote */}
          <div className="mt-10 pl-4 border-l-2 border-primary/20">
            <p className="font-handwritten text-xl text-card-foreground/50 italic">
              "Build with intent. Document deeply. Ship what matters."
            </p>
          </div>
        </motion.div>

        {/* Right page — Structured breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="space-y-10"
        >
          {/* Strengths */}
          <div>
            <div className="inline-block px-3 py-1 border border-border rounded-sm mb-5">
              <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground">Traits</span>
            </div>
            <div className="space-y-3">
              {strengths.map((s, i) => (
                <motion.div
                  key={s.title}
                  className="group p-4 rounded-lg border border-transparent hover:border-border hover:bg-card/50 transition-all duration-300 cursor-default"
                  onHoverStart={() => setHoveredStrength(i)}
                  onHoverEnd={() => setHoveredStrength(null)}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-mono text-primary/60 mt-0.5">0{i + 1}</span>
                    <div>
                      <h4 className="font-display text-sm font-semibold text-card-foreground">{s.title}</h4>
                      <motion.p
                        initial={false}
                        animate={{ height: hoveredStrength === i ? "auto" : 0, opacity: hoveredStrength === i ? 1 : 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden text-xs text-muted-foreground font-body mt-1 leading-relaxed"
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
            <div className="inline-block px-3 py-1 border border-border rounded-sm mb-5">
              <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground">Focus</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {focusAreas.map((area) => (
                <span
                  key={area}
                  className="px-3 py-1.5 text-xs font-mono tracking-wide bg-primary/5 text-primary border border-primary/10 rounded-sm"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* Quick facts */}
          <div>
            <div className="inline-block px-3 py-1 border border-border rounded-sm mb-5">
              <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground">Quick Facts</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono text-muted-foreground">
              <div><span className="text-card-foreground/50">Based in</span> India</div>
              <div><span className="text-card-foreground/50">Education</span> IIM Indore</div>
              <div><span className="text-card-foreground/50">Focus</span> Product · Strategy</div>
              <div><span className="text-card-foreground/50">Currently</span> Building</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
