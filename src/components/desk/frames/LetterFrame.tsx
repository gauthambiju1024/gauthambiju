import { FrameProps } from "./FrameTypes";

const LetterFrame = ({ children }: FrameProps) => {
  return (
    <div className="frame-letter relative w-full h-full rounded-sm overflow-hidden">
      <div className="absolute top-3 right-3 w-6 h-6 rounded-full frame-letter-seal pointer-events-none z-10" />
      <div className="absolute inset-0 stage-fit">
        <div className="stage-scroll">{children}</div>
      </div>
    </div>
  );
};

export default LetterFrame;
