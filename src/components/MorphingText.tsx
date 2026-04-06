import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback, useMemo } from "react";

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
  const [wordIndex, setWordIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentWord = words[wordIndex];

  const longestWord = useMemo(
    () => words.reduce((a, b) => (a.length >= b.length ? a : b), ""),
    [words]
  );

  useEffect(() => {
    const typeSpeed = 80;
    const deleteSpeed = 50;
    const pauseAfterType = interval - 800;

    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && charCount < currentWord.length) {
      // Typing forward
      timeout = setTimeout(() => setCharCount(charCount + 1), typeSpeed);
    } else if (!isDeleting && charCount === currentWord.length) {
      // Finished typing — pause then start deleting
      timeout = setTimeout(() => setIsDeleting(true), pauseAfterType);
    } else if (isDeleting && charCount > 0) {
      // Deleting
      timeout = setTimeout(() => setCharCount(charCount - 1), deleteSpeed);
    } else if (isDeleting && charCount === 0) {
      // Done deleting — move to next word
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timeout);
  }, [charCount, isDeleting, currentWord, words, interval]);

  const displayText = currentWord.slice(0, charCount);

  return (
    <span className={cn("relative inline-block", className)}>
      <span className="invisible font-sans font-bold" aria-hidden="true">
        {longestWord}
      </span>
      <span className="absolute left-0 top-0 font-sans font-bold whitespace-nowrap" style={{ color: 'hsl(var(--ruler-accent))' }}>
        {displayText}
        <span className="animate-pulse ml-[1px] font-light">|</span>
      </span>
    </span>
  );
};
