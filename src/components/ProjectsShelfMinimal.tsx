import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useProjects } from "@/hooks/useSiteData";
import type { Tables } from "@/integrations/supabase/types";

type Project = Tables<"projects">;

const SPINE_COLORS = [
  "hsl(170 25% 28%)",
  "hsl(350 28% 30%)",
  "hsl(215 28% 28%)",
  "hsl(85 18% 28%)",
  "hsl(15 30% 30%)",
  "hsl(280 18% 30%)",
];

const SPINE_W = 44; // px
const SPINE_H = 88; // px
const SLOT_GAP = 6;

const Spine = ({
  project,
  selected,
  onClick,
  color,
}: {
  project: Project;
  selected: boolean;
  onClick: () => void;
  color: string;
}) => (
  <motion.button
    onClick={onClick}
    className="relative flex-shrink-0 group"
    style={{ width: SPINE_W, height: SPINE_H }}
    animate={{ y: selected ? -10 : 0 }}
    whileHover={{ y: selected ? -10 : -6 }}
    transition={{ type: "spring", stiffness: 360, damping: 26 }}
  >
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        backgroundColor: color,
        border: `1px solid ${selected ? "hsl(var(--gold) / 0.7)" : "hsl(var(--gold) / 0.18)"}`,
        boxShadow: selected
          ? "0 6px 14px -4px rgba(0,0,0,0.55), inset 0 0 0 1px hsl(var(--gold) / 0.35)"
          : "0 2px 4px rgba(0,0,0,0.35)",
      }}
    >
      <span
        className="absolute inset-0 flex items-center justify-center font-serif-display text-white/90"
        style={{
          writingMode: "vertical-rl",
          textOrientation: "mixed",
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          fontWeight: 600,
          padding: "8px 0 14px",
        }}
      >
        {project.title}
      </span>
      {project.year && (
        <span
          className="absolute left-0 right-0 bottom-1 text-center font-mono text-white/45"
          style={{ fontSize: 8, letterSpacing: "0.12em" }}
        >
          {project.year}
        </span>
      )}
    </div>
  </motion.button>
);

const LandingSlot = ({ landed }: { landed: boolean }) => (
  <div
    id="projects-shelf-landing-slot"
    className="relative flex-shrink-0"
    style={{
      width: SPINE_W,
      height: SPINE_H,
      border: landed ? "1px solid hsl(var(--gold) / 0.7)" : "1px dashed hsl(var(--gold) / 0.35)",
      background: landed ? "hsl(28 35% 22%)" : "transparent",
      boxShadow: landed ? "0 6px 14px -4px rgba(0,0,0,0.5), inset 0 0 0 1px hsl(var(--gold) / 0.3)" : "none",
      transition: "background 240ms ease, border-color 240ms ease, box-shadow 240ms ease",
    }}
  >
    {landed && (
      <span
        className="absolute inset-0 flex items-center justify-center font-serif-display"
        style={{
          color: "hsl(var(--gold))",
          writingMode: "vertical-rl",
          textOrientation: "mixed",
          fontSize: 10,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        GB · 0024
      </span>
    )}
    <span
      className="absolute left-1/2 -translate-x-1/2 font-mono"
      style={{
        bottom: -16,
        fontSize: 8,
        color: "hsl(var(--gold) / 0.55)",
        letterSpacing: "0.25em",
      }}
    >
      01
    </span>
  </div>
);

const ToolboxSlot = () => (
  <div
    id="projects-toolbox-anchor"
    data-toolbox-anchor="true"
    className="relative flex-shrink-0"
    style={{
      width: 64,
      height: SPINE_H,
      background: "hsl(220 8% 32%)",
      border: "1px solid hsl(28 35% 22%)",
      boxShadow: "inset 0 0 0 1px hsl(var(--gold) / 0.18), 0 2px 6px rgba(0,0,0,0.45)",
    }}
  >
    {/* handle line */}
    <div className="absolute left-2 right-2 top-2 h-px" style={{ background: "hsl(var(--gold) / 0.55)" }} />
    {/* labels */}
    <div
      className="absolute left-0 right-0 top-1/2 -translate-y-1/2 text-center font-mono"
      style={{ fontSize: 8, letterSpacing: "0.28em", color: "hsl(var(--gold) / 0.75)" }}
    >
      TOOLBOX
    </div>
    <div
      className="absolute left-0 right-0 bottom-1 text-center font-mono"
      style={{ fontSize: 7, letterSpacing: "0.18em", color: "hsl(var(--gold) / 0.45)" }}
    >
      03 / 08
    </div>
    {/* corner brackets */}
    {(
      [
        { t: 0, l: 0, br: "tl" },
        { t: 0, r: 0, br: "tr" },
        { b: 0, l: 0, br: "bl" },
        { b: 0, r: 0, br: "br" },
      ] as const
    ).map((c, i) => (
      <div
        key={i}
        className="absolute pulse-bracket"
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
          opacity: 0.5,
          animation: `toolboxPulse 3s ease-in-out ${i * 0.15}s infinite`,
        }}
      />
    ))}
    <style>{`
      @keyframes toolboxPulse {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 0.85; }
      }
    `}</style>
  </div>
);

const ProjectsShelfMinimal = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [landed, setLanded] = useState<boolean>(false);
  const { projects: dbProjects } = useProjects();

  // Observe body[data-card-landed]
  useEffect(() => {
    const check = () => setLanded(document.body.getAttribute("data-card-landed") === "true");
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
    <section className="py-4 md:py-6 h-full flex flex-col" style={{ background: "transparent" }}>
      {/* Section header */}
      <div className="flex items-center gap-4 mb-3 px-6 md:px-10">
        <div className="h-px flex-1" style={{ background: "hsl(var(--border))" }} />
        <span className="text-[10px] tracking-[0.25em] uppercase font-mono" style={{ color: "hsl(var(--muted-foreground))" }}>
          Projects
        </span>
      </div>

      <div className="px-6 md:px-10 mb-4">
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

      {/* Single dense ledge with all groups */}
      <div className="px-4 md:px-8">
        <div
          className="relative"
          style={{
            background: "hsl(28 35% 22%)",
            padding: "16px 14px 0",
            borderTop: "1px solid hsl(var(--gold) / 0.55)",
            boxShadow: "0 12px 24px -10px rgba(0,0,0,0.55), inset 0 1px 0 hsl(var(--gold) / 0.18)",
          }}
        >
          {/* spines row(s) */}
          <div className="flex items-end gap-6 flex-wrap" style={{ rowGap: 28 }}>
            {/* Landing slot first */}
            <div className="flex items-end" style={{ gap: SLOT_GAP }}>
              <LandingSlot landed={landed} />
            </div>

            {categories.map((category) => (
              <div key={category} className="flex flex-col">
                <div className="flex items-end" style={{ gap: SLOT_GAP }}>
                  {grouped[category].map((p, i) => (
                    <Spine
                      key={p.id}
                      project={p}
                      selected={selectedId === p.id}
                      onClick={() => setSelectedId(selectedId === p.id ? null : p.id)}
                      color={p.color || SPINE_COLORS[i % SPINE_COLORS.length]}
                    />
                  ))}
                </div>
                <span
                  className="mt-2 font-mono"
                  style={{
                    fontSize: 8,
                    color: "hsl(var(--gold) / 0.55)",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                  }}
                >
                  {category} / {String(grouped[category].length).padStart(2, "0")}
                </span>
              </div>
            ))}

            {/* Toolbox slot rightmost */}
            <div className="flex flex-col ml-auto">
              <div className="flex items-end">
                <ToolboxSlot />
              </div>
              <span
                className="mt-2 font-mono"
                style={{
                  fontSize: 8,
                  color: "hsl(var(--gold) / 0.55)",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                }}
              >
                NEXT / SKILLS
              </span>
            </div>
          </div>

          {/* bottom ledge edge */}
          <div className="h-2 mt-3" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.45), transparent)" }} />
        </div>

        {/* Detail card */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              key={selectedProject.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
              <div
                className="bg-card border border-border p-5 md:p-6 shadow-xl relative overflow-hidden mt-3"
                style={{ borderLeft: "1px solid hsl(var(--gold))" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="font-mono"
                    style={{ fontSize: 9, letterSpacing: "0.3em", color: "hsl(var(--muted-foreground))" }}
                  >
                    CASE_STUDY · {selectedProject.slug}
                  </span>
                  <button onClick={() => setSelectedId(null)} className="p-1 text-muted-foreground hover:text-card-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-start gap-3 mb-4">
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

      {yearRange && (
        <div className="text-center mt-3">
          <span className="text-[10px] tracking-[0.3em] uppercase font-mono" style={{ color: "hsl(var(--muted-foreground))" }}>
            Curated Work · {yearRange}
          </span>
        </div>
      )}
    </section>
  );
};

export default ProjectsShelfMinimal;
