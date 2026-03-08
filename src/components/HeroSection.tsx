import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section id="about" className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-20 pt-20 pb-12">
      {/* Background geometric accent */}
      <div className="absolute top-20 right-0 w-px h-[40vh] bg-gradient-to-b from-transparent via-primary/20 to-transparent hidden lg:block" />
      <div className="absolute top-[30vh] right-0 w-[20vw] h-px bg-gradient-to-l from-transparent via-primary/10 to-transparent hidden lg:block" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="max-w-5xl"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-8 h-px bg-primary" />
          <span className="font-mono text-xs tracking-[0.25em] uppercase text-primary">
            Developer / Designer / Creator
          </span>
        </motion.div>

        {/* Main heading */}
        <div className="overflow-hidden mb-6">
          <motion.h1
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[clamp(3rem,8vw,7rem)] font-bold leading-[0.9] tracking-tight text-foreground"
          >
            Gautham
            <br />
            <span className="text-primary">Biju</span>
          </motion.h1>
        </div>

        {/* Subheading */}
        <div className="overflow-hidden mb-10">
          <motion.p
            initial={{ y: 60 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif-i italic text-[clamp(1.5rem,3vw,2.5rem)] text-foreground/60 max-w-xl leading-snug"
          >
            Technology should feel human.
          </motion.p>
        </div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="font-body text-foreground/40 text-base md:text-lg max-w-lg leading-relaxed mb-12"
        >
          I build digital experiences that connect with people on a meaningful level
          — interfaces that feel intuitive, natural, and genuinely helpful.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="flex items-center gap-6"
        >
          <a
            href="#connect"
            className="group inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-foreground/60 hover:text-primary transition-colors duration-300"
          >
            <span className="w-10 h-10 rounded-full border border-foreground/20 group-hover:border-primary group-hover:bg-primary/10 flex items-center justify-center transition-all duration-300">
              <ArrowDown className="w-4 h-4" />
            </span>
            Get in touch
          </a>
        </motion.div>
      </motion.div>

      {/* Side index */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.6 }}
        className="absolute right-6 md:right-12 bottom-12 hidden md:flex flex-col items-end gap-1"
      >
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-foreground/20">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-foreground/20 to-transparent" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
