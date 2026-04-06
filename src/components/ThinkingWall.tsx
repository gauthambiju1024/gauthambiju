import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCaseStudies } from "@/hooks/useSiteData";
import { ArrowRight } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type CardType = "sticky" | "framework" | "diagram";

interface FallbackCard {
  id: string;
  title: string;
  category: string;
  card_type: CardType;
  summary: string;
  color: string;
  slug: string;
}

const fallbackCards: FallbackCard[] = [
  { id: "1", title: "Product Teardowns", category: "Analysis", card_type: "sticky", summary: "Dissecting products to understand what works, what doesn't, and why.", color: "hsl(48 80% 88%)", slug: "product-teardowns" },
  { id: "2", title: "Comparative Analysis", category: "Strategy", card_type: "framework", summary: "Side-by-side evaluation of competing solutions and positioning strategies.", color: "hsl(0 0% 98%)", slug: "comparative-analysis" },
  { id: "3", title: "User Journey Mapping", category: "UX", card_type: "diagram", summary: "Mapping the full lifecycle of user interaction with products.", color: "hsl(210 20% 95%)", slug: "user-journey-mapping" },
  { id: "4", title: "UX Critiques", category: "Design", card_type: "sticky", summary: "Constructive analysis of interface decisions and interaction patterns.", color: "hsl(48 70% 90%)", slug: "ux-critiques" },
  { id: "5", title: "Strategy Notes", category: "Business", card_type: "framework", summary: "Business model analysis, market sizing, and GTM thinking.", color: "hsl(0 0% 97%)", slug: "strategy-notes" },
  { id: "6", title: "Case Studies", category: "Deep Dive", card_type: "diagram", summary: "In-depth product case studies with problem → process → outcome structure.", color: "hsl(200 15% 94%)", slug: "case-studies" },
];

const rotations = [-1.5, 0.5, -0.8, 1.2, -0.3, 0.8, -1, 0.6, -0.5, 1.5];

const ThinkingWall = () => {
  const { studies, loading } = useCaseStudies();

  const cards = studies.length > 0
    ? studies.map(s => ({
        id: s.id,
        title: s.title,
        category: s.category,
        card_type: (s.card_type || "sticky") as CardType,
        summary: s.summary || "",
        color: s.color || "hsl(48 80% 88%)",
        slug: s.slug,
      }))
    : fallbackCards;

  return (
    <section className="py-16 md:py-24">
      <div className="px-6 md:px-16 flex items-center gap-3 mb-12">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-mono">Thinking</span>
      </div>

      <div className="px-6 md:px-16 mb-10">
        <h2 className="font-serif-display text-3xl md:text-4xl text-card-foreground leading-tight">
          The Strategy Wall
        </h2>
        <p className="mt-3 font-body text-sm text-muted-foreground">
          How I structure ambiguity, break down products, and think through problems. Click a card to read more.
        </p>
      </div>

      {/* Corkboard / pinboard */}
      <div className="whiteboard-bg rounded-lg mx-4 md:mx-12 relative">
        {/* Grid pattern */}
        <div className="absolute inset-0 rounded-lg opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(hsl(var(--card-foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--card-foreground)) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Vertical scrollable area */}
        <ScrollArea className="h-[520px] w-full relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-6 md:p-10">
            {cards.map((card, i) => {
              const rotation = rotations[i % rotations.length];
              const isSticky = card.card_type === "sticky";
              const isFramework = card.card_type === "framework";

              return (
                <Link
                  key={card.id}
                  to={`/case-studies/${card.slug}`}
                  className="block"
                >
                  <motion.div
                    className={`relative rounded-md p-5 select-none ${
                      isSticky ? "shadow-md border-0" : isFramework ? "shadow-sm border border-border" : "shadow-sm border border-primary/10"
                    }`}
                    style={{ backgroundColor: card.color, rotate: `${rotation}deg` }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                    whileHover={{
                      y: -6,
                      rotate: 0,
                      boxShadow: "0 12px 32px rgba(0,0,0,0.14)",
                      transition: { duration: 0.2 },
                    }}
                  >
                    {/* Pushpin decoration */}
                    {isSticky && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 pushpin z-10" />
                    )}

                    {/* Tape decoration */}
                    {card.card_type === "diagram" && (
                      <div className="absolute -top-2 left-6 right-6 h-5 tape-realistic rounded-sm" style={{ transform: "rotate(-0.5deg)" }} />
                    )}

                    <div className="flex items-start justify-between mb-2">
                      <span className="text-[9px] tracking-[0.2em] uppercase font-mono text-card-foreground/40">
                        {card.category}
                      </span>
                      {isFramework && (
                        <div className="flex gap-0.5">
                          {[...Array(3)].map((_, j) => (
                            <div key={j} className="w-1.5 h-1.5 rounded-full bg-card-foreground/10" />
                          ))}
                        </div>
                      )}
                    </div>

                    <h4 className="font-display text-sm font-semibold text-card-foreground/90 mb-2">{card.title}</h4>
                    <p className="text-xs text-card-foreground/50 font-body leading-relaxed line-clamp-3">{card.summary}</p>

                    <div className="mt-3 flex items-center gap-1 text-[10px] font-mono text-card-foreground/30">
                      Read more <ArrowRight className="w-3 h-3" />
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
          <ScrollBar orientation="vertical" className="w-2 bg-transparent [&>div]:bg-card-foreground/15 [&>div]:rounded-full hover:[&>div]:bg-card-foreground/25" />
        </ScrollArea>
      </div>
    </section>
  );
};

export default ThinkingWall;
