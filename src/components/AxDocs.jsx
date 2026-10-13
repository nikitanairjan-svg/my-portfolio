import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Lightbox from "./Lightbox";

/* AX Flow's interaction library, one card per pattern family: what the
   family is for and the components in it, beside the screens that show
   those components working.

   The cards stack the way the home page's case studies do: each one sticks
   a little lower than the last, so the next rises over it and a strip of
   every covered card (its number and name) stays visible, and a covered card
   eases back. There are no drop shadows: alternating grounds separate the
   cards instead. Stacking only works where a whole card fits on screen, so
   on narrow or short windows, and for reduced motion, they are a plain list.
   Every screen opens full size. */

const TOP = 88; // where the first card settles, clear of the sticky header
const PEEK = 44; // how much of each covered card stays visible: its header
const HOLD = 140; // scroll the finished pile stays put for before it leaves

// stacking needs room for the whole card, so it waits for a wide, tall window
function useStacks() {
  const reduce = useReducedMotion();
  const [fits, setFits] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (min-height: 760px)");
    const update = () => setFits(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return fits && !reduce;
}

function Doc({ item, index, count, stack }) {
  // every other card takes a sage ground, so the pile reads card by card
  const alt = index % 2 === 1;
  const ref = useRef(null);
  const [open, setOpen] = useState(null);
  // how far this card has been covered by the next, measured on its own slot
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  return (
    <li
      ref={ref}
      className={stack ? "sticky" : undefined}
      /* A sticky card lets go when its bottom margin meets the end of the
         list. Every card sits PEEK lower than the one before, so without
         help the last card lets go first and slides up over the others'
         strips. A bottom margin of PEEK for every card after this one makes
         them all let go at the same moment, and the pile leaves as one. */
      style={stack ? { top: TOP + index * PEEK, zIndex: index + 1, marginBottom: (count - 1 - index) * PEEK } : undefined}
    >
      <motion.div style={stack ? { scale } : undefined} className="relative origin-top">
        <article
          data-doc-card
          style={stack ? { minHeight: "var(--doc-h)" } : undefined}
          className={`flex flex-col rounded-3xl border px-5 pb-6 pt-3 sm:px-7 sm:pb-7 ${alt ? "border-forest/15 bg-[#E9EFE5]" : "border-border bg-surface"}`}
        >
          {/* the strip that stays visible when the card is covered */}
          <h3 className="flex h-[38px] items-center gap-2.5 font-serif text-[17px] font-semibold text-ink-primary">
            <span className="tabular-nums text-forest/60">{String(index + 1).padStart(2, "0")}</span>
            <span aria-hidden="true" className="text-ink-primary/25">—</span>
            {item.name}
          </h3>

          <div className="mt-3 grid flex-1 content-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)] lg:gap-8">
            <div className="self-center">
              <p className="text-[15px] leading-[1.55] text-ink-secondary">{item.text}</p>
              <ul className={`mt-5 flex flex-col divide-y ${alt ? "divide-forest/15" : "divide-border"}`}>
                {item.components.map((c) => (
                  <li key={c} className="flex items-center gap-3 py-2.5 text-[14px] text-ink-primary/85 first:pt-0 last:pb-0">
                    <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-forest/60" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            {/* on a phone the screens keep a readable size and the row
                scrolls sideways instead of squeezing them */}
            <div className={`flex items-center overflow-x-auto rounded-2xl ${alt ? "bg-surface/70" : "bg-[#DCE6D8]"} px-4 py-6 [scrollbar-width:thin] sm:justify-center sm:overflow-visible sm:px-6`}>
              <div className="mx-auto flex items-start gap-4 sm:w-full sm:justify-center sm:gap-5">
                {item.screens.map((s, i) => (
                  <figure key={s.src + i} className="w-[170px] shrink-0 sm:w-auto sm:min-w-0 sm:max-w-[220px] sm:flex-1 sm:shrink">
                    <button
                      type="button"
                      onClick={() => setOpen(i)}
                      aria-label={`View full size: ${s.alt}`}
                      className="group block w-full overflow-hidden rounded-[18px] bg-white ring-1 ring-black/10 outline-offset-4 focus-visible:outline-2 focus-visible:outline-forest"
                    >
                      {/* a window onto the part of the screen where the
                          component is; `pos` slides it down to a drawer */}
                      <img
                        src={s.src}
                        alt={s.alt}
                        width={390}
                        height={851}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        style={{ objectPosition: `50% ${s.pos ?? 0}%` }}
                        className="block aspect-[390/560] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
                      />
                    </button>
                    {s.caption && <figcaption className="mt-2.5 text-center text-[12.5px] leading-[17px] text-ink-secondary">{s.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </article>
      </motion.div>
      <Lightbox images={item.screens.map((s) => ({ ...s, w: 390, h: 851 }))} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </li>
  );
}

/* Every card in the stack has to be the same height. A card with three
   screens stands taller than one with four, and a taller card under a
   shorter one shows its bottom edge below it, so the pile looked like green
   cards poking out under white ones. The tallest card sets the height for
   all of them, re-measured whenever the layout changes. */
function useEqualHeights(ref, on) {
  useEffect(() => {
    const list = ref.current;
    if (!on || !list) return undefined;
    const measure = () => {
      list.style.removeProperty("--doc-h");
      const cards = [...list.querySelectorAll("[data-doc-card]")];
      const tallest = Math.max(...cards.map((c) => c.offsetHeight));
      list.style.setProperty("--doc-h", `${tallest}px`);
    };
    measure();
    const observer = new ResizeObserver(() => requestAnimationFrame(measure));
    observer.observe(list);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      list.style.removeProperty("--doc-h");
    };
  }, [ref, on]);
}

export default function AxDocs({ items, footer }) {
  const stack = useStacks();
  const list = useRef(null);
  useEqualHeights(list, stack);
  return (
    <div>
      {/* wider than the text column so the screens can be read, centred on
          it and kept clear of the section rail, as the wide plates are */}
      <ol ref={list} className={`flex flex-col ${stack ? "" : "gap-6"} lg:relative lg:left-1/2 lg:w-[max(100%,min(1120px,calc(100vw-300px)))] lg:max-w-none lg:-translate-x-1/2`}>
        {items.map((item, i) => (
          <Doc key={item.name} item={item} index={i} count={items.length} stack={stack} />
        ))}
        {/* room after the last card, so the finished pile holds for a moment
            before it scrolls away */}
        {stack && <li aria-hidden="true" style={{ height: HOLD }} />}
      </ol>
      {footer && <p className="mt-8 text-center text-[13px] leading-[20px] text-ink-secondary">{footer}</p>}
    </div>
  );
}
