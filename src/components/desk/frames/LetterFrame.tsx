import { FrameProps } from "./FrameTypes";

const LetterFrame = ({ children }: FrameProps) => {
  return (
    <div className="section-panel border-transparent relative w-full h-full overflow-hidden">
      <div className="absolute inset-0 stage-fit">
        <div className="stage-scroll">{children}</div>
      </div>
    </div>
  );
};

export default LetterFrame;
