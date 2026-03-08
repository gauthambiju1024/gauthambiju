import { motion } from "framer-motion";
import Globe from "./Globe";

const HeroSection = () => {
  return (
    <section
      id="about"
      className="relative px-8 md:px-16 pt-8 pb-20 md:pt-12 md:pb-28 overflow-hidden"
    >
      <div className="flex items-center">
        {/* Text content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-3xl md:ml-8 relative z-10 flex-1"
        >
          {/* Handwritten name */}
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="font-handwritten text-2xl md:text-3xl mb-2 text-primary"
          >
            Gautham
          </motion.p>

          {/* Role */}
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="font-mono text-xs tracking-[0.2em] uppercase text-card-foreground/40 mb-6"
          >
            Developer / Designer / Creator
          </motion.p>

          {/* Main statement */}
          <div className="overflow-hidden mb-4">
            <motion.h1
              initial={{ y: 80 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1] tracking-tight text-card-foreground"
            >
              Technology should
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-8">
            <motion.h1
              initial={{ y: 80 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif-i italic text-[clamp(2.5rem,6vw,4.5rem)] leading-[1] text-card-foreground/50"
            >
              feel human.
            </motion.h1>
          </div>

          {/* Location tag */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="font-mono text-[11px] tracking-wider text-card-foreground/30"
          >
            Based remotely — Available worldwide
          </motion.p>
        </motion.div>

        {/* Globe — partial, clipped on right */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="hidden md:block absolute right-[-120px] bottom-[-80px] w-[420px] h-[420px] lg:w-[500px] lg:h-[500px]"
        >
          <div className="w-full h-full rounded-full overflow-hidden opacity-60">
            <Globe />
          </div>
        </motion.div>
      </div>

      {/* Decorative tape strip */}
      <motion.div
        initial={{ opacity: 0, rotate: -5 }}
        animate={{ opacity: 1, rotate: -2 }}
        transition={{ duration: 0.6, delay: 1.1 }}
        className="absolute top-6 right-12 md:right-20 tape-strip px-4 py-1.5 hidden md:block z-20"
      >
        <span className="font-handwritten text-sm text-card-foreground/40">page 01</span>
      </motion.div>
    </section>
  );
};

export default HeroSection;
