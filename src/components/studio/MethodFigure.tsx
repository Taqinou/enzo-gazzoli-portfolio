"use client";

// Figures de la méthode : la même scène en perspective isométrique que les
// figures de l'offre (plateau, page, bloc bleu), qui raconte les quatre étapes
// d'un seul geste : on cadre, on dessine la page, on la construit, on la met en
// ligne. Chaque figure se construit au fil du scroll dans son étape : --p
// (0 → 1, posé par MethodSection sur chaque figure) pilote ses calques via des
// sous-progressions clamp(). Hors scroll (mobile, mouvement réduit) : --p
// absent, la figure est complète. Géométrie générée, viewBox 200×200.
export default function MethodFigure({ step, className = "" }: { step: string; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 200 200" className={`offer-fig ${className}`}>
      {FIGURES[step]}
    </svg>
  );
}

const FIGURES: Record<string, React.ReactNode> = {
  // 01 cadrage
  "01": (
    <>
      <g>
        <polygon className="fig-face" points="9.93,118 117.32,180 117.32,176 9.93,114" />
        <polygon className="fig-face" points="190.07,138 117.32,180 117.32,176 190.07,134" />
        <polygon className="fig-face" points="82.68,72 190.07,134 117.32,176 9.93,114" />
      </g>
      <g style={{ "--a": "clamp(0, calc((var(--p, 1) - 0) / 0.75), 1)" } as React.CSSProperties}>
        <g style={{ transformBox: "view-box", transformOrigin: "100px 122px", transform: "translateY(calc((1 - var(--a)) * -34px)) scale(calc(1 + (1 - var(--a)) * 0.7))", opacity: "calc(0.25 + var(--a) * 0.75)" } as React.CSSProperties}>
          <path className="fig-rule" d="M101.73 93 L87.88 85 L74.02 93" />
          <path className="fig-rule" d="M150.23 121 L164.09 129 L150.23 137" />
          <path className="fig-rule" d="M49.77 123 L35.91 115 L49.77 107" />
          <path className="fig-rule" d="M98.27 151 L112.12 159 L125.98 151" />
        </g>
      </g>
      <circle className="fig-blue" cx="100" cy="122" r="3" style={{ opacity: "clamp(0, calc((var(--p, 1) - 0.72) / 0.2), 1)" }} />
    </>
  ),
  // 02 design
  "02": (
    <>
      <g>
        <polygon className="fig-face" points="9.93,118 117.32,180 117.32,176 9.93,114" />
        <polygon className="fig-face" points="190.07,138 117.32,180 117.32,176 190.07,134" />
        <polygon className="fig-face" points="82.68,72 190.07,134 117.32,176 9.93,114" />
      </g>
      <g style={{ "--l1": "clamp(0, calc((var(--p, 1) - 0.0) / 0.35), 1)", transform: "translateY(calc((1 - var(--l1)) * -46px))", opacity: "var(--l1)" } as React.CSSProperties}>
        <polygon className="fig-face" points="32.45,115 112.12,161 112.12,159 32.45,113" />
        <polygon className="fig-face" points="167.55,129 112.12,161 112.12,159 167.55,127" />
        <polygon className="fig-face" points="87.88,81 167.55,127 112.12,159 32.45,113" />
      </g>
      <g style={{ "--l2": "clamp(0, calc((var(--p, 1) - 0.3) / 0.35), 1)", transform: "translateY(calc((1 - var(--l2)) * -46px))", opacity: "var(--l2)" } as React.CSSProperties}>
        <polygon className="fig-inner" points="70.56,96.5 103.46,115.5 96.54,119.5 63.63,100.5" />
        <polygon className="fig-inner" points="106.93,117.5 139.84,136.5 132.91,140.5 100,121.5" />
        <polygon className="fig-inner" points="60.16,102.5 82.68,115.5 65.36,125.5 42.84,112.5" />
        <polygon className="fig-inner" points="86.14,117.5 106.93,129.5 89.61,139.5 68.82,127.5" />
        <polygon className="fig-inner" points="110.39,131.5 129.44,142.5 112.12,152.5 93.07,141.5" />
      </g>
      <g style={{ "--l3": "clamp(0, calc((var(--p, 1) - 0.6) / 0.35), 1)", transform: "translateY(calc((1 - var(--l3)) * -46px))", opacity: "var(--l3)" } as React.CSSProperties}>
        <polygon className="fig-blue" points="88.74,86 158.02,126 145.03,133.5 75.75,93.5" />
      </g>
    </>
  ),
  // 03 développement
  "03": (
    <>
      <g>
        <polygon className="fig-face" points="9.93,118 117.32,180 117.32,176 9.93,114" />
        <polygon className="fig-face" points="190.07,138 117.32,180 117.32,176 190.07,134" />
        <polygon className="fig-face" points="82.68,72 190.07,134 117.32,176 9.93,114" />
      </g>
      <g>
        <polygon className="fig-face" points="32.45,115 112.12,161 112.12,159 32.45,113" />
        <polygon className="fig-face" points="167.55,129 112.12,161 112.12,159 167.55,127" />
        <polygon className="fig-face" points="87.88,81 167.55,127 112.12,159 32.45,113" />
        <polygon className="fig-blue" points="88.74,86 158.02,126 145.03,133.5 75.75,93.5" />
      </g>
      <g>
        <polygon className="fig-inner" points="70.56,96.5 103.46,115.5 96.54,119.5 63.63,100.5" />
        <g style={{ "--b0": "clamp(0, calc((var(--p, 1) - 0.05) / 0.2), 1)", transform: "translateY(calc((1 - var(--b0)) * 6px))", opacity: "var(--b0)" } as React.CSSProperties}>
          <polygon className="fig-face" points="63.63,101 96.54,120 96.54,114 63.63,95" />
          <polygon className="fig-face" points="103.46,116 96.54,120 96.54,114 103.46,110" />
          <polygon className="fig-face" points="70.56,91 103.46,110 96.54,114 63.63,95" />
        </g>
      </g>
      <g>
        <polygon className="fig-inner" points="60.16,102.5 82.68,115.5 65.36,125.5 42.84,112.5" />
        <g style={{ "--b1": "clamp(0, calc((var(--p, 1) - 0.21) / 0.2), 1)", transform: "translateY(calc((1 - var(--b1)) * 6px))", opacity: "var(--b1)" } as React.CSSProperties}>
          <polygon className="fig-face" points="42.84,113 65.36,126 65.36,120 42.84,107" />
          <polygon className="fig-face" points="82.68,116 65.36,126 65.36,120 82.68,110" />
          <polygon className="fig-face" points="60.16,97 82.68,110 65.36,120 42.84,107" />
        </g>
      </g>
      <g>
        <polygon className="fig-inner" points="106.93,117.5 139.84,136.5 132.91,140.5 100,121.5" />
        <g style={{ "--b2": "clamp(0, calc((var(--p, 1) - 0.37) / 0.2), 1)", transform: "translateY(calc((1 - var(--b2)) * 6px))", opacity: "var(--b2)" } as React.CSSProperties}>
          <polygon className="fig-face" points="100,122 132.91,141 132.91,135 100,116" />
          <polygon className="fig-face" points="139.84,137 132.91,141 132.91,135 139.84,131" />
          <polygon className="fig-face" points="106.93,112 139.84,131 132.91,135 100,116" />
        </g>
      </g>
      <g>
        <polygon className="fig-inner" points="86.14,117.5 106.93,129.5 89.61,139.5 68.82,127.5" />
        <g style={{ "--b3": "clamp(0, calc((var(--p, 1) - 0.53) / 0.2), 1)", transform: "translateY(calc((1 - var(--b3)) * 6px))", opacity: "var(--b3)" } as React.CSSProperties}>
          <polygon className="fig-face" points="68.82,128 89.61,140 89.61,134 68.82,122" />
          <polygon className="fig-face" points="106.93,130 89.61,140 89.61,134 106.93,124" />
          <polygon className="fig-face" points="86.14,112 106.93,124 89.61,134 68.82,122" />
        </g>
      </g>
      <g>
        <polygon className="fig-inner" points="110.39,131.5 129.44,142.5 112.12,152.5 93.07,141.5" />
        <g style={{ "--b4": "clamp(0, calc((var(--p, 1) - 0.69) / 0.2), 1)", transform: "translateY(calc((1 - var(--b4)) * 6px))", opacity: "var(--b4)" } as React.CSSProperties}>
          <polygon className="fig-face" points="93.07,142 112.12,153 112.12,147 93.07,136" />
          <polygon className="fig-face" points="129.44,143 112.12,153 112.12,147 129.44,137" />
          <polygon className="fig-face" points="110.39,126 129.44,137 112.12,147 93.07,136" />
        </g>
      </g>
    </>
  ),
  // 04 mise en ligne
  "04": (
    <>
      <g>
        <polygon className="fig-face" points="9.93,118 117.32,180 117.32,176 9.93,114" />
        <polygon className="fig-face" points="190.07,138 117.32,180 117.32,176 190.07,134" />
        <polygon className="fig-face" points="82.68,72 190.07,134 117.32,176 9.93,114" />
      </g>
      <g style={{ "--u": "clamp(0, calc(var(--p, 1) / 0.55), 1)", transformBox: "view-box", transformOrigin: "100px 124px", transform: "scale(calc(1 - var(--u) * 0.22))", opacity: "calc(1 - var(--u) * 0.45)" } as React.CSSProperties}>
        <polygon className="fig-shadow" points="87.88,85 167.55,131 112.12,163 32.45,117" />
      </g>
      <g style={{ "--r1": "clamp(0, calc((var(--p, 1) - 0.3) / 0.5), 1)", transformBox: "view-box", transformOrigin: "100px 124px", transform: "scale(calc(0.35 + var(--r1) * 1.25))", opacity: "calc(min(var(--r1) * 4, 1) * (1 - var(--r1)))" } as React.CSSProperties}>
        <ellipse className="fig-signal" cx="100" cy="124" rx="36" ry="21" />
      </g>
      <g style={{ "--r2": "clamp(0, calc((var(--p, 1) - 0.5) / 0.5), 1)", transformBox: "view-box", transformOrigin: "100px 124px", transform: "scale(calc(0.35 + var(--r2) * 1.25))", opacity: "calc(min(var(--r2) * 4, 1) * (1 - var(--r2)))" } as React.CSSProperties}>
        <ellipse className="fig-signal" cx="100" cy="124" rx="36" ry="21" />
      </g>
      <g style={{ "--u": "clamp(0, calc(var(--p, 1) / 0.55), 1)", transform: "translateY(calc(var(--u) * -36px))" } as React.CSSProperties}>
        <polygon className="fig-face" points="32.45,115 112.12,161 112.12,159 32.45,113" />
        <polygon className="fig-face" points="167.55,129 112.12,161 112.12,159 167.55,127" />
        <polygon className="fig-face" points="87.88,81 167.55,127 112.12,159 32.45,113" />
        <polygon className="fig-blue" points="88.74,86 158.02,126 145.03,133.5 75.75,93.5" />
        <polygon className="fig-face" points="63.63,101 96.54,120 96.54,114 63.63,95" />
        <polygon className="fig-face" points="103.46,116 96.54,120 96.54,114 103.46,110" />
        <polygon className="fig-face" points="70.56,91 103.46,110 96.54,114 63.63,95" />
        <polygon className="fig-face" points="100,122 132.91,141 132.91,135 100,116" />
        <polygon className="fig-face" points="139.84,137 132.91,141 132.91,135 139.84,131" />
        <polygon className="fig-face" points="106.93,112 139.84,131 132.91,135 100,116" />
        <polygon className="fig-face" points="42.84,113 65.36,126 65.36,120 42.84,107" />
        <polygon className="fig-face" points="82.68,116 65.36,126 65.36,120 82.68,110" />
        <polygon className="fig-face" points="60.16,97 82.68,110 65.36,120 42.84,107" />
        <polygon className="fig-face" points="68.82,128 89.61,140 89.61,134 68.82,122" />
        <polygon className="fig-face" points="106.93,130 89.61,140 89.61,134 106.93,124" />
        <polygon className="fig-face" points="86.14,112 106.93,124 89.61,134 68.82,122" />
        <polygon className="fig-face" points="93.07,142 112.12,153 112.12,147 93.07,136" />
        <polygon className="fig-face" points="129.44,143 112.12,153 112.12,147 129.44,137" />
        <polygon className="fig-face" points="110.39,126 129.44,137 112.12,147 93.07,136" />
      </g>
    </>
  ),
};
