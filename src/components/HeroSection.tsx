import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import heroPortrait from "@/assets/hero-portrait.png";
import { useSiteContent } from "@/hooks/useSiteData";
import { MorphingText } from "./MorphingText";
import { ArrowUpRight } from "lucide-react";

const defaultWords = ["products", "systems", "platforms", "experiences"];

const HeroSection = () => {
  const { value: heroData, loading: heroLoading } = useSiteContent('hero', 'main');
  const { value: wordsData } = useSiteContent('hero', 'rotating_words');

  const hero = heroData as { name?: string; tagline?: string; location?: string; portrait?: string } | null;
  const rotatingWords = (wordsData as string[] | null) ?? defaultWords;
  const portraitSrc = hero?.portrait || heroPortrait;

  return (
    <section className="relative px-6 md:px-16 pt-8 pb-16 md:pt-12 md:pb-24 overflow-hidden">
      {/* Ruler annotation header */}
      <motion.div
        className="mb-8 flex items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="px-2.5 py-1 border border-dashed rounded-none"
          style={{ borderColor: 'hsl(var(--ruler-accent) / 0.4)' }}>
          <span className="dimension-label">Spec Sheet</span>
        </div>
        <div className="h-px flex-1 border-t border-dashed" style={{ borderColor: 'hsl(var(--ruler-accent) / 0.15)' }} />
        <span className="text-[9px] font-mono" style={{ color: 'hsl(var(--ruler-accent) / 0.35)' }}>
          {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </span>
      </motion.div>

      <div className="flex items-center">
        <div className="max-w-3xl md:ml-4 relative z-10 flex-1 my-0">
          <p className="font-handwritten text-2xl md:text-3xl mb-6" style={{ color: 'hsl(var(--ruler-accent))' }}>
            {hero?.name ?? "Gautham Biju"}
          </p>

          {/* Measurement line */}
          <div className="mb-4 h-px" style={{ background: 'hsl(var(--ruler-accent) / 0.15)' }} />

          <div className="mb-2">
            <h1 className="font-handwritten text-[clamp(2.2rem,5.5vw,4rem)] leading-[1.1]"
              style={{ color: 'hsl(var(--paper) / 0.35)' }}>
              I'm learning to build
            </h1>
          </div>

          <div className="mb-2 py-1">
            <MorphingText
              words={rotatingWords}
              className="text-[clamp(2.8rem,6.5vw,5rem)] leading-[1.15]"
              interval={3500}
            />
          </div>

          <div className="mb-8">
            <h1 className="font-handwritten text-[clamp(2.2rem,5.5vw,4rem)] leading-[1.1]"
              style={{ color: 'hsl(var(--paper) / 0.35)' }}>
              for problems worth solving.
            </h1>
          </div>

          {/* Measurement line */}
          <div className="mb-6 h-px" style={{ background: 'hsl(var(--ruler-accent) / 0.15)' }} />

          <p className="text-sm tracking-[0.2em] uppercase font-mono mb-8"
            style={{ color: 'hsl(var(--paper) / 0.25)' }}>
            At the intersection of Technology · Business · Design
          </p>

          {/* CTAs — ruler accent outlined */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-5 py-2.5 text-xs font-mono tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 border"
              style={{
                borderColor: 'hsl(var(--ruler-accent))',
                color: 'hsl(var(--ruler-accent))',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'hsl(var(--ruler-accent))';
                e.currentTarget.style.color = 'hsl(var(--cutting-mat))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'hsl(var(--ruler-accent))';
              }}
            >
              View Work <ArrowUpRight className="w-3 h-3" />
            </button>
            <a
              href="#"
              className="px-5 py-2.5 text-xs font-mono tracking-wider uppercase transition-all duration-200 border"
              style={{
                borderColor: 'hsl(var(--mat-grid) / 0.5)',
                color: 'hsl(var(--paper) / 0.4)',
              }}
            >
              Resume
            </a>
          </div>

          <p className="text-[10px] tracking-wider font-mono" style={{ color: 'hsl(var(--paper) / 0.15)' }}>
            {hero?.location ?? "INDIA · GMT + 5:30"}
          </p>
        </div>

        <div
          className={`hidden md:block absolute top-0 right-0 w-[400px] lg:w-[520px] z-0 transition-opacity duration-500 ${heroLoading ? 'opacity-0' : 'opacity-100'}`}
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 100%), linear-gradient(to bottom, black 0%, black 75%, transparent 100%)',
            maskComposite: 'intersect',
            WebkitMaskComposite: 'source-in',
          }}
        >
          <img
            src={portraitSrc}
            alt="Gautham portrait sketch"
            className="w-full h-auto opacity-50"
            style={{ filter: 'sepia(0.3) brightness(0.8)' }}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
