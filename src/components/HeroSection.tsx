import { motion } from "framer-motion";
import { useSiteContent } from "@/hooks/useSiteData";
import { MorphingText } from "./MorphingText";
import { ArrowUpRight } from "lucide-react";

const defaultWords = ["products", "systems", "platforms", "experiences"];

const HeroSection = () => {
  const { value: heroData } = useSiteContent('hero', 'main');
  const { value: wordsData } = useSiteContent('hero', 'rotating_words');

  const hero = heroData as { name?: string; tagline?: string; location?: string } | null;
  const rotatingWords = (wordsData as string[] | null) ?? defaultWords;

  return (
    <section className="relative px-6 md:px-12 pt-4 pb-2 overflow-visible h-full flex flex-col justify-center">
      {/* Top bar */}
      <motion.div
        className="flex items-center justify-between mb-5"
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
        className="flex items-center gap-3 mb-6"
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
          <motion.div
            className="flex items-center gap-2 mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 100% / 0.2)' }}>{'--->'}</span>
          </motion.div>

          <div className="mb-2">
            <h1 className="font-handwritten text-[clamp(2.2rem,5.5vw,4rem)] leading-[1.1]" style={{ color: 'hsl(40 30% 85% / 0.5)' }}>
              I'm learning to build
            </h1>
          </div>

          <div className="mb-2 py-1 relative">
            <div className="border border-dashed inline-block px-3 py-1" style={{ borderColor: 'hsl(0 0% 100% / 0.2)' }}>
              <MorphingText
                words={rotatingWords}
                className="text-[clamp(2.8rem,6.5vw,5rem)] leading-[1.15]"
                interval={3500}
              />
            </div>
            <span className="hidden md:inline-block ml-3 text-[8px] font-mono tracking-wider" style={{ color: 'hsl(0 0% 100% / 0.25)' }}>
              {'--- [ ROTATING ]'}
            </span>
          </div>

          <div className="mb-6">
            <h1 className="font-handwritten text-[clamp(2.2rem,5.5vw,4rem)] leading-[1.1]" style={{ color: 'hsl(40 30% 85% / 0.5)' }}>
              for problems worth solving.
            </h1>
          </div>

          <div className="flex items-center gap-3 mb-2">
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

        {/* Right — spacer to keep headline width (badge is rendered by HeroIdBadge overlay) */}
        <div className="hidden md:block" style={{ width: "clamp(220px, 18vw, 280px)", flexShrink: 0 }} aria-hidden />
      </div>
    </section>
  );
};

export default HeroSection;
