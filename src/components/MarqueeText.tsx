import { motion } from "framer-motion";
import { Diamond } from "lucide-react";

const items = [
  { text: "Developer", isIcon: false },
  { text: "", isIcon: true },
  { text: "Creator", isIcon: false },
  { text: "", isIcon: true },
  { text: "Designer", isIcon: false },
  { text: "", isIcon: true },
  { text: "Problem Solver", isIcon: false },
  { text: "", isIcon: true },
  { text: "Tech Enthusiast", isIcon: false },
  { text: "", isIcon: true },
];

const MarqueeText = () => {
  return (
    <div className="marquee-container py-6 border-y-2 border-dashed border-border overflow-hidden">
      <motion.div 
        className="marquee-content"
        animate={{ x: [0, "-50%"] }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        {/* Double the content for seamless loop */}
        {[...items, ...items].map((item, index) => (
          <span
            key={index}
            className="mx-6 text-3xl md:text-4xl"
          >
            {item.isIcon ? (
              <Diamond className="w-5 h-5 text-primary animate-spin-slow inline-block" />
            ) : (
              <span className="font-handwritten text-card-foreground">{item.text}</span>
            )}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default MarqueeText;
