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

const linenTexture = (base: string) => ({
  backgroundColor: base,
  backgroundImage: `
    repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px),
    repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)
  `,
});

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
    <section className="py-6 md:py-8">
      {/* Section header — consistent with other sections */}
      <div className="flex items-center gap-4 mb-4 px-6 md:px-10">
        <span className="text-[10px] tracking-[0.25em] uppercase font-mono" style={{ color: "hsl(var(--muted-foreground))" }}>
          page 03
        </span>
        <div className="h-px flex-1" style={{ background: "hsl(var(--border))" }} />
        <span className="text-[10px] tracking-[0.25em] uppercase font-mono" style={{ color: "hsl(var(--muted-foreground))" }}>
          Projects
        </span>
      </div>

      {/* Section title */}
      <div className="px-6 md:px-10 mb-3">
        <h2 className="font-serif-display text-2xl md:text-3xl" style={{ color: "hsl(var(--card-foreground))" }}>
          Project Library
        </h2>
        <p className="mt-2 font-body text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
          Case Studies · Products · Builds
        </p>
      </div>

      {categories.length === 0 && (
        <p className="text-center font-body text-sm py-10" style={{ color: "hsl(var(--muted-foreground))" }}>
          No projects yet — add some from the admin panel.
        </p>
      )}

      {categories.map((category) => (
        <div key={category} className="mb-2">
          {categories.length > 1 && (
            <div className="px-6 md:px-10 flex items-center gap-3 mb-2">
              <span className="text-[9px] tracking-[0.25em] uppercase font-mono" style={{ color: "hsl(var(--muted-foreground))" }}>
                {category}
              </span>
              <div className="h-px flex-1" style={{ background: "hsl(var(--border) / 0.5)" }} />
            </div>
          )}

          {/* Shelf */}
          <div
            className="rounded-lg mx-4 md:mx-8 p-3 md:p-4 relative overflow-hidden"
            style={{
              background: "linear-gradient(180deg, hsl(16 21% 42%) 0%, hsl(16 21% 36%) 100%)",
              backgroundImage: `
                repeating-linear-gradient(90deg, transparent 0px, transparent 120px, rgba(255,255,255,0.008) 120px, rgba(255,255,255,0.008) 121px),
                linear-gradient(180deg, hsl(16 21% 42%) 0%, hsl(16 21% 36%) 100%)
              `,
            }}
          >
            {/* Recessed shadows */}
            <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-black/25 to-transparent z-[1] pointer-events-none rounded-t-lg" />
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-black/10 to-transparent z-[1] pointer-events-none" />

            <div className="flex gap-3 md:gap-4 items-end min-h-[240px] overflow-x-auto pb-1 relative z-[2]">
              {grouped[category].map((project, i) => {
                const isSelected = selectedId === project.id;
                const spineColor = project.color || SPINE_COLORS[i % SPINE_COLORS.length];

                return (
                  <motion.button
                    key={project.id}
                    onClick={() => setSelectedId(isSelected ? null : project.id)}
                    className="relative flex-shrink-0 cursor-pointer group"
                    style={{ perspective: "800px" }}
                    animate={{ y: isSelected ? -14 : 0 }}
                    whileHover={{ y: isSelected ? -14 : -8 }}
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  >
                    <motion.div
                      className="relative rounded-sm overflow-hidden"
                      style={{
                        width: "85px",
                        height: "240px",
                        ...linenTexture(spineColor),
                      }}
                      whileHover={{ rotateY: -3 }}
                      animate={{
                        boxShadow: isSelected
                          ? `0 0 24px 6px ${spineColor}18, 4px 4px 16px rgba(0,0,0,0.4)`
                          : "4px 4px 12px rgba(0,0,0,0.35)",
                      }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    >
                      {/* Left edge highlight */}
                      <div
                        className="absolute left-0 top-0 bottom-0 w-[4px]"
                        style={{ background: "linear-gradient(to right, rgba(255,255,255,0.18), rgba(255,255,255,0.04))" }}
                      />
                      {/* Right edge shadow */}
                      <div
                        className="absolute right-0 top-0 bottom-0 w-[3px]"
                        style={{ background: "linear-gradient(to left, rgba(0,0,0,0.2), transparent)" }}
                      />

                      {/* Year top */}
                      <div className="absolute top-3 left-0 right-0 flex justify-center">
                        <span className="text-white/30 text-[8px] font-mono tracking-wider" style={{ writingMode: "vertical-lr" }}>
                          {project.year}
                        </span>
                      </div>

                      {/* Vertical title */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span
                          className="text-white/90 text-[13px] font-serif-display font-semibold tracking-[0.2em] uppercase"
                          style={{ writingMode: "vertical-lr", textOrientation: "mixed" }}
                        >
                          {project.title}
                        </span>
                      </div>

                      {/* Bottom horizontal subtitle */}
                      <div className="absolute bottom-0 left-0 right-0 px-1.5 pb-2.5 pt-6" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.35), transparent)" }}>
                        <div className="w-full h-px bg-white/15 mb-1.5" />
                        <p className="text-white/50 text-[8px] font-body leading-tight text-center" style={{ lineHeight: "1.3" }}>
                          {project.subtitle ? truncateWords(project.subtitle, 5) : (project.tags ?? [])[0] ?? ""}
                        </p>
                      </div>
                    </motion.div>

                    {/* Book shadow on shelf */}
                    <div className="h-1 mx-1 bg-black/25 rounded-b-sm blur-[2px]" />
                  </motion.button>
                );
              })}
            </div>

            {/* Shelf ledge */}
            <div
              className="mt-1 h-[6px] rounded-b-sm"
              style={{
                background: "linear-gradient(to top, hsl(24 14% 20%), hsl(24 14% 28%))",
                boxShadow: "0 4px 12px rgba(0,0,0,0.35), 0 2px 4px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            />
          </div>

          {/* Detail card */}
          <AnimatePresence>
            {selectedProject && grouped[category].some((p) => p.id === selectedProject.id) && (
              <motion.div
                className="mx-4 md:mx-8 mt-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              >
                <div
                  className="bg-card rounded-lg border border-border p-5 md:p-6 shadow-xl relative overflow-hidden"
                >
                  {/* Top color accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ backgroundColor: selectedProject.color || SPINE_COLORS[0] }} />

                  <button
                    onClick={() => setSelectedId(null)}
                    className="absolute top-3 right-3 p-1.5 text-muted-foreground hover:text-card-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-start gap-3 mb-4 mt-1">
                    <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: selectedProject.color || SPINE_COLORS[0] }} />
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
                        <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground">Problem</span>
                        <p className="mt-1 text-card-foreground/80">{selectedProject.problem}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      {selectedProject.role && (
                        <div>
                          <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground">Role</span>
                          <p className="mt-1 text-card-foreground/80">{selectedProject.role}</p>
                        </div>
                      )}
                      {selectedProject.stack && (
                        <div>
                          <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground">Stack</span>
                          <p className="mt-1 text-card-foreground/80">{selectedProject.stack}</p>
                        </div>
                      )}
                    </div>
                    {selectedProject.impact && (
                      <div>
                        <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground">Impact</span>
                        <p className="mt-1 text-card-foreground/80">{selectedProject.impact}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex items-center gap-3 flex-wrap">
                    <div className="flex gap-2">
                      {(selectedProject.tags ?? []).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 text-[10px] font-mono border border-border rounded-sm text-muted-foreground">
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
        <div className="text-center mt-4">
          <span className="text-[10px] tracking-[0.3em] uppercase font-mono" style={{ color: "hsl(var(--muted-foreground))" }}>
            Curated Work · {yearRange}
          </span>
        </div>
      )}
    </section>
  );
};

export default ProjectsShelf;
