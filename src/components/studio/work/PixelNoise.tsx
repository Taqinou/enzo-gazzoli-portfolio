"use client";

import { useEffect, useRef } from "react";

// Grille des visuels pixel : image source 2400×1463, pixels de 5 px
// (scripts/work-pixel.py). Le bruit se pose exactement sur cette grille.
const SRC_W = 2400;
const SRC_H = 1463;
const SRC_PX = 5;
const COLS = SRC_W / SRC_PX;
const ROWS = Math.ceil(SRC_H / SRC_PX);
// Part des pixels qui scintillent en même temps, et durée d'un scintillement
// (tirée entre les deux bornes) : plus elle est longue, plus le bruit est lent.
const DENSITY = 0.022;
const LIFE_MIN = 300;
const LIFE_MAX = 900;
const FPS = 30;

interface PixelNoiseProps {
  /** Le visuel pixel sous le bruit. */
  src: string;
  /**
   * Visuels presque entièrement bleus (plaque sneakerscope, logo 7eyes) : le
   * bruit ne touche que le motif crème (texte, logo) et son contour, en
   * inversant ses pixels ; le fond bleu reste intact.
   */
  markOnly?: boolean;
}

interface Spark {
  idx: number;
  light: boolean;
  until: number;
}

/**
 * Bruit léger au survol d'un projet : quelques pixels de la trame changent de
 * couleur (bleu ↔ crème), chacun pendant quelques centaines de millisecondes,
 * alignés sur la grille du visuel (même recadrage object-cover). L'image reste
 * lisible, elle « grésille » à peine. Tourne seulement pendant le survol du
 * lien parent (.group) ; rien sous prefers-reduced-motion ni sur écran tactile.
 */
export default function PixelNoise({ src, markOnly = false }: PixelNoiseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.closest<HTMLElement>(".group");
    if (!canvas || !host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce), (hover: none)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const styles = getComputedStyle(document.documentElement);
    const blue = styles.getPropertyValue("--blue").trim() || "#0000ff";
    const cream = styles.getPropertyValue("--bg").trim() || "#f7f6f5";

    // Mode motif seul : cellules crème du visuel, et cellules candidates (le
    // motif dilaté d'une cellule, pour que son contour grésille aussi).
    let creamCells: Uint8Array | null = null;
    let candidates: Int32Array | null = null;
    let loading = false;
    const loadMark = () => {
      if (loading) return;
      loading = true;
      const img = new window.Image();
      img.src = src;
      img
        .decode()
        .then(() => {
          const off = document.createElement("canvas");
          off.width = COLS;
          off.height = ROWS;
          const octx = off.getContext("2d");
          if (!octx) return;
          octx.imageSmoothingEnabled = false;
          octx.drawImage(img, 0, 0, COLS, ROWS);
          const data = octx.getImageData(0, 0, COLS, ROWS).data;
          const light = new Uint8Array(COLS * ROWS);
          for (let k = 0; k < light.length; k++) light[k] = data[k * 4] > 128 ? 1 : 0;
          const list: number[] = [];
          for (let j = 0; j < ROWS; j++) {
            for (let i = 0; i < COLS; i++) {
              let near = false;
              for (let dj = -1; dj <= 1 && !near; dj++) {
                for (let di = -1; di <= 1 && !near; di++) {
                  const x = i + di;
                  const y = j + dj;
                  near = x >= 0 && y >= 0 && x < COLS && y < ROWS && light[y * COLS + x] === 1;
                }
              }
              if (near) list.push(j * COLS + i);
            }
          }
          creamCells = light;
          candidates = Int32Array.from(list);
        })
        .catch(() => {});
    };

    const sparks: Spark[] = [];
    const spark = (now: number, fresh: boolean): Spark => {
      const idx = candidates
        ? candidates[Math.floor(Math.random() * candidates.length)]
        : Math.floor(Math.random() * COLS * ROWS);
      const life = LIFE_MIN + Math.random() * (LIFE_MAX - LIFE_MIN);
      return {
        idx,
        light: creamCells ? creamCells[idx] === 0 : Math.random() < 0.5,
        // au premier remplissage, les fins sont étalées : jamais tous à la fois
        until: now + (fresh ? Math.random() * life : life),
      };
    };

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const w = Math.round(rect.width * dpr);
      const h = Math.round(rect.height * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      // recadrage object-cover du visuel, en pixels du canvas
      const scale = Math.max(w / SRC_W, h / SRC_H);
      const cell = SRC_PX * scale;
      const offX = (w - SRC_W * scale) / 2;
      const offY = (h - SRC_H * scale) / 2;
      const size = Math.ceil(cell);
      ctx.clearRect(0, 0, w, h);
      for (const s of sparks) {
        const x = offX + (s.idx % COLS) * cell;
        const y = offY + Math.floor(s.idx / COLS) * cell;
        if (x + cell < 0 || y + cell < 0 || x > w || y > h) continue;
        ctx.fillStyle = s.light ? cream : blue;
        ctx.fillRect(Math.round(x), Math.round(y), size, size);
      }
    };

    let raf = 0;
    let last = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 1000 / FPS) return;
      last = now;
      if (markOnly && !candidates) return;
      const target = Math.round((candidates ? candidates.length : COLS * ROWS) * DENSITY);
      for (let k = 0; k < sparks.length; k++) {
        if (sparks[k].until <= now) sparks[k] = spark(now, false);
      }
      while (sparks.length < target) sparks.push(spark(now, true));
      draw();
    };
    const start = () => {
      if (markOnly) loadMark();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      sparks.length = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    host.addEventListener("mouseenter", start);
    host.addEventListener("mouseleave", stop);
    return () => {
      stop();
      host.removeEventListener("mouseenter", start);
      host.removeEventListener("mouseleave", stop);
    };
  }, [src, markOnly]);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />;
}
