import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

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
  const [isMorphing, setIsMorphing] = useState(false);

  const currentWord = words[currentIndex];
  const nextWord = words[(currentIndex + 1) % words.length];

  useEffect(() => {
    const morphDuration = 600;
    const steps = 24;
    let step = 0;
    let morphTimer: ReturnType<typeof setInterval>;

    const startMorph = () => {
      setIsMorphing(true);
      step = 0;

      morphTimer = setInterval(() => {
        step++;
        const progress = step / steps;

        if (progress < 0.5) {
          const charCount = Math.floor(currentWord.length * (1 - progress * 2));
          setDisplayText(currentWord.slice(0, charCount));
        } else {
          const charCount = Math.ceil(nextWord.length * ((progress - 0.5) * 2));
          setDisplayText(nextWord.slice(0, charCount));
        }

        if (step >= steps) {
          clearInterval(morphTimer);
          setDisplayText(nextWord);
          setIsMorphing(false);
        }
      }, morphDuration / steps);
    };

    const wordTimeout = setTimeout(() => {
      startMorph();
    }, interval - morphDuration);

    const cycleTimeout = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, interval + 50);

    return () => {
      clearInterval(morphTimer);
      clearTimeout(wordTimeout);
      clearTimeout(cycleTimeout);
    };
  }, [currentIndex, currentWord, nextWord, interval, words.length]);

  return (
    <span className={cn("relative inline-block", className)}>
      <span
        className={cn(
          "font-sans font-bold text-card-foreground transition-opacity duration-150",
          isMorphing && "opacity-70"
        )}
      >
        {displayText}
        <span
          className="inline-block w-[3px] ml-1 rounded-full bg-primary align-middle transition-opacity duration-300"
          style={{
            height: '0.7em',
            opacity: isMorphing ? 1 : 0,
          }}
        />
      </span>
    </span>
  );
};
