"use client";

import { useEffect, useRef } from "react";

// Matrice de Bayer 4×4 (seuils 0..1) : le même tramage ordonné que les visuels
// pixel des travaux (scripts/work-pixel.py).
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
const EMPTY = 0;
const CREAM = 1;
const BLUE = 2;
// Les gris des figures sont très clairs (encre à 5-7 %) : renforcés pour que la
// trame les montre.
const GRAY_BOOST = 2.5;
const CELL = 2;
// Faces éclairées comme un objet : la trame dit le volume (part de points
// allumés, en seizièmes). Même sens que le produit bleu de la boutique : le
// côté gauche plus sombre que le droit.
const FACE_TOP = 2 / 16;
const FACE_RIGHT = 4 / 16;
const FACE_LEFT = 6 / 16;

/** Orientation d'une face isométrique d'après ses arêtes (verticales, diagonales). */
function faceTone(pts: number[]) {
  let vertical = false;
  let down = false;
  let up = false;
  const n = pts.length / 2;
  for (let k = 0; k < n; k++) {
    const dx = pts[((k + 1) % n) * 2] - pts[k * 2];
    const dy = pts[((k + 1) % n) * 2 + 1] - pts[k * 2 + 1];
    if (Math.hypot(dx, dy) < 0.5) continue;
    if (Math.abs(dx) < 0.5) vertical = true;
    else if (Math.abs(dy) > Math.abs(dx) * 0.1) {
      if (dx * dy > 0) down = true;
      else up = true;
    }
  }
  if (vertical && down && !up) return FACE_LEFT;
  if (vertical && up && !down) return FACE_RIGHT;
  return FACE_TOP;
}

interface PixelSvgProps {
  viewBox: string;
  /** Boîte de la figure : doit porter le positionnement (relative, absolute…). */
  className?: string;
  /** Classes de la figure SVG elle-même (offer-fig, on, scale…). */
  svgClassName?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

interface Shape {
  el: SVGGraphicsElement;
  pts: number[];
  closed: boolean;
  chain: Element[];
  css: CSSStyleDeclaration;
  face: number;
}

/**
 * Une figure au trait imprimée en pixels, comme les visuels des travaux :
 * carrés bleus #0000ff sur crème, gris rendus par tramage ordonné. Le SVG
 * reste dans la page, invisible, et garde toutes ses animations (survol de
 * l'offre, --p de la méthode) ; à chaque image où il bouge, ses formes sont
 * relues (position animée, opacité, couleurs) et redessinées sur une grille de
 * pixels fixe dans un canvas, agrandi sans lissage.
 */
export default function PixelSvg({ viewBox, className = "", svgClassName = "", style, children }: PixelSvgProps) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const svg = svgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !svg || !canvas || !ctx) return;

    const root = getComputedStyle(document.documentElement);
    const rgb = (name: string, fallback: number[]) => {
      const v = root.getPropertyValue(name).trim().split(/\s+/).map(Number);
      return v.length === 3 && v.every((n) => !Number.isNaN(n)) ? v : fallback;
    };
    const bg = rgb("--bg-rgb", [247, 246, 245]);
    const blue = rgb("--blue-rgb", [0, 0, 255]);
    const bgLum = (bg[0] + bg[1] + bg[2]) / 3;

    // géométrie locale de chaque forme (statique ; seules les transformations bougent)
    const shapes: Shape[] = [];
    svg.querySelectorAll<SVGGraphicsElement>("polygon,polyline,line,path,circle,ellipse").forEach((el) => {
      const tag = el.tagName.toLowerCase();
      const pts: number[] = [];
      let closed = true;
      if (tag === "polygon" || tag === "polyline") {
        const list = (el as SVGPolygonElement).points;
        for (let i = 0; i < list.numberOfItems; i++) {
          const p = list.getItem(i);
          pts.push(p.x, p.y);
        }
        closed = tag === "polygon";
      } else if (tag === "line") {
        const l = el as SVGLineElement;
        pts.push(l.x1.baseVal.value, l.y1.baseVal.value, l.x2.baseVal.value, l.y2.baseVal.value);
        closed = false;
      } else if (tag === "circle" || tag === "ellipse") {
        const c = el as SVGEllipseElement & SVGCircleElement;
        const cx = c.cx.baseVal.value;
        const cy = c.cy.baseVal.value;
        const rx = tag === "circle" ? c.r.baseVal.value : c.rx.baseVal.value;
        const ry = tag === "circle" ? c.r.baseVal.value : c.ry.baseVal.value;
        for (let k = 0; k < 32; k++) {
          const a = (k / 32) * Math.PI * 2;
          pts.push(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry);
        }
      } else {
        const d = el.getAttribute("d") ?? "";
        closed = /z/i.test(d);
        if (/^[\sMLZz\d.,-]+$/.test(d)) {
          const nums = d.match(/-?\d*\.?\d+/g)?.map(Number) ?? [];
          for (let i = 0; i + 1 < nums.length; i += 2) pts.push(nums[i], nums[i + 1]);
        } else {
          const path = el as SVGPathElement;
          const len = path.getTotalLength();
          for (let k = 0; k <= 24; k++) {
            const p = path.getPointAtLength((len * k) / 24);
            pts.push(p.x, p.y);
          }
        }
      }
      const chain: Element[] = [];
      for (let p: Element | null = el; p && p !== svg; p = p.parentElement) chain.push(p);
      shapes.push({ el, pts, closed, chain, css: getComputedStyle(el), face: closed ? faceTone(pts) : 0 });
    });

    const colors = new Map<string, number[] | null>();
    const parseColor = (s: string) => {
      if (colors.has(s)) return colors.get(s)!;
      let out: number[] | null = null;
      const nums = s === "none" ? null : s.match(/-?\d*\.?\d+(?:e-?\d+)?/g)?.map(Number);
      if (nums && nums.length >= 3) {
        const k = s.startsWith("color(") ? 255 : 1;
        out = [nums[0] * k, nums[1] * k, nums[2] * k, nums[3] ?? 1];
      }
      colors.set(s, out);
      return out;
    };

    let W = 0;
    let H = 0;
    let cell = CELL;
    let margin = 0;
    let buf = new Uint8Array(0);
    let image: ImageData | null = null;

    const resize = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (!w || !h) return false;
      // pixels de 2 px, la taille à l'écran de ceux des visuels des travaux
      cell = CELL;
      // marge : les mouvements des figures débordent de leur boîte
      margin = Math.ceil((Math.max(w, h) * 0.5) / cell);
      const nextW = Math.ceil(w / cell) + margin * 2;
      const nextH = Math.ceil(h / cell) + margin * 2;
      if (nextW !== W || nextH !== H) {
        W = nextW;
        H = nextH;
        canvas.width = W;
        canvas.height = H;
        buf = new Uint8Array(W * H);
        image = ctx.createImageData(W, H);
      }
      Object.assign(canvas.style, {
        left: `${-margin * cell}px`,
        top: `${-margin * cell}px`,
        width: `${W * cell}px`,
        height: `${H * cell}px`,
      });
      return true;
    };

    const dissolve = (i: number, j: number, opacity: number) =>
      opacity < 1 && opacity <= BAYER[(((j + 2) & 3) << 2) | ((i + 1) & 3)];

    const plot = (i: number, j: number, opacity: number) => {
      if (i < 0 || j < 0 || i >= W || j >= H || dissolve(i, j, opacity)) return;
      buf[j * W + i] = BLUE;
    };

    const stroke = (x0: number, y0: number, x1: number, y1: number, width: number, opacity: number) => {
      let x = Math.floor(x0);
      let y = Math.floor(y0);
      const xe = Math.floor(x1);
      const ye = Math.floor(y1);
      const dx = Math.abs(xe - x);
      const dy = -Math.abs(ye - y);
      const sx = x < xe ? 1 : -1;
      const sy = y < ye ? 1 : -1;
      let err = dx + dy;
      for (let guard = 0; guard < 4096; guard++) {
        plot(x, y, opacity);
        if (width > 1) {
          plot(x + 1, y, opacity);
          plot(x, y + 1, opacity);
          plot(x + 1, y + 1, opacity);
        }
        if (x === xe && y === ye) break;
        const e2 = 2 * err;
        if (e2 >= dy) {
          err += dy;
          x += sx;
        }
        if (e2 <= dx) {
          err += dx;
          y += sy;
        }
      }
    };

    const xs: number[] = [];
    const fill = (pts: number[], tone: number, opaque: boolean, opacity: number) => {
      const n = pts.length / 2;
      let minY = Infinity;
      let maxY = -Infinity;
      for (let k = 0; k < n; k++) {
        minY = Math.min(minY, pts[k * 2 + 1]);
        maxY = Math.max(maxY, pts[k * 2 + 1]);
      }
      const j0 = Math.max(0, Math.ceil(minY - 0.5));
      const j1 = Math.min(H - 1, Math.floor(maxY - 0.5));
      for (let j = j0; j <= j1; j++) {
        const y = j + 0.5;
        xs.length = 0;
        for (let k = 0; k < n; k++) {
          const ax = pts[k * 2];
          const ay = pts[k * 2 + 1];
          const bx = pts[((k + 1) % n) * 2];
          const by = pts[((k + 1) % n) * 2 + 1];
          if ((ay <= y && by > y) || (by <= y && ay > y)) xs.push(ax + ((y - ay) * (bx - ax)) / (by - ay));
        }
        xs.sort((a, b) => a - b);
        for (let k = 0; k + 1 < xs.length; k += 2) {
          const i0 = Math.max(0, Math.ceil(xs[k] - 0.5));
          const i1 = Math.min(W - 1, Math.floor(xs[k + 1] - 0.5));
          for (let i = i0; i <= i1; i++) {
            if (dissolve(i, j, opacity)) continue;
            const on = BAYER[((j & 3) << 2) | (i & 3)] < tone;
            if (opaque) buf[j * W + i] = on ? BLUE : CREAM;
            else if (on) buf[j * W + i] = BLUE;
          }
        }
      }
    };

    // part d'encre d'une couleur : mélange de bleu, ou gris (renforcé)
    // les faces crème ou grises opaques prennent en plus la trame de leur orientation
    const toneOf = (c: number[], face: number) => {
      const [r, g, b, a] = c;
      if (b > r + 30 && b > g + 30) return Math.min(1, Math.max(0, 1 - (r + g) / (bg[0] + bg[1]))) * a;
      const ink = Math.max(0, (bgLum - (r + g + b) / 3) / bgLum);
      return Math.min(1, ink * a * GRAY_BOOST + (a >= 0.99 ? face : 0));
    };

    const pts: number[] = [];
    const render = () => {
      if (!image) return;
      const svgCss = getComputedStyle(svg);
      // transformation CSS du SVG lui-même (mise à l'échelle au survol), autour de son origine
      const origin = svgCss.transformOrigin.split(" ").map(parseFloat);
      const own = svgCss.transform === "none" ? new DOMMatrix() : new DOMMatrix(svgCss.transform);
      const toGrid = new DOMMatrix()
        .translateSelf(margin, margin)
        .scaleSelf(1 / cell)
        .translateSelf(origin[0] || 0, origin[1] || 0)
        .multiplySelf(own)
        .translateSelf(-(origin[0] || 0), -(origin[1] || 0));

      buf.fill(EMPTY);
      for (const s of shapes) {
        const ctm = s.el.getCTM();
        if (!ctm) return;
        let opacity = 1;
        for (const node of s.chain) opacity *= parseFloat(getComputedStyle(node).opacity) || 0;
        if (opacity < 0.02) continue;
        const m = toGrid.multiply(ctm);
        pts.length = 0;
        for (let k = 0; k < s.pts.length; k += 2) {
          const x = s.pts[k];
          const y = s.pts[k + 1];
          pts.push(m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f);
        }
        const fillColor = s.closed ? parseColor(s.css.fill) : null;
        if (fillColor && pts.length >= 6) {
          fill(pts, toneOf(fillColor, s.face), fillColor[3] >= 0.99, opacity);
        }
        const strokeColor = parseColor(s.css.stroke);
        if (strokeColor && strokeColor[3] > 0) {
          const width = Math.max(1, Math.round((parseFloat(s.css.strokeWidth) || 1) / cell));
          const count = pts.length / 2;
          const segments = s.closed ? count : count - 1;
          for (let k = 0; k < segments; k++) {
            const b = (k + 1) % count;
            stroke(pts[k * 2], pts[k * 2 + 1], pts[b * 2], pts[b * 2 + 1], width, opacity);
          }
        }
      }

      const data = image.data;
      for (let k = 0; k < buf.length; k++) {
        const o = k * 4;
        const v = buf[k];
        if (v === EMPTY) {
          data[o + 3] = 0;
          continue;
        }
        const c = v === BLUE ? blue : bg;
        data[o] = c[0];
        data[o + 1] = c[1];
        data[o + 2] = c[2];
        data[o + 3] = 255;
      }
      ctx.putImageData(image, 0, 0);
    };

    // on ne redessine que quand la figure bouge, et seulement à l'écran
    let raf = 0;
    let visible = true;
    let dirty = true;
    const frame = () => {
      raf = 0;
      if (!visible) {
        dirty = true;
        return;
      }
      dirty = false;
      if (!W && !resize()) return;
      render();
      if (svg.getAnimations({ subtree: true }).length) schedule();
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onResize = new ResizeObserver(() => {
      if (resize()) schedule();
    });
    onResize.observe(wrap);
    const onChange = new MutationObserver((records) => {
      if (records.some((r) => r.target !== canvas)) schedule();
    });
    onChange.observe(wrap, { attributes: true, subtree: true, attributeFilter: ["class", "style"] });
    const onView = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && dirty) schedule();
      },
      { rootMargin: "25%" },
    );
    onView.observe(wrap);
    svg.addEventListener("transitionrun", schedule);
    schedule();

    return () => {
      cancelAnimationFrame(raf);
      onResize.disconnect();
      onChange.disconnect();
      onView.disconnect();
      svg.removeEventListener("transitionrun", schedule);
    };
  }, []);

  return (
    <span ref={wrapRef} aria-hidden="true" className={`block ${className}`} style={style}>
      <svg ref={svgRef} viewBox={viewBox} className={`invisible absolute inset-0 h-full w-full ${svgClassName}`}>
        {children}
      </svg>
      <canvas ref={canvasRef} className="pointer-events-none absolute max-w-none [image-rendering:pixelated]" />
    </span>
  );
}
