import { useEffect, useState, useMemo } from "react";
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

const SPINE_W = 78;
const SPINE_H = 200;

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

/** Reserved landing spine for the folded About ID card. */
const LandingSpine = ({ landed }: { landed: boolean }) => (
  <div
    id="projects-shelf-landing-slot"
    data-card-landing-slot="true"
    className="relative flex-shrink-0"
    style={{
      width: SPINE_W,
      height: SPINE_H,
      marginRight: 4,
    }}
  >
    <div
      className="relative w-full h-full overflow-hidden rounded-sm"
      style={{
        background: landed ? "hsl(28 35% 22%)" : "transparent",
        border: landed
          ? "1px solid hsl(var(--gold) / 0.7)"
          : "1px dashed hsl(var(--gold) / 0.35)",
        boxShadow: landed
          ? "0 0 24px 6px hsl(var(--gold) / 0.08), 4px 4px 16px rgba(0,0,0,0.45), inset 0 0 0 1px hsl(var(--gold) / 0.25)"
          : "none",
        transition:
          "background 320ms ease, border-color 320ms ease, box-shadow 320ms ease, opacity 320ms ease",
        opacity: landed ? 1 : 0.85,
      }}
    >
      {/* Left edge highlight */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[4px]"
        style={{
          background:
            "linear-gradient(to right, hsl(var(--gold) / 0.18), transparent)",
        }}
      />
      {/* Right edge shadow */}
      <div
        className="absolute right-0 top-0 bottom-0 w-[3px]"
        style={{
          background:
            "linear-gradient(to left, rgba(0,0,0,0.25), transparent)",
        }}
      />

      {/* Title — only when landed */}
      <div className="absolute inset-0 flex items-center justify-center px-1">
        <span
          className="font-serif-display"
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            fontSize: 12,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            fontWeight: 600,
            color: landed ? "hsl(var(--gold))" : "hsl(var(--gold) / 0.45)",
            transition: "color 320ms ease",
            whiteSpace: "nowrap",
          }}
        >
          {landed ? "GB · 0024 · About" : "About — folding…"}
        </span>
      </div>

      {/* foot label */}
      <div className="absolute bottom-2 left-0 right-0 text-center">
        <span
          className="font-mono"
          style={{
            fontSize: 8,
            letterSpacing: "0.2em",
            color: "hsl(var(--gold) / 0.55)",
          }}
        >
          01
        </span>
      </div>
    </div>
    {/* Book shadow on shelf */}
    <div className="h-1 mx-1 bg-black/25 rounded-b-sm blur-[2px]" />
  </div>
);

/** Toolbox object on the shelf — anchor for the future Projects → Skills zoom. */
const ToolboxOnShelf = () => (
  <div
    id="projects-toolbox-anchor"
    data-toolbox-anchor="true"
    className="relative flex-shrink-0 ml-2"
    style={{ width: 92, height: SPINE_H }}
  >
    <div
      className="absolute bottom-0 left-0 right-0 rounded-sm overflow-hidden"
      style={{
        height: 108,
        background:
          "linear-gradient(to bottom, hsl(220 8% 30%), hsl(220 10% 18%))",
        border: "1px solid hsl(28 35% 22%)",
        boxShadow:
          "inset 0 0 0 1px hsl(var(--gold) / 0.18), 0 6px 14px -6px rgba(0,0,0,0.6), 4px 4px 14px rgba(0,0,0,0.35)",
      }}
    >
      {/* Handle */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: 8,
          width: 46,
          height: 8,
          borderTop: "2px solid hsl(var(--gold) / 0.75)",
          borderLeft: "2px solid hsl(var(--gold) / 0.5)",
          borderRight: "2px solid hsl(var(--gold) / 0.5)",
          borderRadius: "8px 8px 0 0",
        }}
      />
      {/* Latch */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: 26,
          width: 18,
          height: 10,
          background: "hsl(0 0% 12%)",
          border: "1px solid hsl(var(--gold) / 0.45)",
          borderRadius: 2,
        }}
      />
      {/* Stencil labels */}
      <div
        className="absolute left-0 right-0 text-center font-mono"
        style={{
          top: 46,
          fontSize: 9,
          letterSpacing: "0.32em",
          color: "hsl(var(--gold) / 0.85)",
        }}
      >
        TOOLBOX
      </div>
      <div
        className="absolute left-0 right-0 text-center font-mono"
        style={{
          top: 62,
          fontSize: 7.5,
          letterSpacing: "0.24em",
          color: "hsl(var(--gold) / 0.55)",
        }}
      >
        STATION · 03 / 08
      </div>
      {/* Corner brackets */}
      {[
        { t: 4, l: 4, br: "tl" as const },
        { t: 4, r: 4, br: "tr" as const },
        { b: 4, l: 4, br: "bl" as const },
        { b: 4, r: 4, br: "br" as const },
      ].map((c, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            width: 8,
            height: 8,
            top: (c as any).t,
            bottom: (c as any).b,
            left: (c as any).l,
            right: (c as any).r,
            borderTop: c.br.startsWith("t") ? "1px solid hsl(var(--gold))" : undefined,
            borderBottom: c.br.startsWith("b") ? "1px solid hsl(var(--gold))" : undefined,
            borderLeft: c.br.endsWith("l") ? "1px solid hsl(var(--gold))" : undefined,
            borderRight: c.br.endsWith("r") ? "1px solid hsl(var(--gold))" : undefined,
            opacity: 0.4,
            animation: `toolboxPulse 3s ease-in-out ${i * 0.15}s infinite`,
          }}
        />
      ))}
    </div>
    <style>{`
      @keyframes toolboxPulse {
        0%, 100% { opacity: 0.35; }
        50% { opacity: 0.85; }
      }
    `}</style>
  </div>
);

const ProjectsShelf = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [landed, setLanded] = useState<boolean>(false);
  const { projects: dbProjects } = useProjects();

  // Observe body[data-card-landed]
  useEffect(() => {
    const check = () =>
      setLanded(document.body.getAttribute("data-card-landed") === "true");
    check();
    const mo = new MutationObserver(check);
    mo.observe(document.body, { attributes: true, attributeFilter: ["data-card-landed"] });
    return () => mo.disconnect();
  }, []);

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
    <section className="py-4 md:py-6 h-full flex flex-col" style={{ background: "transparent", borderRadius: "8px" }}>
      {/* Section header */}
      <div className="flex items-center gap-4 mb-3 px-6 md:px-10">
        <div className="h-px flex-1" style={{ background: "hsl(var(--border))" }} />
        <span className="text-[10px] tracking-[0.25em] uppercase font-mono" style={{ color: "hsl(var(--muted-foreground))" }}>
          Projects
        </span>
      </div>

      <div className="px-6 md:px-10 mb-3">
        <h2 className="font-serif-display text-2xl md:text-3xl" style={{ color: "hsl(var(--card-foreground))" }}>
          Project Library
        </h2>
        <p className="mt-1 font-body text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
          Case Studies · Products · Builds
        </p>
      </div>

      {categories.length === 0 && (
        <p className="text-center font-body text-sm py-10" style={{ color: "hsl(var(--muted-foreground))" }}>
          No projects yet — add some from the admin panel.
        </p>
      )}

      {categories.map((category, catIdx) => (
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
            className="p-3 md:p-4 relative overflow-hidden"
            style={{
              background: "hsl(220 10% 8%)",
              backgroundImage: `
                radial-gradient(ellipse at 50% 0%, rgba(180,130,70,0.06) 0%, transparent 70%),
                repeating-linear-gradient(90deg, transparent 0px, transparent 120px, rgba(255,255,255,0.008) 120px, rgba(255,255,255,0.008) 121px)
              `,
            }}
          >
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-black/15 to-transparent z-[1] pointer-events-none" />

            <div className="flex gap-3 md:gap-4 items-end min-h-[200px] overflow-x-auto pb-1 relative z-[2]">
              {/* Landing spine — only on the first category row */}
              {catIdx === 0 && <LandingSpine landed={landed} />}

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
                        width: `${SPINE_W}px`,
                        height: `${SPINE_H}px`,
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
                      <div className="absolute left-0 top-0 bottom-0 w-[4px]" style={{ background: "linear-gradient(to right, rgba(255,255,255,0.18), rgba(255,255,255,0.04))" }} />
                      <div className="absolute right-0 top-0 bottom-0 w-[3px]" style={{ background: "linear-gradient(to left, rgba(0,0,0,0.2), transparent)" }} />

                      <div className="absolute top-3 left-0 right-0 flex justify-center">
                        <span className="text-white/30 text-[8px] font-mono tracking-wider" style={{ writingMode: "vertical-lr" }}>
                          {project.year}
                        </span>
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center">
                        <span
                          className="text-white/90 text-[13px] font-serif-display font-semibold tracking-[0.2em] uppercase"
                          style={{ writingMode: "vertical-lr", textOrientation: "mixed" }}
                        >
                          {project.title}
                        </span>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 px-1.5 pb-2.5 pt-6" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.35), transparent)" }}>
                        <div className="w-full h-px bg-white/15 mb-1.5" />
                        <p className="text-white/50 text-[8px] font-body leading-tight text-center" style={{ lineHeight: "1.3" }}>
                          {project.subtitle ? truncateWords(project.subtitle, 5) : (project.tags ?? [])[0] ?? ""}
                        </p>
                      </div>
                    </motion.div>

                    <div className="h-1 mx-1 bg-black/25 rounded-b-sm blur-[2px]" />
                  </motion.button>
                );
              })}

              {/* Toolbox at end of last row */}
              {catIdx === categories.length - 1 && <ToolboxOnShelf />}
            </div>

            <div
              className="mt-1 h-[6px] rounded-b-sm"
              style={{
                background: "linear-gradient(to top, hsl(220 10% 8%), hsl(220 10% 10%))",
                boxShadow: "0 8px 30px rgba(180,130,70,0.15), 0 4px 15px rgba(180,130,70,0.1), 0 2px 4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            />
          </div>

          <AnimatePresence>
            {selectedProject && grouped[category].some((p) => p.id === selectedProject.id) && (
              <motion.div
                className="mx-4 md:mx-8 mt-1"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              >
                <div className="bg-card rounded-lg border border-border p-5 md:p-6 shadow-xl relative overflow-hidden">
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
        <div className="text-center mt-2">
          <span className="text-[10px] tracking-[0.3em] uppercase font-mono" style={{ color: "hsl(var(--muted-foreground))" }}>
            Curated Work · {yearRange}
          </span>
        </div>
      )}
    </section>
  );
};

export default ProjectsShelf;
