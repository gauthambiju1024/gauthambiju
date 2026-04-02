import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useProjects } from "@/hooks/useSiteData";

const fallbackProjects = [
  { id: '1', title: "Project One", subtitle: "A creative exploration in digital experiences", tags: ["React", "Design", "UI/UX"], year: "2025", url: "#" },
  { id: '2', title: "Project Two", subtitle: "Building connections through technology", tags: ["Full Stack", "Mobile", "API"], year: "2024", url: "#" },
  { id: '3', title: "Project Three", subtitle: "Where creativity meets functionality", tags: ["Creative", "Animation", "Web"], year: "2024", url: "#" },
];

const WorkSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { projects: dbProjects, loading } = useProjects();
  const projects = dbProjects.length > 0 ? dbProjects : (loading ? [] : fallbackProjects);

  return (
    <section className="py-16 md:py-24 px-8 md:px-16 relative">

      <div className="md:ml-8">
        <div className="mb-12">
          <p className="font-handwritten text-xl mb-3" style={{ color: 'hsl(8 68% 45%)' }}>Selected work</p>
          <h2 className="font-handwritten text-3xl md:text-5xl font-bold tracking-tight text-card-foreground">
            Things I've<span className="font-handwritten font-normal text-card-foreground/45 ml-2">built</span>
          </h2>
        </div>

        <div style={{ borderTop: '1px solid hsl(30 20% 78% / 0.4)' }}>
          {projects.map((project, index) => (
            <a
              key={project.id}
              href={project.url || '#'}
              target={project.url && project.url !== '#' ? '_blank' : undefined}
              rel="noopener noreferrer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group block py-6 md:py-8 relative"
            >
              <div style={{ borderBottom: '1px solid hsl(30 20% 78% / 0.4)' }} className="absolute bottom-0 left-0 right-0" />
              {hoveredIndex === index && (
                <div className="absolute inset-0 -mx-4 rounded-sm" style={{ background: 'hsl(8 68% 45% / 0.04)' }} />
              )}
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
            </a>
          ))}
        </div>

        <p className="mt-8 font-handwritten text-base text-card-foreground/25 text-center">
          More projects in progress...
        </p>
      </div>
    </section>
  );
};

export default WorkSection;
