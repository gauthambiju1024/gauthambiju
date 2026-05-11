import { FrameProps } from "./FrameTypes";

const ScrollFrame = ({ children }: FrameProps) => {
  return (
    <div className="section-panel border-primary/20 relative w-full overflow-hidden">
      <div className="w-full">{children}</div>
    </div>
  );
};

export default ScrollFrame;
