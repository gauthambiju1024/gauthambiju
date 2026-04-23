import { FrameProps } from "./FrameTypes";

// Writing uses editorial cream paper in the reference design
const NotebookFrame = ({ children }: FrameProps) => {
  return (
    <div className="section-panel editorial-bg border-[hsl(var(--notebook-border)/0.3)] relative w-full h-full overflow-hidden">
      <div className="absolute inset-0 stage-fit">
        <div className="stage-scroll">{children}</div>
      </div>
    </div>
  );
};

export default NotebookFrame;
