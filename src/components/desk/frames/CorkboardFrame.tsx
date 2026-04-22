import { motion } from "framer-motion";
import { FrameProps } from "./FrameTypes";

const CorkboardFrame = ({ children }: FrameProps) => {
  return (
    <motion.div
      className="frame-cork relative w-full h-full rounded-md overflow-hidden"
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 40, opacity: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="absolute top-3 left-4 w-2.5 h-2.5 rounded-full bg-[hsl(var(--primary))] shadow-md z-10" />
      <span className="absolute top-3 right-4 w-2.5 h-2.5 rounded-full bg-[hsl(var(--primary))] shadow-md z-10" />
      <div className="absolute inset-0 stage-fit">
        <div className="stage-scroll">{children}</div>
      </div>
    </motion.div>
  );
};

export default CorkboardFrame;
