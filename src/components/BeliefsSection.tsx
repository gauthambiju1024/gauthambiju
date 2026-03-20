import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";
import { useSiteContent } from "@/hooks/useSiteData";

const defaultBeliefs = [
  { number: "01", title: "Tirelessly pursue clarity.", body: "The best solutions are often the simplest. Strip away complexity to reveal what truly matters." },
  { number: "02", title: "Obsess over the details.", body: "Every pixel, every interaction, every word contributes to the whole experience." },
  { number: "03", title: "Build with empathy.", body: "Understanding people is the foundation of creating meaningful technology." },
];

const BeliefItem = ({ belief, index, scrollYProgress }: { belief: typeof defaultBeliefs[0]; index: number; scrollYProgress: MotionValue<number> }) => {
  const start = 0.1 + index * 0.2;
  const end = start + 0.25;
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const y = useTransform(scrollYProgress, [start, end], [40, 0]);

  return (
    <motion.div style={{ opacity, y }} className="group relative pl-10 py-4">
      <div style={{ borderBottom: '1px solid hsl(30 20% 78% / 0.3)' }} className="absolute inset-0 pointer-events-none" />
      {/* Left accent border on hover */}
      <div className="absolute left-0 top-4 bottom-4 w-[2px] bg-primary/0 group-hover:bg-primary/40 transition-all duration-500 rounded-full" />
      <span className="absolute left-0 top-4 font-handwritten text-sm text-card-foreground/20">{belief.number}</span>
      <h3 className="font-handwritten text-xl md:text-2xl font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors duration-300">{belief.title}</h3>
      <p className="font-handwritten text-base text-card-foreground/45 leading-relaxed max-w-lg">{belief.body}</p>
    </motion.div>
  );
};

const BeliefsSection = () => {
  const ref = useRef<HTMLDivElement>(null!);
  const { value } = useSiteContent('beliefs', 'items');
  const beliefs = (value as typeof defaultBeliefs | null) ?? defaultBeliefs;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end 0.7"] });
  const headerOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);
  const headerX = useTransform(scrollYProgress, [0, 0.15], [-20, 0]);

  return (
    <section className="py-16 md:py-24 px-8 md:px-16">
      <div ref={ref} className="md:ml-8">
        <motion.p style={{ opacity: headerOpacity, x: headerX }} className="font-handwritten text-xl mb-8">
          <span style={{ color: 'hsl(8 68% 45%)' }}>{beliefs.length} things I strongly believe in</span>
        </motion.p>
        <div className="space-y-8">
          {beliefs.map((belief, index) => (
            <BeliefItem key={belief.number} belief={belief} index={index} scrollYProgress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeliefsSection;
