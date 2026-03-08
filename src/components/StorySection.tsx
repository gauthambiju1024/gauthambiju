import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { BookOpen, MapPin, GraduationCap, ArrowRight } from "lucide-react";
import DraggableSticker from "./DraggableSticker";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

const StorySection = () => {
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
        className="relative"
      >
        <motion.div
          variants={itemVariants}
          className="relative rounded-lg bg-gradient-to-br from-[hsl(15_70%_50%/0.1)] via-secondary/40 to-[hsl(200_50%_70%/0.1)] p-8 md:p-12 overflow-hidden sketchy-border"
        >
          {/* Background decorative pattern */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <DraggableSticker
            className="absolute top-4 right-4 hidden md:block"
            initialRotation={12}
          >
            <motion.div
              className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <BookOpen className="w-5 h-5 text-primary" />
            </motion.div>
          </DraggableSticker>

          <div className="relative z-10 max-w-2xl">
            <motion.div variants={itemVariants} className="flex items-center gap-3 mb-4">
              <div className="flex gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-primary" />
                </span>
                <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-primary" />
                </span>
              </div>
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="font-handwritten text-4xl md:text-5xl text-primary mb-3"
            >
              My Journey
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="font-serif text-xl md:text-2xl text-card-foreground leading-relaxed mb-2"
            >
              From curiosity to creation
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="font-body text-muted-foreground leading-relaxed mb-6 max-w-lg"
            >
              Every project, every line of code, every design decision has been a step 
              in a journey of learning, growing, and building things that matter.
            </motion.p>

            <motion.a
              variants={itemVariants}
              href="#about"
              whileHover={{ scale: 1.05, rotate: -1 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-primary 
                         font-handwritten text-lg text-primary hover:bg-primary hover:text-primary-foreground 
                         transition-colors duration-300 cursor-pointer"
            >
              My Story <ArrowRight className="w-4 h-4" />
            </motion.a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default StorySection;
