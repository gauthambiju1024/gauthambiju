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
    <section id="work" className="py-16 md:py-24 px-8 md:px-16 relative">
      {/* Tape decoration */}
      <div className="absolute top-4 left-16 tape-strip px-3 py-1 hidden md:block" style={{ transform: 'rotate(1deg)' }}>
        <span className="font-handwritten text-sm text-card-foreground/40">page 02</span>
      </div>

      <div ref={ref} className="md:ml-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="font-handwritten text-xl mb-3" style={{ color: 'hsl(8 68% 45%)' }}>
            Selected work
          </p>
          <h2 className="font-handwritten text-3xl md:text-5xl font-bold tracking-tight text-card-foreground">
            Things I've
            <span className="font-handwritten font-normal text-card-foreground/45 ml-2">built</span>
          </h2>
        </motion.div>

        {/* Projects */}
        <div style={{ borderTop: '1px solid hsl(30 20% 78% / 0.4)' }}>
          {projects.map((project, index) => (
            <motion.a
              key={project.title}
              href="#"
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group block py-6 md:py-8 relative"
              style={{ borderBottom: '1px solid hsl(30 20% 78% / 0.4)' }}
            >
              {/* Hover highlight */}
              <motion.div
                className="absolute inset-0 -mx-4 rounded-sm"
                style={{ background: 'hsl(8 68% 45% / 0.04)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                transition={{ duration: 0.25 }}
              />

              <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-baseline gap-5">
                  <span className="font-handwritten text-sm text-card-foreground/18 w-6">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-handwritten text-xl md:text-2xl font-semibold text-card-foreground group-hover:text-primary transition-colors duration-300 flex items-center gap-2">
                      {project.title}
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    </h3>
                    <p className="font-handwritten text-sm text-card-foreground/35 mt-0.5">{project.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-11 md:ml-0">
                  <div className="flex gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-handwritten text-xs tracking-wider uppercase text-card-foreground/25 px-2 py-0.5"
                        style={{ border: '1px solid hsl(30 20% 78% / 0.4)' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="font-handwritten text-sm text-card-foreground/15 hidden md:block">
                    {project.year}
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 font-handwritten text-base text-card-foreground/25 text-center"
        >
          More projects in progress...
        </motion.p>
      </div>
    </section>
  );
};

export default WorkSection;
