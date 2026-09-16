"use client";

import PixelSvg from "@/components/studio/PixelSvg";
import type { ProjectType } from "@/data/pricing";

interface OfferFigureProps {
  type: ProjectType;
  on: boolean;
  dim: boolean;
}

// Figures de l'offre : un objet au trait par offre, en perspective isométrique
// (géométrie générée), qui raconte l'offre au survol. Faces pleines couleur
// fond pour cacher les arêtes arrière, un seul détail bleu.
//
// Cadrage : chaque viewBox serre le dessin au repos, et la hauteur vaut
// --fig-s × scale, où scale donne à chaque objet la même surface à l'œil
// (hauteur ∝ √(h/w), la plus haute à 1). Ainsi les quatre ont la même
// présence ; en filigrane au centre de leur case, derrière le titre. Les mouvements
// du survol débordent du cadre (overflow visible).
//
// Au survol (.on), les groupes [data-move] passent de --rx/--ry à --tx/--ty
// (délai --d à l'aller, --od au retour). Styles : .offer-fig dans globals.css.
// Rendu en pixels bleus tramés, comme les visuels des travaux (PixelSvg).
export default function OfferFigure({ type, on, dim }: OfferFigureProps) {
  const { viewBox, ratio, scale, shape } = FIGURES[type];
  return (
    <PixelSvg
      viewBox={viewBox}
      className="relative shrink-0"
      svgClassName={`offer-fig origin-center transition-transform duration-[900ms] ease-out-expo ${
        on ? "on md:scale-[1.12]" : dim ? "md:scale-[0.6]" : ""
      }`}
      style={{ height: `calc(var(--fig-s) * ${scale})`, aspectRatio: ratio }}
    >
      {shape}
    </PixelSvg>
  );
}

interface Figure {
  viewBox: string;
  ratio: string;
  scale: number;
  shape: React.ReactNode;
}

const FIGURES: Record<ProjectType, Figure> = {
  // 01 : une page debout ; au survol, ses sections se détachent vers l'avant.
  website: {
    viewBox: "46.54 10.5 110.39 161",
    ratio: "110.39 / 161",
    scale: 0.926,
    shape: (
      <>
        <g>
          <polygon className="fig-face" points="48.04,110 151.96,170 151.96,74 48.04,14" />
          <polygon className="fig-face" points="155.43,168 151.96,170 151.96,74 155.43,72" />
          <polygon className="fig-face" points="51.5,12 155.43,72 151.96,74 48.04,14" />
        </g>
        <g data-move="" style={{ "--tx": "-5.2px", "--ty": "3px", "--d": "0ms" } as React.CSSProperties}>
          <polygon className="fig-face" points="53.23,23 146.77,77 146.77,83 53.23,29" />
        </g>
        <g data-move="" style={{ "--tx": "-15.59px", "--ty": "9px", "--d": "60ms" } as React.CSSProperties}>
          <polygon className="fig-blue" points="53.23,35 146.77,89 146.77,117 53.23,63" />
        </g>
        <g data-move="" style={{ "--tx": "-8.66px", "--ty": "5px", "--d": "120ms" } as React.CSSProperties}>
          <polygon className="fig-face" points="53.23,70 112.12,104 112.12,109 53.23,75" />
          <polygon className="fig-face" points="53.23,78 125.98,120 125.98,125 53.23,83" />
        </g>
        <g data-move="" style={{ "--tx": "-12.12px", "--ty": "7px", "--d": "180ms" } as React.CSSProperties}>
          <polygon className="fig-face" points="53.23,91 98.27,117 98.27,131 53.23,105" />
          <polygon className="fig-face" points="101.73,119 146.77,145 146.77,159 101.73,133" />
        </g>
      </>
    ),
  },
  // 02 : trois étapes de dossiers ; au survol, le dossier bleu passe à l'étape suivante.
  application: {
    viewBox: "25.75 73.5 148.5 90",
    ratio: "148.5 / 90",
    scale: 0.597,
    shape: (
      <>
        <g>
          <polygon className="fig-face" points="27.25,104 127.71,162 127.71,159 27.25,101" />
          <polygon className="fig-face" points="172.75,136 127.71,162 127.71,159 172.75,133" />
          <polygon className="fig-face" points="72.29,75 172.75,133 127.71,159 27.25,101" />
        </g>
        <line className="fig-rule" x1="106.06" y1="98.5" x2="67.96" y2="120.5" />
        <line className="fig-rule" x1="132.04" y1="113.5" x2="93.94" y2="135.5" />
        <g>
          <polygon className="fig-face" points="54.97,104 70.56,113 70.56,110 54.97,101" />
          <polygon className="fig-face" points="93.07,100 70.56,113 70.56,110 93.07,97" />
          <polygon className="fig-face" points="77.48,88 93.07,97 70.56,110 54.97,101" />
        </g>
        <g>
          <polygon className="fig-face" points="80.95,119 96.54,128 96.54,125 80.95,116" />
          <polygon className="fig-face" points="119.05,115 96.54,128 96.54,125 119.05,112" />
          <polygon className="fig-face" points="103.46,103 119.05,112 96.54,125 80.95,116" />
        </g>
        <g>
          <polygon className="fig-face" points="106.93,134 122.52,143 122.52,140 106.93,131" />
          <polygon className="fig-face" points="145.03,130 122.52,143 122.52,140 145.03,127" />
          <polygon className="fig-face" points="129.44,118 145.03,127 122.52,140 106.93,131" />
        </g>
        <g>
          <polygon className="fig-face" points="106.93,130 122.52,139 122.52,136 106.93,127" />
          <polygon className="fig-face" points="145.03,126 122.52,139 122.52,136 145.03,123" />
          <polygon className="fig-face" points="129.44,114 145.03,123 122.52,136 106.93,127" />
        </g>
        <g data-move="" style={{ "--tx": "0px", "--ty": "-18px", "--d": "0ms", "--od": "720ms", "--dur": "420ms" } as React.CSSProperties}>
          <g data-move="" style={{ "--tx": "25.98px", "--ty": "15px", "--d": "300ms", "--od": "300ms", "--dur": "520ms" } as React.CSSProperties}>
            <g data-move="" style={{ "--tx": "0px", "--ty": "18px", "--d": "720ms", "--od": "0ms", "--dur": "420ms" } as React.CSSProperties}>
              <polygon className="fig-face" points="54.97,100 70.56,109 70.56,106 54.97,97" />
              <polygon className="fig-face" points="93.07,96 70.56,109 70.56,106 93.07,93" />
              <polygon className="fig-blue" points="77.48,84 93.07,93 70.56,106 54.97,97" />
            </g>
          </g>
        </g>
      </>
    ),
  },
  // 03 : un sac ; au survol, l'article bleu tombe dedans.
  shopify: {
    viewBox: "63.86 48.5 72.28 123",
    ratio: "72.28 / 123",
    scale: 1.0,
    shape: (
      <>
        <g>
          <polygon className="fig-inner" points="89.61,130 65.36,144 65.36,94 89.61,80" />
          <polygon className="fig-inner" points="89.61,130 134.64,156 134.64,106 89.61,80" />
        </g>
        {/* anse arrière : attachée au bord haut de la paroi du fond (derrière l'article) */}
        <path className="fig-handle" d="M101.73 87.0 Q112.12 53.0 122.52 99.0" />
        <g data-move="" style={{ "--rx": "0px", "--ry": "-46px", "--tx": "0px", "--ty": "0px", "--dur": "700ms" } as React.CSSProperties}>
          <polygon className="fig-blue-2" points="86.14,120 100,128 100,112 86.14,104" />
          <polygon className="fig-blue-3" points="113.86,120 100,128 100,112 113.86,104" />
          <polygon className="fig-blue" points="100,96 113.86,104 100,112 86.14,104" />
        </g>
        <g>
          <polygon className="fig-face" points="65.36,144 110.39,170 110.39,120 65.36,94" />
          <polygon className="fig-face" points="134.64,156 110.39,170 110.39,120 134.64,106" />
        </g>
        {/* anse avant : attachée au bord haut de la paroi avant */}
        <path className="fig-handle" d="M77.48 101.0 Q87.88 67.0 98.27 113.0" />
      </>
    ),
  },
  // 04 : un document ; au survol, une ligne de lecture le parcourt et deux informations s'en détachent.
  ai: {
    viewBox: "20.56 62.5 158.88 96",
    ratio: "158.88 / 96",
    scale: 0.596,
    shape: (
      <>
        <g>
          <polygon className="fig-face" points="22.06,119 87.88,157 87.88,154 22.06,116" />
          <polygon className="fig-face" points="177.94,105 87.88,157 87.88,154 177.94,102" />
          <polygon className="fig-face" points="112.12,64 177.94,102 87.88,154 22.06,116" />
        </g>
        <line className="fig-text" x1="110.39" y1="75" x2="153.69" y2="100" />
        <line className="fig-text" x1="101.73" y1="80" x2="151.96" y2="109" />
        <g data-move="" style={{ "--tx": "0px", "--ty": "-26px", "--d": "380ms" } as React.CSSProperties}>
          <line className="fig-text fig-extract" x1="93.07" y1="85" x2="127.71" y2="105" />
        </g>
        <line className="fig-text" x1="80.95" y1="92" x2="127.71" y2="119" />
        <line className="fig-text" x1="72.29" y1="97" x2="112.12" y2="120" />
        <g data-move="" style={{ "--tx": "0px", "--ty": "-40px", "--d": "720ms" } as React.CSSProperties}>
          <line className="fig-text fig-extract" x1="63.63" y1="102" x2="113.86" y2="131" />
        </g>
        <line className="fig-text" x1="51.5" y1="109" x2="82.68" y2="127" />
        <line className="fig-text" x1="42.84" y1="114" x2="84.41" y2="138" />
        <g data-move="" style={{ "--tx": "-79.67px", "--ty": "46px", "--dur": "1200ms", "--ease": "cubic-bezier(0.65, 0, 0.35, 1)" } as React.CSSProperties}>
          <line className="fig-scan" x1="106.93" y1="66.5" x2="172.75" y2="104.5" />
        </g>
      </>
    ),
  },
};
