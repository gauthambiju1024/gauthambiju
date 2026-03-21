import { Link } from "react-router-dom";
import { ArrowUpRight, Calendar } from "lucide-react";
import { useBlogPosts } from "@/hooks/useSiteData";

const fallbackPosts = [
  { id: "1", title: "Coming soon", excerpt: "Blog posts will appear here.", published_at: null, slug: "#", tags: [] },
];

const BlogSection = () => {
  const { posts, loading } = useBlogPosts();
  const displayPosts = posts.length > 0 ? posts.slice(0, 3) : fallbackPosts;

  return (
    <section className="px-8 md:px-16 py-16 md:py-24">
      <div className="mb-10">
        <h2 className="font-handwritten text-4xl md:text-5xl font-bold text-card-foreground mb-2">
          Blog
        </h2>
        <p className="font-handwritten text-xl text-card-foreground/40">
          Thoughts, ideas, and explorations.
        </p>
      </div>

      {loading ? (
        <p className="font-handwritten text-lg text-card-foreground/40">Loading…</p>
      ) : (
        <div>
          {displayPosts.map((post, i) => (
            <Link
              key={post.id ?? i}
              to={`/blog/${post.slug}`}
              className="group flex items-start justify-between py-5 border-b border-border/30 transition-colors hover:bg-muted/20 px-2 -mx-2 rounded"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-handwritten text-2xl text-card-foreground group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="font-handwritten text-lg text-card-foreground/50 mt-1 line-clamp-1">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-2">
                  {post.published_at && (
                    <span className="flex items-center gap-1 text-xs font-mono text-card-foreground/30">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.published_at).toLocaleDateString()}
                    </span>
                  )}
                  {post.tags?.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-xs font-mono px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-card-foreground/20 group-hover:text-primary transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 mt-2 flex-shrink-0" />
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Link
          to="/blog"
          className="font-handwritten text-xl text-primary hover:underline inline-flex items-center gap-1"
        >
          View all posts <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};

export default BlogSection;
