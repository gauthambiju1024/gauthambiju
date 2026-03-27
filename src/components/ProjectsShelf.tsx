import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { useProjects } from "@/hooks/useSiteData";
import { Link } from "react-router-dom";
import type { Tables } from "@/integrations/supabase/types";

const SPINE_COLORS = [
  "hsl(170 18% 28%)",
  "hsl(350 22% 30%)",
  "hsl(215 22% 28%)",
  "hsl(45 18% 30%)",
  "hsl(15 25% 30%)",
  "hsl(260 15% 30%)",
];

type Project = Tables<"projects">;

const ProjectsShelf = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { projects: dbProjects } = useProjects();

  // Group by category
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

  return (
    <section className="py-16 md:py-24">
      <div className="px-6 md:px-16 mb-10">
        <h2 className="font-serif-display text-3xl md:text-4xl text-card-foreground leading-tight">
          Selected Work
        </h2>
      </div>

      {categories.length === 0 && (
        <p className="text-center text-muted-foreground font-body text-sm py-12">
          No projects yet — add some from the admin panel.
        </p>
      )}

      {categories.map((category) => (
        <div key={category} className="mb-8">
          {/* Category label */}
          {categories.length > 1 && (
            <div className="px-6 md:px-16 flex items-center gap-3 mb-4">
              <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-mono">
                {category}
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
          )}

          {/* Shelf */}
          <div className="shelf-bg rounded-lg mx-4 md:mx-12 p-6 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-card-foreground/10 to-transparent" />

            <div className="flex gap-5 md:gap-6 items-end min-h-[260px] md:min-h-[280px] overflow-x-auto pb-2">
              {grouped[category].map((project, i) => {
                const isSelected = selectedId === project.id;
                const spineColor = project.color || SPINE_COLORS[i % SPINE_COLORS.length];

                return (
                  <motion.button
                    key={project.id}
                    onClick={() => setSelectedId(isSelected ? null : project.id)}
                    className="relative flex-shrink-0 cursor-pointer group"
                    style={{ perspective: "800px" }}
                    animate={{ y: isSelected ? -16 : 0 }}
                    whileHover={{ y: isSelected ? -16 : -10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <motion.div
                      className="relative rounded-sm overflow-hidden shadow-lg"
                      style={{
                        width: "65px",
                        height: "240px",
                        backgroundColor: spineColor,
                      }}
                      whileHover={{
                        rotateY: -5,
                        boxShadow: "8px 8px 24px rgba(0,0,0,0.4)",
                      }}
                      animate={{
                        boxShadow: isSelected
                          ? "0 0 20px 4px rgba(255,255,255,0.08)"
                          : "4px 4px 12px rgba(0,0,0,0.3)",
                      }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    >
                      {/* Spine edge highlight */}
                      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-r from-white/15 to-transparent" />

                      {/* Title vertical */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span
                          className="text-white/85 text-[11px] font-display font-semibold tracking-[0.15em] uppercase"
                          style={{ writingMode: "vertical-lr", textOrientation: "mixed" }}
                        >
                          {project.title}
                        </span>
                      </div>

                      {/* Year top */}
                      <div className="absolute top-3 left-0 right-0 flex justify-center">
                        <span
                          className="text-white/25 text-[7px] font-mono"
                          style={{ writingMode: "vertical-lr" }}
                        >
                          {project.year}
                        </span>
                      </div>

                      {/* Tag bottom */}
                      <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                        <span
                          className="text-white/30 text-[7px] font-mono tracking-wider uppercase"
                          style={{ writingMode: "vertical-lr" }}
                        >
                          {(project.tags ?? [])[0] ?? ""}
                        </span>
                      </div>
                    </motion.div>
                    <div className="h-1 mx-1 bg-black/20 rounded-b-sm blur-[1px]" />
                  </motion.button>
                );
              })}
            </div>

            {/* Shelf ledge */}
            <div className="mt-3 h-3 rounded-b-sm bg-gradient-to-t from-black/30 to-black/10 shadow-[0_4px_12px_rgba(0,0,0,0.3)]" />
          </div>

          {/* Inline detail card */}
          <AnimatePresence>
            {selectedProject && grouped[category].some((p) => p.id === selectedProject.id) && (
              <motion.div
                className="mx-4 md:mx-12 mt-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              >
                <div className="bg-card rounded-lg border border-border p-6 md:p-8 shadow-xl relative">
                  <button
                    onClick={() => setSelectedId(null)}
                    className="absolute top-4 right-4 p-1.5 text-muted-foreground hover:text-card-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className="w-1 h-8 rounded-full flex-shrink-0"
                      style={{ backgroundColor: selectedProject.color || SPINE_COLORS[0] }}
                    />
                    <div>
                      <h3 className="font-serif-display text-xl md:text-2xl text-card-foreground">
                        {selectedProject.title}
                      </h3>
                      {selectedProject.subtitle && (
                        <p className="text-sm text-muted-foreground font-body">{selectedProject.subtitle}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 font-body text-sm">
                    {selectedProject.problem && (
                      <div>
                        <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground">
                          Problem
                        </span>
                        <p className="mt-1 text-card-foreground/80">{selectedProject.problem}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      {selectedProject.role && (
                        <div>
                          <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground">
                            Role
                          </span>
                          <p className="mt-1 text-card-foreground/80">{selectedProject.role}</p>
                        </div>
                      )}
                      {selectedProject.stack && (
                        <div>
                          <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground">
                            Stack
                          </span>
                          <p className="mt-1 text-card-foreground/80">{selectedProject.stack}</p>
                        </div>
                      )}
                    </div>
                    {selectedProject.impact && (
                      <div>
                        <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground">
                          Impact
                        </span>
                        <p className="mt-1 text-card-foreground/80">{selectedProject.impact}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 flex items-center gap-3 flex-wrap">
                    <div className="flex gap-2">
                      {(selectedProject.tags ?? []).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-[10px] font-mono border border-border rounded-sm text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="ml-auto flex items-center gap-3">
                      {selectedProject.url && selectedProject.url !== "#" && (
                        <a
                          href={selectedProject.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs font-mono text-primary hover:underline"
                        >
                          Visit <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                      <Link
                        to={`/projects/${selectedProject.slug}`}
                        className="flex items-center gap-1 text-xs font-mono text-primary hover:underline font-semibold"
                      >
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
    </section>
  );
};

export default ProjectsShelf;
