import { FrameProps } from "./FrameTypes";

const CorkboardFrame = ({ children }: FrameProps) => {
  return (
    <div className="frame-cork relative w-full h-full rounded-md overflow-hidden">
      <span className="absolute top-3 left-4 w-2.5 h-2.5 rounded-full bg-[hsl(var(--primary))] shadow-md z-10" />
      <span className="absolute top-3 right-4 w-2.5 h-2.5 rounded-full bg-[hsl(var(--primary))] shadow-md z-10" />
      <span className="absolute bottom-3 left-4 w-2.5 h-2.5 rounded-full bg-[hsl(var(--primary))] shadow-md z-10" />
      <span className="absolute bottom-3 right-4 w-2.5 h-2.5 rounded-full bg-[hsl(var(--primary))] shadow-md z-10" />
      <div className="absolute inset-0 stage-fit">
        <div className="stage-scroll">{children}</div>
      </div>
    </div>
  );
};

export default CorkboardFrame;
