import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import Lightbox from "./Lightbox";

/* A mobile journey, screen by screen.

   Phone screens are tall and narrow, so the page's one-at-a-time carousel
   shrank them to a sliver. Here they sit in a row at a readable size, each
   with its step and caption underneath, and the row scrolls sideways: by
   swipe, trackpad, the round arrows at either end or the arrow keys. Every
   screen opens full size, and the viewer steps through the whole journey
   from there. */

export default function PhoneJourney({ screens, caption }) {
  const reduce = useReducedMotion();
  const track = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const [open, setOpen] = useState(null);

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // One step is one screen plus the gap, so the row always lands on a screen.
  const page = (dir) => {
    const el = track.current;
    const item = el?.querySelector("li");
    if (!el || !item) return;
    const step = item.getBoundingClientRect().width + parseFloat(getComputedStyle(el.firstElementChild).columnGap || 0);
    el.scrollBy({ left: dir * step * Math.max(1, Math.floor(el.clientWidth / step) - 1), behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <figure role="group" aria-label={caption ?? "Screens"} className="relative rounded-3xl bg-surface/70 px-12 py-8 sm:px-16 sm:py-10">
      <div
        ref={track}
        onScroll={measure}
        tabIndex={0}
        aria-label="Screens, scrolls sideways"
        className="snap-x snap-mandatory overflow-x-auto px-1 pb-3 pt-1 outline-offset-4 [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-forest"
      >
        <ol className="flex gap-6 sm:gap-7">
          {screens.map((screen, i) => (
            <li key={screen.src} className="w-[min(58vw,204px)] shrink-0 snap-start">
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`View full size: ${screen.caption}`}
                className="group block w-full overflow-hidden rounded-[22px] bg-surface ring-1 ring-black/10 outline-offset-4 focus-visible:outline-2 focus-visible:outline-forest"
              >
                <img
                  src={screen.src}
                  alt={screen.alt}
                  width={screen.w}
                  height={screen.h}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="block w-full transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:transition-none"
                />
              </button>
              <p className="mt-4 flex gap-2 text-[13px] leading-[19px]">
                <span className="font-semibold tabular-nums text-ink-subtle">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-ink-secondary">{screen.caption}</span>
              </p>
            </li>
          ))}
        </ol>
      </div>

      {/* one arrow at each end, centred on the screens */}
      <Arrow dir={-1} disabled={edges.start} onClick={() => page(-1)} />
      <Arrow dir={1} disabled={edges.end} onClick={() => page(1)} />

      <Lightbox images={screens} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </figure>
  );
}

function Arrow({ dir, disabled, onClick }) {
  const back = dir < 0;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={back ? "Previous screens" : "Next screens"}
      className={`absolute top-[calc(50%-14px)] z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-surface text-ink-primary shadow-[0_2px_8px_rgba(24,32,30,0.08)] transition-colors hover:bg-sage-pale disabled:cursor-default disabled:opacity-40 disabled:hover:bg-surface ${
        back ? "left-1 sm:left-3" : "right-1 sm:right-3"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {back ? <path d="M15 5l-7 7 7 7" /> : <path d="M9 5l7 7-7 7" />}
      </svg>
    </button>
  );
}
