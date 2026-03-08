import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, Github, Linkedin, Twitter, Send } from "lucide-react";
import DraggableSticker from "./DraggableSticker";

const socialLinks = [
  { name: "Email", icon: Mail, href: "mailto:hello@gauthambiju.com" },
  { name: "GitHub", icon: Github, href: "https://github.com" },
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
};

const ConnectSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="connect" className="py-16 px-8 md:px-16 relative">
      {/* Decorative divider */}
      <div className="doodle-divider mb-12" />
      
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-2xl mx-auto text-center relative"
      >
        {/* Floating decoration */}
        <DraggableSticker 
          className="absolute -top-8 right-0"
          initialRotation={20}
        >
          <motion.div 
            className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Send className="w-6 h-6 text-primary" />
          </motion.div>
        </DraggableSticker>
        
        <motion.h2 
          variants={itemVariants}
          className="font-handwritten text-5xl md:text-6xl text-primary mb-3"
        >
          Let's Shape the Future Together
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="font-serif text-lg md:text-xl text-card-foreground/70 tracking-wide mb-8"
        >
          Connect <span className="text-primary">·</span> Innovate <span className="text-primary">·</span> Create
        </motion.p>
        
        <motion.p 
          variants={itemVariants}
          className="font-body text-muted-foreground mb-10"
        >
          I'm always excited to meet new people and explore interesting projects. 
          Don't hesitate to reach out!
        </motion.p>

        {/* Circular social icons */}
        <motion.div variants={itemVariants} className="flex justify-center gap-5 mb-12">
          {socialLinks.map((link, index) => (
            <motion.a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ 
                y: -6, 
                scale: 1.15,
              }}
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 rounded-full border-2 border-primary/30 bg-secondary/50 
                         flex items-center justify-center group hover:border-primary hover:bg-primary 
                         transition-all duration-300"
            >
              <link.icon className="w-5 h-5 text-card-foreground group-hover:text-primary-foreground transition-colors" />
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-3"
        >
          {/* Animated wave hand SVG */}
          <motion.svg 
            width="32" 
            height="32" 
            viewBox="0 0 32 32" 
            fill="none"
            animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity,
              repeatDelay: 1 
            }}
            className="origin-bottom-right"
          >
            <path 
              d="M8 22C8 22 7 19 8 16C9 13 11 11 13 10C15 9 17 9 18 10C19 11 19 13 18 15C17 17 15 19 15 19" 
              stroke="hsl(var(--primary))" 
              strokeWidth="2" 
              strokeLinecap="round"
              fill="none"
            />
            <path 
              d="M13 10C13 10 14 7 17 6C20 5 22 6 23 8C24 10 23 13 21 15C19 17 17 18 15 19" 
              stroke="hsl(var(--primary))" 
              strokeWidth="2" 
              strokeLinecap="round"
              fill="none"
            />
            <path 
              d="M17 6C17 6 19 4 22 4C25 4 27 6 27 9C27 12 25 14 23 15" 
              stroke="hsl(var(--primary))" 
              strokeWidth="2" 
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="10" cy="24" r="2" fill="hsl(var(--primary))" fillOpacity="0.3" />
          </motion.svg>
          <span className="font-handwritten text-2xl text-muted-foreground">
            Looking forward to hearing from you!
          </span>
        </motion.div>
        
        {/* Decorative element */}
        <DraggableSticker 
          className="absolute -bottom-4 left-10 hidden md:block"
          initialRotation={-15}
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="font-handwritten text-primary text-sm transform -rotate-12">
              say hi!
            </span>
          </div>
        </DraggableSticker>
      </motion.div>
    </section>
  );
};

export default ConnectSection;
