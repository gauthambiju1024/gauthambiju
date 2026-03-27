import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useProject } from "@/hooks/useSiteData";
import Navigation from "@/components/Navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ProjectPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { project, loading } = useProject(slug ?? "");

  if (loading) {
    return (
      <div className="min-h-screen desk-pattern flex items-center justify-center" style={{ background: "hsl(var(--background))" }}>
        <p className="text-muted-foreground font-mono text-sm">Loading…</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen desk-pattern flex flex-col items-center justify-center gap-4" style={{ background: "hsl(var(--background))" }}>
        <p className="text-muted-foreground font-body">Project not found.</p>
        <Link to="/" className="text-primary font-mono text-sm hover:underline flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Back to Home
        </Link>
      </div>
    );
  }

  const sections = [
    { label: "Problem", value: project.problem },
    { label: "Role", value: project.role },
    { label: "Stack", value: project.stack },
    { label: "Contribution", value: project.contribution },
    { label: "Impact", value: project.impact },
  ].filter((s) => s.value);

  return (
    <div className="min-h-screen desk-pattern" style={{ background: "hsl(var(--background))" }}>
      <div className="sticky top-0 z-50 w-full max-w-7xl mx-auto px-2 md:px-4 lg:px-8">
        <Navigation />
      </div>

      <motion.article
        className="max-w-3xl mx-auto px-6 md:px-8 py-12 md:py-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Home
        </Link>

        {/* Hero */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-1.5 h-10 rounded-full"
              style={{ backgroundColor: project.color || "hsl(215 20% 30%)" }}
            />
            <div>
              <h1 className="font-serif-display text-3xl md:text-5xl text-card-foreground leading-tight">
                {project.title}
              </h1>
              {project.subtitle && (
                <p className="font-body text-base text-muted-foreground mt-1">{project.subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4 flex-wrap">
            {project.year && (
              <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
                {project.year}
              </span>
            )}
            {(project.tags ?? []).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[10px] font-mono border border-border rounded-sm text-muted-foreground"
              >
                {tag}
              </span>
            ))}
            {project.url && project.url !== "#" && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto flex items-center gap-1 text-xs font-mono text-primary hover:underline"
              >
                Visit Project <ArrowUpRight className="w-3 h-3" />
              </a>
            )}
          </div>
        </header>

        {/* Thumbnail */}
        {project.thumbnail_url && (
          <div className="mb-12 rounded-lg overflow-hidden border border-border shadow-lg">
            <img src={project.thumbnail_url} alt={project.title} className="w-full h-auto" />
          </div>
        )}

        {/* Metadata sections */}
        {sections.length > 0 && (
          <div className="space-y-6 mb-12">
            {sections.map(({ label, value }) => (
              <div key={label}>
                <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground">
                  {label}
                </span>
                <p className="mt-1 font-body text-sm text-card-foreground/85 leading-relaxed">{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Long-form description */}
        {project.description && (
          <div className="prose prose-invert prose-sm max-w-none font-body text-card-foreground/80">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.description}</ReactMarkdown>
          </div>
        )}
      </motion.article>
    </div>
  );
};

export default ProjectPage;
