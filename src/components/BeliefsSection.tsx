import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Target, Sparkles, Heart, MessageCircle, Paperclip, ArrowRight } from "lucide-react";
import DraggableSticker from "./DraggableSticker";

const beliefs = [
  {
    number: "01",
    title: "Simplicity wins",
    description: "The best solutions are often the simplest. I strip away complexity to reveal what truly matters.",
    icon: Target,
    annotation: "less is more",
    gradient: "from-[hsl(15_70%_50%/0.15)] to-[hsl(40_25%_88%/0.5)]",
  },
  {
    number: "02", 
    title: "Details matter",
    description: "Every pixel, every interaction, every word contributes to the whole experience.",
    icon: Sparkles,
    annotation: "the little things",
    gradient: "from-[hsl(40_25%_88%/0.5)] to-[hsl(200_50%_70%/0.15)]",
  },
  {
    number: "03",
    title: "Build with empathy",
    description: "Understanding people is the foundation of creating meaningful technology.",
    icon: Heart,
    annotation: "people first",
    gradient: "from-[hsl(200_50%_70%/0.15)] to-[hsl(15_70%_50%/0.1)]",
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, rotate: -2 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

const BeliefsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-16 px-8 md:px-16 relative">
      {/* Decorative divider */}
      <div className="doodle-divider mb-12" />
      
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div className="flex items-center gap-4 mb-2">
          <motion.h2 
            variants={cardVariants}
            className="font-handwritten text-4xl text-primary"
          >
            3 things I strongly believe in
          </motion.h2>
          <DraggableSticker initialRotation={15}>
            <motion.div 
              className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <MessageCircle className="w-5 h-5 text-primary" />
            </motion.div>
          </DraggableSticker>
        </div>
        
        <motion.div 
          variants={cardVariants}
          className="w-24 h-1 bg-primary/30 mb-12 rounded-full" 
        />
        
        <div className="grid md:grid-cols-3 gap-8">
          {beliefs.map((belief, index) => (
            <motion.div
              key={belief.number}
              variants={cardVariants}
              whileHover={{ 
                y: -8, 
                rotate: index % 2 === 0 ? 1 : -1,
                transition: { duration: 0.3 }
              }}
              className={`group relative sketchy-border p-6 bg-gradient-to-br ${belief.gradient} cursor-default rounded-lg`}
            >
              {/* Handwritten annotation */}
              <span className="absolute -top-3 right-4 font-handwritten text-sm text-primary/60 
                             transform rotate-[-8deg] opacity-0 group-hover:opacity-100 transition-opacity">
                {belief.annotation}
              </span>
              
              <div className="flex items-start gap-4">
                <motion.span 
                  className="font-handwritten text-5xl text-primary/20 group-hover:text-primary/40 transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                >
                  {belief.number}
                </motion.span>
                <div>
                  <motion.div 
                    className="mb-2 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      repeatDelay: 2 + index 
                    }}
                  >
                    <belief.icon className="w-5 h-5 text-primary" />
                  </motion.div>
                  <h3 className="font-serif text-xl text-card-foreground mb-2 group-hover:text-primary transition-colors">
                    {belief.title}
                  </h3>
                  <p className="font-body text-muted-foreground text-sm leading-relaxed mb-3">
                    {belief.description}
                  </p>
                  <span className="inline-flex items-center gap-1 font-handwritten text-sm text-primary/60 
                                   group-hover:text-primary transition-colors cursor-pointer">
                    Learn more <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
              
              {/* Paper clip decoration */}
              {index === 1 && (
                <motion.div 
                  className="absolute -top-3 -right-1"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Paperclip className="w-6 h-6 text-muted-foreground/50 rotate-45" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default BeliefsSection;
