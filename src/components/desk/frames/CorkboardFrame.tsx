import { FrameProps } from "./FrameTypes";

const CorkboardFrame = ({ children }: FrameProps) => {
  return (
    <div className="section-panel whiteboard-bg border-border/40 relative w-full h-full overflow-hidden">
      <div className="absolute inset-0">
        <div className="panel-inner-scroll">{children}</div>
      </div>
    </div>
  );
};

export default CorkboardFrame;
