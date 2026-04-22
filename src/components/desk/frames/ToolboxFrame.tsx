import { motion } from "framer-motion";
import { FrameProps } from "./FrameTypes";

const ToolboxFrame = ({ children }: FrameProps) => {
  return (
    <motion.div
      className="frame-toolbox relative w-full h-full rounded-md overflow-hidden"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* hinged lid line */}
      <div className="absolute top-0 left-0 right-0 h-2 frame-toolbox-lid pointer-events-none" />
      <div className="absolute inset-0 pt-2 overflow-auto">{children}</div>
    </motion.div>
  );
};

export default ToolboxFrame;
