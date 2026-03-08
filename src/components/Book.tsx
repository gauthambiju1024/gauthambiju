import { useState, useCallback, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BookPage from "./BookPage";

interface PageConfig {
  id: string;
  label: string;
  pageNumber: string;
  content: ReactNode;
}

interface BookProps {
  pages: PageConfig[];
}

const pageVariants = {
  enter: (direction: number) => ({
    rotateY: direction > 0 ? 90 : -90,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    rotateY: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    rotateY: direction > 0 ? -90 : 90,
    opacity: 0,
    scale: 0.95,
  }),
};

const Book = ({ pages }: BookProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);

  const goToPage = useCallback(
    (index: number) => {
      if (index < 0 || index >= pages.length || index === currentPage) return;
      setDirection(index > currentPage ? 1 : -1);
      setCurrentPage(index);
    },
    [currentPage, pages.length]
  );

  const flipForward = useCallback(() => goToPage(currentPage + 1), [currentPage, goToPage]);
  const flipBackward = useCallback(() => goToPage(currentPage - 1), [currentPage, goToPage]);

  // Keyboard support
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") flipForward();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") flipBackward();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [flipForward, flipBackward]);

  // Swipe support
  const [dragStartX, setDragStartX] = useState<number | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    setDragStartX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragStartX === null) return;
    const diff = dragStartX - e.clientX;
    if (Math.abs(diff) > 60) {
      if (diff > 0) flipForward();
      else flipBackward();
    }
    setDragStartX(null);
  };

  return (
    <div className="min-h-screen py-4 md:py-6 px-2 md:px-4 lg:px-8 desk-pattern" style={{ background: 'hsl(20 15% 8%)' }}>
      <div className="max-w-7xl mx-auto relative">
        {/* Bookmark tabs */}
        <div className="hidden md:flex flex-col gap-2 absolute -right-1 top-16 z-30">
          {pages.map((page, i) => (
            <button
              key={page.id}
              onClick={() => goToPage(i)}
              className="relative group"
            >
              <div
                className={`
                  font-handwritten text-sm py-3 rounded-r-md transition-all duration-300 text-center
                  ${i === currentPage
                    ? "w-28 bg-primary text-primary-foreground shadow-lg"
                    : "w-20 bg-card text-card-foreground/50 hover:w-24 hover:text-card-foreground border border-l-0 border-border"
                  }
                `}
              >
                {page.label}
              </div>
            </button>
          ))}
        </div>

        {/* Book container */}
        <div
          className="notebook notebook-grid relative"
          style={{ perspective: "1200px", minHeight: "85vh" }}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentPage}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                rotateY: { type: "spring", stiffness: 200, damping: 30 },
                opacity: { duration: 0.3 },
                scale: { duration: 0.3 },
              }}
              style={{ transformStyle: "preserve-3d", minHeight: "85vh" }}
              className="w-full"
            >
              <BookPage pageNumber={pages[currentPage].pageNumber}>
                {pages[currentPage].content}
              </BookPage>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Arrow buttons on the desk */}
        <div className="flex items-center justify-between mt-4 px-4">
          <button
            onClick={flipBackward}
            disabled={currentPage === 0}
            className="p-3 rounded-full transition-all duration-300 disabled:opacity-20 hover:bg-card/10"
          >
            <ChevronLeft className="w-5 h-5 text-card/50" />
          </button>

          {/* Mobile page dots */}
          <div className="flex gap-2 md:hidden">
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentPage ? "bg-primary w-6" : "bg-card/30"
                }`}
              />
            ))}
          </div>

          <button
            onClick={flipForward}
            disabled={currentPage === pages.length - 1}
            className="p-3 rounded-full transition-all duration-300 disabled:opacity-20 hover:bg-card/10"
          >
            <ChevronRight className="w-5 h-5 text-card/50" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Book;
