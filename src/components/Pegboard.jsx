import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import PegItem from "./PegItem";
import { ItemArt } from "./PegArt";
import { CURSORS } from "./cursors";
import {
  pegboardBg,
  plantImg,
  holderImg,
  notebookImg,
  toolsImg,
  idImg,
  headphoneImg,
  bottleImg,
  booksImg,
  photoImg,
} from "../assets";

/* The board is laid out in the pixel space of the pegboard background (6688 × 3764).
   Every object's box is its exact placement in updated-assests/refer-v2.png,
   measured by template-matching each object PNG against it. Objects shown at a
   different size from their image carry `img` (the image's own size); hotspot
   boxes, `art` rects (x, y, w, h) and pivots are always in image pixels. */
const BOARD = { w: 6688, h: 3764 };

// Paint order: later objects sit on top. `cursor` keys into CURSORS.
const ITEMS = [
  {
    id: "plant", src: plantImg, alt: "Trailing pothos plant in a white planter",
    box: { x: 32, y: 308, w: 1332, h: 2788 },
    label: "Nature lover", cursor: "dot",
    // Pot and top leaves stay put; the hanging vines bend more the lower they hang.
    art: {
      type: "sway", pivot: [540, 760], duration: 2.8, brighten: true,
      layers: [{ to: 836, angle: 0 }, { to: 1478, angle: 0.8 }, { to: 2119, angle: 1.6 }, { to: 2788, angle: 2.5 }],
    },
  },
  {
    id: "holder", src: holderImg, alt: "Pen holder with pens, pencil, ruler and scissors",
    box: { x: 1836, y: 472, w: 764, h: 1000 },
    label: "Tools of thought", cursor: "dot",
    lift: { scale: 1.05, origin: "50% 100%", shadow: true },
    art: {
      type: "parts",
      // Pens jostle and settle inside the cup.
      parts: [{
        id: "pens", rects: [[40, 40, 720, 512]], origin: [345, 552], shadow: false,
        hover: { y: [0, -2, 0.5, 0], rotate: [0, -1.5, 0.7, 0] },
        transition: { duration: 0.45, ease: "easeOut" },
      }],
      front: [[110, 535, 470, 465], [65, 495, 58, 110], [565, 495, 52, 110]], // cup and its side tabs
    },
  },
  {
    id: "notebook", src: notebookImg, alt: "Notes notebook and wireframe sketches on a shelf",
    box: { x: 744, y: 1320, w: 1712, h: 1080 },
    label: "Hands-on thinking", cursor: "dot",
    art: {
      type: "parts",
      parts: [
        { id: "notebook", rects: [[91, 40, 759, 535], [91, 575, 714, 343]], origin: [466, 918], hover: { scale: 1.05, y: -1.5, rotate: -1.2 } },
        { id: "notes", rects: [[875, 240, 730, 678]], origin: [1240, 918], hover: { scale: 1.05, y: -1.5, rotate: 1.2 }, delay: 0.04 },
      ],
      front: [[0, 905, 1712, 175], [20, 515, 95, 390], [800, 570, 72, 335], [1570, 530, 80, 375]], // shelf lip and posts
    },
  },
  {
    id: "tools", src: toolsImg, alt: "Figma, Claude, VS Code and Notion cards clipped to a rail",
    box: { x: 688, y: 2548, w: 1912, h: 804 },
    hotspotsOnly: true, // only the cards respond, not the rail
    hotspots: [
      { id: "figma", box: { x: 163, y: 311, w: 335, h: 407 }, label: "Primary tool", cursor: "wrench" },
      { id: "claude", box: { x: 541, y: 313, w: 375, h: 407 }, label: "Thinking partner", cursor: "wrench" },
      { id: "vscode", box: { x: 967, y: 313, w: 360, h: 407 }, label: "Building stuff", cursor: "wrench" },
      { id: "notion", box: { x: 1371, y: 313, w: 361, h: 407 }, label: "Everything organized", cursor: "wrench" },
    ],
    art: {
      type: "parts",
      // Each card bounces from its binder clip; the clips stay in front.
      parts: [["figma", 160, 342, 324], ["claude", 538, 381, 714], ["vscode", 961, 372, 1150], ["notion", 1365, 373, 1544]].map(
        ([id, x, w, clipX]) => ({
          id, hotspot: id, rects: [[x, 305, w, 420]], origin: [clipX, 320],
          hover: { scale: 1.1 }, transition: { type: "spring", duration: 0.3, bounce: 0.5 },
        }),
      ),
      front: [324, 714, 1150, 1544].map((clipX) => [clipX - 62, 130, 124, 218]),
    },
  },
  {
    id: "id", src: idImg, alt: "ID card: Nikita Nair, Product Designer, 4+ years experience, Hyderabad, India",
    box: { x: 2692, y: 341, w: 1151, h: 2731 }, img: { w: 1076, h: 2552 },
    cursor: "board",
    art: { type: "tilt", pivot: [538, 0] }, // hangs from the lanyard
  },
  {
    id: "headphone", src: headphoneImg, alt: "Over-ear headphones on a hook",
    box: { x: 4137, y: 555, w: 1145, h: 1145 }, img: { w: 1292, h: 1292 },
    label: "Deep focus", cursor: "dot",
    lift: { scale: 1.08, rotate: 3, origin: "48% 6%", shadow: true }, // swings on the hook
  },
  {
    id: "bottle", src: bottleImg, alt: "Stanley water bottle in a holder",
    box: { x: 5280, y: 341, w: 1058, h: 1585 }, img: { w: 1172, h: 1756 },
    label: "Hydration first", cursor: "dot",
    lift: { scale: 1.05, origin: "48% 97%", shadow: true },
  },
  {
    id: "books", src: booksImg, alt: "My last reads: RAM, Never Lie, The Silent Patient, The Picture of Dorian Gray",
    box: { x: 3845, y: 2103, w: 978, h: 1194 }, img: { w: 1108, h: 1352 },
    label: "Thriller lover", cursor: "book",
    lift: { scale: 1.04, origin: "50% 100%" },
    art: {
      type: "parts",
      // Each book shifts a little differently, like the stack was grabbed.
      parts: [[108, 222, -1.1, -1], [330, 220, 0.8, 1], [550, 195, -0.7, -1], [745, 230, 1, 1]].map(([x, w, rotate, dx], i) => ({
        id: `book-${i}`, rects: [[x, 45, w, 1093]], origin: [x + w / 2, 1138],
        hover: { rotate, x: dx, y: -1 }, delay: i * 0.03,
      })),
      front: [[55, 1130, 995, 222], [55, 630, 63, 500], [978, 625, 67, 505]], // label lip and side wires
    },
  },
  {
    id: "photo", src: photoImg, alt: "Polaroids from Himachal, Agra, Goa, Dubai and Manali",
    box: { x: 4692, y: 1976, w: 1880, h: 1120 },
    label: "Places I've been", cursor: "pointer",
    // Each polaroid cluster opens the travel carousel at its front photo.
    hotspots: [
      { id: "travel-left", box: { x: 0, y: 0, w: 1049, h: 1120 }, open: 0, ariaLabel: "Open travel photos: Himachal" },
      { id: "travel-right", box: { x: 1049, y: 0, w: 831, h: 1120 }, open: 2, ariaLabel: "Open travel photos: Dubai" },
    ],
    art: {
      type: "parts",
      // Each cluster lifts from its binder clip.
      parts: [
        { id: "left", hotspot: "travel-left", rects: [[0, 0, 1049, 1120]], origin: [523, 143], hover: { scale: 1.08, rotate: -1.5 } },
        { id: "right", hotspot: "travel-right", rects: [[1049, 0, 831, 1120]], origin: [1395, 129], hover: { scale: 1.08, rotate: 1.5 } },
      ],
    },
  },
];

const TOOLTIP_GAP = 8; // px between the cursor image and the tooltip
const TILT = { stiffness: 170, damping: 18 };

function pct({ x, y, w, h }, frame = BOARD) {
  return {
    left: `${(x / frame.w) * 100}%`,
    top: `${(y / frame.h) * 100}%`,
    width: `${(w / frame.w) * 100}%`,
    height: `${(h / frame.h) * 100}%`,
  };
}

const inBox = (x, y, box) => x >= box.x && x < box.x + box.w && y >= box.y && y < box.y + box.h;

/* Low-res alpha masks of each object image, so hover follows the object's
   visible shape instead of its transparent bounding box. */
function useAlphaMasks() {
  const masks = useRef({});
  useEffect(() => {
    let cancelled = false;
    for (const item of ITEMS) {
      const img = new Image();
      img.onload = () => {
        if (cancelled) return;
        const w = Math.max(1, Math.round(img.naturalWidth / 4));
        const h = Math.max(1, Math.round(img.naturalHeight / 4));
        const ctx = Object.assign(document.createElement("canvas"), { width: w, height: h }).getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        const rgba = ctx.getImageData(0, 0, w, h).data;
        const alpha = new Uint8Array(w * h);
        for (let i = 0; i < alpha.length; i++) alpha[i] = rgba[i * 4 + 3];
        masks.current[item.id] = { w, h, alpha };
      };
      img.src = item.src;
    }
    return () => {
      cancelled = true;
    };
  }, []);
  return masks;
}

// Topmost object (and hotspot) under a point in board pixels.
function hitTest(px, py, masks) {
  for (let i = ITEMS.length - 1; i >= 0; i--) {
    const item = ITEMS[i];
    if (!inBox(px, py, item.box)) continue;
    const lx = px - item.box.x;
    const ly = py - item.box.y;
    const mask = masks[item.id];
    if (mask) {
      const mx = Math.floor((lx / item.box.w) * mask.w);
      const my = Math.floor((ly / item.box.h) * mask.h);
      if (mask.alpha[my * mask.w + mx] < 40) continue; // transparent: look underneath
    }
    const img = item.img ?? item.box;
    const hotspot = item.hotspots?.find((h) => inBox((lx / item.box.w) * img.w, (ly / item.box.h) * img.h, h.box)) ?? null;
    if (item.hotspotsOnly && !hotspot) continue;
    return { item, hotspot, u: lx / item.box.w, v: ly / item.box.h };
  }
  return null;
}

const keyOf = (hit) => (hit ? `${hit.item.id}:${hit.hotspot?.id ?? ""}` : null);

function fromKey(key) {
  if (!key) return null;
  const [itemId, hotspotId] = key.split(":");
  const item = ITEMS.find((i) => i.id === itemId);
  return { item, hotspot: item.hotspots?.find((h) => h.id === hotspotId) ?? null };
}

const cursorOf = (hit) => CURSORS[hit.hotspot?.cursor ?? hit.item.cursor];
const labelOf = (hit) => hit.hotspot?.label ?? hit.item.label;

/* --- Pegboard canvas ----------------------------------------------------- */
export default function Pegboard({ onOpenTravel }) {
  const boardRef = useRef(null);
  const tooltipRef = useRef(null);
  const pointer = useRef({ x: 0, y: 0, width: 0 });
  const tooltipX = useMotionValue(0);
  const tooltipY = useMotionValue(0);
  const tilt = { x: useSpring(0, TILT), y: useSpring(0, TILT) };
  const masks = useAlphaMasks();
  const [hoverKey, setHoverKey] = useState(null);
  const [focusKey, setFocusKey] = useState(null);

  function hitAt(e, rect = boardRef.current.getBoundingClientRect()) {
    // The navbar lives inside the board but isn't an object: it gets the page-wide cursors.
    if (e.target.closest("[data-native-cursor]")) return null;
    return hitTest(((e.clientX - rect.left) / rect.width) * BOARD.w, ((e.clientY - rect.top) / rect.height) * BOARD.h, masks.current);
  }

  /* Centre the tooltip just above the cursor image (below it when there's no
     room at the top), kept inside the board. Motion values avoid re-rendering
     on every pointer move. */
  function placeTooltip(cursor) {
    const tip = tooltipRef.current;
    if (!tip || !cursor) return;
    const { x, y, width } = pointer.current;
    const above = y - cursor.hotspot[1] - TOOLTIP_GAP - tip.offsetHeight;
    tooltipY.set(above >= TOOLTIP_GAP ? above : y + cursor.height - cursor.hotspot[1] + TOOLTIP_GAP);
    tooltipX.set(Math.min(Math.max(x - tip.offsetWidth / 2, TOOLTIP_GAP), width - tip.offsetWidth - TOOLTIP_GAP));
  }

  function handlePointerMove(e) {
    const rect = boardRef.current.getBoundingClientRect();
    pointer.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, width: rect.width };
    const hit = hitAt(e, rect);
    setHoverKey(keyOf(hit));
    if (hit) placeTooltip(cursorOf(hit));
    // The ID card leans toward the pointer.
    const tilting = hit?.item.art?.type === "tilt";
    tilt.y.set(tilting ? (hit.u - 0.5) * 10 : 0);
    tilt.x.set(tilting ? (0.5 - hit.v) * 6 : 0);
  }

  function handlePointerLeave() {
    setHoverKey(null);
    tilt.x.set(0);
    tilt.y.set(0);
  }

  function handleClick(e) {
    const open = hitAt(e)?.hotspot?.open;
    if (open !== undefined) onOpenTravel?.(open);
  }

  const hovered = fromKey(hoverKey);
  const active = hovered ?? fromKey(focusKey);
  const hoverLabel = hovered && labelOf(hovered);

  // A newly shown tooltip has no size until it mounts; place it once it has.
  useLayoutEffect(() => {
    if (hovered) placeTooltip(cursorOf(hovered));
  });

  return (
    <div
      ref={boardRef}
      className="relative w-full overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        aspectRatio: `${BOARD.w} / ${BOARD.h}`,
        backgroundImage: `url(${pegboardBg})`,
        cursor: hovered ? cursorOf(hovered).css : CURSORS.board.css,
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
    >

      {/* Fade the photo's bottom margin (below the frame) into the wall below */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[5%] bg-gradient-to-b from-transparent to-wall" />

      {ITEMS.map((item) => {
        const isActive = active?.item.id === item.id;
        return (
          <div
            key={item.id}
            className="pointer-events-none absolute"
            style={{ ...pct(item.box), zIndex: isActive ? 40 : undefined }}
          >
            {/* Pointer hover uses the cursor tooltip below; the item's own
                tooltip only shows for keyboard focus. */}
            <PegItem label={hovered ? null : item.label} active={isActive} lift={item.lift} className="h-full w-full">
              <ItemArt item={item} active={isActive} activeHotspot={isActive ? active.hotspot?.id : null} tilt={tilt} />

              {item.hotspots?.map(
                (hotspot) =>
                  hotspot.open !== undefined && (
                    // Keyboard access; mouse and touch clicks are hit-tested by the board.
                    <button
                      key={hotspot.id}
                      type="button"
                      aria-label={hotspot.ariaLabel}
                      className="pointer-events-none absolute rounded-md outline-offset-2 focus-visible:outline-2 focus-visible:outline-moss"
                      style={pct(hotspot.box, item.img ?? item.box)}
                      onFocus={() => setFocusKey(keyOf({ item, hotspot }))}
                      onBlur={() => setFocusKey(null)}
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenTravel?.(hotspot.open);
                      }}
                    />
                  ),
              )}
            </PegItem>
          </div>
        );
      })}

      {/* Tooltip that follows the cursor */}
      <motion.div className="pointer-events-none absolute left-0 top-0 z-50" style={{ x: tooltipX, y: tooltipY }}>
        <AnimatePresence>
          {hoverLabel && (
            <motion.div
              key={hoverLabel}
              ref={(node) => {
                if (node) tooltipRef.current = node;
              }}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.14, ease: "easeOut" }}
              className="absolute left-0 top-0 whitespace-nowrap rounded-full bg-ink px-3.5 py-1.5 text-[13px] font-medium text-cream shadow-lg dark:bg-cream dark:text-ink"
            >
              {hoverLabel}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
