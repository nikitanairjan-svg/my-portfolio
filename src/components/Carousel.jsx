import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/* A carousel for a run of related images — sketches, wireframes, final screens.

   A vertical stack of six wireframes is a scroll tax: the reader flicks past it
   and takes nothing in. One frame at a time, with a count and arrows, asks for
   a decision instead, and keeps the page short enough that the writing around
   it still gets read.

   It is a labelled group with real buttons, arrow-key support and a live region
   announcing each change, so it works without a mouse and without sight. There
   is no autoplay: content that moves on its own is hostile to anyone reading
   slowly, and the spec's "auto-scroll" is the one part of this I have left off
   deliberately. */

const EASE = [0.22, 1, 0.36, 1];

export default function Carousel({ images, caption }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const groupId = useId();
  const liveRef = useRef(null);

  const count = images.length;
  const go = (next, direction) => {
    setDir(direction);
    setIndex(((next % count) + count) % count);
  };

  // Arrow keys move through the set once the carousel has focus.
  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(index + 1, 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(index - 1, -1);
    }
  };

  useEffect(() => {
    if (liveRef.current) liveRef.current.textContent = `Image ${index + 1} of ${count}`;
  }, [index, count]);

  const current = images[index];

  return (
    <figure role="group" aria-roledescription="carousel" aria-label={caption ?? "Image gallery"} className="relative">
      <div
        tabIndex={0}
        onKeyDown={onKeyDown}
        aria-describedby={`${groupId}-count`}
        className="group relative overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_1px_2px_rgba(24,32,30,0.04),0_18px_40px_-28px_rgba(24,32,30,0.25)] outline-offset-4 focus-visible:outline-2 focus-visible:outline-forest"
      >
        {/* A fixed frame: the images differ in ratio, and letting the box resize
            per slide makes the whole page jump as you step through. */}
        <div className="relative h-[clamp(220px,28vw,380px)] w-full">
          <AnimatePresence initial={false} mode="popLayout" custom={dir}>
            <motion.img
              key={current.src}
              src={current.src}
              alt={current.alt}
              width={current.w}
              height={current.h}
              loading="lazy"
              decoding="async"
              draggable={false}
              custom={dir}
              initial={reduce ? false : { opacity: 0, x: dir * 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -28 }}
              transition={{ duration: reduce ? 0 : 0.34, ease: EASE }}
              className="absolute inset-0 h-full w-full bg-surface object-contain"
            />
          </AnimatePresence>
        </div>

        {count > 1 && (
          <>
            <Arrow side="left" onClick={() => go(index - 1, -1)} label="Previous image" />
            <Arrow side="right" onClick={() => go(index + 1, 1)} label="Next image" />
            <span
              id={`${groupId}-count`}
              className="type-label pointer-events-none absolute bottom-3 right-3 rounded-full bg-ink-primary/75 px-2.5 py-1 tabular-nums text-surface backdrop-blur-[2px]"
            >
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>

      {/* dots, so the length of the set is visible at rest */}
      {count > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {images.map((image, i) => (
            <button
              key={image.src}
              type="button"
              aria-label={`Go to image ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => go(i, i > index ? 1 : -1)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-ink-primary" : "w-1.5 bg-ink-primary/25 hover:bg-ink-primary/45"
              }`}
            />
          ))}
        </div>
      )}

      <span ref={liveRef} aria-live="polite" className="sr-only" />

      {(current.caption || caption) && (
        <figcaption className="text-[13px] leading-[20px] mt-3 text-center text-ink-secondary">{current.caption ?? caption}</figcaption>
      )}
    </figure>
  );
}

function Arrow({ side, onClick, label }) {
  const left = side === "left";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-surface/90 text-ink-primary opacity-0 shadow-[0_2px_8px_rgba(24,32,30,0.12)] backdrop-blur-[2px] transition-all duration-200 hover:bg-surface focus-visible:opacity-100 group-hover:opacity-100 motion-reduce:opacity-100 ${
        left ? "left-3" : "right-3"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {left ? <path d="M15 5l-7 7 7 7" /> : <path d="M9 5l7 7-7 7" />}
      </svg>
    </button>
  );
}
