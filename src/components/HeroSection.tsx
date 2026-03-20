import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import heroPortrait from "@/assets/hero-portrait.png";
import { useSiteContent } from "@/hooks/useSiteData";

const defaultWords = ["products", "systems", "platforms", "experiences"];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};

const item = {
  hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
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
          <motion.p variants={item} className="font-serif-i italic text-2xl md:text-3xl mb-6 text-primary">
            {hero?.name ?? "Gautham Biju"}
          </motion.p>

          <motion.div variants={item} className="overflow-hidden mb-2">
            <h1 className="font-serif-i italic text-[clamp(2.5rem,7vw,5.5rem)] leading-[1.05] text-card-foreground/40">
              I'm learning to build
            </h1>
          </motion.div>

          <motion.div variants={item} className="mb-2">
            <div className="overflow-hidden" style={{ height: 'clamp(3.5rem,8.5vw,6.5rem)' }}>
              <AnimatePresence mode="wait">
                <motion.h1
                  key={rotatingWords[wordIndex]}
                  initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
                  animate={{ clipPath: 'inset(0 0 0% 0)', opacity: 1 }}
                  exit={{ clipPath: 'inset(100% 0 0 0)', opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="font-sans font-bold text-[clamp(3.5rem,8vw,6.5rem)] leading-[1] text-card-foreground relative inline-block after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left"
                  style={{ willChange: 'clip-path, opacity' }}
                >
                  {rotatingWords[wordIndex]}
                </motion.h1>
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div variants={item} className="mb-8">
            <h1 className="font-serif-i italic text-[clamp(2.5rem,7vw,5.5rem)] leading-[1.05] text-card-foreground/40">
              for problems worth solving.
            </h1>
          </motion.div>

          <motion.p variants={item} className="text-[11px] tracking-[0.25em] uppercase text-card-foreground/25 font-mono mb-6">
            At the intersection of Technology · Business · Design
          </motion.p>

          <motion.p variants={item} className="text-sm tracking-wider text-card-foreground/30 font-mono">
            {hero?.location ?? "INDIA . + 5:30"}
          </motion.p>
        </motion.div>

        <motion.div
          style={{ y: portraitY, scale: portraitScale }}
          className="hidden md:block absolute top-0 right-0 bottom-0 w-[50%] z-0"
        >
          <motion.img
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 0.85, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            src={heroPortrait}
            alt="Gautham portrait sketch"
            className="w-full h-full object-cover object-top mix-blend-multiply"
            loading="lazy"
            style={{
              maskImage: 'linear-gradient(to left, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, transparent 100%), linear-gradient(to top, transparent 0%, rgba(0,0,0,1) 30%)',
              maskComposite: 'intersect',
              WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, transparent 100%), linear-gradient(to top, transparent 0%, rgba(0,0,0,1) 30%)',
              WebkitMaskComposite: 'source-in',
            }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
