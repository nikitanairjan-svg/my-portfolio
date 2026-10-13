import { Fragment, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Lightbox from "./Lightbox";

/* AX Flow's design decisions, each as the idea beside the screen that
   implements it: a diagram built in markup on the left (so it takes the
   page's type and colours and stays sharp), the real Time Off screen on the
   right. A decision with no screen gives its diagram the full width. Below lg
   the diagram stacks above the screen. Every screen opens full size. */

const EASE = [0.22, 1, 0.36, 1];

function useReveal() {
  const reduce = useReducedMotion();
  return (i = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 8 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-60px" },
          transition: { duration: 0.4, delay: i * 0.08, ease: EASE },
        };
}

// __phrase__ underlines the key words, as in the rest of the case studies
function Line({ text }) {
  return text.split(/(__[^_]+__)/g).map((part, i) =>
    part.startsWith("__") ? (
      <span key={i} className="underline decoration-ink-primary/30 decoration-1 underline-offset-[5px]">
        {part.slice(2, -2)}
      </span>
    ) : (
      part
    ),
  );
}

const Label = ({ children }) => (
  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-subtle">{children}</p>
);

/* ---- 1. information first: the order things appear in ---- */

function Ladder() {
  const reveal = useReveal();
  const steps = [
    ["Balance", "What you have, shown first"],
    ["Request", "What you want"],
    ["Confirmation", "What happens if you submit"],
    ["Status", "Where it is now"],
  ];
  return (
    <div>
      <Label>Priority on screen</Label>
      <ol className="relative mt-5 flex flex-col gap-3">
        <span aria-hidden="true" className="absolute bottom-5 left-[15px] top-5 w-px bg-forest/20" />
        {steps.map(([name, note], i) => (
          <motion.li key={name} {...reveal(i)} className="relative flex items-center gap-4">
            <span
              className={`relative z-[1] grid h-8 w-8 shrink-0 place-items-center rounded-full text-[12px] font-semibold tabular-nums ${
                i === 0 ? "bg-forest text-cream" : "border border-forest/25 bg-surface text-forest"
              }`}
            >
              {i + 1}
            </span>
            <span
              className={`flex min-w-0 flex-1 flex-wrap items-baseline justify-between gap-x-3 rounded-xl px-4 py-3 ${
                i === 0 ? "bg-surface ring-1 ring-forest/30" : "bg-surface/60"
              }`}
            >
              <span className={`font-serif text-[15px] font-semibold ${i === 0 ? "text-ink-primary" : "text-ink-primary/70"}`}>{name}</span>
              <span className="text-[12px] text-ink-secondary">{note}</span>
            </span>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

/* ---- 2. progressive disclosure: all at once against one step at a time ---- */

function MiniPhone({ rows, active, label }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex h-[104px] w-[56px] flex-col gap-[5px] rounded-[10px] border border-forest/35 bg-surface p-[7px] pt-3">
        {Array.from({ length: rows }, (_, i) => (
          <span key={i} className={`h-[7px] rounded-full ${i === active ? "bg-forest" : "bg-ink-primary/10"}`} />
        ))}
      </div>
      <span className="text-[11px] text-ink-secondary">{label}</span>
    </div>
  );
}

function Disclosure() {
  const reveal = useReveal();
  return (
    <div>
      <Label>From one long form to one decision per step</Label>
      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-5">
        <motion.div {...reveal(0)} className="flex flex-col items-center">
          <div className="flex h-[104px] w-[56px] flex-col gap-[5px] rounded-[10px] border border-dashed border-ink-primary/25 bg-surface/50 p-[7px] pt-3">
            {Array.from({ length: 9 }, (_, i) => (
              <span key={i} className="h-[5px] rounded-full bg-ink-primary/15" />
            ))}
          </div>
          <span className="mt-2 text-[11px] text-ink-subtle">All at once</span>
        </motion.div>

        <span aria-hidden="true" className="text-[18px] text-forest/60">→</span>

        <div className="flex items-center gap-2">
          {["Type", "Dates", "Review"].map((step, i) => (
            <Fragment key={step}>
              <motion.div {...reveal(i + 1)}>
                <MiniPhone rows={3} active={i} label={step} />
              </motion.div>
              {i < 2 && <span aria-hidden="true" className="mb-5 text-[13px] text-ink-primary/30">›</span>}
            </Fragment>
          ))}
        </div>
      </div>
      <p className="mt-5 text-[13px] leading-[20px] text-ink-secondary">
        Each step asks one thing. The answer is kept, so the next screen can be shorter still.
      </p>
    </div>
  );
}

/* ---- 3. touch: where a thumb reaches ---- */

function ThumbZones() {
  const reveal = useReveal();
  const notes = [
    ["1", "Swipe the drawer down to dismiss it"],
    ["2", "The whole date cell is the target, not just the number"],
    ["3", "The main action spans the screen, inside easy reach"],
  ];
  return (
    <div>
      <Label>Thumb reach on a phone</Label>
      <div className="mt-5 flex items-center gap-6">
        <motion.div {...reveal(0)} className="relative h-[172px] w-[86px] shrink-0 overflow-hidden rounded-[16px] border border-ink-primary/20 bg-surface">
          <span className="absolute inset-x-0 top-0 h-[34%] bg-[#E9D9CF]/70" />
          <span className="absolute inset-x-0 top-[34%] h-[28%] bg-[#E8E3C8]/70" />
          <span className="absolute inset-x-0 bottom-0 h-[38%] bg-forest/25" />
          <span className="absolute bottom-[10px] right-[10px] h-9 w-6 rounded-full border-2 border-forest/60" aria-hidden="true" />
        </motion.div>
        <ul className="flex flex-col gap-2 text-[12px]">
          {[
            ["bg-forest/25", "Easy"],
            ["bg-[#E8E3C8]", "Stretch"],
            ["bg-[#E9D9CF]", "Hard to reach"],
          ].map(([swatch, name]) => (
            <li key={name} className="flex items-center gap-2 text-ink-secondary">
              <span className={`h-3 w-3 rounded-[3px] ${swatch}`} />
              {name}
            </li>
          ))}
        </ul>
      </div>
      <ol className="mt-6 flex flex-col gap-2.5">
        {notes.map(([n, text]) => (
          <li key={n} className="flex gap-3 text-[13px] leading-[19px] text-ink-secondary">
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#C2602F] text-[10px] font-semibold text-white">{n}</span>
            {text}
          </li>
        ))}
      </ol>
    </div>
  );
}

/* The date picker with its targets marked. Positions are measured from the
   390 × 851 export: the drawer handle, the selected date's cell (one of a
   grid of 52 × 48 cells) and the Done button. */
const MARKS = [
  { n: "1", left: 38, top: 36.7, w: 24, h: 3.3 },
  { n: "2", left: 17.7, top: 70.3, w: 13.3, h: 5.6 },
  { n: "3", left: 5.6, top: 90.2, w: 88.8, h: 5.2 },
];

/* ---- 4. reuse: one component, several flows ---- */

function Mapping() {
  const reveal = useReveal();
  const rows = [
    ["Balance card", "Queue card", "Approvals"],
    ["Request form", "Review form", "Approvals"],
    ["Status tracker", "Every flow", "Approvals · Benefits · Payroll"],
  ];
  return (
    <div>
      <div className="grid grid-cols-[minmax(0,1fr)_28px_minmax(0,1fr)] gap-x-2">
        <Label>Time Off</Label>
        <span />
        <Label>Reused in</Label>
      </div>
      <ul className="mt-3 flex flex-col gap-3">
        {rows.map(([from, to, where], i) => (
          <motion.li key={from} {...reveal(i)} className="grid grid-cols-[minmax(0,1fr)_28px_minmax(0,1fr)] items-stretch gap-x-2">
            <span className="flex items-center rounded-xl bg-forest px-4 py-3.5 font-serif text-[15px] font-semibold text-cream">{from}</span>
            <span aria-hidden="true" className="grid place-items-center text-forest/55">→</span>
            <span className="flex flex-col justify-center rounded-xl bg-surface px-4 py-2.5 ring-1 ring-forest/25">
              <span className="font-serif text-[15px] font-semibold text-ink-primary">{to}</span>
              <span className="text-[12px] text-ink-secondary">{where}</span>
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

const DIAGRAMS = { ladder: Ladder, disclosure: Disclosure, thumb: ThumbZones, mapping: Mapping };

/* ---- the screens ---- */

function ShotButton({ screen, onOpen, children, className = "" }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`View full size: ${screen.alt}`}
      className={`group relative block w-full overflow-hidden rounded-[16px] shadow-[0_12px_30px_-14px_rgba(24,32,30,0.4)] ring-1 ring-black/5 outline-offset-4 focus-visible:outline-2 focus-visible:outline-forest ${className}`}
    >
      {children}
    </button>
  );
}

function Screens({ item, onOpen }) {
  if (item.diagram === "thumb") {
    const screen = item.screens[0];
    return (
      <div className="relative w-[min(78%,230px)]">
        <ShotButton screen={screen} onOpen={() => onOpen(0)} className="rounded-[18px]">
          <img src={screen.src} alt={screen.alt} width={390} height={851} loading="lazy" decoding="async" draggable={false} className="block w-full" />
        </ShotButton>
        {/* the thumb's easy reach, washed over the lower part of the screen */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] rounded-b-[18px] bg-gradient-to-t from-forest/20 to-transparent" />
        {MARKS.map((m) => (
          <span
            key={m.n}
            aria-hidden="true"
            style={{ left: `${m.left}%`, top: `${m.top}%`, width: `${m.w}%`, height: `${m.h}%` }}
            className="pointer-events-none absolute rounded-md border-[1.5px] border-dashed border-[#C2602F]"
          >
            <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-[#C2602F] text-[9px] font-semibold text-white">
              {m.n}
            </span>
          </span>
        ))}
      </div>
    );
  }
  const n = item.screens.length;
  return (
    <div className="flex items-start justify-center gap-3 sm:gap-4">
      {item.screens.map((s, i) => (
        <figure key={s.src} className="min-w-0" style={{ width: n > 2 ? "min(31%,150px)" : n === 2 ? "min(46%,190px)" : "min(70%,230px)" }}>
          {/* a window onto the part of the screen that matters: two of these
              live in a bottom drawer, so `pos` slides the view down to it */}
          <ShotButton screen={s} onOpen={() => onOpen(i)}>
            <img
              src={s.src}
              alt={s.alt}
              width={390}
              height={851}
              loading="lazy"
              decoding="async"
              draggable={false}
              style={{ objectPosition: `50% ${s.pos ?? 0}%` }}
              className="block aspect-[390/600] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
            />
          </ShotButton>
          {s.caption && <figcaption className="mt-2 text-center text-[12px] leading-[16px] text-ink-secondary">{s.caption}</figcaption>}
        </figure>
      ))}
    </div>
  );
}

function Card({ item }) {
  const [open, setOpen] = useState(null);
  const Diagram = DIAGRAMS[item.diagram];
  const screens = item.screens ?? [];
  return (
    // no card around a decision: the two panels carry it, and a hairline
    // between decisions does the separating
    <li className="border-t border-border pt-10 first:border-t-0 first:pt-0 lg:pt-12">
      <div>
        <h3 className="font-serif text-[18px] font-semibold leading-[26px] text-ink-primary">{item.title}</h3>
        <p className="mt-1.5 text-[15px] leading-[1.55] text-ink-secondary">
          <Line text={item.text} />
        </p>
      </div>
      <div className={`mt-5 grid gap-4 ${screens.length ? "lg:grid-cols-2" : ""}`}>
        <div className={`rounded-2xl bg-surface/80 ${screens.length ? "p-6" : "px-6 py-8 sm:px-10 sm:py-10"}`}>{Diagram && <Diagram />}</div>
        {screens.length > 0 && (
          <div className="flex items-center justify-center rounded-2xl bg-[#DCE6D8] px-4 py-7">
            <Screens item={item} onOpen={setOpen} />
          </div>
        )}
      </div>
      {item.caption && <p className="mt-3 text-[12px] leading-[18px] text-ink-subtle">{item.caption}</p>}
      {screens.length > 0 && (
        <Lightbox images={screens.map((s) => ({ ...s, w: 390, h: 851 }))} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
      )}
    </li>
  );
}

export default function AxDecisions({ items }) {
  return (
    <ul className="flex flex-col gap-10 lg:gap-12">
      {items.map((item) => (
        <Card key={item.title} item={item} />
      ))}
    </ul>
  );
}
