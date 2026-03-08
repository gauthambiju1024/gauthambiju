import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const StorySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-16 md:py-24 px-8 md:px-16">
      <div ref={ref} className="md:ml-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-[1fr_1.4fr] gap-10 md:gap-16 items-start"
        >
          {/* Left */}
          <div>
            <p className="font-handwritten text-xl mb-3" style={{ color: 'hsl(8 68% 45%)' }}>
              Background
            </p>
            <h2 className="font-handwritten text-3xl md:text-5xl font-bold tracking-tight text-card-foreground">
              My
              <span className="font-handwritten font-normal text-card-foreground/45 ml-2">journey</span>
            </h2>
          </div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-5"
          >
            <p className="font-handwritten text-xl md:text-2xl text-card-foreground/55 leading-relaxed">
              From curiosity to creation.
            </p>
            <p className="font-body text-sm text-card-foreground/40 leading-relaxed">
              Every project, every line of code, every design decision has been a step
              in a journey of learning, growing, and building things that matter.
              I believe the best work comes from genuine curiosity and an unwillingness
              to settle for "good enough."
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-8 pt-6" style={{ borderTop: '1px solid hsl(30 20% 78% / 0.4)' }}>
              {[
                { value: "3+", label: "Years" },
                { value: "10+", label: "Projects" },
                { value: "100%", label: "Passion" },
              ].map((stat) => (
                <div key={stat.label}>
                  <span className="font-display text-2xl md:text-3xl font-bold block" style={{ color: 'hsl(8 68% 45%)' }}>
                    {stat.value}
                  </span>
                  <span className="font-mono text-[10px] tracking-widest uppercase text-card-foreground/30">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default StorySection;
