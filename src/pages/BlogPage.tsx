import { useBlogPosts } from '@/hooks/useSiteData';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Calendar } from 'lucide-react';

export default function BlogPage() {
  const { posts, loading } = useBlogPosts();

  return (
    <div className="min-h-screen bg-card">
      <div className="max-w-3xl mx-auto px-8 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="font-handwritten text-sm text-primary mb-8 inline-block hover:underline">← Back home</Link>
          <h1 className="font-handwritten text-4xl md:text-5xl font-bold text-card-foreground mb-4">Blog</h1>
          <p className="font-handwritten text-lg text-card-foreground/40 mb-12">Thoughts, learnings, and explorations.</p>
        </motion.div>

        {loading && <p className="font-handwritten text-card-foreground/40">Loading...</p>}

        <div className="space-y-0" style={{ borderTop: '1px solid hsl(30 20% 78% / 0.4)' }}>
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <Link
                to={`/blog/${post.slug}`}
                className="group block py-6 md:py-8 transition-colors"
                style={{ borderBottom: '1px solid hsl(30 20% 78% / 0.4)' }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-handwritten text-xl md:text-2xl font-semibold text-card-foreground group-hover:text-primary transition-colors duration-300 flex items-center gap-2">
                      {post.title}
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    </h2>
                    {post.excerpt && (
                      <p className="font-handwritten text-sm text-card-foreground/40 mt-1 line-clamp-2">{post.excerpt}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      {post.published_at && (
                        <span className="flex items-center gap-1 text-xs text-card-foreground/25 font-mono">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.published_at).toLocaleDateString()}
                        </span>
                      )}
                      {(post.tags ?? []).map(tag => (
                        <span key={tag} className="font-handwritten text-xs text-card-foreground/20 uppercase tracking-wider">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {!loading && posts.length === 0 && (
          <p className="font-handwritten text-lg text-card-foreground/30 text-center py-12">No posts yet. Check back soon!</p>
        )}
      </div>
    </div>
  );
}
