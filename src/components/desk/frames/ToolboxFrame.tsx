import { FrameProps } from "./FrameTypes";

const ToolboxFrame = ({ children }: FrameProps) => {
  return (
    <div className="section-panel toolbox-bg border-border/30 relative w-full h-full overflow-hidden">
      <div className="absolute inset-0 stage-fit">
        <div className="stage-scroll">{children}</div>
      </div>
    </div>
  );
};

export default ToolboxFrame;
