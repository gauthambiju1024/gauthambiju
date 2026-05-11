import { FrameProps } from "./FrameTypes";

const LetterFrame = ({ children }: FrameProps) => {
  return (
    <div className="section-panel border-transparent relative w-full overflow-hidden">
      <div className="w-full">{children}</div>
    </div>
  );
};

export default LetterFrame;
