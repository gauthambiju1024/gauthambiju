import { motion } from "framer-motion";
import heroPortrait from "@/assets/hero-portrait.png";

const HeroSection = () => {
  return (
    <section
      id="about"
      className="relative px-8 md:px-16 pt-8 pb-20 md:pt-12 md:pb-28 overflow-hidden">
      
      <div className="flex items-center">
        {/* Text content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-3xl md:ml-8 relative z-10 flex-1">
          
          {/* Handwritten name */}
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="font-handwritten text-2xl md:text-3xl mb-2 text-primary">
            
            Gautham
          </motion.p>

          {/* Role */}
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="font-handwritten text-base tracking-wide uppercase text-card-foreground/40 mb-6">
            
            ​Technology . Business . Design          
          </motion.p>

          {/* Main statement */}
          <div className="overflow-hidden mb-4">
            <motion.h1
              initial={{ y: 80 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="font-handwritten text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1] tracking-tight text-card-foreground">
              
              Technology should
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-8">
            <motion.h1
              initial={{ y: 80 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="font-handwritten text-[clamp(2.5rem,6vw,4.5rem)] leading-[1] text-card-foreground/50">
              
              feel human.
            </motion.h1>
          </div>

          {/* Location tag */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="font-handwritten text-sm tracking-wider text-card-foreground/30">
            
            Based remotely — Available worldwide
          </motion.p>
        </motion.div>

        {/* Portrait */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="hidden md:block flex-shrink-0 w-[340px] lg:w-[420px] relative z-0">
          
          <img
            src={heroPortrait}
            alt="Gautham portrait sketch"
            className="w-full h-auto mix-blend-multiply opacity-90" />
          
        </motion.div>

      </div>

    </section>);

};

export default HeroSection;