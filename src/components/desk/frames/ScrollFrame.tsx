import { motion } from "framer-motion";
import { FrameProps } from "./FrameTypes";

const ScrollFrame = ({ children }: FrameProps) => {
  return (
    <motion.div
      className="frame-scroll relative w-full h-full overflow-hidden"
      initial={{ scaleY: 0.1, opacity: 0 }}
      animate={{ scaleY: 1, opacity: 1 }}
      exit={{ scaleY: 0.1, opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: "center top" }}
    >
      <div className="absolute top-0 left-0 right-0 h-3 frame-scroll-rod" />
      <div className="absolute bottom-0 left-0 right-0 h-3 frame-scroll-rod" />
      <div className="absolute inset-0 py-3 stage-fit">
        <div className="stage-scroll">{children}</div>
      </div>
    </motion.div>
  );
};

export default ScrollFrame;
