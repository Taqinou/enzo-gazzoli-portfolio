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
// Au retour (lien « studio. » de la page projet), le geste inverse
// (zoomOutOfWork) : la copie repart du hero et rétrécit jusqu'à la vignette
// de la home, qui réapparaît autour d'elle.
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

/** Papier crème au retour : il couvre vite la page projet (avant de naviguer). */
const PAPER_IN = 240;
/** Sortie de brume de la home au retour (1,3 s au premier passage). */
const MIST_BACK = 400;

interface Frame {
  top: number;
  left: number;
  width: number;
  height: number;
}

export const workZoom: {
  slug: string | null;
  layer: HTMLElement | null;
  endsAt: number;
  origin: (Frame & { slug: string; vw: number; vh: number }) | null;
} = {
  slug: null,
  layer: null,
  /** Fin du zoom (performance.now()) : la page projet attend ce moment. */
  endsAt: 0,
  /** Cadre de la vignette au clic : le retour vise d'emblée ce cadre (même scroll, même fenêtre). */
  origin: null,
};

const frameStyle = (f: Frame) => ({
  top: `${f.top}px`,
  left: `${f.left}px`,
  width: `${f.width}px`,
  height: `${f.height}px`,
});

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
  workZoom.origin = {
    slug,
    top: r.top,
    left: r.left,
    width: r.width,
    height: r.height,
    vw: window.innerWidth,
    vh: window.innerHeight,
  };
  // on navigue pendant le zoom : la page projet se monte sous la copie et
  // n'a plus qu'à la retirer quand le zoom s'achève (texte affiché aussitôt)
  window.setTimeout(navigate, DURATION * 0.4);
  // filet de sécurité : jamais de couche orpheline
  window.setTimeout(() => {
    if (workZoom.layer === layer) releaseWorkZoom();
  }, DURATION + 4000);
}

/**
 * Zoom arrière, de la page projet à sa vignette sur la home. La copie part du
 * cadre du hero (image zoomée à HERO_ZOOM) pendant qu'un papier crème couvre la
 * page projet ; on navigue sous le papier, puis la copie rétrécit jusqu'au cadre
 * exact de la vignette (image à 1) et la home réapparaît autour d'elle. Si on
 * vient du zoom avant (même projet, même fenêtre), la copie file d'emblée vers
 * le cadre mémorisé ; sinon elle attend la home, qui défile au besoin pour
 * centrer la vignette.
 */
export function zoomOutOfWork(media: HTMLElement, img: HTMLImageElement, slug: string, navigate: () => void) {
  releaseWorkZoom(true);
  const r = media.getBoundingClientRect();
  // hero presque sorti de l'écran : la copie apparaît en fondu en haut
  const offscreen = r.bottom < r.height * 0.25;

  const layer = document.createElement("div");
  layer.style.cssText = "position:fixed;inset:0;z-index:190;pointer-events:none;";

  const paper = document.createElement("div");
  paper.style.cssText = `position:absolute;inset:0;background:var(--bg);opacity:0;transition:opacity ${PAPER_IN}ms cubic-bezier(0.33,1,0.68,1);`;

  const box = document.createElement("div");
  box.style.cssText = `position:absolute;overflow:hidden;opacity:${offscreen ? 0 : 1};transition:top ${DURATION}ms ${EASE},left ${DURATION}ms ${EASE},width ${DURATION}ms ${EASE},height ${DURATION}ms ${EASE},opacity ${PAPER_IN}ms linear;`;
  Object.assign(box.style, frameStyle({ top: offscreen ? 0 : r.top, left: r.left, width: r.width, height: r.height }));

  const copy = document.createElement("img");
  copy.src = img.currentSrc || img.src;
  copy.alt = "";
  copy.style.cssText = `position:absolute;inset:0;width:100%;height:100%;object-fit:cover;image-rendering:pixelated;transform:scale(${HERO_ZOOM});transition:transform ${DURATION}ms ${EASE};`;

  box.appendChild(copy);
  layer.append(paper, box);
  document.body.appendChild(layer);
  // la copie couvre le hero : on le masque pour qu'il ne reste pas derrière elle
  media.style.visibility = "hidden";
  box.getBoundingClientRect();

  workZoom.slug = null;
  workZoom.layer = layer;

  let target: Frame | null = null;
  let landStart = 0;
  let landsAt = 0;
  const land = (f: Frame) => {
    target = f;
    landStart = landStart || performance.now();
    landsAt = performance.now() + DURATION;
    Object.assign(box.style, frameStyle(f));
    copy.style.transform = "scale(1)";
  };

  const o = workZoom.origin;
  const known =
    o && o.slug === slug && o.vw === window.innerWidth && o.vh === window.innerHeight ? o : null;

  requestAnimationFrame(() => {
    paper.style.opacity = "1";
    box.style.opacity = "1";
    if (known) land(known);
  });

  // la home est montée sous le papier : on la découvre autour de la copie
  const reveal = (tile: HTMLElement) => {
    if (workZoom.layer !== layer) return;
    let t = tile.getBoundingClientRect();
    if (t.top < 0 || t.bottom > window.innerHeight) {
      window.scrollTo(0, window.scrollY + t.top - (window.innerHeight - t.height) / 2);
    }
    // la home sort de la brume comme d'habitude (plus vite, cf. plus bas), sauf
    // la vignette d'arrivée : nette et à sa place sous la copie pour le raccord
    const mist = tile.closest<HTMLElement>(".studio-mist");
    const onScreen = Array.from(document.querySelectorAll<HTMLElement>(".studio-mist")).filter((el) => {
      const b = el.getBoundingClientRect();
      return b.bottom > 0 && b.top < window.innerHeight;
    });
    for (const el of onScreen) {
      el.classList.add("in");
      el.style.animation = "none";
      if (el === mist) el.style.opacity = "1";
    }
    t = tile.getBoundingClientRect();
    const f = { top: t.top, left: t.left, width: t.width, height: t.height };
    const current = target as Frame | null;
    if (
      !current ||
      Math.abs(current.top - f.top) > 1 ||
      Math.abs(current.left - f.left) > 1 ||
      Math.abs(current.width - f.width) > 1 ||
      Math.abs(current.height - f.height) > 1
    ) {
      land(f);
    }
    // miroir du zoom avant : la home se découvre sur les derniers 60 % du
    // rétrécissement, en accélérant jusqu'à l'atterrissage
    const now = performance.now();
    const delay = Math.max(0, landStart + DURATION * 0.4 - now);
    paper.style.transition = `opacity ${DURATION * 0.6}ms cubic-bezier(0.32,0,0.67,0) ${delay}ms`;
    paper.style.opacity = "0";
    // le reste de l'écran sort de la brume dès que le papier se lève, plus vite
    // qu'au premier passage (1,3 s en cascade)
    onScreen
      .filter((el) => el !== mist)
      .forEach((el, k) => {
        el.style.animation = `studio-mist-in ${MIST_BACK}ms cubic-bezier(0.16,1,0.3,1) ${delay + k * 25}ms both`;
      });
    // la vignette est identique sous la copie : on la retire d'un coup
    window.setTimeout(
      () => {
        if (workZoom.layer !== layer) return;
        workZoom.layer = null;
        layer.remove();
      },
      Math.max(landsAt - now, delay + DURATION * 0.6) + 80,
    );
  };

  window.setTimeout(() => {
    navigate();
    const since = performance.now();
    const find = () => {
      if (workZoom.layer !== layer) return;
      const tile =
        window.location.pathname === "/"
          ? document.querySelector<HTMLElement>(`[data-morph][data-slug="${slug}"]`)
          : null;
      if (tile) {
        // deux images : SmoothScroll pose d'abord la position de la home
        requestAnimationFrame(() => requestAnimationFrame(() => reveal(tile)));
      } else if (performance.now() - since > 3000) {
        releaseWorkZoom();
      } else {
        requestAnimationFrame(find);
      }
    };
    requestAnimationFrame(find);
  }, PAPER_IN);
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
