import { motion } from "framer-motion";
import { ArrowUpRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useBlogPosts } from "@/hooks/useSiteData";

interface ArticleCard {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  slug: string;
}

const fallbackArticles: ArticleCard[] = [
  {
    id: "1", title: "Why Every PM Should Think in Systems", excerpt: "Product management isn't about features — it's about understanding the interconnected system you're building within.",
    category: "Product Thinking", readTime: "5 min", date: "2025", slug: "#"
  },
  {
    id: "2", title: "Designing for Behavior, Not Just Usability", excerpt: "Good UX makes things easy. Great UX makes the right things easy.",
    category: "UX Notes", readTime: "4 min", date: "2025", slug: "#"
  },
  {
    id: "3", title: "Building with AI: Lessons from the Trenches", excerpt: "What actually changes when you integrate AI into a product workflow.",
    category: "Experiments", readTime: "6 min", date: "2025", slug: "#"
  },
  {
    id: "4", title: "The Art of Structured Problem Solving", excerpt: "How frameworks help you move from ambiguity to clarity, one step at a time.",
    category: "Strategy", readTime: "4 min", date: "2025", slug: "#"
  },
];

const WritingDesk = () => {
  const { posts } = useBlogPosts();

  const articles: ArticleCard[] = posts.length > 0
    ? posts.slice(0, 4).map((p) => ({
        id: p.id,
        title: p.title,
        excerpt: p.excerpt ?? "",
        category: p.tags?.[0] ?? "Insight",
        readTime: `${Math.max(2, Math.ceil((p.content?.length ?? 0) / 1000))} min`,
        date: p.published_at ? new Date(p.published_at).getFullYear().toString() : "",
        slug: p.slug,
      }))
    : fallbackArticles;

  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <section className="py-3 md:py-4 h-full flex flex-col">
      <div className="px-5 md:px-10 flex items-center gap-3 mb-2">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-mono">Writing</span>
      </div>

      <div className="px-5 md:px-10 mb-2">
        <h2 className="font-serif-display text-xl md:text-2xl text-card-foreground leading-tight">
          The Editorial Desk
        </h2>
        <p className="mt-0.5 font-body text-[11px] text-muted-foreground">
          Thinking through writing. Insights, reflections, and structured notes.
        </p>
      </div>

      <div className="px-5 md:px-10 flex-1 flex flex-col min-h-0">
        {/* Featured article */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-2"
          >
            <Link
              to={featured.slug !== "#" ? `/blog/${featured.slug}` : "/blog"}
              className="group block rounded-md border border-border bg-card/50 p-3 hover:bg-card/80 transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-1.5 py-0.5 text-[9px] tracking-[0.2em] uppercase font-mono bg-primary/5 text-primary border border-primary/10 rounded-sm">
                  {featured.category}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {featured.readTime}
                </span>
              </div>
              <h3 className="font-serif-display text-base md:text-lg text-card-foreground group-hover:text-primary transition-colors leading-snug mb-1">
                {featured.title}
              </h3>
              <p className="font-body text-[11px] text-muted-foreground leading-snug max-w-2xl line-clamp-2">
                {featured.excerpt}
              </p>
            </Link>
          </motion.div>
        )}

        {/* Article grid */}
        <div className="grid md:grid-cols-3 gap-2 flex-1 min-h-0">
          {rest.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              className="min-h-0"
            >
              <Link
                to={article.slug !== "#" ? `/blog/${article.slug}` : "/blog"}
                className="group block rounded-md border border-border bg-card/30 p-2.5 hover:bg-card/60 transition-all duration-300 h-full"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[9px] tracking-[0.15em] uppercase font-mono text-muted-foreground">
                    {article.category}
                  </span>
                  <span className="text-muted-foreground/30">·</span>
                  <span className="text-[9px] font-mono text-muted-foreground">{article.readTime}</span>
                </div>
                <h4 className="font-display text-xs font-semibold text-card-foreground group-hover:text-primary transition-colors leading-snug mb-1">
                  {article.title}
                </h4>
                <p className="text-[10px] text-muted-foreground/70 font-body leading-snug line-clamp-2">
                  {article.excerpt}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View all */}
        <div className="mt-2 text-center">
          <Link to="/blog" className="inline-flex items-center gap-1.5 text-[11px] font-mono text-primary hover:underline">
            View all writing <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WritingDesk;
