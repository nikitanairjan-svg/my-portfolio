"""Build the Contact section artwork from the reference render.

    python3 scripts/build-contact-art.py

Reads portfolio-assets/contact/contact-bg.png (the 1672×941 reference) and writes:
  portfolio-assets/contact/contact-board.png (+ -opt.webp)  full scene, used as the background
  portfolio-assets/contact/contact-cards.png (+ -opt.webp)  the three card bodies on transparency
  src/data/contactLayout.json                               card / clip positions for the page

The pegboard is redrawn bigger (so the scene shows at ZOOM of its reference size)
with a regular hole grid, using the reference's own hole texture, frame edge and
light streaks. Tiles, rod and cards are lifted from the reference with their
clips painted out, then placed so every new, smaller clip hangs in a real slot.
"""
import json
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "portfolio-assets/contact/contact-bg.png"
OUT = ROOT / "portfolio-assets/contact"
LAYOUT = ROOT / "src/data/contactLayout.json"

ZOOM = 0.87
W0, H0 = 1672, 941
W, H = round(W0 / ZOOM), round(H0 / ZOOM)

# Flat board + wall colour (BGR). Matched to the cover pegboard photo's wall
# (#EEE7DC-ish) so both pegboard sections share one tone; the reference was 222,208,193.
BOARD_BGR = np.array([218, 230, 238], np.float32)
BOARD_LUM = 210.5

# ---- Reference geometry (measured, reference pixels) ------------------------
FRAME_REF = (38, 72, 1637, 876)                     # frame line centres l, t, r, b
CREAM_ROWS = [
    dict(y=260, h=67, x=[204, 264, 323, 382, 440, 528, 586, 644, 703, 761, 819],
         w=[53, 52, 52, 52, 52, 52, 52, 52, 52, 52, 53], slots=[0, 1, 2, 3, 4, 6, 7, 8, 9, 10, 11]),
    dict(y=357, h=67, x=[203, 263, 322, 382, 440, 550, 609], w=[54, 53, 53, 52, 52, 53, 52], slots=[0, 1, 2, 3, 4, 6, 7]),
]
GREEN_ROWS = [
    dict(y=493, h=101, x=[205, 298, 394, 487, 579], w=[85, 88, 86, 84, 85]),
    dict(y=613, h=100, x=[205, 298, 394, 487, 580, 670, 760], w=[85, 88, 86, 85, 83, 83, 82]),
]
CARDS_REF = [("email", 311), ("linkedin", 470), ("resume", 625)]
CARD_X, CARD_W, CARD_H, CARD_R = 1080, 387, 103, 14
CARD_CLIP_X_REF = (1128, 1431)
ROD_BOX = (926, 246, 974, 726)                       # x0, y0, x1, y1
ROD_CX, ROD_CAPS, ROD_CAP_R, ROD_HALF_W = 950.5, (266, 705), 16, 5.5

# ---- New board grid and placement (new-canvas pixels) -----------------------
FRAME = (38, 72, W - 35, H - 65)
SX, SY = 60, 72
X_FIRST = FRAME[0] + ((FRAME[2] - FRAME[0]) - SX * ((FRAME[2] - FRAME[0] - 46) // SX)) // 2
Y_FIRST = FRAME[1] + ((FRAME[3] - FRAME[1]) - SY * ((FRAME[3] - FRAME[1] - 80) // SY)) // 2
N_COLS = (FRAME[2] - FRAME[0] - 46) // SX + 1
N_ROWS = (FRAME[3] - FRAME[1] - 80) // SY + 1
col = lambda i: X_FIRST + SX * i
row = lambda j: Y_FIRST + SY * j

TILE_CLIP, CARD_CLIP = (8, 26), (11, 28)             # new clip size (w, h), ~35% smaller
# The reference's cream tiles are nearly the board's colour; tint them down (BGR) so they read.
CREAM_TINT = np.array([0.86, 0.875, 0.90], np.float32)
CREAM_OVERLAP, GREEN_OVERLAP, CARD_OVERLAP = 13, 9, 7  # how far a clip reaches over its item
BASE_COL, BASE_ROW = 4, 3
CREAM_TOPS = [row(BASE_ROW) - 4, row(BASE_ROW) + 86]
GREEN_TOPS = [row(BASE_ROW) + 230, row(BASE_ROW) + 360]
GREEN_X0, GREEN_PITCH = col(BASE_COL) + 15, 90       # each clip sits 15px off-centre, alternating
ROD_COL = BASE_COL + 13
CARD_CLIP_COLS = (BASE_COL + 16, BASE_COL + 21)
CARD_LEFT = col(CARD_CLIP_COLS[0]) - 44
CARD_TOPS = [row(BASE_ROW) + 8 + 150 * k for k in range(3)]
ROD_CAPS_NEW = (row(BASE_ROW) + 4, row(BASE_ROW + 6) + 4)


def rounded_rect_alpha(w, h, r):
    yy, xx = np.mgrid[0:h, 0:w] + 0.5
    qx = np.abs(xx - w / 2) - (w / 2 - r)
    qy = np.abs(yy - h / 2) - (h / 2 - r)
    d = np.hypot(np.maximum(qx, 0), np.maximum(qy, 0)) + np.minimum(np.maximum(qx, qy), 0) - r
    return np.clip(0.5 - d, 0, 1).astype(np.float32)


def directional_fill(L, ok, angle):
    """Fill ~ok pixels by interpolating along the light-streak direction."""
    h, w = L.shape
    ys, xs = np.nonzero(~ok)
    d = (np.cos(np.radians(angle)), np.sin(np.radians(angle)))
    found = []
    for sign in (1, -1):
        v = np.full(len(xs), np.nan, np.float32)
        dist = np.full(len(xs), np.inf, np.float32)
        todo = np.arange(len(xs))
        for step in range(1, 2 * max(h, w)):
            px = np.rint(xs[todo] + sign * d[0] * step).astype(int)
            py = np.rint(ys[todo] + sign * d[1] * step).astype(int)
            inside = (px >= 0) & (px < w) & (py >= 0) & (py < h)
            hit = np.zeros(len(todo), bool)
            hit[inside] = ok[py[inside], px[inside]]
            v[todo[hit]] = L[py[hit], px[hit]]
            dist[todo[hit]] = step
            todo = todo[~hit & inside]
            if not len(todo):
                break
        found.append((v, dist))
    (va, da), (vb, db) = found
    both = np.isfinite(da) & np.isfinite(db)
    fill = np.where(both, (np.nan_to_num(va) * db + np.nan_to_num(vb) * da) / np.where(both, da + db, 1),
                    np.where(np.isfinite(da), va, vb))
    fill = np.where(np.isfinite(fill), fill, L[ok].mean())
    out = L.copy()
    out[ys, xs] = fill
    return out


def reference_object_boxes():
    boxes = []
    for r in CREAM_ROWS + GREEN_ROWS:
        boxes += [((x, r["y"], w, r["h"]), 32) for x, w in zip(r["x"], r["w"])]
    boxes += [((CARD_X, y - 40, CARD_W, CARD_H + 40), 34) for _, y in CARDS_REF]
    boxes.append(((ROD_BOX[0], ROD_BOX[1], ROD_BOX[2] - ROD_BOX[0], ROD_BOX[3] - ROD_BOX[1]), 24))
    return boxes


def light_map(ref):
    """Board lighting (ratio to the flat board colour) with objects, holes and frame removed."""
    gray = cv2.cvtColor(ref.astype(np.uint8), cv2.COLOR_BGR2GRAY).astype(np.float32)
    excl = cv2.dilate((gray < 165).astype(np.uint8), np.ones((9, 9), np.uint8))
    cv2.rectangle(excl, FRAME_REF[:2], FRAME_REF[2:], 1, 9)
    for (x, y, w, h), pad in reference_object_boxes():
        cv2.rectangle(excl, (x - pad, y - pad), (x + w + pad, y + h + pad), 1, -1)
    valid = (1 - excl).astype(np.float32)
    k = 4
    num = cv2.GaussianBlur(cv2.resize(gray * valid, None, fx=1 / k, fy=1 / k, interpolation=cv2.INTER_AREA), (0, 0), 1.5)
    den = cv2.GaussianBlur(cv2.resize(valid, None, fx=1 / k, fy=1 / k, interpolation=cv2.INTER_AREA), (0, 0), 1.5)
    ok = den > 0.25
    L = np.where(ok, num / np.maximum(den, 1e-6), 0).astype(np.float32)
    L = cv2.GaussianBlur(directional_fill(L, ok, angle=46), (0, 0), 1.0)
    L = cv2.resize(L, (gray.shape[1], gray.shape[0]), interpolation=cv2.INTER_CUBIC)
    residual = (gray - L)[(valid > 0) & (np.abs(gray - L) < 20)]
    return L / BOARD_LUM, float(residual.std())


def hole_texture(ref):
    """Average multiplicative texture of clean holes (1.0 = flat board)."""
    gray = cv2.cvtColor(ref.astype(np.uint8), cv2.COLOR_BGR2GRAY)
    n, _, st, cen = cv2.connectedComponentsWithStats((gray < 150).astype(np.uint8))
    picked = [tuple(cen[i]) for i in range(1, n)
              if 6 <= st[i, 2] <= 20 and 25 <= st[i, 3] <= 60
              and ((1180 < cen[i][0] < 1600 and (cen[i][1] < 200 or cen[i][1] > 740)) or (1000 < cen[i][0] < 1060 and 280 < cen[i][1] < 700))]
    patches = []
    for x, y in picked:
        M = np.float32([[1, 0, 18 - x], [0, 1, 32 - y]])
        p = cv2.warpAffine(ref, M, (36, 64), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
        base = np.median(np.concatenate([p[:6].reshape(-1, 3), p[-6:].reshape(-1, 3)]), 0)
        patches.append(p / base)
    return np.median(np.stack(patches), 0).astype(np.float32), len(picked)


def paint_out(img, x0, x1, y0, y1):
    """Replace columns x0..x1 of rows y0..y1 with a blend of the columns just outside."""
    left, right = img[y0:y1, x0 - 1].copy(), img[y0:y1, x1].copy()
    t = ((np.arange(x0, x1) - (x0 - 1)) / (x1 - (x0 - 1))).astype(np.float32)
    img[y0:y1, x0:x1] = left[:, None] * (1 - t)[None, :, None] + right[:, None] * t[None, :, None]


def capsule_sprite(w, h, edge, mid, hi, s=4):
    """Pegboard clip: shaded vertical capsule, darker at the top where it enters the slot."""
    SW, SH = w * s, h * s
    yy, xx = np.mgrid[0:SH, 0:SW] + 0.5
    r = SW / 2
    d = np.hypot(xx - r, yy - np.clip(yy, r, SH - r)) - r
    a = np.clip(0.5 - d, 0, 1)
    u = np.clip((xx - r) / r, -1, 1)
    v = yy / SH
    edge, mid, hi = (np.array(c, np.float32) for c in (edge, mid, hi))
    color = edge + (mid - edge) * (np.cos(u * np.pi / 2) ** 0.8)[..., None]
    shine = np.exp(-((u + 0.35) / 0.22) ** 2) * 0.6
    color = color + (hi - color) * shine[..., None]
    color *= (0.72 + 0.28 * np.clip((v - 0.2) / 0.3, 0, 1))[..., None]
    pm = cv2.resize(color * a[..., None], (w, h), interpolation=cv2.INTER_AREA)
    alpha = cv2.resize(a.astype(np.float32), (w, h), interpolation=cv2.INTER_AREA)
    return pm / np.maximum(alpha, 1e-4)[..., None], alpha


class Scene:
    def __init__(self, board, L_old, L_new):
        self.img, self.L_old, self.L_new = board, L_old, L_new
        # Transparent layers drawn over the board by the page: card bodies (hover),
        # letter tiles (hover) and the clips that hold everything (always on top).
        self.cards = np.zeros((H, W, 4), np.float32)
        self.tiles = np.zeros((H, W, 4), np.float32)
        self.clips = np.zeros((H, W, 4), np.float32)

    def paste_layer(self, layer, color, alpha, x, y):
        h, w = alpha.shape
        dst = layer[y:y + h, x:x + w]
        a = alpha[..., None]
        dst[..., :3] = dst[..., :3] * (1 - a) + color * a
        dst[..., 3] = np.maximum(dst[..., 3], alpha)

    def shadow_into(self, layer, items, offset, sigma, strength, colour=(30, 32, 24)):
        """Soft shadow drawn into a transparent layer, so it falls on whatever is below it."""
        S = np.zeros((H, W), np.float32)
        for alpha, x, y in items:
            h, w = alpha.shape
            x, y = x + offset[0], y + offset[1]
            S[y:y + h, x:x + w] = np.maximum(S[y:y + h, x:x + w], alpha)
        S = cv2.GaussianBlur(S, (0, 0), sigma) * strength
        a = S[..., None]
        layer[..., :3] = layer[..., :3] * (1 - a) + np.array(colour, np.float32) * a
        layer[..., 3] = np.maximum(layer[..., 3], S)

    def relit(self, color, sx, sy, x, y):
        h, w = color.shape[:2]
        r = self.L_new[y:y + h, x:x + w] / np.maximum(self.L_old[sy:sy + h, sx:sx + w], 1e-3)
        return color * np.clip(r, 0.85, 1.18)[..., None]

    def paste(self, color, alpha, x, y, target=None):
        h, w = alpha.shape
        dst = (self.img if target is None else target)[y:y + h, x:x + w, :3]
        dst[:] = dst * (1 - alpha[..., None]) + color * alpha[..., None]

    def shadow(self, items, offset, sigma, strength):
        S = np.zeros((H, W), np.float32)
        for alpha, x, y in items:
            h, w = alpha.shape
            x, y = x + offset[0], y + offset[1]
            S[y:y + h, x:x + w] = np.maximum(S[y:y + h, x:x + w], alpha)
        S = cv2.GaussianBlur(S, (0, 0), sigma)
        self.img *= (1 - strength * S)[..., None]


def main():
    ref = cv2.imread(str(SRC)).astype(np.float32)
    assert ref.shape[:2] == (H0, W0), f"expected a {W0}×{H0} reference"
    L_old, grain = light_map(ref)
    L_new = cv2.resize(L_old, (W, H), interpolation=cv2.INTER_LINEAR)
    hole, n_holes = hole_texture(ref)

    # Board: flat colour × lighting × frame edge × holes (+ the reference's fine grain)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    board = BOARD_BGR[None, None, :] * L_new[..., None]
    l, t, r, b = FRAME
    cx, cy, rad = (l + r) / 2, (t + b) / 2, 5
    qx, qy = np.abs(xx - cx) - ((r - l) / 2 - rad), np.abs(yy - cy) - ((b - t) / 2 - rad)
    dist = np.hypot(np.maximum(qx, 0), np.maximum(qy, 0)) + np.minimum(np.maximum(qx, qy), 0) - rad
    board *= np.interp(dist, [-3, -2, -1, 0, 1, 2, 3], [1, 1.015, 0.92, 0.78, 0.87, 1.0, 1])[..., None]
    holes = np.ones((H, W, 3), np.float32)
    slots = [(col(i), row(j)) for i in range(N_COLS) for j in range(N_ROWS)]
    for sx_, sy_ in slots:
        holes[sy_ - 32:sy_ + 32, sx_ - 18:sx_ + 18] *= hole
    board *= holes
    if grain > 0.8:
        board += cv2.GaussianBlur(np.random.default_rng(7).normal(0, grain * 0.9, (H, W)).astype(np.float32), (0, 0), 0.6)[..., None]
    scene = Scene(board, L_old, L_new)

    # Paint the old clips off the tiles and cards
    work = ref.copy()
    for rw in CREAM_ROWS:
        for x, w in zip(rw["x"], rw["w"]):
            paint_out(work, x + 7, x + w - 7, rw["y"] - 3, rw["y"] + 20)
    for rw in GREEN_ROWS:
        for x, w in zip(rw["x"], rw["w"]):
            paint_out(work, x + 8, x + w - 8, rw["y"] - 2, rw["y"] + 22)
    for _, y in CARDS_REF:
        for cxr in CARD_CLIP_X_REF:
            paint_out(work, cxr - 17, cxr + 17, y - 1, y + 20)

    # Lay out tiles, rod and cards on the new grid
    tiles, tile_clips, checks = [], [], []
    for rw, top in zip(CREAM_ROWS, CREAM_TOPS):
        for x, w, slot in zip(rw["x"], rw["w"], rw["slots"]):
            # 1px side margin keeps the bevel without picking up the shaded gap between tiles
            sx, sy, sw, sh = x - 1, rw["y"] - 3, w + 2, rw["h"] + 4
            centre = col(BASE_COL + slot)
            dx, dy = int(round(centre - sw / 2)), top - 3
            tiles.append((work[sy:sy + sh, sx:sx + sw] * CREAM_TINT, rounded_rect_alpha(sw, sh, 8), sx, sy, dx, dy))
            tile_clips.append((centre, top + CREAM_OVERLAP - TILE_CLIP[1], dx, dx + sw))
    for rw, top in zip(GREEN_ROWS, GREEN_TOPS):
        for k, (x, w) in enumerate(zip(rw["x"], rw["w"])):
            # the green mask already includes the dark edge, so cut exactly on it
            sx, sy, sw, sh = x, rw["y"], w, rw["h"]
            centre = GREEN_X0 + GREEN_PITCH * k
            dx, dy = int(round(centre - sw / 2)), top
            tiles.append((work[sy:sy + sh, sx:sx + sw], rounded_rect_alpha(sw, sh, 9), sx, sy, dx, dy))
            clip_col = col(int(round((centre - X_FIRST) / SX)))
            tile_clips.append((clip_col, top + GREEN_OVERLAP - TILE_CLIP[1], dx, dx + sw))

    rx0, ry0, rx1, ry1 = ROD_BOX
    ryy, rxx = np.mgrid[ry0:ry1, rx0:rx1].astype(np.float32)
    d_body = np.where((ryy >= ROD_CAPS[0]) & (ryy <= ROD_CAPS[1]), np.abs(rxx - ROD_CX) - ROD_HALF_W, 1e3)
    d_caps = np.minimum(*(np.hypot(rxx - ROD_CX, ryy - c) - ROD_CAP_R for c in ROD_CAPS))
    rod_alpha = np.clip(0.5 - np.minimum(d_body, d_caps), 0, 1).astype(np.float32)
    sv = (ROD_CAPS_NEW[1] - ROD_CAPS_NEW[0]) / (ROD_CAPS[1] - ROD_CAPS[0])
    rh = int(round((ry1 - ry0) * sv))
    rod_color = cv2.resize(work[ry0:ry1, rx0:rx1], (rx1 - rx0, rh), interpolation=cv2.INTER_AREA)
    rod_alpha = cv2.resize(rod_alpha, (rx1 - rx0, rh), interpolation=cv2.INTER_AREA)
    rod_dx = int(round(col(ROD_COL) - (ROD_CX - rx0)))
    rod_dy = int(round(ROD_CAPS_NEW[0] - (ROD_CAPS[0] - ry0) * sv))
    rod_src_y = ry0

    cards = []
    card_alpha = rounded_rect_alpha(CARD_W, CARD_H, CARD_R)
    for (cid, y), top in zip(CARDS_REF, CARD_TOPS):
        cards.append((cid, work[y:y + CARD_H, CARD_X:CARD_X + CARD_W], CARD_X, y, CARD_LEFT, top))

    # Shadows, then bodies
    tile_items = [(a, dx, dy) for _, a, _, _, dx, dy in tiles]
    scene.shadow(tile_items, (1, 5), 4.5, 0.40)      # soft cast shadow, as in the reference gaps
    scene.shadow(tile_items, (0, 1), 1.5, 0.22)      # tight contact shadow seating each tile
    scene.shadow([(rod_alpha, rod_dx, rod_dy)], (3, 3), 3, 0.30)
    scene.shadow([(card_alpha, dx, dy) for *_, dx, dy in cards], (0, 8), 9, 0.28)
    # Tiles go on their own layer (the page tilts them on hover); their shadows stay on the board.
    layout_tiles = []
    for (color, a, sx, sy, dx, dy), (clip_cx, clip_top, _, _) in zip(tiles, tile_clips):
        scene.paste_layer(scene.tiles, scene.relit(color, sx, sy, dx, dy), a, dx, dy)
        layout_tiles.append(dict(x=dx, y=dy, w=a.shape[1], h=a.shape[0],
                                 pivot=[int(clip_cx - dx), int(clip_top + TILE_CLIP[1] - dy)]))
    rod_L_old = cv2.resize(L_old[ry0:ry1, rx0:rx1], (rx1 - rx0, rh), interpolation=cv2.INTER_AREA)
    rod_r = L_new[rod_dy:rod_dy + rh, rod_dx:rod_dx + rx1 - rx0] / np.maximum(rod_L_old, 1e-3)
    scene.paste(rod_color * np.clip(rod_r, 0.85, 1.18)[..., None], rod_alpha, rod_dx, rod_dy)
    layout_cards = []
    for cid, color, sx, sy, dx, dy in cards:
        c = scene.relit(color, sx, sy, dx, dy)
        scene.paste(c, card_alpha, dx, dy)
        scene.paste(c, card_alpha, dx, dy, target=scene.cards)
        scene.cards[dy:dy + CARD_H, dx:dx + CARD_W, 3] = np.maximum(scene.cards[dy:dy + CARD_H, dx:dx + CARD_W, 3], card_alpha)
        layout_cards.append(dict(id=cid, x=dx, y=dy, w=CARD_W, h=CARD_H))

    # New clips: tile clips (cream) and card clips (sage grey), each hanging in a slot
    tile_sprite = capsule_sprite(*TILE_CLIP, edge=(160, 182, 200), mid=(214, 229, 240), hi=(236, 245, 250))  # warm cream (BGR)
    card_sprite = capsule_sprite(*CARD_CLIP, edge=(88, 104, 104), mid=(146, 166, 166), hi=(196, 212, 212))
    clip_items, layout_clips = [], []
    for cx_, top, t_left, t_right in tile_clips:
        x = int(round(cx_ - TILE_CLIP[0] / 2))
        clip_items.append((tile_sprite, x, top))
        checks.append(("tile", cx_, top, t_left, t_right))
    for (_, _, _, _, dx, dy) in cards:
        for c in CARD_CLIP_COLS:
            x, top = int(round(col(c) - CARD_CLIP[0] / 2)), dy + CARD_OVERLAP - CARD_CLIP[1]
            clip_items.append((card_sprite, x, top))
            layout_clips.append(dict(x=x, y=top, w=CARD_CLIP[0], h=CARD_CLIP[1]))
            checks.append(("card", col(c), top, dx, dx + CARD_W))
    # Clips sit on their own layer above the tiles, so a tilted tile still hangs from its clip.
    scene.shadow_into(scene.clips, [(spr[1], x, y) for spr, x, y in clip_items], (1, 2), 1.2, 0.35)
    for (color, alpha), x, y in clip_items:
        h, w = alpha.shape
        scene.paste_layer(scene.clips, color * L_new[y:y + h, x:x + w, None], alpha, x, y)

    # Sanity checks: every clip on a column, its top inside a slot, within its item
    worst = 0
    for kind, cx_, top, left, right in checks:
        j = int(round((top - Y_FIRST) / SY))
        off = top - row(j)
        on_col = (cx_ - X_FIRST) % SX == 0
        inside_slot = -17 <= off <= 2
        within = left + 8 <= cx_ <= right - 8
        assert on_col and inside_slot and within, (kind, cx_, top, off, left, right)
        worst = max(worst, abs(off + 7))
    tile_top, tile_bottom = CREAM_TOPS[0], GREEN_TOPS[1] + GREEN_ROWS[1]["h"]
    card_top, card_bottom = CARD_TOPS[0], CARD_TOPS[-1] + CARD_H

    board_u8 = np.clip(scene.img, 0, 255).astype(np.uint8)
    cv2.imwrite(str(OUT / "contact-board.png"), board_u8)
    Image.fromarray(board_u8[..., ::-1]).save(OUT / "contact-board-opt.webp", "WEBP", quality=90, method=6)
    def save_layer(layer, name, quality):
        rgba = np.dstack([np.clip(layer[..., :3], 0, 255), np.clip(layer[..., 3] * 255, 0, 255)]).astype(np.uint8)
        cv2.imwrite(str(OUT / f"{name}.png"), rgba)
        Image.fromarray(rgba[..., [2, 1, 0, 3]]).save(OUT / f"{name}-opt.webp", "WEBP", quality=quality, method=6)

    save_layer(scene.cards, "contact-cards", 92)
    save_layer(scene.tiles, "contact-tiles", 92)
    save_layer(scene.clips, "contact-clips", 92)

    layout = dict(
        canvas=dict(w=W, h=H), zoom=ZOOM, cardRadius=CARD_R, cards=layout_cards, tiles=layout_tiles,
        tilesCrop=dict(x=col(BASE_COL) - 60, y=CREAM_TOPS[0] - 45, w=col(ROD_COL - 1) - col(BASE_COL) + 90, h=tile_bottom - CREAM_TOPS[0] + 80),
    )
    LAYOUT.write_text(json.dumps(layout, indent=2) + "\n")

    print(f"canvas {W}×{H} (scene at {ZOOM:.0%}), {N_COLS}×{N_ROWS} slots, hole texture from {n_holes} holes, grain σ {grain:.2f}")
    print(f"{len(tiles)} tiles, rod, {len(cards)} cards; {len(tile_clips)} tile clips {TILE_CLIP[0]}×{TILE_CLIP[1]}, {len(layout_clips)} card clips {CARD_CLIP[0]}×{CARD_CLIP[1]}")
    print(f"all clips on slot columns and inside slots ✓ (tile clip size −{1 - TILE_CLIP[1] / 40:.0%}, card clip −{1 - CARD_CLIP[1] / 44:.0%})")
    print(f"tiles span y {tile_top}–{tile_bottom} (centre {(tile_top + tile_bottom) / 2:.0f}); cards span y {card_top}–{card_bottom} (centre {(card_top + card_bottom) / 2:.0f})")
    print(f"cream tiles tinted to {tuple(round(float(c), 2) for c in CREAM_TINT[::-1])} of the reference (RGB factors)")
    print("wrote contact-board, -cards, -tiles and -clips (png + opt.webp) and", LAYOUT.relative_to(ROOT))


if __name__ == "__main__":
    main()
