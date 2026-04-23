import { FrameProps } from "./FrameTypes";

const ScrollFrame = ({ children }: FrameProps) => {
  return (
    <div className="section-panel border-primary/20 relative w-full h-full overflow-hidden">
      <div className="absolute inset-0 stage-fit">
        <div className="stage-scroll">{children}</div>
      </div>
    </div>
  );
};

export default ScrollFrame;
