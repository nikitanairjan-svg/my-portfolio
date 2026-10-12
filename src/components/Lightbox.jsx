import { useCallback, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { createPortal } from "react-dom";

/* Full-size viewer for a set of images.

   Opens on the one you clicked and steps through the rest with the arrows, the
   keyboard, or the thumbnails. It is a modal dialog: focus is trapped to it,
   Escape closes, the page behind cannot scroll, and the arrow keys move. It
   renders through a portal so no ancestor's overflow or transform can clip it. */

const EASE = [0.22, 1, 0.36, 1];

export default function Lightbox({ images, index, onClose, onIndex }) {
  const reduce = useReducedMotion();
  const open = index !== null && index >= 0;
  const count = images.length;

  const step = useCallback(
    (delta) => onIndex(((index + delta) % count + count) % count),
    [index, count, onIndex],
  );

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
    };
    // Hold the page still behind the overlay, and give the width back so the
    // layout does not jump as the scrollbar disappears.
    const prevOverflow = document.body.style.overflow;
    const prevPad = document.body.style.paddingRight;
    const bar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (bar > 0) document.body.style.paddingRight = `${bar}px`;
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPad;
    };
  }, [open, onClose, step]);

  if (typeof document === "undefined") return null;

  const current = open ? images[index] : null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={current.alt || "Image viewer"}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? {} : { opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex flex-col bg-ink-primary/92 backdrop-blur-sm"
        >
          {/* clicking the ground closes; the figure stops the bubble */}
          <button type="button" aria-label="Close viewer" onClick={onClose} className="absolute inset-0 cursor-zoom-out" />

          <div className="pointer-events-none relative z-10 flex items-center justify-between px-5 py-4">
            <span className="text-[13px] tabular-nums text-white/70">
              {index + 1} / {count}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close viewer"
              className="pointer-events-auto grid h-9 w-9 place-items-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <figure className="pointer-events-none relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-4 pb-2">
            <AnimatePresence initial={false} mode="wait">
              <motion.img
                key={current.src}
                src={current.src}
                alt={current.alt}
                initial={reduce ? false : { opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? {} : { opacity: 0, scale: 0.985 }}
                transition={{ duration: reduce ? 0 : 0.22, ease: EASE }}
                className="max-h-full max-w-[min(1400px,94vw)] rounded-lg object-contain shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
              />
            </AnimatePresence>
            {current.caption && (
              <figcaption className="mt-4 max-w-[62ch] text-center text-[13px] leading-[20px] text-white/70">{current.caption}</figcaption>
            )}
          </figure>

          {count > 1 && (
            <>
              <Arrow side="left" onClick={() => step(-1)} label="Previous image" />
              <Arrow side="right" onClick={() => step(1)} label="Next image" />

              <div className="relative z-10 flex items-center justify-center gap-2 overflow-x-auto px-5 pb-5 pt-1">
                {images.map((img, i) => (
                  <button
                    key={img.src}
                    type="button"
                    aria-label={`Show image ${i + 1}`}
                    aria-current={i === index ? "true" : undefined}
                    onClick={() => onIndex(i)}
                    className={`h-12 w-16 shrink-0 overflow-hidden rounded border transition-opacity ${
                      i === index ? "border-white opacity-100" : "border-white/25 opacity-55 hover:opacity-85"
                    }`}
                  >
                    <img src={img.src} alt="" aria-hidden="true" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function Arrow({ side, onClick, label }) {
  const left = side === "left";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10 ${
        left ? "left-4" : "right-4"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        {left ? <path d="M15 5l-7 7 7 7" /> : <path d="M9 5l7 7-7 7" />}
      </svg>
    </button>
  );
}
