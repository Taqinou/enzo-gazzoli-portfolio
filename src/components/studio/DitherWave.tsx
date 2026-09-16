"use client";

import { useEffect, useRef } from "react";

// Taille d'un pixel de trame (px CSS), proche des pixels des visuels travaux.
const CELL = 3;
// Images par seconde : un mouvement de lave lent n'a pas besoin de plus.
const FPS = 30;
// Matrice de Bayer 8×8 : le même tramage ordonné que les visuels des travaux
// (scripts/work-pixel.py).
const BAYER = [
  0, 48, 12, 60, 3, 51, 15, 63, 32, 16, 44, 28, 35, 19, 47, 31, 8, 56, 4, 52, 11, 59, 7, 55, 40, 24, 36, 20, 43, 27, 39,
  23, 2, 50, 14, 62, 1, 49, 13, 61, 34, 18, 46, 30, 33, 17, 45, 29, 10, 58, 6, 54, 9, 57, 5, 53, 42, 26, 38, 22, 41, 25,
  37, 21,
].map((v) => (v + 0.5) / 64);

/**
 * Passage au bleu tramé, vivant : une bande de pixels bleus #0000ff en tramage
 * ordonné (comme les visuels des travaux), clairsemée en haut, pleine en bas,
 * dont la frontière ondule lentement comme de la lave. Dessinée dans un canvas
 * basse définition agrandi sans lissage (pixels nets). Arrêtée hors écran ;
 * image fixe sous prefers-reduced-motion.
 */
export default function DitherWave({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cols = 0;
    let rows = 0;
    let image: ImageData | null = null;
    let raf = 0;
    let last = 0;
    let visible = false;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      cols = Math.max(1, Math.ceil(rect.width / CELL));
      rows = Math.max(1, Math.ceil(rect.height / CELL));
      canvas.width = cols;
      canvas.height = rows;
      image = ctx.createImageData(cols, rows);
    };

    const draw = (t: number) => {
      if (!image) return;
      const data = image.data;
      for (let y = 0; y < rows; y++) {
        const fy = y / (rows - 1 || 1);
        for (let x = 0; x < cols; x++) {
          // houle lente : trois ondes croisées, comme une lave qui roule
          const wave =
            0.07 * Math.sin(x * 0.03 + t * 0.1) +
            0.04 * Math.sin(x * 0.08 - t * 0.16 + fy * 2.4) +
            0.025 * Math.sin((x + y * 1.7) * 0.05 + t * 0.24);
          const v = fy * 1.25 - 0.2 + wave;
          const on = v > BAYER[(y % 8) * 8 + (x % 8)];
          const i = (y * cols + x) * 4;
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = 255;
          data[i + 3] = on ? 255 : 0;
        }
      }
      ctx.putImageData(image, 0, 0);
    };

    const loop = (now: number) => {
      if (!visible) return;
      raf = requestAnimationFrame(loop);
      if (now - last < 1000 / FPS) return;
      last = now;
      draw(now / 1000);
    };

    resize();
    draw(0);
    // la hauteur de la section bouge (polices, largeur) : on suit le canvas
    const sizeObserver = new ResizeObserver(() => {
      resize();
      draw(performance.now() / 1000);
    });
    sizeObserver.observe(canvas);

    // animation seulement à l'écran : aucune image calculée hors champ
    const observer = new IntersectionObserver(([entry]) => {
      const was = visible;
      visible = entry.isIntersecting;
      if (visible && !was && !reduce) raf = requestAnimationFrame(loop);
      if (!visible) cancelAnimationFrame(raf);
    });
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      sizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`block [image-rendering:pixelated] ${className}`}
    />
  );
}
