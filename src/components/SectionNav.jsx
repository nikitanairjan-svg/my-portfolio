import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* The case study's section navigator.

   The story is one continuous read in two parts — the summary and the full
   process — so the rail carries both, grouped, with its numbering restarting
   per group. At rest it is a narrow pill: a continuous line with a soft dot per
   section and one filled circle carrying the current number, which travels down
   as you read. Hovering (or focusing) widens the pill to show the labels and
   the group headings; the rail itself never moves.

   It sticks inside the content wrapper, so it travels with the story and stops
   where the story stops. */

const EASE = [0.22, 1, 0.36, 1];
const SPRING = { type: "spring", stiffness: 380, damping: 32 };

function num(i) {
  return String(i + 1).padStart(2, "0");
}

/* ---- desktop ---- */

function Rail({ groups, activeUid, onJump, reduce }) {
  return (
    // Top starts at the first section, not the wrapper's padding, so the rail
    // can never climb above the heading that sits over the first section.
    <nav aria-label="Sections" className="pointer-events-none absolute bottom-0 left-0 top-14 z-30 hidden lg:block">
      {/* A viewport-tall sticky box centres the rail without a transform —
          a translate would let it overshoot the top of this container. */}
      <div className="sticky top-0 flex h-svh items-center">
        <div className="group pointer-events-auto -translate-x-[52px] xl:-translate-x-[76px]">
          <div className="relative flex max-h-[78svh] w-10 flex-col overflow-y-auto overflow-x-hidden rounded-[20px] border border-border/60 bg-cream/70 py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.06)] backdrop-blur-[2px] transition-[width,border-radius] duration-300 ease-out group-hover:w-[212px] group-hover:rounded-2xl group-focus-within:w-[212px] group-focus-within:rounded-2xl motion-reduce:transition-none">
            {/* one continuous line, behind the markers */}
            <span aria-hidden="true" className="absolute left-5 top-[28px] bottom-[28px] w-[2px] -translate-x-1/2 bg-ink-primary/12" />

            {groups.map((group, g) => (
              <ul key={group.id} className={g > 0 ? "mt-1.5" : undefined}>
                {/* The group's name only has room once the rail is open. */}
                <li
                  aria-hidden="true"
                  className="type-label relative h-0 overflow-hidden whitespace-nowrap pl-10 uppercase tracking-[0.2em] text-ink-subtle opacity-0 transition-[height,opacity,margin] duration-200 group-hover:mb-1 group-hover:h-4 group-hover:opacity-100 group-focus-within:mb-1 group-focus-within:h-4 group-focus-within:opacity-100"
                >
                  {group.label}
                </li>

                <AnimatePresence initial={false}>
                  {group.sections.map((section, i) => {
                    const active = section.uid === activeUid;
                    return (
                      <motion.li
                        key={section.uid}
                        layout={!reduce}
                        initial={reduce ? false : { opacity: 0, height: 0 }}
                        animate={reduce ? {} : { opacity: 1, height: "auto" }}
                        exit={reduce ? {} : { opacity: 0, height: 0 }}
                        transition={{ duration: 0.26, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <button
                          type="button"
                          aria-current={active ? "true" : undefined}
                          onClick={() => onJump(section.uid)}
                          className="relative flex h-11 w-[204px] items-center text-left"
                        >
                          {/* the active row's ground, only once the labels are out */}
                          {active && (
                            <motion.span
                              layoutId="rail-row"
                              transition={reduce ? { duration: 0 } : SPRING}
                              className="absolute inset-y-0.5 left-1 right-1 rounded-xl bg-[#E6EFE7] opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
                            />
                          )}
                          <span className="relative grid h-11 w-10 shrink-0 place-items-center">
                            {active ? (
                              <motion.span
                                layoutId="rail-active"
                                transition={reduce ? { duration: 0 } : SPRING}
                                className="type-label grid h-9 w-9 place-items-center rounded-full bg-ink-primary tabular-nums text-surface"
                              >
                                {num(i)}
                              </motion.span>
                            ) : (
                              <span className="h-3 w-3 rounded-full border border-ink-primary/20 bg-surface/70" />
                            )}
                          </span>
                          <span
                            className={`type-body-s relative whitespace-nowrap pr-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 ${
                              active ? "font-semibold text-ink-primary" : "text-ink-secondary"
                            }`}
                          >
                            {section.navLabel ?? section.title}
                          </span>
                        </button>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

/* ---- small screens: a pill that opens a sheet ---- */

function Sheet({ groups, activeUid, onJump, reduce }) {
  const [open, setOpen] = useState(false);
  const flat = groups.flatMap((g) => g.sections);
  const activeIndex = Math.max(0, flat.findIndex((s) => s.uid === activeUid));

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        className="type-body-s fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 font-medium text-ink-primary shadow-[0_2px_6px_rgba(24,32,30,0.08),0_16px_32px_-18px_rgba(24,32,30,0.4)]"
      >
        <span className="type-label grid h-6 w-6 place-items-center rounded-full bg-ink-primary tabular-nums text-surface">{num(activeIndex)}</span>
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
                <span className="type-label uppercase tracking-[0.2em] text-ink-subtle">Sections</span>
                <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="type-body-s px-2 text-ink-secondary">
                  ✕
                </button>
              </div>

              <div className="max-h-[60svh] overflow-y-auto px-3 pb-2">
                {groups.map((group) => (
                  <div key={group.id} className="mb-2">
                    <p className="type-label px-2.5 pb-1.5 pt-2 uppercase tracking-[0.2em] text-ink-subtle">{group.label}</p>
                    <ul>
                      {group.sections.map((section, i) => {
                        const active = section.uid === activeUid;
                        return (
                          <li key={section.uid}>
                            <button
                              type="button"
                              aria-current={active ? "true" : undefined}
                              onClick={() => {
                                setOpen(false);
                                onJump(section.uid);
                              }}
                              className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-3 text-left ${active ? "bg-[#E6EFE7]" : ""}`}
                            >
                              <span
                                className={`type-label grid h-7 w-7 shrink-0 place-items-center rounded-full tabular-nums ${
                                  active ? "bg-ink-primary text-surface" : "border border-border text-ink-subtle"
                                }`}
                              >
                                {num(i)}
                              </span>
                              <span className={`type-body-s ${active ? "font-semibold text-ink-primary" : "text-ink-secondary"}`}>
                                {section.navLabel ?? section.title}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SectionNav({ groups, activeUid, onJump, reduce }) {
  return (
    <>
      <Rail groups={groups} activeUid={activeUid} onJump={onJump} reduce={reduce} />
      <Sheet groups={groups} activeUid={activeUid} onJump={onJump} reduce={reduce} />
    </>
  );
}
