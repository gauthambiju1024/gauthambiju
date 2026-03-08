import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ExternalLink, Briefcase, PenTool, ArrowRight } from "lucide-react";
import DraggableSticker from "./DraggableSticker";

const projects = [
  {
    title: "Project One",
    description: "A creative exploration in digital experiences",
    tags: ["React", "Design", "UI/UX"],
    color: "from-[hsl(15_70%_50%/0.12)] to-secondary",
    rotation: -1,
  },
  {
    title: "Project Two", 
    description: "Building connections through technology",
    tags: ["Full Stack", "Mobile", "API"],
    color: "from-secondary to-muted",
    rotation: 0.5,
  },
  {
    title: "Project Three",
    description: "Where creativity meets functionality",
    tags: ["Creative", "Animation", "Web"],
    color: "from-muted to-[hsl(15_70%_50%/0.08)]",
    rotation: -0.5,
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const projectVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

const WorkSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="work" className="py-16 px-8 md:px-16 relative">
      {/* Decorative divider */}
      <div className="doodle-divider mb-12" />
      
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div className="flex items-center gap-4 mb-2">
          <motion.h2 
            variants={projectVariants}
            className="font-handwritten text-4xl text-primary"
          >
            Selected work
          </motion.h2>
          <DraggableSticker initialRotation={-10}>
            <motion.div 
              className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Briefcase className="w-5 h-5 text-primary" />
            </motion.div>
          </DraggableSticker>
        </div>
        
        <motion.div 
          variants={projectVariants}
          className="w-24 h-1 bg-primary/30 mb-12 rounded-full" 
        />
        
        <div className="grid gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              variants={projectVariants}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              whileHover={{ 
                scale: 1.02,
                rotate: project.rotation,
              }}
              whileTap={{ scale: 0.98 }}
              style={{ rotate: `${project.rotation}deg` }}
              className={`relative p-6 rounded-lg bg-gradient-to-r ${project.color} 
                         cursor-pointer group overflow-hidden page-curl`}
            >
              {/* Animated background pattern on hover */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  backgroundImage: `radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.1) 0%, transparent 50%)`,
                }}
              />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-2xl text-card-foreground group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ 
                        opacity: hoveredIndex === index ? 1 : 0,
                        x: hoveredIndex === index ? 0 : -10
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <ExternalLink className="w-4 h-4 text-primary" />
                    </motion.span>
                  </div>
                  <p className="font-body text-muted-foreground mt-1">
                    {project.description}
                  </p>
                  {/* Learn More link */}
                  <motion.span
                    className="inline-flex items-center gap-1 mt-2 font-handwritten text-base text-primary/60 
                               group-hover:text-primary transition-colors"
                    animate={{
                      x: hoveredIndex === index ? 4 : 0,
                    }}
                  >
                    Learn More <ArrowRight className="w-3.5 h-3.5" />
                  </motion.span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + tagIndex * 0.1 }}
                      whileHover={{ scale: 1.1, rotate: 3 }}
                      className="px-3 py-1 bg-card/70 rounded-full text-sm font-handwritten 
                               text-card-foreground shadow-sm"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </div>
              
              {/* Decorative tape */}
              {index === 0 && (
                <div className="absolute -top-1 left-10 w-16 h-6 bg-primary/20 
                              transform rotate-[-5deg] hidden md:block" />
              )}
            </motion.div>
          ))}
        </div>

        <motion.div 
          variants={projectVariants}
          className="text-center mt-10"
        >
          <motion.p 
            className="font-handwritten text-xl text-muted-foreground inline-flex items-center gap-2"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <PenTool className="w-5 h-5 text-primary" />
            More projects coming soon...
          </motion.p>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default WorkSection;
