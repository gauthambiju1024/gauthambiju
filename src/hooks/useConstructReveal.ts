import { useEffect } from "react";

export function useConstructReveal() {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const elements = document.querySelectorAll(".construct, .construct-text");

    if (prefersReduced) {
      elements.forEach((el) => el.classList.add("constructed"));
      return;
    }

    // Small initial delay so even above-fold elements show the ghost state briefly
    const startDelay = 600;
    let staggerIndex = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = startDelay + staggerIndex * 150;
            staggerIndex++;
            setTimeout(() => {
              entry.target.classList.add("constructed");
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}
