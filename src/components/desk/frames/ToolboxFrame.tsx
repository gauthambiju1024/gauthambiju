import { FrameProps } from "./FrameTypes";

const ToolboxFrame = ({ children }: FrameProps) => {
  return (
    <div className="section-panel toolbox-bg border-border/30 relative w-full overflow-hidden">
      <div className="w-full">{children}</div>
    </div>
  );
};

export default ToolboxFrame;
