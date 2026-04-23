import { FrameProps } from "./FrameTypes";

const BookshelfFrame = ({ children }: FrameProps) => {
  return (
    <div className="frame-shelf relative w-full h-full rounded-md overflow-hidden">
      <div className="absolute inset-0 stage-fit">
        <div className="stage-scroll">{children}</div>
      </div>
    </div>
  );
};

export default BookshelfFrame;
