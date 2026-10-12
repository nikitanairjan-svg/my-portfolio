import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Lightbox from "./Lightbox";

/* A set of related images — sketches, wireframes, finished screens.

   Shown as real buttons: clicking any one opens it full size and the rest can
   be stepped through from there. Nothing is cropped, so each tile keeps its
   source ratio, and a "view" mark appears on hover so it is obvious the tiles
   are not just pictures.

   `feature` promotes the first image to the full width of the grid, for sets
   where one frame is the one worth leading with.

   Three layouts, chosen from the ratios rather than set by hand:

   - near-uniform ratios  -> a plain grid. No holes, and only a grid can give
     the lead image a full-width span.
   - mixed ratios         -> CSS columns, which pack vertically with no holes.
   - one towering tile    -> a weighted two-column split (see below). */

const EASE = [0.22, 1, 0.36, 1];

/* CSS multi-column balances by content order, which fails completely when a
   single tile is taller than the other columns put together: HC Robotics'
   sketches are three landscape photos (ratios 2.25, 1.51, 1.42) beside one
   portrait sitemap (0.62), and in three columns that left bottoms at 345px,
   210px and 482px — a 272px hole under the middle column.

   So when the spread is that extreme, split the set in two and pick column
   widths that make both columns end level. A column of width w holding images
   of ratio r stands w * Σ(1/r) tall, so equal heights means
   wLeft * Σ(1/r)left = wRight * Σ(1/r)right — which fixes the width share at
   Σright / (Σleft + Σright). Every contiguous split is tried and the one
   giving the most comparable column widths wins. Gaps are ignored in the
   solve, worth a couple of dozen pixels against columns ~790px tall. */
function splitForBalance(ratios) {
  const inv = ratios.map((r) => 1 / r);
  const sum = (a) => a.reduce((s, v) => s + v, 0);
  let best = null;
  for (let k = 1; k < inv.length; k += 1) {
    const left = sum(inv.slice(0, k));
    const right = sum(inv.slice(k));
    const share = right / (left + right); // width share the left column needs
    const score = Math.abs(share - 0.5); // prefer columns of comparable width
    if (!best || score < best.score) best = { k, share, score };
  }
  // A split that leaves one column a sliver is worse than the hole it fixes.
  return best && best.share >= 0.3 && best.share <= 0.7 ? best : null;
}

function Tile({ image, delay, reduce, onOpen }) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: reduce ? 0 : delay, ease: EASE }}
      className="min-w-0"
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`View full size: ${image.alt}`}
        className="group relative block w-full overflow-hidden rounded-xl border border-border bg-surface outline-offset-4 focus-visible:outline-2 focus-visible:outline-forest"
      >
        {/* Each image keeps its own ratio: these sources run from 2.25 to 0.62,
            and object-cover cropped the wide ones on both sides. */}
        <img
          src={image.src}
          alt={image.alt}
          width={image.w}
          height={image.h}
          loading="lazy"
          decoding="async"
          draggable={false}
          style={{ aspectRatio: `${image.w} / ${image.h}` }}
          className="w-full bg-surface object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-end justify-end bg-ink-primary/0 p-3 opacity-0 transition-all duration-300 group-hover:bg-ink-primary/10 group-hover:opacity-100"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface/95 px-2.5 py-1 text-[11px] font-medium text-ink-primary shadow-[0_2px_8px_rgba(24,32,30,0.15)]">
            View
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </span>
        </span>
      </button>
    </motion.div>
  );
}

export default function ImageSet({ images, cols = 3, feature = false, caption }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(null);

  const colClass = cols === 2 ? "sm:grid-cols-2" : cols === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3";
  const masonryClass = cols === 2 ? "columns-1 sm:columns-2" : cols === 4 ? "columns-2 lg:columns-4" : "columns-1 sm:columns-2 lg:columns-3";

  const ratios = images.map((img) => img.w / img.h);
  const spread = Math.max(...ratios) / Math.min(...ratios);
  const uniform = spread < 1.15;
  const balanced = !uniform && spread >= 2.2 && images.length >= 3 && images.length <= 6 ? splitForBalance(ratios) : null;

  return (
    <>
      <figure>
        {balanced ? (
          /* Two stacks, sized so they finish together. The share is carried as
             a custom property because the split comes from the data, and it is
             only applied from lg up — below that the stacks sit one after the
             other in source order, which is the order they were given in. */
          <div
            className="grid gap-3 lg:grid-cols-[var(--set-left)_var(--set-right)]"
            style={{ "--set-left": `${(balanced.share * 100).toFixed(2)}fr`, "--set-right": `${((1 - balanced.share) * 100).toFixed(2)}fr` }}
          >
            {[images.slice(0, balanced.k), images.slice(balanced.k)].map((group, gi) => (
              <ul key={gi} className="flex min-w-0 flex-col gap-3">
                {group.map((image, j) => {
                  const i = gi === 0 ? j : balanced.k + j;
                  return (
                    <li key={image.src} className="min-w-0">
                      <Tile image={image} delay={Math.min(i, 5) * 0.05} reduce={reduce} onOpen={() => setOpen(i)} />
                    </li>
                  );
                })}
              </ul>
            ))}
          </div>
        ) : (
          <ul className={uniform ? `grid items-start gap-3 ${colClass}` : `gap-3 ${masonryClass}`}>
            {images.map((image, i) => (
              <li
                key={image.src}
                className={
                  uniform
                    ? feature && i === 0
                      ? "sm:col-span-2 lg:col-span-3"
                      : undefined
                    : "mb-3 break-inside-avoid"
                }
              >
                <Tile image={image} delay={Math.min(i, 5) * 0.05} reduce={reduce} onOpen={() => setOpen(i)} />
              </li>
            ))}
          </ul>
        )}
        {caption && <figcaption className="mt-3 text-[13px] italic leading-[20px] text-ink-subtle">{caption}</figcaption>}
      </figure>

      <Lightbox images={images} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </>
  );
}
