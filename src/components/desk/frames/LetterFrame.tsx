import { motion } from "framer-motion";
import { FrameProps } from "./FrameTypes";

const LetterFrame = ({ children }: FrameProps) => {
  return (
    <motion.div
      className="frame-letter relative w-full h-full rounded-sm overflow-hidden"
      initial={{ y: 60, scaleY: 0.7, opacity: 0 }}
      animate={{ y: 0, scaleY: 1, opacity: 1 }}
      exit={{ y: 60, scaleY: 0.7, opacity: 0 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: "center bottom" }}
    >
      {/* wax seal */}
      <div className="absolute top-3 right-3 w-6 h-6 rounded-full frame-letter-seal pointer-events-none z-10" />
      <div className="absolute inset-0 overflow-auto">{children}</div>
    </motion.div>
  );
};

export default LetterFrame;
