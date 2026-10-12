import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import SectionHeader from "./SectionHeader";

/* Section 3 — "How I work": four torn-paper sticky notes with washi tape and
   light flow arrows between them. Everything reveals once, in layers, when the
   section comes into view. */

// Small seeded PRNG so each note's torn edge is irregular but identical on every load.
function seeded(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A clip-path polygon whose four edges are nibbled inwards like torn paper (values in %).
function tornEdge(seed, depth = 1.7, step = 2.1) {
  const rand = seeded(seed);
  const nibble = () => rand() * depth;
  const pts = [];
  for (let x = 0; x < 100; x += step) pts.push([x, nibble()]);
  for (let y = 0; y < 100; y += step) pts.push([100 - nibble(), y]);
  for (let x = 100; x > 0; x -= step) pts.push([x, 100 - nibble()]);
  for (let y = 100; y > 0; y -= step) pts.push([nibble(), y]);
  return `polygon(${pts.map(([x, y]) => `${x.toFixed(2)}% ${y.toFixed(2)}%`).join(", ")})`;
}

const TAPE_EDGE =
  "polygon(0% 12%, 3% 0%, 97% 0%, 100% 14%, 97.5% 32%, 100% 50%, 97% 68%, 100% 86%, 97% 100%, 3% 100%, 0% 86%, 2.5% 68%, 0% 50%, 3% 32%)";

const PAPER_GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0.32 0 0 0 0 0.28 0 0 0 0 0.24 0 0 0 0.6 0"/></filter><rect width="100%" height="100%" filter="url(#g)"/></svg>',
)}")`;

const GRID_PAPER =
  "linear-gradient(rgba(24,32,30,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(24,32,30,0.08) 1px, transparent 1px)";

/* Step icons, after the reference sheet: light outline drawings on a 24px grid
   with one thin shared stroke. */
function StepIcon({ children, ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      {children}
    </svg>
  );
}

// Magnifying glass: lens with a small highlight, a collar and an outlined handle.
const SearchIcon = (props) => (
  <StepIcon {...props}>
    <circle cx="10" cy="9.5" r="6.5" />
    <path d="M5.7 7.9A4.6 4.6 0 0 1 8.4 5.2" />
    <rect x="-0.6" y="0" width="1.2" height="1.9" transform="translate(14.6 14.1) rotate(-45)" />
    <rect x="-1.3" y="0" width="2.6" height="6.8" rx="1.3" transform="translate(16.1 15.6) rotate(-45)" />
  </StepIcon>
);

// Jigsaw piece: knobs on the top and bottom, sockets on the left and right.
const PuzzleIcon = (props) => (
  <StepIcon {...props}>
    <path
      transform="translate(0 -0.75)"
      d="M5.8 6.5h4.5a2.2 2.2 0 1 1 3.4 0h4.5a.8.8 0 0 1 .8.8v3.5a2 2 0 1 0 0 3.4v4a.8.8 0 0 1-.8.8h-4.5a2.2 2.2 0 1 1-3.4 0H5.8a.8.8 0 0 1-.8-.8v-4a2 2 0 1 0 0-3.4V7.3a.8.8 0 0 1 .8-.8z"
    />
  </StepIcon>
);

// Spiral notepad, slightly askew, with three ticked rows.
const ChecklistIcon = (props) => (
  <StepIcon {...props}>
    <g transform="rotate(-2 12 13)">
      <rect x="5" y="5" width="14" height="16.5" rx="1.2" />
      <path d="M7.4 3.6v2.9M9.7 3.6v2.9M12 3.6v2.9M14.3 3.6v2.9M16.6 3.6v2.9" />
      <path d="m7.6 10.2 1.1 1.2 2-2.4M12.4 10.1h4.2M7.6 14l1.1 1.2 2-2.4M12.4 13.9h4.2M7.6 17.8l1.1 1.2 2-2.4M12.4 17.7h4.2" />
    </g>
  </StepIcon>
);

// Classic cursor arrow, tilted with the tip up and to the left.
const PointerIcon = (props) => (
  <StepIcon {...props}>
    <path transform="translate(0.7 0.1) rotate(-18 11.3 11.9)" d="M6 3v15.5l3.6-3.3 2.7 5.6 2.1-1-2.6-5.5h4.8z" />
  </StepIcon>
);

const STEPS = [
  {
    number: "01", title: "Get clarity", Icon: SearchIcon,
    description: "Understand the context, users, pain points and what’s really behind the problem.",
    paper: "#EFD3CB", rotate: -3.5, lift: 18, edge: tornEdge(11),
    tape: { color: "#B9A88E", rotate: -18, x: 18 },
  },
  {
    number: "02", title: "Connect the dots", Icon: PuzzleIcon,
    description: "Make sense of what I’ve learned and find the bigger picture.",
    paper: "#F6F2EA", grid: true, rotate: 1.2, lift: 0, edge: tornEdge(23),
    tape: { color: "#A7B8A6", rotate: 6, x: 10 },
  },
  {
    number: "03", title: "Plan & explore", Icon: ChecklistIcon,
    description: "Prioritise, brainstorm multiple directions and map the possibilities.",
    paper: "#CDD0B8", rotate: -2.2, lift: 8, edge: tornEdge(37),
    tape: { color: "#E6C9A2", rotate: -3, x: 4 },
  },
  {
    number: "04", title: "Design & refine", Icon: PointerIcon,
    description: "Turn ideas into simple solutions and make them better through feedback.",
    paper: "#CAD8E4", rotate: -1.6, lift: -6, edge: tornEdge(53),
    tape: { color: "#AEB9C7", rotate: 5, x: 6 },
  },
];

// Reveal timing (seconds after the section comes into view).
const T = { header: 0, notes: [0.3, 0.6, 0.9, 1.2], arrows: [1.5, 1.7, 1.9] };

const rise = {
  hidden: { opacity: 0, y: 28 },
  shown: (delay) => ({ opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay } }),
};
const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  shown: (delay) => ({
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 0.9, ease: "easeOut", delay }, opacity: { duration: 0.15, delay } },
  }),
};

function Note({ step }) {
  const { Icon } = step;
  return (
    <div className="relative h-full" style={{ rotate: `${step.rotate}deg` }}>
      <div className="relative h-full" style={{ filter: "drop-shadow(0 14px 16px rgba(24,32,30,0.13)) drop-shadow(0 2px 2px rgba(24,32,30,0.08))" }}>
        <div
          className="relative h-full px-7 pb-10 pt-11 lg:min-h-[380px] xl:px-8"
          style={{
            backgroundColor: step.paper,
            clipPath: step.edge,
            backgroundImage: step.grid ? GRID_PAPER : undefined,
            backgroundSize: step.grid ? "20px 20px" : undefined,
          }}
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply" style={{ backgroundImage: PAPER_GRAIN }} />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(120% 90% at 30% 20%, rgba(255,255,255,0.28), transparent 60%)" }} />

          <div className="relative">
            <p className="font-note text-[30px] leading-none text-ink-primary">{step.number}</p>
            <svg aria-hidden="true" viewBox="0 0 40 8" className="mt-1 h-2 w-9 text-ink-primary" fill="none">
              <path d="M1 5.5C12 2.5 26 6 39 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <Icon aria-hidden="true" className="mx-auto mt-4 h-[60px] w-[60px] text-ink-primary" />
            <h3 className="font-display mt-6 text-[22px] font-semibold leading-[28px] tracking-[-0.01em] text-ink-primary xl:text-[26px] xl:leading-[32px]">
              {step.title}
            </h3>
            <p className="type-body-s mt-3 text-ink-primary/70">{step.description}</p>
          </div>
        </div>

        {/* Washi tape across the top edge */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-0 h-9 w-[46%] opacity-85"
          style={{ translate: `calc(-50% + ${step.tape.x}px) -48%`, rotate: `${step.tape.rotate}deg`, backgroundColor: step.tape.color, clipPath: TAPE_EDGE }}
        >
          <div className="absolute inset-0 opacity-50 mix-blend-multiply" style={{ backgroundImage: PAPER_GRAIN }} />
        </div>
      </div>
    </div>
  );
}

/* Light curved arrow from one note to the next, across the gap near the top (lg). */
function FlowArc({ delay }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 96 48" fill="none" className="pointer-events-none absolute -right-[48px] -top-[40px] z-20 hidden h-12 w-24 overflow-visible text-ink-primary/35 lg:block">
      <motion.path d="M8 40C24 8 66 4 86 30" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" variants={draw} custom={delay} />
      <motion.path d="M86 30l-8.5-2.2M86 30l-1.2-8.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" variants={draw} custom={delay + 0.6} />
    </svg>
  );
}

export default function HowIWork() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const reduce = useReducedMotion();

  return (
    <section id="approach" className="wall-surface overflow-hidden px-4 py-20 text-ink-primary sm:px-6 lg:px-10 lg:py-30">
      <motion.div
        ref={ref}
        className="relative mx-auto max-w-[1200px]"
        initial={reduce ? false : "hidden"}
        animate={inView || reduce ? "shown" : "hidden"}
      >
        <SectionHeader
          as={motion.header}
          variants={rise}
          custom={T.header}
          title="How I work"
          subtitle="From questions to thoughtful solutions."
        >
          <div className="mt-8 h-px w-14 bg-ink-primary/40" />
        </SectionHeader>

        <ol className="grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-14 lg:grid-cols-4 lg:gap-8">
          {STEPS.map((step, i) => (
            <motion.li key={step.number} variants={rise} custom={T.notes[i]} className="relative mx-auto w-full max-w-[340px] sm:max-w-none" style={{ marginTop: step.lift }}>
              <Note step={step} />
              {i < STEPS.length - 1 && <FlowArc delay={T.arrows[i]} />}
            </motion.li>
          ))}
        </ol>
      </motion.div>
    </section>
  );
}
