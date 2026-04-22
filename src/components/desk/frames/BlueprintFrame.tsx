import { motion } from "framer-motion";
import { FrameProps } from "./FrameTypes";

const BlueprintFrame = ({ children }: FrameProps) => {
  return (
    <motion.div
      className="frame-blueprint relative w-full h-full overflow-hidden"
      initial={{ scaleX: 0.6, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      exit={{ scaleX: 0.6, opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: "left center" }}
    >
      {/* rubber edge highlight */}
      <div className="absolute inset-0 pointer-events-none frame-blueprint-curl" />
      <div className="absolute inset-0 stage-fit">
        <div className="stage-scroll">{children}</div>
      </div>
    </motion.div>
  );
};

export default BlueprintFrame;
