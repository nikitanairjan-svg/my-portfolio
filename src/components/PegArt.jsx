import { motion, useReducedMotion } from "framer-motion";
import { LIFT, SHADOW_DEEP, SHADOW_LIFT, SHADOW_REST } from "./motionPresets";

/* Hover animations for pegboard objects. Each object is one image, so moving
   parts (a card, a book, the pens) are drawn as extra copies of that image
   clipped to the part, while the base copy has a hole where the part was.
   Anything that should stay in front (a shelf lip, a cup, binder clips) is a
   final clipped copy on top. All coordinates are in the image's own pixels. */

const REST = { scale: 1, x: 0, y: 0, rotate: 0 };
// Pendulum: fast through the middle, slow at each end.
const SWING_EASE = ["easeOut", "easeIn", "easeOut", "easeIn"];

const pc = (v, total) => `${((v / total) * 100).toFixed(3)}%`;
const pt = (x, y, size) => `${pc(x, size.w)} ${pc(y, size.h)}`;
const loop = ([x, y, w, h], size) => [pt(x, y, size), pt(x + w, y, size), pt(x + w, y + h, size), pt(x, y + h, size), pt(x, y, size)];

// Union of rectangles as one polygon; each is reached by a zero-width bridge from the corner.
const clipUnion = (rects, size) =>
  `polygon(${[...rects.flatMap((r) => [pt(0, 0, size), ...loop(r, size)]), pt(0, 0, size)].join(", ")})`;

// The whole image minus the rectangles.
const clipHoles = (rects, size) =>
  `polygon(evenodd, ${[pt(0, 0, size), pt(size.w, 0, size), pt(size.w, size.h, size), pt(0, size.h, size), ...rects.flatMap((r) => [pt(0, 0, size), ...loop(r, size)]), pt(0, 0, size)].join(", ")})`;

const origin = ([x, y], size) => `${pc(x, size.w)} ${pc(y, size.h)}`;

// Parts overlap their hole by a few pixels so anti-aliased edges don't leave a
// see-through hairline at rest (the overlap draws identical pixels).
const BLEED = 6;
const bleed = ([x, y, w, h]) => [x - BLEED, y - BLEED, w + 2 * BLEED, h + 2 * BLEED];

function Img({ src, alt = "", style }) {
  return (
    <img
      src={src}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      draggable={false}
      className="absolute inset-0 block h-full w-full select-none"
      style={style}
    />
  );
}

/* Parts that lift, tilt or bounce independently (cards, books, pens, polaroids). */
function PartsArt({ src, alt, size, parts, front = [], active, activeHotspot }) {
  return (
    <>
      <Img src={src} alt={alt} style={{ clipPath: clipHoles(parts.flatMap((p) => p.rects), size) }} />
      {parts.map((part) => {
        const on = part.hotspot ? activeHotspot === part.hotspot : active;
        const shadow = part.shadow === false ? {} : { filter: on ? SHADOW_LIFT : SHADOW_REST };
        return (
          <motion.div
            key={part.id}
            className="absolute inset-0"
            style={{ transformOrigin: origin(part.origin, size) }}
            initial={false}
            animate={on ? { ...part.hover, ...shadow } : { ...Object.fromEntries(Object.keys(part.hover).map((k) => [k, REST[k]])), ...shadow }}
            transition={on ? (part.transition ?? { ...LIFT, delay: part.delay ?? 0 }) : LIFT}
          >
            <Img src={src} style={{ clipPath: clipUnion(part.rects.map(bleed), size) }} />
          </motion.div>
        );
      })}
      {front.length > 0 && <Img src={src} style={{ clipPath: clipUnion(front, size) }} />}
    </>
  );
}

/* Continuous sway while hovered. Horizontal bands of the image swing about a
   shared pivot, each by its own angle, so a plant bends like it's in a breeze;
   soft mask edges hide the seams. One band rocks the whole object. */
function SwayArt({ src, alt, size, layers, pivot, duration, brighten, active }) {
  const reduce = useReducedMotion();
  const feather = 110;
  const swaying = active && !reduce;
  return (
    <motion.div
      className="absolute inset-0"
      initial={false}
      animate={brighten ? { filter: active ? "brightness(1.07) saturate(1.06)" : "brightness(1) saturate(1)" } : undefined}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {layers.map(({ to, angle }, i) => {
        const from = i === 0 ? 0 : layers[i - 1].to;
        const last = i === layers.length - 1;
        const mask =
          layers.length === 1
            ? undefined
            : `linear-gradient(to bottom, ${i === 0 ? "#000 0%" : `transparent ${pc(from - feather, size.h)}, #000 ${pc(from, size.h)}`}, ${last ? "#000 100%" : `#000 ${pc(to, size.h)}, transparent ${pc(to + feather, size.h)}`})`;
        return (
          <motion.div
            key={to}
            className="absolute inset-0"
            style={{ transformOrigin: origin(pivot, size), maskImage: mask, WebkitMaskImage: mask }}
            initial={false}
            animate={swaying && angle ? { rotate: [0, angle, 0, -angle, 0] } : { rotate: 0 }}
            transition={
              swaying && angle
                ? { duration, ease: SWING_EASE, repeat: Infinity, delay: i * 0.12 }
                : { duration: 0.6, ease: "easeOut" }
            }
          >
            <Img src={src} alt={i === 0 ? alt : ""} />
          </motion.div>
        );
      })}
    </motion.div>
  );
}

/* Lifts and tilts in 3D toward the pointer (tilt springs come from the board). */
function TiltArt({ src, alt, active, tilt, pivot, size }) {
  return (
    <div className="absolute inset-0" style={{ perspective: 900 }}>
      <motion.div
        className="absolute inset-0"
        style={{ rotateX: tilt.x, rotateY: tilt.y, transformOrigin: origin(pivot, size) }}
        initial={false}
        animate={{ scale: active ? 1.03 : 1, filter: active ? SHADOW_DEEP : SHADOW_REST }}
        transition={LIFT}
      >
        <Img src={src} alt={alt} />
      </motion.div>
    </div>
  );
}

export function ItemArt({ item, active, activeHotspot, tilt }) {
  const { art, src, alt } = item;
  const size = item.img ?? { w: item.box.w, h: item.box.h }; // art coordinates are in image pixels
  switch (art?.type) {
    case "parts":
      return <PartsArt src={src} alt={alt} size={size} active={active} activeHotspot={activeHotspot} parts={art.parts} front={art.front} />;
    case "sway":
      return <SwayArt src={src} alt={alt} size={size} active={active} layers={art.layers} pivot={art.pivot} duration={art.duration} brighten={art.brighten} />;
    case "tilt":
      return <TiltArt src={src} alt={alt} size={size} active={active} tilt={tilt} pivot={art.pivot} />;
    default:
      return <Img src={src} alt={alt} />;
  }
}
