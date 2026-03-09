import { useParams, Link } from 'react-router-dom';
import { useBlogPost } from '@/hooks/useSiteData';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft } from 'lucide-react';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { post, loading } = useBlogPost(slug ?? '');

  if (loading) {
    return (
      <div className="min-h-screen bg-card flex items-center justify-center">
        <p className="font-handwritten text-xl text-card-foreground/40">Loading...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-card flex flex-col items-center justify-center gap-4">
        <p className="font-handwritten text-2xl text-card-foreground/40">Post not found</p>
        <Link to="/blog" className="font-handwritten text-primary hover:underline">← Back to blog</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-card">
      <article className="max-w-3xl mx-auto px-8 py-16 md:py-24">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link to="/blog" className="inline-flex items-center gap-1 font-handwritten text-sm text-primary mb-8 hover:underline">
            <ArrowLeft className="w-3 h-3" /> Back to blog
          </Link>

          {post.cover_image && (
            <img src={post.cover_image} alt={post.title} className="w-full rounded-lg mb-8 object-cover max-h-[400px]" />
          )}

          <h1 className="font-handwritten text-3xl md:text-5xl font-bold text-card-foreground mb-4">{post.title}</h1>

          <div className="flex items-center gap-4 mb-8">
            {post.published_at && (
              <span className="flex items-center gap-1 text-sm text-card-foreground/30 font-mono">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(post.published_at).toLocaleDateString()}
              </span>
            )}
            {(post.tags ?? []).map(tag => (
              <span key={tag} className="font-handwritten text-xs text-card-foreground/25 uppercase tracking-wider px-2 py-0.5" style={{ border: '1px solid hsl(30 20% 78% / 0.4)' }}>
                {tag}
              </span>
            ))}
          </div>

          <div className="font-handwritten text-lg text-card-foreground/60 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </motion.div>
      </article>
    </div>
  );
}
