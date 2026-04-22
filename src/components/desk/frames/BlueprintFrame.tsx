import { motion } from "framer-motion";
import { FrameProps } from "./FrameTypes";

const BlueprintFrame = ({ children }: FrameProps) => {
  return (
    <motion.div
      className="frame-blueprint relative w-full h-full overflow-hidden rounded-md"
      initial={{ scaleX: 0.6, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      exit={{ scaleX: 0.6, opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: "left center" }}
    >
      {/* paper-curl edge */}
      <div className="absolute right-0 top-0 bottom-0 w-12 pointer-events-none frame-blueprint-curl" />
      <div className="absolute inset-0 overflow-auto">{children}</div>
    </motion.div>
  );
};

export default BlueprintFrame;
