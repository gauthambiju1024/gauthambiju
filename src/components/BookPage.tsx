import { ReactNode } from "react";

interface BookPageProps {
  children: ReactNode;
  pageNumber: string;
}

const BookPage = ({ children, pageNumber }: BookPageProps) => {
  return (
    <div className="relative w-full h-full overflow-y-auto overflow-x-hidden">
      {/* Spine */}
      <div className="notebook-spine hidden md:block" />

      {/* Margin line */}
      <div className="notebook-margin hidden md:block" />

      {/* Hole punches */}
      <div className="notebook-holes hidden md:block">
        <div className="notebook-hole" style={{ top: '80px' }} />
        <div className="notebook-hole" style={{ top: '50%', transform: 'translateY(-50%)' }} />
        <div className="notebook-hole" style={{ bottom: '80px' }} />
      </div>

      {/* Page fold */}
      <div className="page-fold" />

      {/* Tape strip page number */}
      <div className="absolute top-6 right-12 md:right-20 tape-strip px-4 py-1.5 hidden md:block z-20">
        <span className="font-handwritten text-sm text-card-foreground/40">{pageNumber}</span>
      </div>

      {/* Content */}
      <div className="relative z-[1]">
        {children}
      </div>
    </div>
  );
};

export default BookPage;
