import { FrameProps } from "./FrameTypes";

const BookshelfFrame = ({ children }: FrameProps) => {
  return (
    <div className="section-panel shelf-bg border-[hsl(var(--shelf-wood-light)/0.3)] relative w-full h-full overflow-hidden">
      <div className="absolute inset-0 stage-fit">
        <div className="stage-scroll">{children}</div>
      </div>
    </div>
  );
};

export default BookshelfFrame;
