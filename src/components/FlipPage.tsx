import React, { forwardRef, ReactNode } from "react";

interface FlipPageProps {
  children: ReactNode;
}

const FlipPage = forwardRef<HTMLDivElement, FlipPageProps>(({ children }, ref) => {
  return (
    <div ref={ref} className="flip-page">
      <div className="flip-page-content">
        {children}
      </div>
    </div>
  );
});

FlipPage.displayName = "FlipPage";

export default FlipPage;
