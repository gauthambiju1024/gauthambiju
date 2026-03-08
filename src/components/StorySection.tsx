import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const StorySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 lg:px-20">
      <div ref={ref} className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="grid md:grid-cols-[1fr_1.2fr] gap-12 md:gap-20 items-start"
        >
          {/* Left */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-primary" />
              <span className="font-mono text-xs tracking-[0.25em] uppercase text-primary">Background</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-2">
              My
              <br />
              <span className="font-serif-i italic font-normal text-foreground/50">journey</span>
            </h2>
          </div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <p className="font-serif-i italic text-xl md:text-2xl text-foreground/60 leading-relaxed">
              From curiosity to creation.
            </p>
            <p className="font-body text-sm text-foreground/40 leading-relaxed">
              Every project, every line of code, every design decision has been a step
              in a journey of learning, growing, and building things that matter.
              I believe the best work comes from genuine curiosity and an unwillingness
              to settle for "good enough."
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-px bg-foreground/5 mt-10">
              {[
                { value: "3+", label: "Years" },
                { value: "10+", label: "Projects" },
                { value: "100%", label: "Passion" },
              ].map((stat) => (
                <div key={stat.label} className="bg-background py-6 pr-4">
                  <span className="font-display text-2xl md:text-3xl font-bold text-primary block">
                    {stat.value}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-foreground/30">
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
