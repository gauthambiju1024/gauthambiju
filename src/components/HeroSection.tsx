import { motion } from "framer-motion";
import heroPortrait from "@/assets/hero-portrait.png";
import { useSiteContent } from "@/hooks/useSiteData";
import { MorphingText } from "./MorphingText";
import { ArrowUpRight } from "lucide-react";
import Navigation from "./Navigation";

const defaultWords = ["products", "systems", "platforms", "experiences"];

const HeroSection = () => {
  const { value: heroData, loading: heroLoading } = useSiteContent('hero', 'main');
  const { value: wordsData } = useSiteContent('hero', 'rotating_words');

  const hero = heroData as { name?: string; tagline?: string; location?: string; portrait?: string } | null;
  const rotatingWords = (wordsData as string[] | null) ?? defaultWords;
  const portraitSrc = hero?.portrait || heroPortrait;

  return (
    <section className="relative px-6 md:px-12 pt-6 pb-0 overflow-hidden">
      {/* Top bar */}
      <motion.div
        className="flex items-center justify-between mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase font-mono" style={{ color: 'hsl(40 30% 85%)' }}>
          {hero?.name ?? "Gautham Biju"}
        </span>
        <span className="text-[9px] tracking-[0.2em] uppercase font-mono" style={{ color: 'hsl(0 0% 100% / 0.3)' }}>
          Field Notes / {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </span>
      </motion.div>

      {/* Tagline box */}
      <motion.div
        className="flex items-center gap-3 mb-10"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
      >
        <div className="w-6 h-6 border flex items-center justify-center" style={{ borderColor: 'hsl(0 0% 100% / 0.2)' }}>
          <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 100% / 0.4)' }}>#</span>
        </div>
        <div className="px-3 py-1.5 border" style={{ borderColor: 'hsl(0 0% 100% / 0.15)' }}>
          <span className="text-[9px] tracking-[0.25em] uppercase font-mono" style={{ color: 'hsl(0 0% 100% / 0.35)' }}>
            Intersection of Technology · Business · Design
          </span>
        </div>
      </motion.div>

      <div className="flex items-start gap-8 md:gap-12">
        {/* Left — Headline */}
        <div className="flex-1 relative z-10">
          {/* Dashed annotation arrow */}
          <motion.div
            className="flex items-center gap-2 mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 100% / 0.2)' }}>{'--->'}</span>
          </motion.div>

          <div className="mb-2">
            <h1 className="font-handwritten text-[clamp(2.2rem,5.5vw,4rem)] leading-[1.1] construct-text" style={{ '--construct-color': 'hsl(40 30% 85% / 0.5)' } as React.CSSProperties}>
              I'm learning to build
            </h1>
          </div>

          {/* Morphing word with dashed box */}
          <div className="mb-2 py-1 relative">
            <div className="border border-dashed inline-block px-3 py-1" style={{ borderColor: 'hsl(0 0% 100% / 0.2)' }}>
              <MorphingText
                words={rotatingWords}
                className="text-[clamp(2.8rem,6.5vw,5rem)] leading-[1.15]"
                interval={3500}
              />
            </div>
            {/* Label tag connected to dashed box */}
            <span className="hidden md:inline-block ml-3 text-[8px] font-mono tracking-wider" style={{ color: 'hsl(0 0% 100% / 0.25)' }}>
              {'--- [ ROTATING ]'}
            </span>
          </div>

          <div className="mb-10">
            <h1 className="font-handwritten text-[clamp(2.2rem,5.5vw,4rem)] leading-[1.1] construct-text" style={{ '--construct-color': 'hsl(40 30% 85% / 0.5)' } as React.CSSProperties}>
              for problems worth solving.
            </h1>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-5 py-2.5 text-xs font-mono tracking-wider uppercase rounded-sm hover:opacity-90 transition-opacity flex items-center gap-1.5"
              style={{ background: 'hsl(40 30% 90%)', color: 'hsl(160 20% 16%)' }}
            >
              View Work <ArrowUpRight className="w-3 h-3" />
            </button>
            <a
              href="#"
              className="px-5 py-2.5 border text-xs font-mono tracking-wider uppercase rounded-sm hover:opacity-80 transition-opacity"
              style={{ borderColor: 'hsl(0 0% 100% / 0.2)', color: 'hsl(40 30% 85%)' }}
            >
              Resume
            </a>
          </div>
        </div>

        {/* Right — Portrait */}
        <motion.div
          className="hidden md:flex flex-col items-center gap-2 relative z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: heroLoading ? 0 : 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile label */}
          <span className="text-[8px] font-mono tracking-[0.3em] uppercase" style={{ color: 'hsl(0 0% 100% / 0.3)' }}>
            — Profile —
          </span>

          {/* Portrait with corner brackets */}
          <div className="relative">
            <div className="corner-brackets">
              <img
                src={portraitSrc}
                alt="Gautham portrait"
                className="w-[180px] lg:w-[220px] h-auto border"
                style={{ borderColor: 'hsl(0 0% 100% / 0.15)', filter: 'grayscale(0.3)' }}
              />
            </div>

            {/* Right-side vertical dimension */}
            <div className="absolute top-0 -right-8 h-full flex flex-col items-center justify-center">
              <div className="w-px h-full" style={{ background: 'hsl(0 0% 100% / 0.15)' }} />
              <span className="text-[7px] font-mono absolute rotate-90" style={{ color: 'hsl(0 0% 100% / 0.2)' }}>2E00</span>
            </div>
          </div>

          {/* Bottom dimension line */}
          <div className="dimension-line w-[180px] lg:w-[220px]">
            <span>160 PX</span>
          </div>

          {/* Descriptor */}
          <span className="text-[8px] font-mono tracking-[0.2em] uppercase mt-1" style={{ color: 'hsl(0 0% 100% / 0.25)' }}>
            Builder · Thinker · Maker
          </span>
        </motion.div>
      </div>

      {/* Navigation at bottom */}
      <div className="mt-4 border-t" style={{ borderColor: 'hsl(0 0% 100% / 0.08)' }}>
        <Navigation embedded />
      </div>
    </section>
  );
};

export default HeroSection;
