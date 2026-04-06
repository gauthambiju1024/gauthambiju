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
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Globe background - desktop only */}
      <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.07] pointer-events-none">
        <Globe className="w-[500px] h-[500px]" />
      </div>

      <div className="px-6 md:px-16 flex items-center gap-3 mb-12 relative z-10">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-mono">Journey</span>
      </div>

      <div className="px-6 md:px-16 mb-14 relative z-10">
        <h2 className="font-serif-display text-3xl md:text-4xl text-card-foreground leading-tight">
          The Path So Far
        </h2>
        <p className="mt-3 font-body text-sm text-muted-foreground">
          A curated progression, not a résumé list.
        </p>
      </div>

      {/* Timeline */}
      <div className="px-6 md:px-16 relative z-10">
        <div className="relative max-w-2xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-border" />

          {milestones.map((m, i) => (
            <motion.div
              key={m.id}
              className="relative pl-12 md:pl-16 pb-12 last:pb-0"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              {/* Station node */}
              <div className="absolute left-4 md:left-6 top-1 -translate-x-1/2">
                {m.isCurrent ? (
                  <div className="relative">
                    <div className="w-4 h-4 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.4)]" />
                    <div className="absolute inset-0 w-4 h-4 rounded-full bg-primary/30 animate-ping" />
                  </div>
                ) : (
                  <div className="w-3 h-3 rounded-full bg-card border-2 border-border hover:border-primary/50 transition-colors" />
                )}
              </div>

              {/* Content card */}
              <motion.div
                className={`rounded-lg p-4 md:p-5 border transition-all duration-300 cursor-pointer ${
                  m.isCurrent
                    ? "bg-primary/5 border-primary/20"
                    : "bg-card/50 border-border hover:border-border hover:bg-card/80"
                }`}
                onClick={() => setExpandedId(expandedId === m.id ? null : m.id)}
                whileHover={{ x: 4 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-display text-sm font-semibold text-card-foreground">{m.title}</h4>
                    <p className="text-xs text-muted-foreground font-body mt-0.5">{m.subtitle}</p>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap">{m.period}</span>
                </div>

                {/* Expanded takeaway */}
                <motion.div
                  initial={false}
                  animate={{
                    height: expandedId === m.id ? "auto" : 0,
                    opacity: expandedId === m.id ? 1 : 0,
                  }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <p className="mt-3 pt-3 border-t border-border text-xs text-card-foreground/60 font-body leading-relaxed">
                    {m.takeaway}
                  </p>
                </motion.div>

                {m.isCurrent && (
                  <div className="mt-3 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[9px] tracking-[0.2em] uppercase font-mono text-primary">Currently Exploring</span>
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
