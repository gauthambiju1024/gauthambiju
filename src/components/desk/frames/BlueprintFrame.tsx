import { FrameProps } from "./FrameTypes";

const BlueprintFrame = ({ children }: FrameProps) => {
  return (
    <div className="frame-blueprint relative w-full h-full overflow-hidden">
      <div className="absolute inset-0 pointer-events-none frame-blueprint-curl" />
      <div className="absolute inset-0 stage-fit">
        <div className="stage-scroll">{children}</div>
      </div>
    </div>
  );
};

export default BlueprintFrame;
