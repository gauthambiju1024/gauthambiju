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
        <div className="h-px flex-1" style={{ background: 'hsl(var(--ruler-accent) / 0.15)' }} />
        <span className="dimension-label">Thinking</span>
      </div>

      <div className="px-6 md:px-16 mb-10">
        <h2 className="font-serif-display text-3xl md:text-4xl leading-tight" style={{ color: 'hsl(var(--paper))' }}>
          The Strategy Wall
        </h2>
        <p className="mt-3 font-body text-sm" style={{ color: 'hsl(var(--paper) / 0.4)' }}>
          How I structure ambiguity, break down products, and think through problems. Click a card to read more.
        </p>
      </div>

      {/* Paper cards on mat */}
      <div className="rounded-sm mx-4 md:mx-12 relative">
        <ScrollArea className="h-[520px] w-full relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 md:p-10">
            {cards.map((card, i) => (
              <Link
                key={card.id}
                to={`/case-studies/${card.slug}`}
                className="block"
              >
                <motion.div
                  className="relative rounded-sm p-5 select-none paper-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  whileHover={{
                    y: -4,
                    boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
                    transition: { duration: 0.2 },
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-[9px] tracking-[0.15em] uppercase font-mono" style={{ color: 'hsl(var(--ruler-accent) / 0.7)' }}>
                      {card.category}
                    </span>
                  </div>

                  <h4 className="font-display text-sm font-semibold mb-2" style={{ color: 'hsl(var(--card-foreground) / 0.85)' }}>{card.title}</h4>
                  <p className="text-xs font-body leading-relaxed line-clamp-3" style={{ color: 'hsl(var(--card-foreground) / 0.45)' }}>{card.summary}</p>

                  <div className="mt-3 flex items-center gap-1 text-[10px] font-mono" style={{ color: 'hsl(var(--ruler-accent) / 0.5)' }}>
                    Read more <ArrowRight className="w-3 h-3" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
          <ScrollBar orientation="vertical" className="w-2 bg-transparent [&>div]:bg-ruler-accent/15 [&>div]:rounded-full hover:[&>div]:bg-ruler-accent/25" />
        </ScrollArea>
      </div>
    </section>
  );
};

export default ThinkingWall;
