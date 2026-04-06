import { useState } from "react";
import { motion } from "framer-motion";
import Globe from "./Globe";

interface Milestone {
  id: string;
  title: string;
  period: string;
  subtitle: string;
  takeaway: string;
  isCurrent?: boolean;
}

const milestones: Milestone[] = [
  {
    id: "school", title: "Early Foundation", period: "2006–2018",
    subtitle: "Schooling & formative years",
    takeaway: "Built curiosity, discipline, and a habit of questioning why things work the way they do."
  },
  {
    id: "iitgn", title: "IIT Gandhinagar", period: "2018–2022",
    subtitle: "B.Tech — Engineering fundamentals",
    takeaway: "Learned to think in systems, build with rigor, and approach problems analytically."
  },
  {
    id: "accenture", title: "Accenture", period: "2022–2023",
    subtitle: "Strategy & Technology Consulting",
    takeaway: "Exposure to enterprise-scale problem solving, stakeholder management, and structured delivery."
  },
  {
    id: "iimi", title: "IIM Indore", period: "2023–2025",
    subtitle: "MBA — Product, Strategy & Business",
    takeaway: "Sharpened product thinking, business acumen, and the intersection of strategy with execution."
  },
  {
    id: "now", title: "Now Building", period: "2025–",
    subtitle: "Product · AI · Portfolio",
    takeaway: "Building real products, exploring AI workflows, and documenting the journey.",
    isCurrent: true
  },
];

const JourneyTimeline = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section className="py-16 md:py-24 relative overflow-hidden" style={{ background: 'hsl(var(--cutting-mat))' }}>
      {/* Globe background - desktop only */}
      <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.06] pointer-events-none">
        <Globe className="w-[500px] h-[500px]" />
      </div>

      <div className="px-6 md:px-16 flex items-center gap-3 mb-12 relative z-10">
        <div className="h-px flex-1" style={{ background: 'hsl(var(--ruler-accent) / 0.15)' }} />
        <span className="dimension-label">Journey</span>
      </div>

      <div className="px-6 md:px-16 mb-14 relative z-10">
        <h2 className="font-serif-display text-3xl md:text-4xl leading-tight" style={{ color: 'hsl(var(--paper))' }}>
          The Path So Far
        </h2>
        <p className="mt-3 font-body text-sm" style={{ color: 'hsl(var(--paper) / 0.4)' }}>
          A curated progression, not a résumé list.
        </p>
      </div>

      {/* Timeline */}
      <div className="px-6 md:px-16 relative z-10">
        <div className="relative max-w-2xl mx-auto">
          {/* Vertical line — drawn path */}
          <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px" style={{ background: 'hsl(var(--ruler-accent) / 0.25)' }} />

          {milestones.map((m, i) => (
            <motion.div
              key={m.id}
              className="relative pl-12 md:pl-16 pb-12 last:pb-0"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              {/* Node — pushpin / measurement point */}
              <div className="absolute left-4 md:left-6 top-1 -translate-x-1/2">
                {m.isCurrent ? (
                  <div className="relative">
                    <div className="w-3.5 h-3.5 rounded-full shadow-[0_0_8px_hsl(var(--ruler-accent)/0.4)]" style={{ background: 'hsl(var(--ruler-accent))' }} />
                    <div className="absolute inset-0 w-3.5 h-3.5 rounded-full animate-ping" style={{ background: 'hsl(var(--ruler-accent) / 0.2)' }} />
                  </div>
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full border-[1.5px] transition-colors"
                    style={{ background: 'hsl(var(--cutting-mat))', borderColor: 'hsl(var(--ruler-accent) / 0.4)' }} />
                )}
              </div>

              {/* Content card — paper note */}
              <motion.div
                className={`rounded-sm p-4 md:p-5 border transition-all duration-300 cursor-pointer ${
                  m.isCurrent ? "" : ""
                }`}
                style={{
                  background: m.isCurrent ? 'hsl(var(--ruler-accent) / 0.06)' : 'hsl(var(--mat-grid) / 0.15)',
                  borderColor: m.isCurrent ? 'hsl(var(--ruler-accent) / 0.2)' : 'hsl(var(--mat-grid) / 0.3)',
                }}
                onClick={() => setExpandedId(expandedId === m.id ? null : m.id)}
                whileHover={{ x: 4 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-display text-sm font-semibold" style={{ color: 'hsl(var(--paper) / 0.85)' }}>{m.title}</h4>
                    <p className="text-xs font-body mt-0.5" style={{ color: 'hsl(var(--paper) / 0.4)' }}>{m.subtitle}</p>
                  </div>
                  <span className="text-[10px] font-mono whitespace-nowrap" style={{ color: 'hsl(var(--ruler-accent) / 0.5)' }}>{m.period}</span>
                </div>

                <motion.div
                  initial={false}
                  animate={{
                    height: expandedId === m.id ? "auto" : 0,
                    opacity: expandedId === m.id ? 1 : 0,
                  }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <p className="mt-3 pt-3 text-xs font-body leading-relaxed"
                    style={{ borderTop: '1px solid hsl(var(--ruler-accent) / 0.1)', color: 'hsl(var(--paper) / 0.5)' }}>
                    {m.takeaway}
                  </p>
                </motion.div>

                {m.isCurrent && (
                  <div className="mt-3 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'hsl(var(--ruler-accent))' }} />
                    <span className="text-[9px] tracking-[0.2em] uppercase font-mono" style={{ color: 'hsl(var(--ruler-accent))' }}>Currently Exploring</span>
                  </div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JourneyTimeline;
