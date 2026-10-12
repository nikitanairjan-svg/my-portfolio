import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/* How a street becomes a mapped pole, one stage at a time.

   The write-up's own figure was a flat export — a white slide carrying its own
   type, which meant it could not be read on a phone, could not be selected, and
   sat at whatever size the export happened to be. This is the same four stages
   in the page's own palette: live markup, so it stays sharp, reflows, and the
   stage names are real text.

   Hovering (or focusing, or scrolling it into view on a touch screen) walks the
   pipeline. Reduced motion gets the finished state immediately.

   Built to the same plan as ForwarderFlow, deliberately: the two case studies
   each open with a "how this works" figure, and they should feel like siblings. */

const STEPS = [
  {
    id: "scan",
    stage: "Scanning",
    title: "LiDAR Camera",
    note: "Cameras scan streets and roads, capturing high-resolution 3D spatial data",
    icon: "camera",
  },
  {
    id: "generate",
    stage: "Processing",
    title: "Image Generation",
    note: "The raw data becomes a detailed 3D image: terrain, roads, infrastructure",
    icon: "cloud",
  },
  {
    id: "import",
    stage: "Import",
    title: "HC Robotics",
    note: "That image is uploaded into the platform, where the analysis happens",
    icon: "laptop",
    hero: true,
  },
  {
    id: "map",
    stage: "Mapping",
    title: "Pole Mapping",
    note: "Design engineers identify each pole and record its height, span and anchor",
    icon: "pole",
  },
];

/* Drawn rather than imported: four small marks in one stroke weight, so the row
   reads as one family instead of four borrowed icons. */
function StageIcon({ id }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: "h-5 w-5",
    "aria-hidden": "true",
  };
  if (id === "camera") {
    return (
      <svg {...common}>
        <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2.2l1.1-1.8h8.4L17.3 7h2.2A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5z" />
        <circle cx="12" cy="13" r="3.4" />
      </svg>
    );
  }
  if (id === "cloud") {
    // a point cloud: scattered returns, denser toward the centre
    return (
      <svg {...common}>
        <path d="M4 17.5h16" opacity="0.5" />
        <circle cx="7" cy="13" r="0.9" />
        <circle cx="10.5" cy="9.5" r="0.9" />
        <circle cx="14" cy="12" r="0.9" />
        <circle cx="17" cy="8" r="0.9" />
        <circle cx="12" cy="14.5" r="0.9" />
        <circle cx="8.5" cy="6.5" r="0.9" />
        <circle cx="17.5" cy="14" r="0.9" />
      </svg>
    );
  }
  if (id === "laptop") {
    return (
      <svg {...common}>
        <path d="M5 6.5h14v9H5z" />
        <path d="M2.5 19h19" />
      </svg>
    );
  }
  // a pole with its crossarm and guy line — the thing being measured
  return (
    <svg {...common}>
      <path d="M12 3.5v17" />
      <path d="M7 7h10" />
      <path d="M12 12.5 17.5 20" opacity="0.55" />
      <path d="M4.5 20.5h15" />
    </svg>
  );
}

export default function LidarFlow({ caption }) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(-1); // -1 = at rest
  const ref = useRef(null);
  const timer = useRef(null);

  /* Started and stopped by the events that cause it, not by an effect watching
     a flag — driving it from an effect sets state during render-commit and
     cascades renders for nothing. */
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

  useEffect(() => () => clearInterval(timer.current), []);

  // No hover on a touch screen: run it once when it arrives.
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
      aria-label="How a LiDAR scan becomes a mapped electrical pole, step by step"
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
              className={`flex min-w-0 flex-1 flex-col items-center rounded-xl bg-surface px-3 py-5 text-center ring-1 ${
                s.hero ? "ring-forest/35" : "ring-border"
              }`}
            >
              <span
                className={`grid h-10 w-10 place-items-center rounded-full ${
                  s.hero ? "bg-sage text-forest" : "bg-sage-pale text-olive"
                }`}
              >
                <StageIcon id={s.icon} />
              </span>
              <span className="mt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-forest">{s.stage}</span>
              <span className="mt-1.5 font-serif text-[14px] font-semibold leading-[18px] text-ink-primary">{s.title}</span>
              <span className="mt-1.5 text-[11px] leading-[16px] text-ink-subtle">{s.note}</span>
            </motion.div>

            {i < STEPS.length - 1 && (
              <motion.span
                aria-hidden="true"
                animate={reduce ? {} : { opacity: shown(i + 1) ? 1 : 0.2 }}
                transition={{ duration: 0.3 }}
                className="flex shrink-0 items-center justify-center py-1 lg:w-[54px] lg:pt-12"
              >
                <svg
                  viewBox="0 0 24 12"
                  className="h-3 w-6 rotate-90 text-ink-primary/35 lg:rotate-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M0 6h19M15 2l4 4-4 4" />
                </svg>
              </motion.span>
            )}
          </li>
        ))}
      </ol>

      <figcaption className="mt-5 text-center text-[13px] leading-[20px] text-ink-subtle">
        {caption ?? "Scan, process, import, map. Hover to follow the pipeline."}
      </figcaption>
    </figure>
  );
}
