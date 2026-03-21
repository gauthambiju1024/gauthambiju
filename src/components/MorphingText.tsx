import { cn } from "@/lib/utils";
import { useState, useEffect, useMemo } from "react";

interface MorphingTextProps {
  words: string[];
  className?: string;
  interval?: number;
}

export const MorphingText = ({
  words,
  className,
  interval = 3500,
}: MorphingTextProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState(words[0]);

  const longestWord = useMemo(
    () => words.reduce((a, b) => (a.length >= b.length ? a : b), ""),
    [words]
  );

  useEffect(() => {
    const morphDuration = 500;
    const steps = 20;
    let step = 0;
    let morphTimer: ReturnType<typeof setInterval>;

    const currentWord = words[currentIndex];
    const nextWord = words[(currentIndex + 1) % words.length];

    const startMorph = () => {
      step = 0;
      morphTimer = setInterval(() => {
        step++;
        const progress = step / steps;

        if (progress < 0.5) {
          const charCount = Math.max(0, Math.round(currentWord.length * (1 - progress * 2)));
          setDisplayText(currentWord.slice(0, charCount) || "\u00A0");
        } else {
          const charCount = Math.round(nextWord.length * ((progress - 0.5) * 2));
          setDisplayText(nextWord.slice(0, charCount) || "\u00A0");
        }

        if (step >= steps) {
          clearInterval(morphTimer);
          setDisplayText(nextWord);
        }
      }, morphDuration / steps);
    };

    const wordTimeout = setTimeout(startMorph, interval - morphDuration);

    const cycleTimeout = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, interval + 100);

    return () => {
      clearInterval(morphTimer);
      clearTimeout(wordTimeout);
      clearTimeout(cycleTimeout);
    };
  }, [currentIndex, interval, words]);

  return (
    <span className={cn("relative inline-block", className)}>
      {/* Hidden sizer to reserve width */}
      <span className="invisible font-sans font-bold" aria-hidden="true">
        {longestWord}
      </span>
      {/* Visible text overlaid */}
      <span className="absolute left-0 top-0 font-sans font-bold text-primary whitespace-nowrap">
        {displayText}
      </span>
    </span>
  );
};
