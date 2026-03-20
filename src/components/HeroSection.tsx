import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import heroPortrait from "@/assets/hero-portrait.png";
import { useSiteContent } from "@/hooks/useSiteData";

const defaultWords = ["Systems", "Products", "Markets", "Technology"];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

const HeroSection = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const { value: heroData } = useSiteContent('hero', 'main');
  const { value: wordsData } = useSiteContent('hero', 'rotating_words');
  const sectionRef = useRef<HTMLElement>(null!);

  const hero = heroData as { name?: string; tagline?: string; location?: string } | null;
  const rotatingWords = (wordsData as string[] | null) ?? defaultWords;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const portraitScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [rotatingWords.length]);

  return (
    <section ref={sectionRef} className="relative px-8 md:px-16 pt-8 pb-20 md:pt-12 md:pb-28 overflow-hidden">
      <div className="flex items-center">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-3xl md:ml-8 relative z-10 flex-1 my-0"
        >
          <motion.p variants={item} className="font-handwritten text-2xl md:text-3xl mb-2 text-primary">
            {hero?.name ?? "Gautham Biju"}
          </motion.p>

          <motion.p variants={item} className="font-handwritten text-base tracking-wide uppercase text-card-foreground/40 mb-6">
            {hero?.tagline ?? "Technology . Business . Design"}
          </motion.p>

          <motion.div variants={item} className="overflow-hidden mb-4">
            <h1 className="font-handwritten text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1] tracking-tight text-card-foreground my-[16px]">
              Ideas are easy.
            </h1>
          </motion.div>

          <motion.div variants={item} className="mb-8">
            <h1 className="font-handwritten text-[clamp(2.5rem,6vw,4.5rem)] leading-[1] text-card-foreground/50 whitespace-nowrap">
              <span className="inline-block overflow-hidden align-bottom" style={{ height: 'clamp(2.5rem,6vw,4.5rem)' }}>
                <AnimatePresence mode="wait">
                   <motion.span
                    key={rotatingWords[wordIndex]}
                    initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
                    animate={{ clipPath: 'inset(0 0 0% 0)', opacity: 1 }}
                    exit={{ clipPath: 'inset(100% 0 0 0)', opacity: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-block font-bold font-sans text-card-foreground relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left"
                    style={{ willChange: 'clip-path, opacity' }}
                  >
                    {rotatingWords[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
              {" "}change the world.
            </h1>
          </motion.div>

          <motion.p variants={item} className="text-sm tracking-wider text-card-foreground/30 font-mono">
            {hero?.location ?? "INDIA . + 5:30"}
          </motion.p>
        </motion.div>

        <motion.div
          style={{ y: portraitY, scale: portraitScale, willChange: 'transform' }}
          className="hidden md:block absolute top-0 right-0 w-[400px] lg:w-[520px] z-0"
        >
          <motion.img
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 0.9, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            src={heroPortrait}
            alt="Gautham portrait sketch"
            className="w-full h-auto mix-blend-multiply"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
