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
    <section className="py-16 md:py-24" style={{ background: 'hsl(var(--cutting-mat))' }}>
      <div className="px-6 md:px-16 flex items-center gap-3 mb-12">
        <div className="h-px flex-1" style={{ background: 'hsl(var(--ruler-accent) / 0.15)' }} />
        <span className="dimension-label">Writing</span>
      </div>

      <div className="px-6 md:px-16 mb-10">
        <h2 className="font-serif-display text-3xl md:text-4xl leading-tight" style={{ color: 'hsl(var(--paper))' }}>
          The Editorial Desk
        </h2>
        <p className="mt-3 font-body text-sm" style={{ color: 'hsl(var(--paper) / 0.4)' }}>
          Thinking through writing. Insights, reflections, and structured notes.
        </p>
      </div>

      <div className="px-6 md:px-16">
        {/* Featured article — paper document */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link
              to={featured.slug !== "#" ? `/blog/${featured.slug}` : "/blog"}
              className="group block paper-card p-6 md:p-8 transition-all duration-300"
              style={{ transform: 'rotate(-0.3deg)' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[9px] tracking-[0.15em] uppercase font-mono" style={{ color: 'hsl(var(--ruler-accent) / 0.7)' }}>
                  {featured.category}
                </span>
                <span className="text-[10px] font-mono flex items-center gap-1" style={{ color: 'hsl(var(--card-foreground) / 0.4)' }}>
                  <Clock className="w-3 h-3" /> {featured.readTime}
                </span>
              </div>
              <h3 className="font-serif-display text-xl md:text-2xl leading-tight mb-3 transition-colors"
                style={{ color: 'hsl(var(--card-foreground) / 0.85)' }}>
                {featured.title}
              </h3>
              <p className="font-body text-sm leading-relaxed max-w-2xl" style={{ color: 'hsl(var(--card-foreground) / 0.5)' }}>
                {featured.excerpt}
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: 'hsl(var(--ruler-accent))' }}>
                Read article <ArrowUpRight className="w-3 h-3" />
              </div>
            </Link>
          </motion.div>
        )}

        {/* Ruler divider */}
        <div className="h-px mb-8" style={{ background: 'hsl(var(--ruler-accent) / 0.12)' }} />

        {/* Article grid — paper documents */}
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
                className="group block paper-card p-5 transition-all duration-300 h-full"
                style={{ transform: `rotate(${i % 2 === 0 ? '0.2' : '-0.15'}deg)` }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[9px] tracking-[0.15em] uppercase font-mono" style={{ color: 'hsl(var(--ruler-accent) / 0.6)' }}>
                    {article.category}
                  </span>
                  <span style={{ color: 'hsl(var(--card-foreground) / 0.2)' }}>·</span>
                  <span className="text-[10px] font-mono" style={{ color: 'hsl(var(--card-foreground) / 0.35)' }}>{article.readTime}</span>
                </div>
                <h4 className="font-display text-sm font-semibold leading-snug mb-2 transition-colors"
                  style={{ color: 'hsl(var(--card-foreground) / 0.8)' }}>
                  {article.title}
                </h4>
                <p className="text-xs font-body leading-relaxed line-clamp-2" style={{ color: 'hsl(var(--card-foreground) / 0.45)' }}>
                  {article.excerpt}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View all */}
        <div className="mt-8 text-center">
          <Link to="/blog" className="inline-flex items-center gap-1.5 text-xs font-mono hover:underline"
            style={{ color: 'hsl(var(--ruler-accent))' }}>
            View all writing <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WritingDesk;
