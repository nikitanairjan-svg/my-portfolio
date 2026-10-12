import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* The case study's section index.

   At rest it is a column of dots in the left margin — small enough to live in
   a narrow gutter, so it survives on a laptop screen. Hovering (or focusing)
   expands it leftward into a labelled panel; the dots themselves hold their
   place, so nothing jumps under the pointer.

   Below the width where a gutter exists at all, it collapses to a sheet. */

const EASE = [0.22, 1, 0.36, 1];

function num(i) {
  return String(i + 1).padStart(2, "0");
}

/* ---- wide screens: a dot rail that opens on hover ---- */

function Rail({ sections, activeId, onJump, ready, numbered }) {
  return (
    <nav
      aria-label="Sections"
      aria-hidden={ready ? undefined : "true"}
      /* The collapsed rail is 34px, so it only needs ~54px of gutter and
         appears from about 1120px. The expanded panel grows to the right of
         the dots into the same gutter plus a little of the page margin, which
         is empty at these widths. It fades in once the story starts, so it is
         never over the hero. */
      /* Pinned to the gutter beside the 1000px column, but never closer than
         12px to the window edge — so it survives on a narrow laptop window
         instead of disappearing, which is what kept happening. */
      className={`fixed left-[max(12px,calc(50%-548px))] top-1/2 z-30 hidden -translate-y-1/2 transition-opacity duration-300 min-[1000px]:block motion-reduce:transition-none ${
        ready ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <ul className="group/rail flex w-[34px] flex-col gap-0.5 rounded-2xl border border-transparent py-2 transition-[width,background-color,border-color,box-shadow,padding] duration-300 ease-out hover:w-[186px] hover:border-border/70 hover:bg-cream/85 hover:px-1.5 hover:shadow-[0_8px_24px_rgba(24,32,30,0.08)] hover:backdrop-blur-[2px] focus-within:w-[186px] focus-within:border-border/70 focus-within:bg-cream/85 focus-within:px-1.5 focus-within:shadow-[0_8px_24px_rgba(24,32,30,0.08)] motion-reduce:transition-none">
        {sections.map((section, i) => {
          const active = section.id === activeId;
          return (
            <li key={section.id}>
              <button
                type="button"
                aria-current={active ? "true" : undefined}
                onClick={() => onJump(section.id)}
                title={section.navLabel ?? section.title}
                className="group/row relative flex h-8 w-full items-center rounded-lg text-left transition-colors hover:bg-sage-pale/70"
              >
                <span className="grid h-8 w-[22px] shrink-0 place-items-center">
                  <span
                    className={`rounded-full transition-all duration-200 group-hover/row:scale-125 ${
                      active ? "h-[7px] w-[7px] bg-ink-primary" : "h-[6px] w-[6px] border border-ink-primary/40 bg-transparent"
                    }`}
                  />
                </span>
                {/* The label only exists once the rail is open; it is kept in
                    the DOM (not conditionally rendered) so screen readers and
                    the keyboard always have it. */}
                <span
                  className={`min-w-0 overflow-hidden whitespace-nowrap text-[13px] leading-[18px] opacity-0 transition-opacity duration-200 group-hover/rail:opacity-100 group-focus-within/rail:opacity-100 ${
                    active ? "font-medium text-ink-primary" : "text-ink-secondary"
                  }`}
                >
                  {numbered && <span className="mr-2 tabular-nums text-ink-subtle">{num(i)}</span>}
                  {section.navLabel ?? section.title}
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
    <div className="min-[1000px]:hidden">
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
