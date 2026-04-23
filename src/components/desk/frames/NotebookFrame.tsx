import { FrameProps } from "./FrameTypes";

const NotebookFrame = ({ children }: FrameProps) => {
  return (
    <div className="frame-notebook relative w-full h-full rounded-md overflow-hidden">
      <div className="absolute top-0 bottom-0 left-1/2 w-1 -translate-x-1/2 frame-notebook-spine pointer-events-none z-10" />
      <div className="absolute inset-0 stage-fit">
        <div className="stage-scroll">{children}</div>
      </div>
    </div>
  );
};

export default NotebookFrame;
