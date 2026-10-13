import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

/* A strip of headline numbers between the pegboard and the case studies.
   Each number counts up from zero the first time the strip scrolls into view;
   reduced motion shows the final figures straight away. On short screens the
   strip is already visible on load, so the count waits for the opening
   signature (html[data-intro]) to finish rather than running behind it. */

const METRICS = [
  { value: 4, suffix: "+", label: "Years Experience" },
  { value: 10, suffix: "+", label: "Projects Completed" },
  { value: 7, suffix: "+", label: "Domains Explored" },
  { value: 20, suffix: "+", label: "Usability Issues Solved" },
];

const DURATION = 1.8;

// The intro marks <html> in a layout effect, which runs after this component
// first renders, so the check has to happen after mount rather than during it.
function useIntroDone() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const check = () => {
      if (document.documentElement.dataset.intro !== "playing") setDone(true);
    };
    const frame = requestAnimationFrame(check);
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-intro"] });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);
  return done;
}

function Count({ value, suffix, start, reduce }) {
  const [shown, setShown] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!start || reduce) return undefined;
    const controls = animate(0, value, {
      duration: DURATION,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => controls.stop();
  }, [start, reduce, value]);

  return (
    <span className="tabular-nums">
      {reduce ? value : shown}
      {suffix}
    </span>
  );
}

export default function KpiStrip() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const introDone = useIntroDone();

  return (
    <section aria-label="At a glance" className="border-y border-border bg-canvas px-4 py-[60px] sm:px-6 lg:px-10">
      <dl ref={ref} className="mx-auto grid max-w-[1200px] grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-y-12 lg:grid-cols-4 lg:gap-y-0">
        {METRICS.map((m, i) => (
          <div
            key={m.label}
            className={`flex flex-col items-center text-center ${i > 0 ? "lg:border-l lg:border-border" : ""}`}
          >
            <dt className="order-2 mt-2 font-sans text-[14px] leading-[20px] text-ink-secondary">{m.label}</dt>
            <dd className="order-1 font-display text-[48px] font-semibold leading-[1.1] text-ink-primary">
              <Count value={m.value} suffix={m.suffix} start={inView && introDone} reduce={reduce} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
