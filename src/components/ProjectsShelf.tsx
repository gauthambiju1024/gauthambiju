import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { useProjects } from "@/hooks/useSiteData";
import { Link } from "react-router-dom";
import type { Tables } from "@/integrations/supabase/types";

const SPINE_COLORS = [
  "hsl(170 25% 28%)",
  "hsl(350 28% 30%)",
  "hsl(215 28% 28%)",
  "hsl(85 18% 28%)",
  "hsl(15 30% 30%)",
  "hsl(280 18% 30%)",
  "hsl(200 12% 32%)",
  "hsl(35 25% 30%)",
];

type Project = Tables<"projects">;

const truncateWords = (text: string, max: number) => {
  const words = text.split(" ");
  return words.length <= max ? text : words.slice(0, max).join(" ") + "…";
};

const ProjectsShelf = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { projects: dbProjects } = useProjects();

  const grouped = useMemo(() => {
    const groups: Record<string, Project[]> = {};
    const sorted = [...dbProjects].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    for (const p of sorted) {
      const cat = p.category || "General";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(p);
    }
    return groups;
  }, [dbProjects]);

  const categories = Object.keys(grouped);
  const selectedProject = dbProjects.find((p) => p.id === selectedId) ?? null;

  const years = dbProjects.map((p) => p.year).filter(Boolean) as string[];
  const yearRange = years.length > 0
    ? `${Math.min(...years.map(Number))} – ${Math.max(...years.map(Number))}`
    : "";

  return (
    <section className="py-6 md:py-8" style={{ borderRadius: "8px" }}>
      {/* Section header */}
      <div className="flex items-center gap-4 mb-4 px-6 md:px-10">
        <div className="h-px flex-1 bg-border/30" />
        <span className="dimension-label">Projects</span>
      </div>

      {/* Section title */}
      <div className="px-6 md:px-10 mb-3">
        <h2 className="font-serif-display text-2xl md:text-3xl text-card-foreground">
          Project Library
        </h2>
        <p className="mt-2 font-body text-sm text-muted-foreground">
          Case Studies · Products · Builds
        </p>
      </div>

      {categories.length === 0 && (
        <p className="text-center font-body text-sm py-10 text-muted-foreground">
          No projects yet — add some from the admin panel.
        </p>
      )}

      {categories.map((category) => (
        <div key={category} className="mb-2">
          {categories.length > 1 && (
            <div className="px-6 md:px-10 flex items-center gap-3 mb-2">
              <span className="text-[9px] tracking-[0.25em] uppercase font-mono text-muted-foreground">
                {category}
              </span>
              <div className="h-px flex-1 bg-border/20" />
            </div>
          )}

          {/* Shelf — clean dark background */}
          <div className="p-3 md:p-4 relative overflow-hidden">
            <div className="flex gap-3 md:gap-4 items-end min-h-[240px] overflow-x-auto pb-1 relative z-[2]">
              {grouped[category].map((project, i) => {
                const isSelected = selectedId === project.id;
                const spineColor = project.color || SPINE_COLORS[i % SPINE_COLORS.length];

                return (
                  <motion.button
                    key={project.id}
                    onClick={() => setSelectedId(isSelected ? null : project.id)}
                    className="relative flex-shrink-0 cursor-pointer group"
                    animate={{ y: isSelected ? -14 : 0 }}
                    whileHover={{ y: isSelected ? -14 : -6 }}
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  >
                    <motion.div
                      className="relative rounded-sm overflow-hidden"
                      style={{
                        width: "85px",
                        height: "240px",
                        backgroundColor: spineColor,
                      }}
                      animate={{
                        boxShadow: isSelected
                          ? `0 0 20px 4px ${spineColor}15, 2px 4px 16px rgba(0,0,0,0.4)`
                          : "2px 4px 12px rgba(0,0,0,0.3)",
                      }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    >
                      {/* Left edge highlight */}
                      <div
                        className="absolute left-0 top-0 bottom-0 w-[3px]"
                        style={{ background: "linear-gradient(to right, rgba(255,255,255,0.12), transparent)" }}
                      />

                      {/* Year top */}
                      <div className="absolute top-3 left-0 right-0 flex justify-center">
                        <span className="text-white/25 text-[8px] font-mono tracking-wider" style={{ writingMode: "vertical-lr" }}>
                          {project.year}
                        </span>
                      </div>

                      {/* Vertical title */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span
                          className="text-white/85 text-[13px] font-serif-display font-semibold tracking-[0.2em] uppercase"
                          style={{ writingMode: "vertical-lr", textOrientation: "mixed" }}
                        >
                          {project.title}
                        </span>
                      </div>

                      {/* Bottom subtitle */}
                      <div className="absolute bottom-0 left-0 right-0 px-1.5 pb-2.5 pt-6" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.3), transparent)" }}>
                        <div className="w-full h-px bg-white/10 mb-1.5" />
                        <p className="text-white/40 text-[8px] font-body leading-tight text-center">
                          {project.subtitle ? truncateWords(project.subtitle, 5) : (project.tags ?? [])[0] ?? ""}
                        </p>
                      </div>
                    </motion.div>

                    {/* Book shadow */}
                    <div className="h-1 mx-1 bg-black/20 rounded-b-sm blur-[2px]" />
                  </motion.button>
                );
              })}
            </div>

            {/* Shelf ledge — subtle */}
            <div
              className="mt-1 h-[4px] rounded-b-sm"
              style={{
                background: "linear-gradient(to top, hsl(220 10% 6%), hsl(220 10% 10%))",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.3)",
              }}
            />
          </div>

          {/* Detail card */}
          <AnimatePresence>
            {selectedProject && grouped[category].some((p) => p.id === selectedProject.id) && (
              <motion.div
                className="mx-4 md:mx-8 mt-1"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              >
                <div className="bg-card rounded-lg border border-border/50 p-5 md:p-6 shadow-lg relative overflow-hidden">
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-px" style={{ backgroundColor: selectedProject.color || SPINE_COLORS[0] }} />

                  <button
                    onClick={() => setSelectedId(null)}
                    className="absolute top-3 right-3 p-1.5 text-muted-foreground hover:text-card-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-start gap-3 mb-4 mt-1">
                    <div className="w-0.5 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: selectedProject.color || SPINE_COLORS[0] }} />
                    <div>
                      <h3 className="font-serif-display text-xl md:text-2xl text-card-foreground">{selectedProject.title}</h3>
                      {selectedProject.subtitle && (
                        <p className="text-sm text-muted-foreground font-body">{selectedProject.subtitle}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 font-body text-sm">
                    {selectedProject.problem && (
                      <div>
                        <span className="dimension-label">Problem</span>
                        <p className="mt-1 text-card-foreground/80">{selectedProject.problem}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      {selectedProject.role && (
                        <div>
                          <span className="dimension-label">Role</span>
                          <p className="mt-1 text-card-foreground/80">{selectedProject.role}</p>
                        </div>
                      )}
                      {selectedProject.stack && (
                        <div>
                          <span className="dimension-label">Stack</span>
                          <p className="mt-1 text-card-foreground/80">{selectedProject.stack}</p>
                        </div>
                      )}
                    </div>
                    {selectedProject.impact && (
                      <div>
                        <span className="dimension-label">Impact</span>
                        <p className="mt-1 text-card-foreground/80">{selectedProject.impact}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex items-center gap-3 flex-wrap">
                    <div className="flex gap-2">
                      {(selectedProject.tags ?? []).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 text-[10px] font-mono border border-border/50 rounded-sm text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="ml-auto flex items-center gap-3">
                      {selectedProject.url && selectedProject.url !== "#" && (
                        <a href={selectedProject.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-mono text-primary hover:underline">
                          Visit <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                      <Link to={`/projects/${selectedProject.slug}`} className="flex items-center gap-1 text-xs font-mono text-primary hover:underline font-semibold">
                        Full Case Study <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      {yearRange && (
        <div className="text-center mt-2">
          <span className="text-[10px] tracking-[0.3em] uppercase font-mono text-muted-foreground">
            Curated Work · {yearRange}
          </span>
        </div>
      )}
    </section>
  );
};

export default ProjectsShelf;
