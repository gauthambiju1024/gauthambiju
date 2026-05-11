import { FrameProps } from "./FrameTypes";

// Writing uses editorial cream paper in the reference design
const NotebookFrame = ({ children }: FrameProps) => {
  return (
    <div className="section-panel editorial-bg border-[hsl(var(--notebook-border)/0.3)] relative w-full overflow-hidden">
      <div className="w-full">{children}</div>
    </div>
  );
};

export default NotebookFrame;
