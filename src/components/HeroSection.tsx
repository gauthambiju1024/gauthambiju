import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import heroPortrait from "@/assets/hero-portrait.png";
import { useSiteContent } from "@/hooks/useSiteData";
import { MorphingText } from "./MorphingText";
import { ArrowUpRight } from "lucide-react";

const defaultWords = ["products", "systems", "platforms", "experiences"];

const HeroSection = () => {
  const { value: heroData } = useSiteContent('hero', 'main');
  const { value: wordsData } = useSiteContent('hero', 'rotating_words');

  const hero = heroData as { name?: string; tagline?: string; location?: string; portrait?: string } | null;
  const rotatingWords = (wordsData as string[] | null) ?? defaultWords;
  const portraitSrc = hero?.portrait || heroPortrait;

  return (
    <section className="relative px-6 md:px-16 pt-8 pb-16 md:pt-12 md:pb-24 overflow-hidden">
      {/* Field Notes label */}
      <motion.div
        className="mb-8 flex items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="px-2 py-0.5 border border-border rounded-sm">
          <span className="text-[9px] tracking-[0.25em] uppercase font-mono text-muted-foreground">Field Notes</span>
        </div>
        <div className="h-px flex-1 bg-border/50" />
        <span className="text-[9px] font-mono text-muted-foreground/40">
          {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </span>
      </motion.div>

      <div className="flex items-center">
        <div className="max-w-3xl md:ml-4 relative z-10 flex-1 my-0">
          <p className="font-handwritten text-2xl md:text-3xl mb-6 text-primary">
            {hero?.name ?? "Gautham Biju"}
          </p>

          <div className="mb-2">
            <h1 className="font-handwritten text-[clamp(2.2rem,5.5vw,4rem)] leading-[1.1] text-card-foreground/40">
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
            <h1 className="font-handwritten text-[clamp(2.2rem,5.5vw,4rem)] leading-[1.1] text-card-foreground/40">
              for problems worth solving.
            </h1>
          </div>

          <p className="text-sm tracking-[0.2em] uppercase text-card-foreground/30 font-mono mb-8">
            At the intersection of Technology · Business · Design
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-5 py-2.5 bg-primary text-primary-foreground text-xs font-mono tracking-wider uppercase rounded-sm hover:bg-primary/90 transition-colors flex items-center gap-1.5"
            >
              View Work <ArrowUpRight className="w-3 h-3" />
            </button>
            <a
              href="#"
              className="px-5 py-2.5 border border-border text-card-foreground/60 text-xs font-mono tracking-wider uppercase rounded-sm hover:border-primary/30 hover:text-card-foreground transition-all"
            >
              Resume
            </a>
          </div>

          <p className="text-[10px] tracking-wider text-card-foreground/20 font-mono">
            {hero?.location ?? "INDIA · GMT + 5:30"}
          </p>
        </div>

        <div
          className="hidden md:block absolute top-0 right-0 w-[400px] lg:w-[520px] z-0"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 30%, black 100%), linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
            maskComposite: 'intersect',
            WebkitMaskComposite: 'source-in',
          }}
        >
          <img
            src={portraitSrc}
            alt="Gautham portrait sketch"
            className="w-full h-auto mix-blend-multiply opacity-80"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
