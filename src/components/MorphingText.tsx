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
  interval = 4000,
}: MorphingTextProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState(words[0]);
  const [isMorphing, setIsMorphing] = useState(false);

  const longestWord = useMemo(
    () => words.reduce((a, b) => (a.length >= b.length ? a : b), ""),
    [words]
  );

  useEffect(() => {
    const morphDuration = 800;
    const currentWord = words[currentIndex];
    const nextWord = words[(currentIndex + 1) % words.length];
    const totalTicks = currentWord.length + nextWord.length;
    const tickInterval = morphDuration / totalTicks;
    let tick = 0;
    let morphTimer: ReturnType<typeof setInterval>;

    const startMorph = () => {
      tick = 0;
      setIsMorphing(true);
      morphTimer = setInterval(() => {
        tick++;
        if (tick <= currentWord.length) {
          // Phase 1: remove one char at a time
          setDisplayText(currentWord.slice(0, currentWord.length - tick));
        } else {
          // Phase 2: add one char at a time
          const addedChars = tick - currentWord.length;
          setDisplayText(nextWord.slice(0, addedChars));
        }
        if (tick >= totalTicks) {
          clearInterval(morphTimer);
          setDisplayText(nextWord);
          setIsMorphing(false);
        }
      }, tickInterval);
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
      <span className="invisible font-sans font-bold" aria-hidden="true">
        {longestWord}
      </span>
      <span className="absolute left-0 top-0 font-sans font-bold text-card-foreground whitespace-nowrap">
        {displayText}
        {isMorphing && (
          <span className="animate-blink">|</span>
        )}
      </span>
    </span>
  );
};
