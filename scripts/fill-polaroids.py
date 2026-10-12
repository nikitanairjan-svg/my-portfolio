"""Fill the blank polaroids in updated-assests/objects/photo.png with travel photos.

    python3 scripts/fill-polaroids.py

Writes updated-assests/objects/photo-filled.png (full size) and
photo-filled-opt.webp (half size, used by the site). Edit POLAROIDS to swap
which picture goes into which polaroid, or its crop focus. Each polaroid is
captioned with the place name from its file name (travel-goa.webp -> "Goa").
"""
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "updated-assests/objects/photo.png"
OUT = ROOT / "updated-assests/objects/photo-filled.png"
TRAVEL = ROOT / "src/assets/travel"
FONT = ROOT / "scripts/fonts/Caveat.ttf"  # same handwriting face as the site's font-hand

INK_BGR = (31, 34, 35)  # --color-ink
MARGIN = 135  # depth of a polaroid's bottom margin below its window, px

# Window corners (TL, TR, BR, BL) in photo.png pixels, measured by eye and then
# snapped to the window's dark border line. `visible` gives the stretch (0..1)
# of each edge (TL-TR, TR-BR, BR-BL, BL-TL) that isn't hidden by another
# polaroid; hidden edges are placed parallel to the opposite edge.
# Back polaroids come first so the front ones paint over them.
POLAROIDS = [
    dict(name="left-back-left", photo="travel-agra.webp", focus=(0.5, 0.45),
         quad=[(127, 465), (515, 390), (598, 818), (210, 893)],
         visible=[(0.03, 0.38), None, (0.72, 0.97), (0.05, 0.95)], occluders=["left-front"]),
    dict(name="left-back-right", photo="travel-goa.webp", focus=(0.5, 0.5),
         quad=[(584, 398), (975, 458), (908, 895), (517, 835)],
         visible=[(0.62, 0.97), (0.05, 0.95), None, None], occluders=["left-front"]),
    dict(name="left-front", photo="travel-himachal.webp", focus=(0.5, 0.6),
         quad=[(328, 410), (722, 375), (760, 818), (366, 857)],
         visible=[(0.05, 0.95)] * 4, outer=[(293, 372), (748, 330), (802, 950), (345, 995)]),
    dict(name="right-back", photo="travel-manali.webp", focus=(0.5, 0.55),
         quad=[(1264, 429), (1657, 380), (1715, 845), (1322, 894)],
         visible=[None, (0.05, 0.95), (0.03, 0.30), None], occluders=["right-front"]),
    dict(name="right-front", photo="travel-dubai.webp", focus=(0.5, 0.55),
         quad=[(1182, 390), (1580, 432), (1534, 888), (1133, 850)],
         visible=[(0.05, 0.95)] * 4, outer=[(1155, 340), (1615, 388), (1552, 1030), (1088, 985)]),
]


def sample(gray, pts):
    m = pts.reshape(-1, 1, 2).astype(np.float32)
    return cv2.remap(gray, m[..., 0], m[..., 1], cv2.INTER_LINEAR).ravel()


def refine_edge(gray, p, q, rng, search=14):
    """Snap edge p->q to the darkest line nearby. Returns (point, dir, normal offset) or None."""
    p, q = np.float32(p), np.float32(q)
    d = q - p
    length = np.linalg.norm(d)
    d /= length
    n = np.float32([d[1], -d[0]])  # outward normal for a clockwise quad
    offs = np.arange(-search, search + 1, dtype=np.float32)
    hits = []
    for t in np.linspace(rng[0], rng[1], 80):
        c = p + d * length * t
        line = c[None, :] + offs[:, None] * n[None, :]
        vals = sample(gray, line)
        if vals.min() < 120:  # binder clip or deep shadow, not the border
            continue
        k = int(np.argmin(vals))
        if vals[k] > np.median(vals) - 6:  # no distinct border line here
            continue
        hits.append(line[k])
    if len(hits) < 10:
        return None
    vx, vy, x0, y0 = cv2.fitLine(np.float32(hits), cv2.DIST_HUBER, 0, 0.01, 0.01).ravel()
    fd = np.float32([vx, vy])
    if fd @ d < 0:
        fd = -fd
    pt = np.float32([x0, y0])
    return pt, fd, float((pt - p) @ n)


def intersect(l1, l2):
    (p1, d1), (p2, d2) = l1, l2
    a = np.array([d1, -d2]).T
    s = np.linalg.solve(a, p2 - p1)[0]
    return p1 + d1 * s


def refine_quad(gray, quad, visible):
    quad = [np.float32(c) for c in quad]
    edges = [(quad[i], quad[(i + 1) % 4]) for i in range(4)]
    fits = [refine_edge(gray, p, q, r) if r else None for (p, q), r in zip(edges, visible)]
    lines = []
    for i, (p, q) in enumerate(edges):
        d = (q - p) / np.linalg.norm(q - p)
        if fits[i]:
            lines.append((fits[i][0], fits[i][1]))
            continue
        opp = fits[(i + 2) % 4]
        if opp:  # keep the window's size: move with the opposite edge, stay parallel
            n = np.float32([d[1], -d[0]])
            lines.append((p - n * opp[2], -opp[1]))
        else:
            lines.append((p, d))
    return np.float32([intersect(lines[(i + 3) % 4], lines[i]) for i in range(4)])


def cover_crop(img, aspect, focus):
    h, w = img.shape[:2]
    if w / h > aspect:
        nw = int(round(h * aspect))
        x = int(round((w - nw) * focus[0]))
        return img[:, x:x + nw]
    nh = int(round(w / aspect))
    y = int(round((h - nh) * focus[1]))
    return img[y:y + nh]


def caption_for(photo):
    return Path(photo).stem.removeprefix("travel-").replace("-", " ").title()


def draw_caption(out, quad, text, paper, name):
    """Hand-write `text` in the polaroid's bottom margin, on its visible stretch only."""
    bl, br = quad[3], quad[2]
    width = float(np.linalg.norm(br - bl))
    ex = (br - bl) / width  # along the margin, left to right
    ey = np.float32([-ex[1], ex[0]])  # down, away from the window
    h, w = paper.shape

    us = np.arange(0, width, 2, dtype=np.float32)

    def free_run(vc):
        """Longest stretch of margin, as (start, end), that is clear of other polaroids around height vc."""
        ok = np.ones(len(us), bool)
        for v in (vc - 22, vc, vc + 22):
            pts = (bl + us[:, None] * ex + v * ey).round().astype(int)
            inside = (pts[:, 0] >= 0) & (pts[:, 0] < w) & (pts[:, 1] >= 0) & (pts[:, 1] < h)
            ok &= inside
            ok[inside] &= paper[pts[inside, 1], pts[inside, 0]] > 0
        best, start = (0.0, 0.0), None
        for i, good in enumerate(np.append(ok, False)):
            if good and start is None:
                start = i
            elif not good and start is not None:
                if us[i - 1] - us[start] > best[1] - best[0]:
                    best = (float(us[start]), float(us[i - 1]))
                start = None
        return best

    # Front polaroids have the whole margin free, so this lands mid-margin; on back
    # ones it finds the height where the most margin peeks out from behind.
    vc, (u0, u1) = max(((v, free_run(v)) for v in range(40, MARGIN + 10, 4)),
                       key=lambda c: (round(c[1][1] - c[1][0], -1), -abs(c[0] - MARGIN * 0.46)))
    u0, u1 = u0 + 8, u1 - 8

    size = 78
    while True:
        font = ImageFont.truetype(str(FONT), size)
        try:
            font.set_variation_by_axes([600])
        except OSError:
            pass
        l, t, r, b = font.getbbox(text, anchor="mm")
        if r - l <= u1 - u0 or size <= 36:
            break
        size -= 2
    if r - l > u1 - u0:
        print(f"  ! caption '{text}' doesn't fit on {name}; skipped")
        return out

    layer = Image.new("L", (int(np.ceil(width)), MARGIN + 60), 0)
    ImageDraw.Draw(layer).text(((u0 + u1) / 2, vc), text, font=font, fill=255, anchor="mm")
    m = np.float32([[ex[0], ey[0], bl[0]], [ex[1], ey[1], bl[1]]])
    ink = cv2.warpAffine(np.array(layer), m, (w, h), flags=cv2.INTER_LINEAR)
    a = (ink.astype(np.float32) / 255 * 0.9 * (paper > 0))[..., None]
    print(f"  caption '{text}' at {size}px")
    return out * (1 - a) + np.float32(INK_BGR) * a


def main():
    src = cv2.imread(str(SRC), cv2.IMREAD_UNCHANGED)
    bgr, alpha = src[:, :, :3].astype(np.float32), src[:, :, 3]
    gray = cv2.GaussianBlur(cv2.cvtColor(src[:, :, :3], cv2.COLOR_BGR2GRAY), (3, 3), 0).astype(np.float32)
    smooth = cv2.GaussianBlur(gray, (9, 9), 0)
    h, w = gray.shape
    outers = {p["name"]: np.int32(p["outer"]) for p in POLAROIDS if "outer" in p}
    out = bgr.copy()

    for p in POLAROIDS:
        quad = refine_quad(gray, p["quad"], p["visible"])
        moved = np.abs(quad - np.float32(p["quad"])).max()
        print(f"{p['name']:16s} corners {quad.round().astype(int).tolist()}  (max move {moved:.1f}px)")

        # Parts of the image covered by polaroids lying on top of this one.
        covered = np.zeros((h, w), np.uint8)
        for name in p.get("occluders", []):
            cv2.fillConvexPoly(covered, outers[name], 255)
        covered = cv2.dilate(covered, np.ones((7, 7), np.uint8))

        # Window region to paint: slightly grown quad, minus clips, frames and front polaroids.
        c = quad.mean(0)
        grown = c + (quad - c) * 1.012
        mask = np.zeros((h, w), np.uint8)
        cv2.fillConvexPoly(mask, grown.round().astype(np.int32), 255)
        mask[covered > 0] = 0
        mask[(smooth < 90) | (smooth > 226) | (alpha < 250)] = 0
        mask = cv2.GaussianBlur(mask, (3, 3), 0).astype(np.float32)[..., None] / 255

        # Photo: cover-crop to the window's shape, then warp onto the tilted window.
        ww = (np.linalg.norm(quad[1] - quad[0]) + np.linalg.norm(quad[2] - quad[3])) / 2
        wh = (np.linalg.norm(quad[3] - quad[0]) + np.linalg.norm(quad[2] - quad[1])) / 2
        photo = np.array(ImageOps.exif_transpose(Image.open(TRAVEL / p["photo"])).convert("RGB"))[:, :, ::-1]
        photo = cover_crop(photo, ww / wh, p["focus"])
        photo = cv2.resize(photo, (int(ww * 1.2), int(wh * 1.2)), interpolation=cv2.INTER_AREA)
        ph, pw = photo.shape[:2]
        m = cv2.getPerspectiveTransform(np.float32([[0, 0], [pw, 0], [pw, ph], [0, ph]]), grown)
        warped = cv2.warpPerspective(photo, m, (w, h), flags=cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_REFLECT)

        # Carry over the window's own light: border line, clip and polaroid shadows.
        base = np.median(smooth[mask[..., 0] > 0.5])
        shade = np.clip(smooth / base, 0.35, 1.06)[..., None]
        out = out * (1 - mask) + warped.astype(np.float32) * shade * mask

        paper = ((covered == 0) & (alpha > 250) & (smooth > 200)).astype(np.uint8)
        out = draw_caption(out, quad, caption_for(p["photo"]), paper, p["name"])

    result = np.dstack([np.clip(out, 0, 255).astype(np.uint8), alpha])
    cv2.imwrite(str(OUT), result)
    rgba = Image.fromarray(result[:, :, [2, 1, 0, 3]])
    rgba.resize((round(w / 2), round(h / 2)), Image.LANCZOS).save(OUT.with_name("photo-filled-opt.webp"), "WEBP", quality=88, method=6)
    print("wrote", OUT.relative_to(ROOT), "and photo-filled-opt.webp")


if __name__ == "__main__":
    main()
