import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* The case study's section index.

   At rest it is a column of dots in the left margin — small enough to live in
   a narrow gutter, so it survives on a laptop screen. Hovering (or focusing)
   expands it rightward into a labelled panel; the dots themselves hold their
   place, so nothing jumps under the pointer.

   Below the width where a gutter exists at all, it collapses to a sheet. */

const EASE = [0.22, 1, 0.36, 1];

function num(i) {
  return String(i + 1).padStart(2, "0");
}

/* ---- wide screens: a dot rail that opens on hover ---- */

const PANEL_W = 186;     // open width; the longest label ("Problem & solution") needs 168
const GAP = 140;         // breathing room between the rail and the text column
const EDGE = 12;          // never closer than this to the window edge
const DISC = 28;          // the active step's filled disc
const PAD = 8;            // the rail's inner padding
const BORDER = 1;         // its hairline border
// Collapsed width: the disc, the padding and the border. Leaving the border
// out made the row 2px narrower than the dot column, so the dots sat 2px off
// at rest and jumped back when the rail opened.
const RAIL_W = DISC + 2 * PAD + 2 * BORDER;
const ROW = 32;           // each row's height
const ROW_GAP = 4;        // space between rows

/* At rest: a column of dots in the left margin, the current one a filled disc
   carrying its number, so it reads as a progress indicator on its own.
   Hovering (or focusing) opens it rightward into a labelled panel that floats
   over the text; the dots hold their x position, so nothing jumps under the
   pointer.

   Every number here is measured from the DOM rather than expressed in CSS.
   Four earlier attempts derived the geometry from nested clamps that mixed
   100vw with percentages resolving against the nav's own box, and each one put
   the panel off-screen at some width while the CSS still looked plausible. The
   only input now is the text column's left edge: the collapsed rail ends GAP
   short of it, never closer than EDGE to the window. */
function Rail({ sections, activeId, onJump, ready, numbered }) {
  const [geo, setGeo] = useState(null);
  const frame = useRef(0);

  useEffect(() => {
    const measure = () => {
      frame.current = 0;
      const main = document.querySelector("main");
      if (!main) return;
      const box = main.getBoundingClientRect();
      const colLeft = box.left + parseFloat(getComputedStyle(main).paddingLeft || 0);
      const left = Math.max(EDGE, Math.round(colLeft - GAP - RAIL_W));
      setGeo({ left, width: Math.min(PANEL_W, window.innerWidth - left - EDGE) });
    };
    const onResize = () => {
      if (!frame.current) frame.current = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("resize", onResize);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  if (!geo) return null;

  const activeIndex = Math.max(0, sections.findIndex((s) => s.id === activeId));

  return (
    <nav
      aria-label="Sections"
      aria-hidden={ready ? undefined : "true"}
      style={{ left: `${geo.left}px`, width: `${geo.width}px` }}
      /* The nav box spans the open width, but only the rail itself takes the
         pointer, so text under the empty part stays selectable and clickable. */
      className={`pointer-events-none fixed top-1/2 z-30 hidden -translate-y-1/2 transition-opacity duration-300 min-[1100px]:block motion-reduce:transition-none ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* The open width is a measured pixel value handed to CSS as a custom
          property, so the transition stays in CSS without any CSS arithmetic. */}
      <ul
        style={{ "--open-w": `${geo.width}px`, width: `${RAIL_W}px` }}
        className={`group/rail relative flex flex-col gap-1 overflow-hidden rounded-[22px] border border-border/50 bg-surface/85 px-2 py-2 shadow-[0_4px_16px_rgba(24,32,30,0.07)] backdrop-blur-[2px] transition-[width,background-color,border-color,box-shadow,padding] duration-300 ease-out hover:!w-[var(--open-w)] hover:border-border/70 hover:bg-surface/95 hover:shadow-[0_10px_28px_rgba(24,32,30,0.12)] focus-within:!w-[var(--open-w)] focus-within:border-border/70 focus-within:bg-surface/95 focus-within:shadow-[0_10px_28px_rgba(24,32,30,0.12)] motion-reduce:transition-none ${
          ready ? "pointer-events-auto" : ""
        }`}
      >
        {/* the thread the dots sit on, held at the dot column's centre */}
        <span
          aria-hidden="true"
          style={{ left: `${PAD + DISC / 2}px` }}
          className="pointer-events-none absolute inset-y-4 w-px -translate-x-1/2 bg-ink-primary/15"
        />

        {/* One disc for the whole rail, sliding to the current row, rather
            than a disc per row that pops in and out as the reader scrolls. */}
        <span
          aria-hidden="true"
          style={{
            left: `${PAD}px`,
            top: `${PAD + (ROW - DISC) / 2}px`,
            transform: `translateY(${activeIndex * (ROW + ROW_GAP)}px)`,
          }}
          className="pointer-events-none absolute z-[2] grid h-[28px] w-[28px] place-items-center rounded-full bg-forest text-[10px] font-semibold tabular-nums leading-none text-cream shadow-[0_2px_6px_rgba(24,32,30,0.25)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
        >
          {numbered ? num(activeIndex) : ""}
        </span>

        {sections.map((section) => {
          const active = section.id === activeId;
          return (
            <li key={section.id}>
              <button
                type="button"
                aria-current={active ? "true" : undefined}
                onClick={() => onJump(section.id)}
                title={section.navLabel ?? section.title}
                className={`group/row relative flex h-8 w-full flex-row-reverse items-center rounded-xl text-left transition-colors ${
                  active ? "bg-sage-pale/80" : "hover:bg-sage-pale/50"
                }`}
              >
                {/* The outer span can shrink to nothing; the padding lives on
                    the inner one. Padding on a flex item can't shrink, and in
                    the 28px collapsed row it shoved the dots half out of view. */}
                <span className="min-w-0 flex-1 overflow-hidden">
                <span
                  className={`block truncate pl-2 pr-3 text-[13px] leading-[18px] opacity-0 transition-opacity duration-200 group-hover/rail:opacity-100 group-focus-within/rail:opacity-100 ${
                    active ? "font-medium text-ink-primary" : "text-ink-secondary"
                  }`}
                >
                  {section.navLabel ?? section.title}
                </span>
                </span>

                {/* The dot column: fixed width, never shrinks. Every row keeps
                    its hollow dot (the sliding disc covers the current one),
                    and hover only darkens it, so nothing in the column moves. */}
                <span className="relative z-[1] grid h-8 w-[28px] shrink-0 place-items-center">
                  <span className="h-[13px] w-[13px] rounded-full border border-ink-primary/35 bg-surface transition-colors duration-200 group-hover/row:border-ink-primary/70" />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ---- narrower: a pill that opens a sheet ---- */

function Sheet({ sections, activeId, onJump, reduce, numbered }) {
  const [open, setOpen] = useState(false);
  const activeIndex = Math.max(0, sections.findIndex((s) => s.id === activeId));

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="min-[1100px]:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 text-[13px] font-medium text-ink-primary shadow-[0_2px_6px_rgba(24,32,30,0.08),0_16px_32px_-18px_rgba(24,32,30,0.4)]"
      >
        {/* Unnumbered studies get the rail's dot rather than a hollow ring. */}
        <span className="grid h-6 w-6 place-items-center rounded-full bg-ink-primary text-[11px] tabular-nums text-surface">
          {numbered ? num(activeIndex) : <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-surface" />}
        </span>
        Sections
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Close sections"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-ink-primary/25"
            />
            <motion.div
              role="dialog"
              aria-label="Sections"
              initial={reduce ? false : { y: "100%" }}
              animate={{ y: 0 }}
              exit={reduce ? {} : { y: "100%" }}
              transition={{ duration: 0.3, ease: EASE }}
              className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border-t border-border bg-surface pb-[max(1rem,env(safe-area-inset-bottom))] pt-2"
            >
              <div className="mx-auto mb-1 h-1 w-10 rounded-full bg-border" />
              <div className="flex items-center justify-between px-5 py-3">
                <span className="text-[11px] uppercase tracking-[0.2em] text-ink-subtle">Sections</span>
                <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="px-2 text-[13px] text-ink-secondary">
                  ✕
                </button>
              </div>
              <ul className="max-h-[60svh] overflow-y-auto px-3 pb-2">
                {sections.map((section, i) => {
                  const active = section.id === activeId;
                  return (
                    <li key={section.id}>
                      <button
                        type="button"
                        aria-current={active ? "true" : undefined}
                        onClick={() => {
                          setOpen(false);
                          onJump(section.id);
                        }}
                        className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-3 text-left ${active ? "bg-[#E6EFE7]" : ""}`}
                      >
                        <span
                          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] tabular-nums ${
                            active ? "bg-ink-primary text-surface" : "border border-border text-ink-subtle"
                          }`}
                        >
                          {numbered ? (
                            num(i)
                          ) : (
                            <span
                              aria-hidden="true"
                              className={`h-1.5 w-1.5 rounded-full ${active ? "bg-surface" : "bg-ink-primary/40"}`}
                            />
                          )}
                        </span>
                        <span className={`text-[13px] ${active ? "font-medium text-ink-primary" : "text-ink-secondary"}`}>
                          {section.navLabel ?? section.title}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SectionNav({ sections, activeId, onJump, reduce, ready = true, numbered = true }) {
  return (
    <>
      <Rail sections={sections} activeId={activeId} onJump={onJump} ready={ready} numbered={numbered} />
      <Sheet sections={sections} activeId={activeId} onJump={onJump} reduce={reduce} numbered={numbered} />
    </>
  );
}
