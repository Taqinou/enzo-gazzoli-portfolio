# Génère public/images/studio/sky-painting-loop.jpg, le ciel du hero studio raccordé à
# lui-même horizontalement, pour qu'il défile vers la gauche sans fin (tuiles
# côte à côte). À relancer si on change le ciel :
#   python3 scripts/sky-loop.py [chemin/du/ciel.jpg] [sortie.jpg]
#
# Raccord en fondu : les OVERLAP derniers % de la photo sont fondus sur ses
# premiers % (poids adouci), puis retirés. Le bord droit de la tuile se
# prolonge alors exactement dans son bord gauche.
import sys

from PIL import Image

SRC = sys.argv[1] if len(sys.argv) > 1 else "public/images/studio/sky-painting.jpg"
OUT = sys.argv[2] if len(sys.argv) > 2 else "public/images/studio/sky-painting-loop.jpg"
OVERLAP = 0.2

im = Image.open(SRC).convert("RGB")
w, h = im.size
o = int(w * OVERLAP)
tile = im.crop((0, 0, w - o, h))
head = im.crop((0, 0, o, h))
tail = im.crop((w - o, 0, w, h))

# masque horizontal adouci : 0 (queue de la photo) → 1 (début de la photo)
mask = Image.new("L", (o, h))
column = [int(255 * (t * t * (3 - 2 * t))) for t in (x / (o - 1) for x in range(o))]
mask.putdata([column[x] for _ in range(h) for x in range(o)])
tile.paste(Image.composite(head, tail, mask), (0, 0))

tile.save(OUT, "JPEG", quality=86, optimize=True, progressive=True)
print(f"{OUT} {tile.size[0]}x{tile.size[1]} ratio {tile.size[0] / tile.size[1]:.4f}")
