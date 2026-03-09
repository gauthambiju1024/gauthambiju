import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import heroPortrait from "@/assets/hero-portrait.png";
import { useSiteContent } from "@/hooks/useSiteData";

const defaultWords = ["Systems", "Products", "Markets", "Technology"];

const HeroSection = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const { value: heroData } = useSiteContent('hero', 'main');
  const { value: wordsData } = useSiteContent('hero', 'rotating_words');

  const hero = heroData as { name?: string; tagline?: string; location?: string } | null;
  const rotatingWords = (wordsData as string[] | null) ?? defaultWords;

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [rotatingWords.length]);

  return (
    <section id="about" className="relative px-8 md:px-16 pt-8 pb-20 md:pt-12 md:pb-28 overflow-hidden">
      <div className="flex items-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-3xl md:ml-8 relative z-10 flex-1 my-0"
        >
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="font-handwritten text-2xl md:text-3xl mb-2 text-primary"
          >
            {hero?.name ?? "Gautham Biju"}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="font-handwritten text-base tracking-wide uppercase text-card-foreground/40 mb-6"
          >
            {hero?.tagline ?? "Technology . Business . Design"}
          </motion.p>

          <div className="overflow-hidden mb-4">
            <motion.h1
              initial={{ y: 80 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="font-handwritten text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1] tracking-tight text-card-foreground my-[16px]"
            >
              Ideas are easy.
            </motion.h1>
          </div>
          <div className="mb-8">
            <motion.h1
              initial={{ y: 80 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="font-handwritten text-[clamp(2.5rem,6vw,4.5rem)] leading-[1] text-card-foreground/50 whitespace-nowrap"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={rotatingWords[wordIndex]}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block font-bold font-sans text-card-foreground relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left"
                >
                  {rotatingWords[wordIndex]}
                </motion.span>
              </AnimatePresence>
              {" "}change the world.
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="text-sm tracking-wider text-card-foreground/30 font-mono"
          >
            {hero?.location ?? "INDIA . + 5:30"}
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="hidden md:block absolute top-0 right-0 w-[400px] lg:w-[520px] z-0"
        >
          <img src={heroPortrait} alt="Gautham portrait sketch" className="w-full h-auto mix-blend-multiply opacity-90" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
