import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/* The freight-forwarding chain, told one step at a time.

   The whole point of this figure is the sequence — who hires whom, and in what
   order — which a flat picture cannot carry. Hovering (or focusing, or simply
   scrolling it into view on a touch screen) walks the chain: the buyer places
   an order, the supplier hires the forwarder, the forwarder arranges the
   carrier, and the goods come back to the buyer.

   Everything is live markup rather than an image, so it stays sharp, the names
   are selectable text, and it reflows on a phone. Reduced motion gets the
   finished state immediately. */

const STEPS = [
  { id: "buyer", brand: "Walmart", role: "Buyer", note: "Places an order for their goods", tint: "#0071CE" },
  { id: "supplier", brand: "Foxconn", role: "Supplier", note: "Prepares and hands over the goods", tint: "#0A4595" },
  { id: "forwarder", brand: "DHL", role: "Freight Forwarder", note: "Coordinates the shipment across parties", tint: "#D40511", hero: true },
  { id: "carrier", brand: "Maersk", role: "Carrier", note: "Moves the goods by sea, air, rail or road", tint: "#42B0D5" },
  { id: "port", brand: "Destination Port", role: "Arrival", note: "Goods reach the destination", tint: "#6B6AA8" },
];

const LINKS = ["Places order", "Hires to handle logistics", "Arranges transport", "Moves goods"];

export default function ForwarderFlow({ caption }) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(-1); // -1 = at rest
  const ref = useRef(null);
  const timer = useRef(null);

  /* The walk is started and stopped by the events that cause it, not by an
     effect watching a flag. Driving it from an effect meant setting state
     synchronously during render-commit, which cascades renders for no reason. */
  const start = useCallback(() => {
    if (reduce) return;
    clearInterval(timer.current);
    setStep(0);
    timer.current = setInterval(() => {
      setStep((s) => (s >= STEPS.length - 1 ? s : s + 1));
    }, 520);
  }, [reduce]);

  const rest = useCallback(() => {
    clearInterval(timer.current);
    setStep(-1);
  }, []);

  // Stop the interval if the figure goes away mid-walk.
  useEffect(() => () => clearInterval(timer.current), []);

  // On a touch screen there is no hover: run it once when it scrolls into view.
  useEffect(() => {
    if (reduce || !ref.current) return undefined;
    if (window.matchMedia("(hover: hover)").matches) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start();
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [reduce, start]);

  const shown = (i) => reduce || step < 0 || i <= step;
  const atRest = !reduce && step < 0;

  return (
    <figure
      ref={ref}
      onMouseEnter={start}
      onMouseLeave={rest}
      onFocus={start}
      onBlur={rest}
      tabIndex={0}
      aria-label="How a freight forwarder coordinates a shipment, step by step"
      className="group rounded-2xl bg-[#FBF8F2] px-5 py-8 ring-1 ring-border outline-offset-4 focus-visible:outline-2 focus-visible:outline-forest sm:px-8"
    >
      <ol className="flex flex-col items-stretch gap-3 lg:flex-row lg:items-start lg:gap-0">
        {STEPS.map((s, i) => (
          <li key={s.id} className="contents">
            <motion.div
              animate={
                reduce
                  ? {}
                  : {
                      opacity: shown(i) ? 1 : 0.28,
                      y: shown(i) ? 0 : 6,
                      scale: !atRest && step === i ? 1.03 : 1,
                    }
              }
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              className={`flex min-w-0 flex-1 flex-col items-center rounded-xl bg-surface px-3 py-4 text-center ring-1 ${
                s.hero ? "ring-forest/35" : "ring-border"
              }`}
            >
              <span className="text-[14px] font-semibold leading-[18px]" style={{ color: s.tint }}>
                {s.brand}
              </span>
              <span className="mt-1.5 text-[12px] font-medium leading-[16px] text-ink-primary">{s.role}</span>
              <span className="mt-1 text-[11px] leading-[15px] text-ink-subtle">{s.note}</span>
            </motion.div>

            {i < LINKS.length && (
              <motion.span
                aria-hidden="true"
                animate={reduce ? {} : { opacity: shown(i + 1) ? 1 : 0.2 }}
                transition={{ duration: 0.3 }}
                className="flex shrink-0 flex-col items-center justify-center gap-1 py-1 lg:w-[86px] lg:pt-7"
              >
                <span className="text-[10px] leading-[13px] text-ink-subtle">{LINKS[i]}</span>
                <svg viewBox="0 0 24 12" className="h-3 w-6 rotate-90 text-ink-primary/35 lg:rotate-0" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M0 6h19M15 2l4 4-4 4" />
                </svg>
              </motion.span>
            )}
          </li>
        ))}
      </ol>

      {/* the return leg, drawn once the chain has completed */}
      <motion.div
        aria-hidden="true"
        animate={reduce ? {} : { opacity: shown(STEPS.length - 1) ? 1 : 0.18 }}
        transition={{ duration: 0.4 }}
        className="mt-5 hidden items-center gap-3 lg:flex"
      >
        <span className="h-px flex-1 border-t border-dashed border-ink-primary/30" />
        <span className="text-[11px] leading-[15px] text-ink-subtle">Delivers the goods back to the buyer</span>
        <span className="h-px flex-1 border-t border-dashed border-ink-primary/30" />
      </motion.div>

      <figcaption className="mt-5 text-center text-[13px] leading-[20px] text-ink-subtle">
        {caption ?? "Hover to follow the chain."}
      </figcaption>
    </figure>
  );
}
