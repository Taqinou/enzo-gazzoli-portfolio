# Génère les visuels de la section travaux : chaque capture de site imprimée
# en pixels carrés bleus #0000ff sur crème, tramage 1 bit ordonné (matrice de
# Bayer 8×8). Retenu par Enzo le 16 sept. 2026 (parmi bichromie, trame de
# points, ascii et gravure).
#
#   python3 scripts/work-pixel.py <police Playfair Display .ttf>
#
# Entrées : scripts/work-captures/<slug>.webp (captures couleur des sites en
# ligne, 2400×1463). Sneakerscope, sans site en ligne, reçoit une plaque bleue
# à son nom en Playfair (police passée en argument, ex. PlayfairDisplay[wght].ttf
# de google/fonts). Sorties : public/images/work/<slug>-pixel.webp, en WebP
# sans perte (servies sans réencodage, cf. WorkShot).
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageOps

W, H = 2400, 1463
PX = 5  # taille d'un pixel de trame (px de l'image finale)
BLUE = np.array([0, 0, 255], dtype=np.float32)
CREAM = np.array([247, 246, 245], dtype=np.float32)  # --bg du site
SHOTS = ["7eyes", "lumiere-de-soso", "studio", "th14", "off-screen"]
BAYER = np.array(
    [
        [0, 48, 12, 60, 3, 51, 15, 63],
        [32, 16, 44, 28, 35, 19, 47, 31],
        [8, 56, 4, 52, 11, 59, 7, 55],
        [40, 24, 36, 20, 43, 27, 39, 23],
        [2, 50, 14, 62, 1, 49, 13, 61],
        [34, 18, 46, 30, 33, 17, 45, 29],
        [10, 58, 6, 54, 9, 57, 5, 53],
        [42, 26, 38, 22, 41, 25, 37, 21],
    ],
    dtype=np.float32,
)


def plate(name: str, font_path: str) -> Image.Image:
    img = Image.new("L", (W, H), 29)  # le bleu #0000ff en niveaux de gris
    draw = ImageDraw.Draw(img)
    font = ImageFont.truetype(font_path, 230)
    box = draw.textbbox((0, 0), name, font=font)
    tw, th = box[2] - box[0], box[3] - box[1]
    draw.text(((W - tw) / 2 - box[0], (H - th) / 2 - box[1]), name, font=font, fill=255)
    return img


def pixel_print(gray: Image.Image) -> Image.Image:
    gray = ImageOps.autocontrast(gray, cutoff=1)
    # grille qui couvre toute l'image (arrondie au-dessus puis recadrée) : une
    # grille arrondie au-dessous laissait des lignes vides en bord, rendues en
    # liseré crème sur les plaques bleues
    cols, rows = -(-W // PX), -(-H // PX)
    small = np.asarray(gray.resize((cols, rows), Image.BOX), dtype=np.float32) / 255
    threshold = (BAYER + 0.5) / 64
    tile = np.tile(threshold, (rows // 8 + 1, cols // 8 + 1))[:rows, :cols]
    ink = (1 - small > tile).astype(np.uint8) * 255
    big = Image.fromarray(ink, "L").resize((cols * PX, rows * PX), Image.NEAREST).crop((0, 0, W, H))
    a = np.asarray(big, dtype=np.float32)[..., None] / 255
    return Image.fromarray((CREAM + (BLUE - CREAM) * a).astype(np.uint8), "RGB")


if __name__ == "__main__":
    sources = {s: Image.open(f"scripts/work-captures/{s}.webp").convert("L").resize((W, H)) for s in SHOTS}
    if len(sys.argv) > 1:
        sources["sneakerscope"] = plate("sneakerscope", sys.argv[1])
    for slug, gray in sources.items():
        pixel_print(gray).save(f"public/images/work/{slug}-pixel.webp", "WEBP", lossless=True, method=6)
        print(slug)
