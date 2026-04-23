import { FrameProps } from "./FrameTypes";

const ScrollFrame = ({ children }: FrameProps) => {
  return (
    <div className="frame-scroll relative w-full h-full overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-3 frame-scroll-rod" />
      <div className="absolute bottom-0 left-0 right-0 h-3 frame-scroll-rod" />
      <div className="absolute inset-0 py-3 stage-fit">
        <div className="stage-scroll">{children}</div>
      </div>
    </div>
  );
};

export default ScrollFrame;
