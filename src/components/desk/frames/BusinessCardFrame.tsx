import { motion } from "framer-motion";
import { FrameProps } from "./FrameTypes";

const BusinessCardFrame = ({ children }: FrameProps) => {
  return (
    <motion.div
      className="frame-card relative w-full h-full rounded-lg overflow-hidden"
      initial={{ rotateY: 180, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      exit={{ rotateY: -180, opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
    >
      {/* gold foil corner */}
      <div className="absolute top-0 right-0 w-20 h-20 frame-card-foil pointer-events-none" />
      <div className="absolute inset-0 overflow-auto">{children}</div>
    </motion.div>
  );
};

export default BusinessCardFrame;
