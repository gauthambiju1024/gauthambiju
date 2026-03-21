import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    rotateY: -6,
    scale: 0.97,
    transformPerspective: 1200,
  },
  animate: {
    opacity: 1,
    rotateY: 0,
    scale: 1,
    transformPerspective: 1200,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    rotateY: 6,
    scale: 0.97,
    transformPerspective: 1200,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ transformOrigin: "left center", willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
