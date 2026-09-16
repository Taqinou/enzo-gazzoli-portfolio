// Zoom dans l'image d'un projet, de la home (section travaux) à sa page /work.
//
// Au clic, une copie exacte de la vignette (même fichier, même recadrage
// object-cover, pixels nets) est posée en position fixe par-dessus la page et
// s'agrandit jusqu'au cadre exact du hero de /work (toute la largeur × 82svh,
// ou l'image à son ratio sur téléphone),
// pendant que l'image s'approche (scale → HERO_ZOOM) et que la page s'efface
// sous un papier crème. On navigue pendant le zoom : /work monte son hero à
// l'identique sous la copie (même image, même cadre, même zoom), puis retire la copie une
// fois son image peinte (releaseWorkZoom). Raccord au pixel près.
//
// La couche vit dans document.body, hors de l'arbre React : elle survit au
// changement de route. Variable de module : même contexte JS en navigation SPA.

/** Hauteur du hero de /work sur desktop (md:min-h-[82svh] dans CaseStudyContent). */
export const HERO_HEIGHT_VH = 82;
/** Ratio des visuels (2400×1463) : hauteur du hero sur téléphone (aspect-[2400/1463]). */
const SHOT_RATIO = 1463 / 2400;
/** Zoom de l'image du hero de /work (scale-[1.08] dans CaseStudyContent). */
export const HERO_ZOOM = 1.08;
const DURATION = 700;
const EASE = "cubic-bezier(0.76, 0, 0.24, 1)";

export const workZoom: { slug: string | null; layer: HTMLElement | null; endsAt: number } = {
  slug: null,
  layer: null,
  /** Fin du zoom (performance.now()) : la page projet attend ce moment. */
  endsAt: 0,
};

export function zoomIntoWork(frame: HTMLElement, img: HTMLImageElement, slug: string, navigate: () => void) {
  releaseWorkZoom(true);
  const r = frame.getBoundingClientRect();

  const layer = document.createElement("div");
  // au-dessus de toute la page (nav z-50 comprise)
  layer.style.cssText = "position:fixed;inset:0;z-index:190;pointer-events:none;";

  const paper = document.createElement("div");
  paper.style.cssText = `position:absolute;inset:0;background:var(--bg);opacity:0;transition:opacity ${
    DURATION * 0.6
  }ms cubic-bezier(0.33,1,0.68,1);`;

  const box = document.createElement("div");
  box.style.cssText = `position:absolute;overflow:hidden;top:${r.top}px;left:${r.left}px;width:${r.width}px;height:${r.height}px;transition:top ${DURATION}ms ${EASE},left ${DURATION}ms ${EASE},width ${DURATION}ms ${EASE},height ${DURATION}ms ${EASE};`;

  const copy = document.createElement("img");
  copy.src = img.currentSrc || img.src;
  copy.alt = "";
  copy.style.cssText = `position:absolute;inset:0;width:100%;height:100%;object-fit:cover;image-rendering:pixelated;transform:scale(1);transition:transform ${DURATION}ms ${EASE};`;

  box.appendChild(copy);
  layer.append(paper, box);
  document.body.appendChild(layer);
  box.getBoundingClientRect();

  requestAnimationFrame(() => {
    paper.style.opacity = "1";
    // même cadre que le hero de /work : image à son ratio sur téléphone,
    // 82svh sur desktop (innerHeight = hauteur visible, barres comprises)
    const phone = window.matchMedia("(max-width: 767px)").matches;
    Object.assign(box.style, {
      top: "0px",
      left: "0px",
      width: `${window.innerWidth}px`,
      height: `${phone ? window.innerWidth * SHOT_RATIO : (window.innerHeight * HERO_HEIGHT_VH) / 100}px`,
    });
    copy.style.transform = `scale(${HERO_ZOOM})`;
  });

  workZoom.slug = slug;
  workZoom.layer = layer;
  workZoom.endsAt = performance.now() + DURATION;
  // on navigue pendant le zoom : la page projet se monte sous la copie et
  // n'a plus qu'à la retirer quand le zoom s'achève (texte affiché aussitôt)
  window.setTimeout(navigate, DURATION * 0.4);
  // filet de sécurité : jamais de couche orpheline
  window.setTimeout(() => {
    if (workZoom.layer === layer) releaseWorkZoom();
  }, DURATION + 4000);
}

/** Retire la copie (en fondu court, ou tout de suite). */
export function releaseWorkZoom(immediate = false) {
  const layer = workZoom.layer;
  workZoom.layer = null;
  workZoom.slug = null;
  if (!layer) return;
  if (immediate) {
    layer.remove();
    return;
  }
  layer.style.transition = "opacity 0.2s linear";
  layer.style.opacity = "0";
  window.setTimeout(() => layer.remove(), 220);
}
