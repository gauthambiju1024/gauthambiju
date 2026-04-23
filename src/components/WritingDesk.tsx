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
    <section className="py-16 md:py-24">
      <div className="px-6 md:px-16 flex items-center gap-3 mb-12">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-mono">Writing</span>
      </div>

      <div className="px-6 md:px-16 mb-10">
        <h2 className="font-serif-display text-3xl md:text-4xl text-card-foreground leading-tight">
          The Editorial Desk
        </h2>
        <p className="mt-3 font-body text-sm text-muted-foreground">
          Thinking through writing. Insights, reflections, and structured notes.
        </p>
      </div>

      <div className="px-6 md:px-16">
        {/* Featured article */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <Link
              to={featured.slug !== "#" ? `/blog/${featured.slug}` : "/blog"}
              className="group block rounded-lg border border-border bg-card/50 p-4 md:p-5 hover:bg-card/80 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-0.5 text-[9px] tracking-[0.2em] uppercase font-mono bg-primary/5 text-primary border border-primary/10 rounded-sm">
                  {featured.category}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {featured.readTime}
                </span>
              </div>
              <h3 className="font-serif-display text-xl md:text-2xl text-card-foreground group-hover:text-primary transition-colors leading-tight mb-3">
                {featured.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-2xl">
                {featured.excerpt}
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs font-mono text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Read article <ArrowUpRight className="w-3 h-3" />
              </div>
            </Link>
          </motion.div>
        )}

        {/* Article grid */}
        <div className="grid md:grid-cols-3 gap-4">
          {rest.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <Link
                to={article.slug !== "#" ? `/blog/${article.slug}` : "/blog"}
                className="group block rounded-lg border border-border bg-card/30 p-5 hover:bg-card/60 hover:border-border transition-all duration-300 h-full"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[9px] tracking-[0.15em] uppercase font-mono text-muted-foreground">
                    {article.category}
                  </span>
                  <span className="text-muted-foreground/30">·</span>
                  <span className="text-[10px] font-mono text-muted-foreground">{article.readTime}</span>
                </div>
                <h4 className="font-display text-sm font-semibold text-card-foreground group-hover:text-primary transition-colors leading-snug mb-2">
                  {article.title}
                </h4>
                <p className="text-xs text-muted-foreground/70 font-body leading-relaxed line-clamp-2">
                  {article.excerpt}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View all */}
        <div className="mt-4 text-center">
          <Link to="/blog" className="inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:underline">
            View all writing <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WritingDesk;
