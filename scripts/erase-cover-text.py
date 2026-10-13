"""Erase the baked-in typography from a case study cover.

Usage: python3 scripts/erase-cover-text.py <cover.webp> <out.webp> x0,y0,x1,y1 [...]

Each box is a region (in cover pixels) holding text. Inside it, pixels that
stand out from a heavily median-blurred copy of the image are treated as type,
inpainted from their surroundings, and softened so the fill reads as the same
out-of-focus backdrop. Keep boxes tight to the text: foliage or other detail
inside a box gets smudged too.

Boxes used for the current covers (2000x800 masters):
  shipthis     120,170,710,550
  hc-robotics  95,185,725,428 95,460,615,530
  ax-flow      140,205,755,555
  bloom-craft  135,190,780,572
"""
import sys, cv2, numpy as np
from PIL import Image
src, out = sys.argv[1], sys.argv[2]
boxes = [tuple(map(int, b.split(","))) for b in sys.argv[3:]]
img = cv2.cvtColor(np.array(Image.open(src).convert("RGB")), cv2.COLOR_RGB2BGR)
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
bg = cv2.medianBlur(gray, 101)
dev = cv2.absdiff(gray, bg)
mask = np.zeros_like(gray)
for x0, y0, x1, y1 in boxes:
    box = (slice(y0, y1), slice(x0, x1))
    mask[box] = (dev[box] > 14).astype(np.uint8) * 255
mask = cv2.dilate(mask, np.ones((7, 7), np.uint8), iterations=2)
res = cv2.inpaint(img, mask, 9, cv2.INPAINT_TELEA)
# soften the filled area so it reads as the same out-of-focus backdrop
soft = cv2.GaussianBlur(res, (0, 0), 6)
m = cv2.GaussianBlur(cv2.dilate(mask, np.ones((15, 15), np.uint8)).astype(np.float32) / 255, (0, 0), 5)[..., None]
res = (res * (1 - m) + soft * m).astype(np.uint8)
Image.fromarray(cv2.cvtColor(res, cv2.COLOR_BGR2RGB)).save(out, "WEBP", quality=90, method=6)
