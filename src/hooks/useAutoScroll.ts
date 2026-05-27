import { useEffect, useState } from "react";

export function useAutoScroll() {
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(1);

  useEffect(() => {
    if (!isScrolling) return;

    const interval = setInterval(() => {
      window.scrollBy(0, scrollSpeed);
    }, 50);

    return () => clearInterval(interval);
  }, [isScrolling, scrollSpeed]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (["ArrowRight", "ArrowLeft", "Space"].includes(event.code)) {
        event.preventDefault();
      }

      if (event.code === "Space") {
        setIsScrolling((prev) => !prev);
      }

      if (event.code === "ArrowRight") {
        setScrollSpeed((prev) => Math.min(10, prev + 1));
      }

      if (event.code === "ArrowLeft") {
        setScrollSpeed((prev) => Math.max(1, prev - 1));
      }
    }

    window.addEventListener("keydown", handleKeyDown, { passive: false });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return {
    isScrolling,
    setIsScrolling,
    scrollSpeed,
    setScrollSpeed,
  };
}
