import { useRef, useState, useCallback, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import MarqueeText from "@/components/MarqueeText";
import BeliefsSection from "@/components/BeliefsSection";
import WorkSection from "@/components/WorkSection";
import StorySection from "@/components/StorySection";
import BlogSection from "@/components/BlogSection";
import ConnectSection from "@/components/ConnectSection";
import Footer from "@/components/Footer";
import FlipPage from "@/components/FlipPage";
import { ChevronLeft, ChevronRight } from "lucide-react";

const pageNavMap: Record<number, string> = {
  0: 'about',
  1: 'work',
  2: 'blog',
  3: 'connect',
};

const navPageMap: Record<string, number> = {
  about: 0,
  work: 1,
  blog: 2,
  connect: 3,
};

const Index = () => {
  const flipBookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);
  const totalPages = 4;

  // Measure container to size the flip book
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.floor(rect.width),
          height: Math.floor(rect.height),
        });
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const onFlip = useCallback((e: any) => {
    setCurrentPage(e.data);
  }, []);

  const flipToPage = useCallback((pageIndex: number) => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flip(pageIndex);
    }
  }, []);

  const goNext = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipNext();
    }
  };

  const goPrev = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipPrev();
    }
  };

  return (
    <div className="h-screen overflow-hidden desk-pattern flex flex-col" style={{ background: 'hsl(var(--background))' }}>
      {/* Navigation */}
      <div className="flex-shrink-0 w-full max-w-7xl mx-auto px-2 md:px-4 lg:px-8">
        <Navigation
          activeSection={pageNavMap[currentPage] || 'about'}
          onNavigate={(sectionId) => {
            const page = navPageMap[sectionId];
            if (page !== undefined) flipToPage(page);
          }}
        />
      </div>

      {/* Notebook outer frame */}
      <div className="flex-1 min-h-0 flex items-center justify-center px-2 md:px-4 lg:px-8 pb-3 md:pb-5">
        <div className="notebook relative w-full max-w-7xl h-full flex flex-col">
          <div className="notebook-spine hidden md:block" />
          <div className="notebook-margin hidden md:block" />
          <div className="notebook-holes hidden md:block">
            <div className="notebook-hole" style={{ top: '80px' }} />
            <div className="notebook-hole" style={{ top: '33%' }} />
            <div className="notebook-hole" style={{ top: '66%' }} />
            <div className="notebook-hole" style={{ bottom: '80px' }} />
          </div>
          <div className="page-fold" />

          {/* Flip book container */}
          <div ref={containerRef} className="flip-book-container relative z-[1] flex-1 overflow-hidden flex items-center justify-center">
            {dimensions.width > 0 && dimensions.height > 0 && (
              // @ts-ignore - react-pageflip types are incomplete
              <HTMLFlipBook
                ref={flipBookRef}
                width={dimensions.width}
                height={dimensions.height}
                size="stretch"
                minWidth={300}
                maxWidth={1400}
                minHeight={400}
                maxHeight={1200}
                maxShadowOpacity={0.3}
                showCover={false}
                mobileScrollSupport={false}
                onFlip={onFlip}
                className="flip-book"
                style={{}}
                startPage={0}
                drawShadow={true}
                flippingTime={800}
                usePortrait={true}
                startZIndex={0}
                autoSize={false}
                clickEventForward={true}
                useMouseEvents={true}
                swipeDistance={30}
                showPageCorners={true}
                disableFlipByClick={false}
              >
                {/* Page 1: Hero + Marquee + Beliefs */}
                <FlipPage>
                  <HeroSection />
                  <MarqueeText />
                  <BeliefsSection />
                </FlipPage>

                {/* Page 2: Work + Story */}
                <FlipPage>
                  <WorkSection />
                  <StorySection />
                </FlipPage>

                {/* Page 3: Blog */}
                <FlipPage>
                  <BlogSection />
                </FlipPage>

                {/* Page 4: Connect + Footer */}
                <FlipPage>
                  <ConnectSection />
                  <Footer />
                </FlipPage>
              </HTMLFlipBook>
            )}
          </div>

          {/* Page controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-4">
            <button
              onClick={goPrev}
              disabled={currentPage === 0}
              className="p-2 rounded-full transition-colors disabled:opacity-20"
              style={{ color: 'hsl(var(--notebook-border))', background: 'hsl(var(--notebook-paper) / 0.8)' }}
            >
              <ChevronLeft size={20} />
            </button>
            <span
              className="font-handwritten text-sm tabular-nums"
              style={{ color: 'hsl(var(--muted-foreground))' }}
            >
              {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={goNext}
              disabled={currentPage === totalPages - 1}
              className="p-2 rounded-full transition-colors disabled:opacity-20"
              style={{ color: 'hsl(var(--notebook-border))', background: 'hsl(var(--notebook-paper) / 0.8)' }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
