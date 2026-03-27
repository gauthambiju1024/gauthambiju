import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Navigation from "@/components/Navigation";
import { useCaseStudy } from "@/hooks/useSiteData";
import { Badge } from "@/components/ui/badge";

const CaseStudyPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { study, loading } = useCaseStudy(slug ?? "");

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse font-mono text-sm text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (!study) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="font-body text-muted-foreground">Case study not found.</p>
        <Link to="/#thinking" className="text-sm font-mono text-primary hover:underline flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Back to Strategy Wall
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto px-6 pt-28 pb-20"
      >
        {/* Back link */}
        <Link to="/#thinking" className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors mb-10">
          <ArrowLeft className="w-3 h-3" /> Back to Strategy Wall
        </Link>

        {/* Case file header */}
        <div
          className="relative rounded-lg p-8 md:p-12 mb-8"
          style={{
            backgroundColor: study.color || "hsl(48 80% 88%)",
            backgroundImage: "linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        >
          {/* Left accent border */}
          <div className="absolute left-0 top-4 bottom-4 w-1 rounded-full bg-card-foreground/15" />

          <span className="inline-block text-[10px] tracking-[0.25em] uppercase font-mono text-card-foreground/50 mb-3">
            {study.category}
          </span>
          <h1 className="font-serif-display text-3xl md:text-4xl text-card-foreground/90 leading-tight mb-4">
            {study.title}
          </h1>
          {study.summary && (
            <p className="font-body text-sm text-card-foreground/60 max-w-lg">{study.summary}</p>
          )}

          {study.tags && study.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {study.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-[10px] font-mono bg-card-foreground/8 text-card-foreground/60 border-0">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Cover image */}
        {study.cover_image && (
          <div className="rounded-lg overflow-hidden mb-10">
            <img src={study.cover_image} alt={study.title} className="w-full object-cover" />
          </div>
        )}

        {/* Markdown content */}
        {study.content && (
          <div className="prose prose-sm max-w-none font-body text-foreground/80
            prose-headings:font-serif-display prose-headings:text-foreground
            prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3
            prose-p:leading-relaxed prose-p:mb-4
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-2 prose-blockquote:border-primary/30 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground
            prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
            prose-img:rounded-lg">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{study.content}</ReactMarkdown>
          </div>
        )}
      </motion.article>
    </div>
  );
};

export default CaseStudyPage;
