import { FrameProps } from "./FrameTypes";

const BlueprintFrame = ({ children }: FrameProps) => {
  return (
    <div className="blueprint-surface relative w-full h-full overflow-hidden rounded-lg">
      <div className="absolute inset-0 stage-fit">
        <div className="stage-scroll">{children}</div>
      </div>
    </div>
  );
};

export default BlueprintFrame;
