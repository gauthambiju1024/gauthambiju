import { motion } from "framer-motion";
import { FrameProps } from "./FrameTypes";

const BookshelfFrame = ({ children }: FrameProps) => {
  return (
    <motion.div
      className="frame-shelf relative w-full h-full rounded-md overflow-hidden"
      initial={{ y: 60, rotateX: 12, opacity: 0 }}
      animate={{ y: 0, rotateX: 0, opacity: 1 }}
      exit={{ y: 60, rotateX: 12, opacity: 0 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute inset-0 overflow-auto">{children}</div>
    </motion.div>
  );
};

export default BookshelfFrame;
