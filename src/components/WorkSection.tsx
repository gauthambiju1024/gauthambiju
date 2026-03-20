import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useProjects } from "@/hooks/useSiteData";

const fallbackProjects = [
  { id: '1', title: "Project One", subtitle: "A creative exploration in digital experiences", tags: ["React", "Design", "UI/UX"], year: "2025", url: "#" },
  { id: '2', title: "Project Two", subtitle: "Building connections through technology", tags: ["Full Stack", "Mobile", "API"], year: "2024", url: "#" },
  { id: '3', title: "Project Three", subtitle: "Where creativity meets functionality", tags: ["Creative", "Animation", "Web"], year: "2024", url: "#" },
];

interface ProjectRowProps {
  project: { id: string; title: string; subtitle: string | null; tags: string[] | null; year: string | null; url: string | null };
  index: number;
  scrollYProgress: MotionValue<number>;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

const ProjectRow = ({ project, index, scrollYProgress, isHovered, onHover, onLeave }: ProjectRowProps) => {
  const start = 0.15 + index * 0.12;
  const end = start + 0.18;
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const y = useTransform(scrollYProgress, [start, end], [30, 0]);

  return (
    <motion.a
      href={project.url || '#'}
      target={project.url && project.url !== '#' ? '_blank' : undefined}
      rel="noopener noreferrer"
      style={{ opacity, y }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="group block py-6 md:py-8 relative"
    >
      <div style={{ borderBottom: '1px solid hsl(30 20% 78% / 0.4)' }} className="absolute bottom-0 left-0 right-0" />
      <motion.div
        className="absolute inset-0 -mx-4 rounded-sm"
        style={{ background: 'hsl(8 68% 45% / 0.04)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
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
            {(project.tags ?? []).map((tag) => (
              <span key={tag} className="font-handwritten text-xs tracking-wider uppercase text-card-foreground/25 px-2 py-0.5" style={{ border: '1px solid hsl(30 20% 78% / 0.4)' }}>
                {tag}
              </span>
            ))}
          </div>
          <span className="font-handwritten text-sm text-card-foreground/15 hidden md:block">{project.year}</span>
        </div>
      </div>
    </motion.a>
  );
};

const WorkSection = () => {
  const ref = useRef<HTMLDivElement>(null!);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { projects: dbProjects, loading } = useProjects();
  const projects = dbProjects.length > 0 ? dbProjects : (loading ? [] : fallbackProjects);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end 0.6"],
  });

  const headerOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);
  const headerY = useTransform(scrollYProgress, [0, 0.15], [30, 0]);
  const footerOpacity = useTransform(scrollYProgress, [0.8, 1], [0, 1]);

  return (
    <section className="py-16 md:py-24 px-8 md:px-16 relative">
      <div className="absolute top-4 left-16 tape-strip px-3 py-1 hidden md:block" style={{ transform: 'rotate(1deg)' }}>
        <span className="font-handwritten text-sm text-card-foreground/40">page 02</span>
      </div>

      <div ref={ref} className="md:ml-8">
        <motion.div style={{ opacity: headerOpacity, y: headerY }} className="mb-12">
          <p className="font-handwritten text-xl mb-3" style={{ color: 'hsl(8 68% 45%)' }}>Selected work</p>
          <h2 className="font-handwritten text-3xl md:text-5xl font-bold tracking-tight text-card-foreground">
            Things I've<span className="font-handwritten font-normal text-card-foreground/45 ml-2">built</span>
          </h2>
        </motion.div>

        <div style={{ borderTop: '1px solid hsl(30 20% 78% / 0.4)' }}>
          {projects.map((project, index) => (
            <ProjectRow
              key={project.id}
              project={project}
              index={index}
              scrollYProgress={scrollYProgress}
              isHovered={hoveredIndex === index}
              onHover={() => setHoveredIndex(index)}
              onLeave={() => setHoveredIndex(null)}
            />
          ))}
        </div>

        <motion.p style={{ opacity: footerOpacity }} className="mt-8 font-handwritten text-base text-card-foreground/25 text-center">
          More projects in progress...
        </motion.p>
      </div>
    </section>
  );
};

export default WorkSection;
