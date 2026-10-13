import { useCallback, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { createPortal } from "react-dom";

/* Full-size viewer for a set of images.

   Opens on the one you clicked and steps through the rest with the round
   arrows either side of it, the dots, or the arrow keys. The counter sits
   centred above the image, level with the close button; the caption and the
   dots sit under the image in their own space, so nothing overlaps it. It is a modal dialog: focus is trapped to it,
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

          {/* the counter sits centred above the image, on the same line as
              the close button at the right */}
          <div className="pointer-events-none relative z-10 flex items-center justify-center px-5 py-4">
            {count > 1 && (
              <span className="rounded-full bg-white/10 px-3 py-1 text-[13px] font-medium tabular-nums text-white/85">
                {index + 1}/{count}
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close viewer"
              className="pointer-events-auto absolute right-5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          {/* the image alone takes the free height, so nothing below it can
              ever sit on top of it */}
          <figure className="pointer-events-none relative z-10 flex min-h-0 flex-1 items-center justify-center gap-3 px-3 sm:gap-5 sm:px-5">
            {/* the arrows sit beside the image, never over it */}
            {count > 1 && (
              <span className="pointer-events-auto">
                <Step dir={-1} onClick={() => step(-1)} />
              </span>
            )}
            <AnimatePresence initial={false} mode="wait">
              <motion.img
                key={current.src}
                src={current.src}
                alt={current.alt}
                initial={reduce ? false : { opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? {} : { opacity: 0, scale: 0.985 }}
                transition={{ duration: reduce ? 0 : 0.22, ease: EASE }}
                className="max-h-full min-w-0 max-w-[min(1400px,calc(100vw-140px))] rounded-lg object-contain shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
              />
            </AnimatePresence>
            {count > 1 && (
              <span className="pointer-events-auto">
                <Step dir={1} onClick={() => step(1)} />
              </span>
            )}
          </figure>

          {/* below the image, in its own space: caption, position, controls */}
          <div className="pointer-events-none relative z-10 flex flex-col items-center px-5 pb-6 pt-5">
            {current.caption && <p className="max-w-[62ch] text-center text-[14px] leading-[21px] text-white/80">{current.caption}</p>}

            {count > 1 && (
              <>
                <div className={`pointer-events-auto flex max-w-full items-center ${current.caption ? "mt-4" : ""}`}>
                  <div className="flex min-w-0 items-center justify-center gap-0.5 sm:gap-1">
                    {images.map((img, i) => (
                      <button
                        key={img.src + i}
                        type="button"
                        aria-label={`Show image ${i + 1}`}
                        aria-current={i === index ? "true" : undefined}
                        onClick={() => onIndex(i)}
                        className="grid h-6 w-5 shrink-0 place-items-center sm:w-6"
                      >
                        <span
                          className={`block h-2 rounded-full transition-all duration-300 ${i === index ? "w-5 bg-white" : "w-2 bg-white/35 hover:bg-white/60"}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function Step({ dir, onClick }) {
  const back = dir < 0;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={back ? "Previous image" : "Next image"}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {back ? <path d="M15 5l-7 7 7 7" /> : <path d="M9 5l7 7-7 7" />}
      </svg>
    </button>
  );
}
