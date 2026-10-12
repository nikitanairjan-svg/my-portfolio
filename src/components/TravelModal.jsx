import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const AUTO_ADVANCE_MS = 4000;

const variants = {
  enter: (direction) => ({ x: direction > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction > 0 ? -60 : 60, opacity: 0 }),
};

export default function TravelModal({ photos, initialIndex, onClose }) {
  const [index, setIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback(
    (nextIndex, dir) => {
      setDirection(dir);
      setIndex((current) => {
        const total = photos.length;
        return (nextIndex(current) + total) % total;
      });
    },
    [photos.length],
  );

  const goNext = useCallback(() => goTo((i) => i + 1, 1), [goTo]);
  const goPrev = useCallback(() => goTo((i) => i - 1, -1), [goTo]);

  useEffect(() => {
    if (paused) return undefined;
    timerRef.current = setInterval(goNext, AUTO_ADVANCE_MS);
    return () => clearInterval(timerRef.current);
  }, [paused, goNext]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    function handleKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose, goNext, goPrev]);

  const current = photos[index];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-cream/90 text-ink shadow-lg transition-transform hover:scale-105 sm:right-8 sm:top-8"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
        </svg>
      </button>

      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="relative flex w-[min(90vw,32rem)] flex-col items-center"
      >
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous photo"
          className="absolute left-1 top-1/2 z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cream/90 text-ink shadow-lg transition-transform hover:scale-110 sm:-left-4"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-neutral-900 shadow-2xl">
          <AnimatePresence custom={direction} mode="wait" initial={false}>
            <motion.img
              key={current.label + index}
              src={current.src}
              alt={current.label}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="absolute inset-0 h-full w-full object-cover"
              draggable={false}
            />
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={goNext}
          aria-label="Next photo"
          className="absolute right-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-cream/90 text-ink shadow-lg transition-transform hover:scale-110 sm:-right-4"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <p className="font-hand mt-4 text-2xl text-cream">{current.label}</p>

        <div className="mt-2 flex gap-1.5">
          {photos.map((photo, i) => (
            <button
              key={photo.label}
              type="button"
              aria-label={`Go to ${photo.label}`}
              onClick={() => goTo(() => i, i > index ? 1 : -1)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-5 bg-cream" : "w-1.5 bg-cream/40"
              }`}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
