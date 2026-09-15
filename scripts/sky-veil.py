# Génère public/images/studio/sky-veil.webp, la nappe de nuages du premier plan
# du hero studio, détourée depuis le ciel du fond. À relancer si on change
# sky.jpg :   python3 scripts/sky-veil.py [chemin/du/ciel.jpg]
#
# On garde les zones blanches (canal min élevé), on écarte le bleu et les nuages
# gris, on ajoute une brume qui s'épaissit vers le bas, et on floute : le
# premier plan est hors de la zone de netteté. Bande du bas de la photo, en
# miroir, pour ne pas superposer les mêmes formes que le fond.
import sys

from PIL import Image, ImageChops, ImageFilter, ImageOps

SRC = sys.argv[1] if len(sys.argv) > 1 else "public/images/studio/sky.jpg"
OUT = "public/images/studio/sky-veil.webp"
LO, HI, CAP = 115, 200, 0.95
OUT_WIDTH = 1800

im = Image.open(SRC).convert("RGB")
w, h = im.size
band = ImageOps.mirror(im.crop((0, int(h * 0.48), w, h)))

r, g, b = band.split()
whiteness = ImageChops.darker(ImageChops.darker(r, g), b)


def ramp(v):
    t = min(max((v - LO) / (HI - LO), 0.0), 1.0)
    return int(255 * CAP * t * t * (3 - 2 * t))


def top_fade(v):
    # 0 en haut → 1 à 35 % de la hauteur : le bord haut de l'image (nuages
    # coupés par le recadrage) reste transparent où que la nappe se trouve.
    t = min(v / 255 / 0.35, 1.0)
    return int(255 * t * t * (3 - 2 * t))


gradient = Image.linear_gradient("L").resize(band.size)
alpha = whiteness.point(ramp)
mist = gradient.point(lambda v: int(v * 0.55))
alpha = ImageChops.lighter(alpha, mist).filter(ImageFilter.GaussianBlur(12))
alpha = ImageChops.multiply(alpha, gradient.point(top_fade))

cream = Image.new("RGB", band.size, (249, 249, 249))
veil = Image.blend(band, cream, 0.6).filter(ImageFilter.GaussianBlur(6))
veil.putalpha(alpha)

veil = veil.resize((OUT_WIDTH, round(veil.height * OUT_WIDTH / w)), Image.LANCZOS)
veil.save(OUT, "WEBP", quality=80, method=6)
print(f"{OUT} {veil.size[0]}x{veil.size[1]}")
