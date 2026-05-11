import { FrameProps } from "./FrameTypes";

const BookshelfFrame = ({ children }: FrameProps) => {
  return (
    <div className="section-panel shelf-bg border-[hsl(var(--shelf-wood-light)/0.3)] relative w-full overflow-hidden">
      <div className="w-full">{children}</div>
    </div>
  );
};

export default BookshelfFrame;
