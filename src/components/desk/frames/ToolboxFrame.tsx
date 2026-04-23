import { FrameProps } from "./FrameTypes";

const ToolboxFrame = ({ children }: FrameProps) => {
  return (
    <div className="frame-toolbox relative w-full h-full rounded-md overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-2 frame-toolbox-lid pointer-events-none" />
      <div className="absolute inset-0 pt-2 stage-fit">
        <div className="stage-scroll">{children}</div>
      </div>
    </div>
  );
};

export default ToolboxFrame;
