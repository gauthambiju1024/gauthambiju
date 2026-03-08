import { motion } from "framer-motion";
import { ReactNode } from "react";

interface DraggableStickerProps {
  children: ReactNode;
  className?: string;
  initialRotation?: number;
}

const DraggableSticker = ({ 
  children, 
  className = "", 
  initialRotation = 0 
}: DraggableStickerProps) => {
  return (
    <motion.div
      drag
      dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
      dragElastic={0.1}
      whileDrag={{ 
        scale: 1.1, 
        rotate: initialRotation + 5,
        cursor: "grabbing",
        zIndex: 50
      }}
      whileHover={{ scale: 1.05 }}
      initial={{ rotate: initialRotation }}
      className={`cursor-grab select-none ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default DraggableSticker;
