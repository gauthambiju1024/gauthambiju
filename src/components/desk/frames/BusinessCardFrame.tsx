import { FrameProps } from "./FrameTypes";

// About uses notebook skin in the reference design
const BusinessCardFrame = ({ children }: FrameProps) => {
  return (
    <div className="notebook notebook-grid relative w-full h-full overflow-hidden">
      <div className="notebook-spine hidden md:block" />
      <div className="notebook-margin hidden md:block" />
      <div className="notebook-holes hidden md:block">
        <div className="notebook-hole" style={{ top: "60px" }} />
        <div className="notebook-hole" style={{ top: "33%" }} />
        <div className="notebook-hole" style={{ top: "66%" }} />
        <div className="notebook-hole" style={{ bottom: "60px" }} />
      </div>
      <div className="page-fold" />
      <div className="absolute inset-0 stage-fit">
        <div className="stage-scroll relative z-[1]">{children}</div>
      </div>
    </div>
  );
};

export default BusinessCardFrame;
