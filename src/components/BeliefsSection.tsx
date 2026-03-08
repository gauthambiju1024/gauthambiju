import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const beliefs = [
  {
    number: "01",
    title: "Tirelessly pursue clarity.",
    body: "The best solutions are often the simplest. Strip away complexity to reveal what truly matters.",
  },
  {
    number: "02",
    title: "Obsess over the details.",
    body: "Every pixel, every interaction, every word contributes to the whole experience.",
  },
  {
    number: "03",
    title: "Build with empathy.",
    body: "Understanding people is the foundation of creating meaningful technology.",
  },
];

const BeliefsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-16 md:py-24 px-8 md:px-16">
      <div ref={ref} className="md:ml-8">
        {/* Handwritten section label */}
        <motion.p
          initial={{ opacity: 0, x: -10 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="font-handwritten text-xl mb-8"
          style={{ color: 'hsl(8 68% 45%)' }}
        >
          3 things I strongly believe in
        </motion.p>

        {/* Beliefs */}
        <div className="space-y-8">
          {beliefs.map((belief, index) => (
            <motion.div
              key={belief.number}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.12 * index }}
              className="group relative pl-10 py-4"
              style={{ borderBottom: '1px solid hsl(30 20% 78% / 0.3)' }}
            >
              <span
                className="absolute left-0 top-4 font-handwritten text-sm text-card-foreground/20"
              >
                {belief.number}
              </span>
              <h3 className="font-handwritten text-xl md:text-2xl font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                {belief.title}
              </h3>
              <p className="font-body text-sm text-card-foreground/45 leading-relaxed max-w-lg">
                {belief.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeliefsSection;
