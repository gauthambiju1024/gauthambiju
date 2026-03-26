import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type CardType = "sticky" | "framework" | "diagram";

interface ThinkingCard {
  id: string;
  title: string;
  category: string;
  type: CardType;
  summary: string;
  detail: string;
  color: string;
  rotation: number;
  connections?: string[];
}

const cards: ThinkingCard[] = [
  {
    id: "teardown", title: "Product Teardowns", category: "Analysis",
    type: "sticky", summary: "Dissecting products to understand what works, what doesn't, and why.",
    detail: "Systematic breakdown of product decisions — from onboarding flows to monetization models. Every product tells a story through its design choices.",
    color: "hsl(48 80% 88%)", rotation: -1.5, connections: ["ux-critique"]
  },
  {
    id: "comparison", title: "Comparative Analysis", category: "Strategy",
    type: "framework", summary: "Side-by-side evaluation of competing solutions and positioning strategies.",
    detail: "Structured frameworks for comparing market positioning, feature sets, pricing models, and user experience across competing products.",
    color: "hsl(0 0% 98%)", rotation: 0.5, connections: ["strategy"]
  },
  {
    id: "journey", title: "User Journey Mapping", category: "UX",
    type: "diagram", summary: "Mapping the full lifecycle of user interaction with products.",
    detail: "End-to-end journey maps that capture touchpoints, emotions, pain points, and opportunities. From awareness to advocacy.",
    color: "hsl(210 20% 95%)", rotation: -0.8, connections: ["ux-critique", "teardown"]
  },
  {
    id: "ux-critique", title: "UX Critiques", category: "Design",
    type: "sticky", summary: "Constructive analysis of interface decisions and interaction patterns.",
    detail: "Evaluating usability heuristics, accessibility, information hierarchy, and interaction patterns in real products.",
    color: "hsl(48 70% 90%)", rotation: 1.2
  },
  {
    id: "strategy", title: "Strategy Notes", category: "Business",
    type: "framework", summary: "Business model analysis, market sizing, and GTM thinking.",
    detail: "Frameworks for evaluating market opportunities, competitive moats, revenue models, and go-to-market strategies.",
    color: "hsl(0 0% 97%)", rotation: -0.3, connections: ["comparison"]
  },
  {
    id: "case-study", title: "Case Studies", category: "Deep Dive",
    type: "diagram", summary: "In-depth product case studies with problem → process → outcome structure.",
    detail: "Detailed walkthroughs of real projects showing structured problem-solving: from defining the problem space to shipping solutions and measuring impact.",
    color: "hsl(200 15% 94%)", rotation: 0.8
  },
];

const cardStyles: Record<CardType, string> = {
  sticky: "shadow-md border-0",
  framework: "shadow-sm border border-border",
  diagram: "shadow-sm border border-primary/10",
};

const ThinkingWall = () => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  return (
    <section className="py-16 md:py-24">
      <div className="px-6 md:px-16 flex items-center gap-3 mb-12">
        <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-mono">page 04</span>
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-mono">Thinking</span>
      </div>

      <div className="px-6 md:px-16 mb-10">
        <h2 className="font-serif-display text-3xl md:text-4xl text-card-foreground leading-tight">
          The Strategy Wall
        </h2>
        <p className="mt-3 font-body text-sm text-muted-foreground">
          How I structure ambiguity, break down products, and think through problems.
        </p>
      </div>

      {/* Wall */}
      <div className="whiteboard-bg rounded-lg mx-4 md:mx-12 p-6 md:p-10 relative min-h-[400px]">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(hsl(var(--card-foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--card-foreground)) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              className={`relative rounded-md p-5 cursor-pointer ${cardStyles[card.type]}`}
              style={{
                backgroundColor: card.color,
                rotate: `${card.rotation}deg`,
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              whileHover={{
                y: -4,
                rotate: 0,
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                transition: { duration: 0.2 },
              }}
              onClick={() => setExpandedCard(expandedCard === card.id ? null : card.id)}
            >
              {/* Pin */}
              {card.type === "sticky" && (
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-card-foreground/20 shadow-sm" />
              )}

              <div className="flex items-start justify-between mb-2">
                <span className="text-[9px] tracking-[0.2em] uppercase font-mono text-card-foreground/40">
                  {card.category}
                </span>
                {card.type === "framework" && (
                  <div className="flex gap-0.5">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="w-1.5 h-1.5 rounded-full bg-card-foreground/10" />
                    ))}
                  </div>
                )}
              </div>

              <h4 className="font-display text-sm font-semibold text-card-foreground/90 mb-2">{card.title}</h4>
              <p className="text-xs text-card-foreground/50 font-body leading-relaxed">{card.summary}</p>

              <AnimatePresence>
                {expandedCard === card.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 pt-3 border-t border-card-foreground/10">
                      <p className="text-xs text-card-foreground/60 font-body leading-relaxed">{card.detail}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThinkingWall;
