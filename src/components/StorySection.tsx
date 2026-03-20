import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useSiteContent } from "@/hooks/useSiteData";

const defaultStats = [
  { value: "3+", label: "Years" },
  { value: "10+", label: "Projects" },
  { value: "100%", label: "Passion" },
];

const CountingStat = ({ value, label, isInView }: { value: string; label: string; isInView: boolean }) => {
  const [displayVal, setDisplayVal] = useState("0");
  const numericMatch = value.match(/^(\d+)/);
  const suffix = value.replace(/^\d+/, '');

  useEffect(() => {
    if (!isInView || !numericMatch) {
      if (!numericMatch) setDisplayVal(value);
      return;
    }
    const target = parseInt(numericMatch[1], 10);
    const duration = 1200;
    const steps = 30;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), target);
      setDisplayVal(String(current));
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, value, numericMatch]);

  return (
    <div>
      <span className="font-handwritten text-3xl md:text-4xl font-bold block" style={{ color: 'hsl(8 68% 45%)' }}>
        {numericMatch ? displayVal + suffix : value}
      </span>
      <span className="font-handwritten text-sm tracking-widest uppercase text-card-foreground/30">
        {label}
      </span>
    </div>
  );
};

const StorySection = () => {
  const ref = useRef<HTMLDivElement>(null!);
  const statsRef = useRef<HTMLDivElement>(null!);
  const isInView = useInView(statsRef, { once: true, amount: 0.5 });
  const { value: storyData } = useSiteContent('story', 'main');
  const { value: statsData } = useSiteContent('story', 'stats');

  const story = storyData as { heading?: string; body?: string } | null;
  const stats = (statsData as typeof defaultStats | null) ?? defaultStats;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end 0.5"],
  });

  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const headerY = useTransform(scrollYProgress, [0, 0.2], [30, 0]);
  const bodyOpacity = useTransform(scrollYProgress, [0.15, 0.4], [0, 1]);
  const bodyY = useTransform(scrollYProgress, [0.15, 0.4], [24, 0]);

  return (
    <section className="py-16 md:py-24 px-8 md:px-16">
      <div ref={ref} className="md:ml-8">
        <div className="grid md:grid-cols-[1fr_1.4fr] gap-10 md:gap-16 items-start">
          <motion.div
            style={{ opacity: headerOpacity, y: headerY }}
            className="md:sticky md:top-24"
          >
            <p className="font-handwritten text-xl mb-3" style={{ color: 'hsl(8 68% 45%)' }}>
              Background
            </p>
            <h2 className="font-handwritten text-3xl md:text-5xl font-bold tracking-tight text-card-foreground">
              My
              <span className="font-handwritten font-normal text-card-foreground/45 ml-2">journey</span>
            </h2>
          </motion.div>

          <motion.div style={{ opacity: bodyOpacity, y: bodyY }} className="space-y-5">
            <p className="font-handwritten text-xl md:text-2xl text-card-foreground/55 leading-relaxed">
              {story?.heading ?? "From curiosity to creation."}
            </p>
            <p className="font-handwritten text-base text-card-foreground/40 leading-relaxed">
              {story?.body ?? "Every project, every line of code, every design decision has been a step in a journey of learning, growing, and building things that matter. I believe the best work comes from genuine curiosity and an unwillingness to settle for \"good enough.\""}
            </p>

            <div ref={statsRef} className="grid grid-cols-3 gap-6 mt-8 pt-6" style={{ borderTop: '1px solid hsl(30 20% 78% / 0.4)' }}>
              {stats.map((stat) => (
                <CountingStat key={stat.label} value={stat.value} label={stat.label} isInView={isInView} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
