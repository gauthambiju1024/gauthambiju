import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import heroPortrait from "@/assets/hero-portrait.png";
import { useSiteContent } from "@/hooks/useSiteData";
import { MorphingText } from "./MorphingText";

const defaultWords = ["products", "systems", "platforms", "experiences"];

const HeroSection = () => {
  const { value: heroData } = useSiteContent('hero', 'main');
  const { value: wordsData } = useSiteContent('hero', 'rotating_words');

  const hero = heroData as { name?: string; tagline?: string; location?: string } | null;
  const rotatingWords = (wordsData as string[] | null) ?? defaultWords;

  return (
    <section className="relative px-8 md:px-16 pt-8 pb-20 md:pt-12 md:pb-28 overflow-hidden">
      <div className="flex items-center">
        <div className="max-w-3xl md:ml-8 relative z-10 flex-1 my-0">
          <p className="font-handwritten text-2xl md:text-3xl mb-6 text-primary">
            {hero?.name ?? "Gautham Biju"}
          </p>

          <div className="mb-2">
            <h1 className="font-handwritten text-[clamp(2.2rem,5.5vw,4rem)] leading-[1.1] text-card-foreground/40">
              I'm learning to build
            </h1>
          </div>

          <div className="mb-2" style={{ height: 'clamp(2.8rem,6.5vw,5rem)' }}>
            <MorphingText
              words={rotatingWords}
              className="text-[clamp(2.8rem,6.5vw,5rem)] leading-[1]"
              interval={3500}
            />
          </div>

          <div className="mb-8">
            <h1 className="font-handwritten text-[clamp(2.2rem,5.5vw,4rem)] leading-[1.1] text-card-foreground/40">
              for problems worth solving.
            </h1>
          </div>

          <p className="text-sm tracking-[0.2em] uppercase text-card-foreground/30 font-mono mb-6">
            At the intersection of Technology · Business · Design
          </p>

          <p className="text-[10px] tracking-wider text-card-foreground/20 font-mono">
            {hero?.location ?? "INDIA · GMT + 5:30"}
          </p>
        </div>

        <div className="hidden md:block absolute top-0 right-0 w-[400px] lg:w-[520px] z-0">
          <img
            src={heroPortrait}
            alt="Gautham portrait sketch"
            className="w-full h-auto mix-blend-multiply opacity-90"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
