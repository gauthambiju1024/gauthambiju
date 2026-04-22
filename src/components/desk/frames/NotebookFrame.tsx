import { motion } from "framer-motion";
import { FrameProps } from "./FrameTypes";

const NotebookFrame = ({ children }: FrameProps) => {
  return (
    <motion.div
      className="frame-notebook relative w-full h-full rounded-md overflow-hidden"
      initial={{ rotateX: -25, opacity: 0, y: 30 }}
      animate={{ rotateX: 0, opacity: 1, y: 0 }}
      exit={{ rotateX: -25, opacity: 0, y: 30 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: "center top" }}
    >
      <div className="absolute top-0 bottom-0 left-1/2 w-1 -translate-x-1/2 frame-notebook-spine pointer-events-none z-10" />
      <div className="absolute inset-0 stage-fit">
        <div className="stage-scroll">{children}</div>
      </div>
    </motion.div>
  );
};

export default NotebookFrame;
