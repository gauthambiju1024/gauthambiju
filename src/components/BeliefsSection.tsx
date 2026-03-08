import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const beliefs = [
  {
    number: "01",
    title: "Simplicity wins",
    body: "The best solutions are often the simplest. Strip away complexity to reveal what truly matters.",
  },
  {
    number: "02",
    title: "Details matter",
    body: "Every pixel, every interaction, every word contributes to the whole experience.",
  },
  {
    number: "03",
    title: "Build with empathy",
    body: "Understanding people is the foundation of creating meaningful technology.",
  },
];

const BeliefsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 lg:px-20">
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
            <span className="font-mono text-xs tracking-[0.25em] uppercase text-primary">Principles</span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-foreground">
            Three things I
            <br />
            <span className="font-serif-i italic font-normal text-foreground/50">strongly believe in</span>
          </h2>
        </motion.div>

        {/* Beliefs grid */}
        <div className="grid md:grid-cols-3 gap-px bg-foreground/5">
          {beliefs.map((belief, index) => (
            <motion.div
              key={belief.number}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 * index }}
              className="group bg-background p-8 md:p-10 relative"
            >
              {/* Corner marks on first item */}
              {index === 0 && <div className="corner-marks absolute inset-4 pointer-events-none" />}

              <span className="font-mono text-[10px] tracking-[0.3em] text-foreground/20 block mb-6">
                {belief.number}
              </span>
              <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                {belief.title}
              </h3>
              <p className="font-body text-sm text-foreground/40 leading-relaxed">
                {belief.body}
              </p>

              {/* Bottom accent line on hover */}
              <div className="absolute bottom-0 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeliefsSection;
