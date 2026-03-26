import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { useProjects } from "@/hooks/useSiteData";

interface BookProject {
  id: string;
  title: string;
  subtitle: string;
  tags: string[];
  year: string;
  url: string;
  color: string;
  problem?: string;
  role?: string;
  contribution?: string;
  stack?: string;
  impact?: string;
}

const fallbackProjects: BookProject[] = [
  {
    id: "1", title: "Homeofarm", subtitle: "Smart agriculture platform", tags: ["AgriTech", "IoT"], year: "2024",
    url: "#", color: "hsl(140 15% 32%)",
    problem: "Small-scale farmers lack access to data-driven farming decisions",
    role: "Product Lead", contribution: "End-to-end product design and development",
    stack: "React · Supabase · IoT", impact: "Enabled precision farming for 100+ farmers"
  },
  {
    id: "2", title: "Drishti", subtitle: "AI-powered visual analysis", tags: ["AI", "Computer Vision"], year: "2024",
    url: "#", color: "hsl(215 20% 30%)",
    problem: "Manual visual inspection is slow and error-prone",
    role: "Builder", contribution: "ML pipeline and product interface design",
    stack: "Python · TensorFlow · React", impact: "Reduced inspection time by 60%"
  },
  {
    id: "3", title: "Classy", subtitle: "Academic collaboration tool", tags: ["EdTech", "SaaS"], year: "2023",
    url: "#", color: "hsl(30 12% 28%)",
    problem: "Students struggle with fragmented class resources and communication",
    role: "Full-stack Developer", contribution: "Architecture, UI/UX, and backend design",
    stack: "React · Node.js · PostgreSQL", impact: "Used by 500+ students"
  },
  {
    id: "4", title: "Vaidya", subtitle: "Healthcare intelligence system", tags: ["HealthTech", "AI"], year: "2023",
    url: "#", color: "hsl(200 15% 26%)",
    problem: "Healthcare providers lack unified patient intelligence",
    role: "Product Designer", contribution: "User research, information architecture, prototype",
    stack: "Figma · React · FHIR", impact: "Streamlined clinical workflows"
  },
];

const ProjectsShelf = () => {
  const [selectedBook, setSelectedBook] = useState<BookProject | null>(null);
  const { projects: dbProjects } = useProjects();

  const projects: BookProject[] = dbProjects.length > 0
    ? dbProjects.map((p, i) => ({
        ...p,
        subtitle: p.subtitle ?? "",
        tags: p.tags ?? [],
        year: p.year ?? "",
        url: p.url ?? "#",
        color: fallbackProjects[i % fallbackProjects.length].color,
        problem: fallbackProjects[i % fallbackProjects.length]?.problem,
        role: fallbackProjects[i % fallbackProjects.length]?.role,
        contribution: fallbackProjects[i % fallbackProjects.length]?.contribution,
        stack: fallbackProjects[i % fallbackProjects.length]?.stack,
        impact: fallbackProjects[i % fallbackProjects.length]?.impact,
      }))
    : fallbackProjects;

  return (
    <section className="py-16 md:py-24">
      {/* Section label */}
      <div className="px-6 md:px-16 flex items-center gap-3 mb-12">
        <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-mono">page 03</span>
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-mono">Projects</span>
      </div>

      <div className="px-6 md:px-16 mb-10">
        <h2 className="font-serif-display text-3xl md:text-4xl text-card-foreground leading-tight">
          Selected Work
        </h2>
        <p className="mt-3 font-body text-sm text-muted-foreground">
          Each project is a book. Hover to pull from the shelf.
        </p>
      </div>

      {/* Shelf */}
      <div className="shelf-bg rounded-lg mx-4 md:mx-12 p-8 md:p-12 relative overflow-hidden">
        {/* Shelf ledge top */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-card-foreground/10 to-transparent" />

        {/* Books row */}
        <div className="flex gap-4 md:gap-6 justify-center items-end min-h-[280px] md:min-h-[360px] overflow-x-auto pb-4">
          {projects.map((project, i) => (
            <motion.button
              key={project.id}
              onClick={() => setSelectedBook(project)}
              className="relative flex-shrink-0 cursor-pointer group"
              style={{ perspective: "800px" }}
              whileHover={{ y: -12 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <motion.div
                className="relative rounded-sm overflow-hidden shadow-lg"
                style={{
                  width: `${48 + (i % 3) * 8}px`,
                  height: `${220 + (i % 2) * 40}px`,
                  backgroundColor: project.color,
                }}
                whileHover={{
                  rotateY: -8,
                  boxShadow: "8px 8px 24px rgba(0,0,0,0.4)",
                }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                {/* Spine edge highlight */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-r from-white/15 to-transparent" />

                {/* Title vertical */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="text-white/80 text-[10px] md:text-xs font-display font-semibold tracking-[0.15em] uppercase"
                    style={{ writingMode: "vertical-lr", textOrientation: "mixed" }}
                  >
                    {project.title}
                  </span>
                </div>

                {/* Category label bottom */}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                  <span className="text-white/30 text-[7px] font-mono tracking-wider uppercase"
                    style={{ writingMode: "vertical-lr" }}>
                    {project.tags[0] ?? ""}
                  </span>
                </div>

                {/* Year top */}
                <div className="absolute top-3 left-0 right-0 flex justify-center">
                  <span className="text-white/25 text-[7px] font-mono"
                    style={{ writingMode: "vertical-lr" }}>
                    {project.year}
                  </span>
                </div>
              </motion.div>

              {/* Book bottom shadow */}
              <div className="h-1 mx-1 bg-black/20 rounded-b-sm blur-[1px]" />
            </motion.button>
          ))}

          {/* Archive slot */}
          <motion.div
            className="flex-shrink-0 rounded-sm border-2 border-dashed border-white/10 flex items-center justify-center"
            style={{ width: "44px", height: "220px" }}
            whileHover={{ borderColor: "rgba(255,255,255,0.2)" }}
          >
            <span className="text-white/20 text-[8px] font-mono tracking-wider uppercase"
              style={{ writingMode: "vertical-lr" }}>
              Archive
            </span>
          </motion.div>
        </div>

        {/* Shelf ledge bottom */}
        <div className="mt-4 h-3 rounded-b-sm bg-gradient-to-t from-black/30 to-black/10 shadow-[0_4px_12px_rgba(0,0,0,0.3)]" />
      </div>

      {/* Book detail modal */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedBook(null)} />
            <motion.div
              className="relative bg-card rounded-lg shadow-2xl max-w-2xl w-full p-8 md:p-10 border border-border"
              initial={{ scale: 0.9, opacity: 0, rotateY: -10 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
              <button
                onClick={() => setSelectedBook(null)}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-card-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-start gap-2 mb-1">
                <div className="w-1 h-8 rounded-full" style={{ backgroundColor: selectedBook.color }} />
                <div>
                  <h3 className="font-serif-display text-2xl md:text-3xl text-card-foreground">{selectedBook.title}</h3>
                  <p className="text-sm text-muted-foreground font-body">{selectedBook.subtitle}</p>
                </div>
              </div>

              <div className="mt-6 space-y-5 font-body text-sm">
                {selectedBook.problem && (
                  <div>
                    <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground">Problem</span>
                    <p className="mt-1 text-card-foreground/80">{selectedBook.problem}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  {selectedBook.role && (
                    <div>
                      <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground">Role</span>
                      <p className="mt-1 text-card-foreground/80">{selectedBook.role}</p>
                    </div>
                  )}
                  {selectedBook.stack && (
                    <div>
                      <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground">Stack</span>
                      <p className="mt-1 text-card-foreground/80">{selectedBook.stack}</p>
                    </div>
                  )}
                </div>
                {selectedBook.contribution && (
                  <div>
                    <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground">Contribution</span>
                    <p className="mt-1 text-card-foreground/80">{selectedBook.contribution}</p>
                  </div>
                )}
                {selectedBook.impact && (
                  <div>
                    <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground">Impact</span>
                    <p className="mt-1 text-card-foreground/80">{selectedBook.impact}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center gap-3">
                <div className="flex gap-2">
                  {selectedBook.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 text-[10px] font-mono border border-border rounded-sm text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
                {selectedBook.url && selectedBook.url !== "#" && (
                  <a href={selectedBook.url} target="_blank" rel="noopener noreferrer"
                    className="ml-auto flex items-center gap-1 text-xs font-mono text-primary hover:underline">
                    View Project <ArrowUpRight className="w-3 h-3" />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProjectsShelf;
