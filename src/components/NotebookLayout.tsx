import { ReactNode } from "react";

interface NotebookLayoutProps {
  children: ReactNode;
}

const NotebookLayout = ({ children }: NotebookLayoutProps) => {
  return (
    <div className="min-h-screen desk-pattern py-4 md:py-6 px-2 md:px-4 lg:px-8" style={{ background: 'hsl(20 15% 8%)' }}>
      <div className="notebook notebook-grid max-w-7xl mx-auto relative">
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

        {/* Bookmark tabs */}
        <div className="bookmark-tab" style={{ top: '60px' }} />
        <div className="bookmark-tab" style={{ top: '140px', opacity: 0.6, width: '24px' }} />

        {/* Page fold */}
        <div className="page-fold" />

        {/* Content */}
        <div className="relative z-[1]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default NotebookLayout;
