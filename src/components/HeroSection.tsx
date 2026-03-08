import { motion } from "framer-motion";
import { Sparkles, Code2, Palette, Lightbulb, Rocket, ArrowDown } from "lucide-react";
import DraggableSticker from "./DraggableSticker";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

const HeroSection = () => {
  return (
    <section id="about" className="py-12 px-8 md:px-16 relative">
      {/* Decorative washi tapes */}
      <div className="washi-tape washi-tape-1 hidden md:block" />
      <div className="washi-tape washi-tape-2 hidden md:block" />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl mx-auto relative"
      >
        {/* Floating sticker decoration */}
        <DraggableSticker 
          className="absolute -top-4 right-0 md:right-10"
          initialRotation={12}
        >
          <motion.div 
            className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Sparkles className="w-5 h-5 text-primary" />
          </motion.div>
        </DraggableSticker>
        
        <motion.div variants={itemVariants} className="relative">
          <span className="font-handwritten text-lg text-muted-foreground block mb-2">
            Hi there, I'm
          </span>
        </motion.div>
        
        <motion.h1 
          variants={itemVariants}
          className="font-handwritten text-6xl md:text-8xl text-primary mb-4 relative inline-block"
        >
          Gautham Biju
          {/* Decorative scribble */}
          <motion.svg
            className="absolute -bottom-2 left-0 w-full h-4"
            viewBox="0 0 200 10"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <motion.path
              d="M0,5 Q50,0 100,5 T200,5"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            />
          </motion.svg>
        </motion.h1>

        {/* Bold role subtitle with pipes */}
        <motion.div variants={itemVariants} className="mb-6">
          <span className="font-serif text-sm md:text-base tracking-[0.3em] uppercase text-card-foreground/70">
            Developer <span className="text-primary">|</span> Designer <span className="text-primary">|</span> Creator
          </span>
        </motion.div>
        
        <motion.h2 
          variants={itemVariants}
          className="font-serif text-3xl md:text-4xl text-card-foreground leading-tight mb-8"
        >
          Technology should feel{" "}
          <span className="italic sketch-underline">human</span>
        </motion.h2>
        
        <motion.p 
          variants={itemVariants}
          className="font-body text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl"
        >
          I'm a developer and creator who believes in building digital experiences 
          that connect with people on a meaningful level. I craft interfaces that 
          feel intuitive, natural, and genuinely helpful.
        </motion.p>

        {/* CTA Button */}
        <motion.div variants={itemVariants} className="mb-8">
          <motion.a
            href="#connect"
            whileHover={{ scale: 1.05, rotate: -1 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 border-primary 
                       font-handwritten text-xl text-primary hover:bg-primary hover:text-primary-foreground 
                       transition-colors duration-300 cursor-pointer"
          >
            Let's Connect
            <ArrowDown className="w-4 h-4" />
          </motion.a>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="flex flex-wrap gap-4 font-handwritten text-xl"
        >
          {[
            { icon: Code2, label: "developer" },
            { icon: Palette, label: "designer" },
            { icon: Lightbulb, label: "creator" },
          ].map((tag, index) => (
            <motion.span
              key={tag.label}
              whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 2 : -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-secondary rounded-full text-secondary-foreground cursor-default
                         hover:bg-primary/10 transition-colors duration-300 flex items-center gap-2"
            >
              <tag.icon className="w-4 h-4" />
              {tag.label}
            </motion.span>
          ))}
        </motion.div>

        {/* Decorative sticky note */}
        <DraggableSticker 
          className="absolute -bottom-8 right-0 hidden md:block"
          initialRotation={-6}
        >
          <div className="sticky-note w-36 text-center flex flex-col items-center gap-2">
            <Rocket className="w-5 h-5 text-yellow-700" />
            <span className="font-handwritten text-base text-yellow-900">
              Let's build something amazing!
            </span>
          </div>
        </DraggableSticker>
      </motion.div>
    </section>
  );
};

export default HeroSection;
