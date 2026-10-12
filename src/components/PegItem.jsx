import { AnimatePresence, motion } from "framer-motion";
import { LIFT, SHADOW_LIFT, SHADOW_REST } from "./motionPresets";

const sideClasses = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-3",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-3",
  left: "right-full top-1/2 -translate-y-1/2 mr-3",
  right: "left-full top-1/2 -translate-y-1/2 ml-3",
};

const initialOffset = {
  top: { y: 6 },
  bottom: { y: -6 },
  left: { x: 6 },
  right: { x: -6 },
};

export function Tooltip({ label, show, side = "top" }) {
  return (
    <AnimatePresence>
      {show && label && (
        <motion.div
          initial={{ opacity: 0, scale: 0.92, ...initialOffset[side] }}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, ...initialOffset[side] }}
          transition={{ duration: 0.16, ease: "easeOut" }}
          className={`pointer-events-none absolute z-40 whitespace-nowrap rounded-full bg-ink px-3.5 py-1.5 text-[13px] font-medium text-cream shadow-lg dark:bg-cream dark:text-ink ${sideClasses[side]}`}
        >
          {label}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* A pegboard object. The board decides what is hovered (it hit-tests the
   object's visible pixels), so hover state arrives as `active`. `lift`
   ({ scale, y, rotate, origin, shadow }) moves the whole object; finer
   animations live in the children (see PegArt). */
export default function PegItem({ label, active = false, children, className = "", tooltipSide = "top", lift }) {
  const rest = { scale: 1, y: 0, rotate: 0, ...(lift?.shadow && { filter: SHADOW_REST }) };
  const hover = lift && {
    scale: lift.scale ?? 1,
    y: lift.y ?? 0,
    rotate: lift.rotate ?? 0,
    ...(lift.shadow && { filter: SHADOW_LIFT }),
  };

  return (
    <div className={`relative ${className}`}>
      <motion.div
        initial={false}
        animate={active && hover ? hover : rest}
        transition={LIFT}
        style={{ transformOrigin: lift?.origin ?? "50% 50%" }}
        className="relative h-full w-full"
      >
        {children}
      </motion.div>

      <Tooltip label={label} show={active} side={tooltipSide} />
    </div>
  );
}
