import { useEffect, useState } from "react";

/**
 * Velocidade em pixels por segundo de cada ponto da escala 1–10: o passo 1 vale
 * 12 px/s, o 10 vale 120 px/s. Antes o cálculo era 1px por ponto a cada 50ms
 * (20 px/s por ponto) e até o passo mais lento descia rápido demais para
 * acompanhar cantando.
 */
const PIXELS_PER_SECOND_PER_STEP = 12;

/** ~60fps. O resto fracionário é acumulado, então a escala inteira continua exata. */
const TICK_MS = 16;

export function useAutoScroll(initialSpeed = 5) {
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(initialSpeed);

  useEffect(() => {
    if (!isScrolling) return;

    const perTick = (scrollSpeed * PIXELS_PER_SECOND_PER_STEP * TICK_MS) / 1000;
    // Nas velocidades baixas um tick anda menos de 1px; o navegador arredondaria
    // para zero e a página nunca sairia do lugar. Guardamos a sobra e rolamos só
    // quando ela fecha um pixel inteiro.
    let pending = 0;

    const interval = setInterval(() => {
      pending += perTick;
      const whole = Math.floor(pending);
      if (whole < 1) return;
      pending -= whole;
      window.scrollBy(0, whole);
    }, TICK_MS);

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
