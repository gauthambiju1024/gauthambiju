import { FrameProps } from "./FrameTypes";

const CorkboardFrame = ({ children }: FrameProps) => {
  return (
    <div className="section-panel whiteboard-bg border-border/40 relative w-full overflow-hidden">
      <div className="w-full">{children}</div>
    </div>
  );
};

export default CorkboardFrame;
