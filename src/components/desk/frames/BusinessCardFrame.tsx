import { FrameProps } from "./FrameTypes";

const BusinessCardFrame = ({ children }: FrameProps) => {
  return (
    <div className="frame-card relative w-full h-full rounded-lg overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 frame-card-foil pointer-events-none" />
      <div className="absolute inset-0 stage-fit">
        <div className="stage-scroll">{children}</div>
      </div>
    </div>
  );
};

export default BusinessCardFrame;
