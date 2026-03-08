import { motion } from "framer-motion";
import { 
  Leaf, Coffee, Monitor, BookOpen, Palette, Music, 
  Sparkles, Moon, Flame, Rainbow, Pizza, FileText,
  Star, Gamepad2, Headphones, Camera, Flower2, Wind,
  Zap, Target, Rocket, Lightbulb, Tent, Waves
} from "lucide-react";

const leftIcons = [
  Leaf, Coffee, Monitor, BookOpen, Palette, Music, 
  Sparkles, Moon, Flame, Rainbow, Pizza, FileText
];

const rightIcons = [
  Star, Gamepad2, Headphones, Camera, Flower2, Wind,
  Zap, Target, Rocket, Lightbulb, Tent, Waves
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.5,
    },
  },
};

const iconVariants = {
  hidden: { opacity: 0, scale: 0, rotate: -180 },
  visible: {
    opacity: 0.5,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 15,
    },
  },
};

const DecorativeBorder = ({ side }: { side: "left" | "right" }) => {
  const icons = side === "left" ? leftIcons : rightIcons;
  
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`hidden lg:flex flex-col items-center justify-start gap-4 py-12 px-4 ${
        side === "left" ? "order-first" : "order-last"
      }`}
    >
      {icons.map((Icon, index) => (
        <motion.div
          key={`${side}-${index}`}
          variants={iconVariants}
          whileHover={{ 
            scale: 1.3, 
            opacity: 0.8,
            rotate: [0, -10, 10, 0],
            transition: { duration: 0.3 }
          }}
          animate={{
            y: [0, -3, 0],
            transition: {
              duration: 2 + index * 0.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.1,
            }
          }}
          className="cursor-default select-none hover:drop-shadow-lg transition-all"
        >
          <Icon className="w-5 h-5 text-muted-foreground/60" />
        </motion.div>
      ))}
      
      {/* Decorative line */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="w-px h-20 bg-gradient-to-b from-primary/30 to-transparent origin-top"
      />
    </motion.div>
  );
};

export default DecorativeBorder;
