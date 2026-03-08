import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    title: "Project One",
    subtitle: "A creative exploration in digital experiences",
    tags: ["React", "Design", "UI/UX"],
    year: "2025",
  },
  {
    title: "Project Two",
    subtitle: "Building connections through technology",
    tags: ["Full Stack", "Mobile", "API"],
    year: "2024",
  },
  {
    title: "Project Three",
    subtitle: "Where creativity meets functionality",
    tags: ["Creative", "Animation", "Web"],
    year: "2024",
  },
];

const WorkSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="work" className="py-24 md:py-32 px-6 md:px-12 lg:px-20">
      <div ref={ref} className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-primary" />
            <span className="font-mono text-xs tracking-[0.25em] uppercase text-primary">Portfolio</span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-foreground">
            Selected
            <br />
            <span className="font-serif-i italic font-normal text-foreground/50">work</span>
          </h2>
        </motion.div>

        {/* Projects list */}
        <div className="border-t border-foreground/10">
          {projects.map((project, index) => (
            <motion.a
              key={project.title}
              href="#"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group block border-b border-foreground/10 py-8 md:py-10 relative"
            >
              {/* Hover background */}
              <motion.div
                className="absolute inset-0 bg-foreground/[0.02]"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />

              <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-baseline gap-6">
                  <span className="font-mono text-[10px] tracking-[0.3em] text-foreground/20 w-8">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300 flex items-center gap-3">
                      {project.title}
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-1 group-hover:translate-y-0" />
                    </h3>
                    <p className="font-body text-sm text-foreground/30 mt-1">{project.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 ml-14 md:ml-0">
                  <div className="flex gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] tracking-wider uppercase text-foreground/25 border border-foreground/8 px-2.5 py-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="font-mono text-[10px] tracking-wider text-foreground/15 hidden md:block">
                    {project.year}
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* More coming */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 text-center"
        >
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-foreground/20">
            More projects in progress
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default WorkSection;
