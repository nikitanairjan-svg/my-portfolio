import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import SectionNav from "./SectionNav";
import BrowseProjects from "./BrowseProjects";
import { WORLD_PATH } from "./worldPath";

/* A case study as one continuous read: the cover, then the summary, then the
   full process, then the other projects. A floating index tracks the section
   you're in across both parts. */

// the site's standard ease, used by the flow reveal below
const EASE = [0.22, 1, 0.36, 1];

/* ---- blocks ---- */

function Bullet({ marker }) {
  if (marker === "check") return <span aria-hidden="true" className="mt-[7px] text-forest">✓</span>;
  // Verbatim user quotes read as speech, not as bullet points: a rule stands in
  // for the dot and the line sits against it.
  if (marker === "quote") return <span aria-hidden="true" className="mt-1.5 w-0.5 shrink-0 self-stretch rounded-full bg-forest/35" />;
  return <span aria-hidden="true" className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-forest/55" />;
}

function Figure({ src, alt, caption, w, h, className = "" }) {
  return (
    <figure className={className}>
      <img
        src={src}
        alt={alt}
        width={w}
        height={h}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="w-full rounded-2xl border border-border bg-surface object-cover shadow-[0_1px_2px_rgba(24,32,30,0.04),0_18px_40px_-28px_rgba(24,32,30,0.25)]"
      />
      {caption && <figcaption className="type-body-s mt-3 text-ink-secondary">{caption}</figcaption>}
    </figure>
  );
}

/* Copy carries two emphasis markers: **bold** for the phrases that matter, and
   __underline__ for the longer clauses. Bold nests inside underline. */
function bolds(text, keyBase) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={`${keyBase}-b${i}`} className="font-semibold text-ink-primary">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  );
}

function Rich({ text, className = "" }) {
  return (
    <span className={className}>
      {text.split(/(__[^_]+__)/g).map((part, i) =>
        part.startsWith("__") && part.endsWith("__") ? (
          <span key={`u${i}`} className="underline decoration-ink-primary/30 decoration-1 underline-offset-[5px]">
            {bolds(part.slice(2, -2), `u${i}`)}
          </span>
        ) : (
          bolds(part, `p${i}`)
        ),
      )}
    </span>
  );
}

/* The freight modes, placed on the world and joined in order. Positions are
   given in the map's own coordinates (equirectangular, 1000x500) so the chips,
   the route and the land can never drift apart; the chip percentages are
   derived from them against the cropped viewBox below. */
// Cropped above Antarctica: it reads as a heavy band across the foot of the
// frame and pulls the eye off the route.
const MAP_BOX = { x: 40, y: 28, w: 930, h: 342 };
const MODES = [
  { id: "sea", label: "Sea", tint: "#DAE8D9", at: [318, 142] },
  { id: "air", label: "Air", tint: "#E4E9EE", at: [542, 89] },
  { id: "road", label: "Road", tint: "#ECE3D7", at: [569, 245] },
  { id: "rail", label: "Rail", tint: "#E8E3EB", at: [828, 150] },
];
const pct = ([x, y]) => ({ left: `${((x - MAP_BOX.x) / MAP_BOX.w) * 100}%`, top: `${((y - MAP_BOX.y) / MAP_BOX.h) * 100}%` });

function ModeIcon({ id }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };
  if (id === "sea")
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" {...common}>
        <path d="M3.5 16.5h17l-1.6 3.4a1 1 0 0 1-.9.6H6a1 1 0 0 1-.9-.6z" />
        <path d="M5.5 16.5V11h13v5.5M12 11V6.5M9.4 8.6h5.2" />
      </svg>
    );
  if (id === "air")
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" {...common}>
        <path d="M21 14.5 3 9.2l2-2 6.4 1.6 4.2-4.2a2 2 0 0 1 2.8 2.8l-4.2 4.2 1.6 6.4-2 2z" />
      </svg>
    );
  if (id === "rail")
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" {...common}>
        <rect x="6" y="3.5" width="12" height="12.5" rx="2.5" />
        <path d="M6.5 10.5h11M9.5 19.5l-2 2M14.5 19.5l2 2M9.5 16v3.5h5V16" />
        <circle cx="9.3" cy="13.2" r=".7" fill="currentColor" stroke="none" />
        <circle cx="14.7" cy="13.2" r=".7" fill="currentColor" stroke="none" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" {...common}>
      <path d="M2.8 7h10v9h-10zM12.8 10.5h4l3 3V16h-7z" />
      <circle cx="6.4" cy="17.6" r="1.7" />
      <circle cx="16.4" cy="17.6" r="1.7" />
    </svg>
  );
}

function ModesAside() {
  const box = `${MAP_BOX.x} ${MAP_BOX.y} ${MAP_BOX.w} ${MAP_BOX.h}`;
  const [sea, air, road, rail] = MODES.map((m) => m.at);
  // one smooth run through the four stops, in map coordinates
  const route = `M${sea[0]},${sea[1]} C${sea[0] + 90},${sea[1] - 55} ${air[0] - 80},${air[1] - 30} ${air[0]},${air[1]} C${air[0] + 70},${air[1] + 35} ${road[0] - 40},${road[1] - 70} ${road[0]},${road[1]} C${road[0] + 70},${road[1] + 50} ${rail[0] - 110},${rail[1] + 60} ${rail[0]},${rail[1]}`;

  return (
    <div
      aria-hidden="true"
      className="relative mx-auto w-full max-w-[640px] lg:mt-1"
      style={{ aspectRatio: `${MAP_BOX.w} / ${MAP_BOX.h}` }}
    >
      <svg viewBox={box} className="absolute inset-0 h-full w-full overflow-visible">
        {/* the world, as a quiet ground */}
        <path d={WORLD_PATH} fill="#CFDCCB" fillRule="evenodd" />
        {/* the route between the modes */}
        <path d={route} fill="none" stroke="#18201E" strokeOpacity="0.62" strokeWidth="2.6" strokeDasharray="7 9" strokeLinecap="round" />
        {MODES.map((mode) => (
          <circle key={mode.id} cx={mode.at[0]} cy={mode.at[1]} r="5.5" fill="#18201E" />
        ))}
      </svg>

      {MODES.map((mode) => (
        <span
          key={mode.id}
          style={{ ...pct(mode.at), backgroundColor: mode.tint }}
          className="absolute flex w-[74px] -translate-x-1/2 -translate-y-[calc(100%+14px)] flex-col items-center gap-1 rounded-2xl px-2 py-2.5 text-ink-primary shadow-[0_1px_2px_rgba(24,32,30,0.05),0_12px_28px_-18px_rgba(24,32,30,0.4)]"
        >
          <ModeIcon id={mode.id} />
          <span className="type-label text-ink-secondary">{mode.label}</span>
        </span>
      ))}
    </div>
  );
}

function FactIcon({ id }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };
  if (id === "platform")
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...common}>
        <rect x="3" y="4.5" width="18" height="12" rx="2" />
        <path d="M9 20.5h6M12 16.5v4" />
      </svg>
    );
  // team reads as a connected group, so it can't be mistaken for the users mark
  if (id === "team")
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...common}>
        <circle cx="12" cy="5.4" r="2.4" />
        <circle cx="5.4" cy="17" r="2.4" />
        <circle cx="18.6" cy="17" r="2.4" />
        <path d="M10.3 7.3 6.9 14.6M13.7 7.3l3.4 7.3M7.9 17.6h8.2" />
      </svg>
    );
  // users: one person, with a second at their shoulder
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" {...common}>
      <circle cx="9.5" cy="8.4" r="3.1" />
      <path d="M3.6 19.6c0-3.1 2.6-5.2 5.9-5.2s5.9 2.1 5.9 5.2" />
      <path d="M16.6 6.4a3 3 0 0 1 0 5.6M18.2 14.8c1.4.6 2.2 1.9 2.2 3.4" />
    </svg>
  );
}

const FACT_TINT = { users: "bg-[#E4EDE5]", team: "bg-[#E2EAF4]", platform: "bg-[#EAE6F2]" };

/* ---- Context & Problem ---- */

/* Marks used through Context & Problem. */
function CtxIcon({ id, className = "h-6 w-6" }) {
  const marks = {
    bulb: <><path d="M9.2 17.5h5.6M10 20.5h4" /><path d="M12 3.5a5.6 5.6 0 0 0-3.3 10.1c.5.4.8 1 .8 1.6v.3h5v-.3c0-.6.3-1.2.8-1.6A5.6 5.6 0 0 0 12 3.5z" /></>,
    target: <><circle cx="12" cy="12" r="7.5" /><circle cx="12" cy="12" r="3.4" /><path d="M12 4.5V2M12 22v-2.5M4.5 12H2M22 12h-2.5" /></>,
    laptop: <><rect x="3.8" y="5" width="16.4" height="11" rx="1.6" /><path d="M2 19h20" /></>,
    sheet: <><rect x="4.2" y="3.5" width="15.6" height="17" rx="1.8" /><path d="M4.2 9h15.6M4.2 15h15.6M12 3.5v17" /></>,
    mail: <><rect x="3" y="5.5" width="18" height="13" rx="2" /><path d="m3.8 7 7.1 5.4a2 2 0 0 0 2.2 0L20.2 7" /></>,
    doc: <><path d="M7 2.8h7.2l4.8 4.8v12.6a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3.8a1 1 0 0 1 1-1z" /><path d="M14 2.8v4.9h5M9.2 12.5h5.6M9.2 15.8h5.6M9.2 19.1h3.6" /></>,
    person: <><circle cx="12" cy="8.2" r="3.4" /><path d="M5.5 20.2c0-3.4 2.9-5.8 6.5-5.8s6.5 2.4 6.5 5.8" /></>,
    clock: <><circle cx="12" cy="12" r="8.2" /><path d="M12 7.2V12l3.2 2" /></>,
    layers: <><ellipse cx="12" cy="6.2" rx="7.4" ry="2.8" /><path d="M4.6 6.2v5.6c0 1.5 3.3 2.8 7.4 2.8s7.4-1.3 7.4-2.8V6.2" /><path d="M4.6 11.8v5.6c0 1.5 3.3 2.8 7.4 2.8s7.4-1.3 7.4-2.8v-5.6" /></>,
  };
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {marks[id]}
    </svg>
  );
}


/* Blocks in a section are not evenly spaced. A subsection heading owns the
   figure that follows it, so those sit close together, and the space opens up
   again where one group ends and the next begins. With one uniform gap the
   section reads as a flat stack of slabs with nothing grouping them. */

const FIGURE_BLOCKS = new Set([
  "plate", "toolflow", "painpoints", "image", "gallery", "cards", "metrics",
  "facts", "factCards", "list", "steps", "decisions", "problems", "status",
]);
const OPENS_GROUP = new Set(["subsection", "heading"]);

function blockGap(prev, cur) {
  if (!prev) return "";
  if (OPENS_GROUP.has(cur)) return "mt-14 lg:mt-[4.5rem]";
  if (FIGURE_BLOCKS.has(cur) && (OPENS_GROUP.has(prev) || prev === "lead" || prev === "text")) return "mt-5 lg:mt-6";
  if (cur === "highlight" || cur === "callout" || cur === "note") return "mt-9 lg:mt-10";
  return "mt-7 lg:mt-8";
}

function Block({ block, reduce }) {
  switch (block.type) {
    case "subsection":
      return (
        <div className="min-w-0">
          <h3 className="font-serif text-ink-primary [font-size:clamp(23px,2.1vw,31px)] [line-height:1.15]">{block.title}</h3>
          <p className="type-body-l mt-3 text-ink-primary/75">
            <Rich text={block.text} />
          </p>
        </div>
      );

    case "highlight":
      return (
        <div className="flex gap-5 rounded-2xl bg-[#E9F0E6] px-6 py-6 lg:gap-6 lg:px-8">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-surface/70 text-forest">
            <CtxIcon id={block.icon} />
          </span>
          <div className="min-w-0 flex-1 border-l border-forest/25 pl-5">
            <h4 className="font-serif text-ink-primary [font-size:clamp(18px,1.6vw,23px)]">{block.title}</h4>
            <p className="type-body-s mt-2 text-ink-primary/75">{block.text}</p>
          </div>
        </div>
      );

    case "toolflow":
      return (
        <div>
          <div className="flex flex-col lg:flex-row lg:items-stretch">
            {block.items.map((item, i) => (
              <Fragment key={item.title}>
                <div className="flex min-w-0 flex-1 flex-col rounded-2xl bg-[#FBF8F2] p-5 ring-1 ring-border">
                  <CtxIcon id={item.icon} className="h-7 w-7 text-ink-primary" />
                  <p className="type-body-s mt-4 font-semibold text-ink-primary">{item.title}</p>
                  <p className="type-body-s mt-1.5 text-ink-secondary">{item.text}</p>
                </div>
                {i < block.items.length - 1 && (
                  <div className="flex shrink-0 items-center justify-center py-2 lg:w-9 lg:py-0">
                    <svg viewBox="0 0 24 12" className="h-3 w-5 rotate-90 text-ink-primary/35 lg:rotate-0" aria-hidden="true">
                      <path d="M0 6h19M15 2l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </Fragment>
            ))}
          </div>
          {block.footnote && (
            <div className="relative mt-5 hidden h-12 lg:block">
              <svg viewBox="0 0 1000 40" preserveAspectRatio="none" className="h-full w-full text-ink-primary/30" aria-hidden="true">
                <path d="M88 4 L88 24 L432 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="5 6" vectorEffect="non-scaling-stroke" />
                <path d="M568 24 L912 24 L912 4" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="5 6" vectorEffect="non-scaling-stroke" />
              </svg>
              {["8.8%", "91.2%"].map((left) => (
                <span key={left} aria-hidden="true" style={{ left }} className="absolute top-0 -translate-x-1/2 -translate-y-1 text-ink-primary/40">
                  <svg viewBox="0 0 12 10" className="h-2.5 w-3">
                    <path d="M6 0 11 9H1z" fill="currentColor" />
                  </svg>
                </span>
              ))}
              <span className="type-label absolute left-1/2 top-[24px] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-ink-subtle">
                {block.footnote}
              </span>
            </div>
          )}
        </div>
      );

    case "painpoints":
      return (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {block.items.map((item) => (
            <li key={item.title} className="rounded-2xl bg-[#FBF8F2] p-6 ring-1 ring-border">
              <CtxIcon id={item.icon} className="h-7 w-7 text-ink-primary" />
              <p className="mt-5 font-serif text-ink-primary [font-size:clamp(17px,1.4vw,20px)]">{item.title}</p>
              <p className="type-body-s mt-2 text-ink-secondary">{item.text}</p>
            </li>
          ))}
        </ul>
      );

    case "plate":
      // supplied artwork with its ground keyed out: no frame, no shadow — it
      // sits straight on the section and fades up as it arrives.
      return (
        <motion.img
          src={block.src}
          alt={block.alt}
          width={block.w}
          height={block.h}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="mx-auto block w-full max-w-[1120px]"
          /* Artwork that carries empty canvas below its content leaves a
             phantom gap under the figure. Pull that back by the measured
             inset — as a percentage, so it tracks the rendered scale
             (percentage margins resolve against the container's width, and
             the image is w-full, so the two match). */
          style={block.trimBottom ? { marginBottom: `-${((block.trimBottom / block.w) * 100).toFixed(2)}%` } : undefined}
          {...(reduce
            ? {}
            : {
                initial: { opacity: 0, y: 18 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, margin: "-80px" },
                transition: { duration: 0.6, ease: EASE },
              })}
        />
      );

    case "note":
      return <p className="type-body-s border-l border-border pl-5 text-ink-secondary">{block.text}</p>;

    case "problems":
      return (
        <ol className="border-t border-border">
          {block.items.map((item, i) => (
            <li key={item.title} className="grid gap-2 border-b border-border py-7 lg:grid-cols-[72px_minmax(0,1fr)] lg:gap-8">
              <span className="type-label pt-1 tabular-nums text-ink-subtle">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h4 className="type-h4 text-ink-primary">{item.title}</h4>
                <p className="type-body-s mt-2 text-ink-secondary">{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      );

    case "opportunity":
      return (
        <div className="rounded-2xl bg-forest px-8 py-8 text-cream shadow-[0_20px_44px_-26px_rgba(24,32,30,0.55)]">
          <p className="type-label uppercase tracking-[0.2em] text-cream/60">{block.label}</p>
          <p className="type-body-l mt-3 max-w-[760px] text-cream">{block.text}</p>
        </div>
      );

    case "intro":
      return (
        // The copy leads here, so it takes the larger share and runs to about
        // half the page before wrapping; items-start keeps the map from hanging
        // below a short column and colliding with what follows.
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,46%)] lg:gap-10">
          <div className="max-w-[640px]">
            {/* pulled up under the heading — it was sitting a long way below it */}
            <span aria-hidden="true" className="-mt-4 mb-6 block h-px w-12 bg-ink-primary/20" />
            {/* One size for both lines — the marked phrases and the ink carry
                the hierarchy, not a change of scale. */}
            <p className="font-sans font-normal text-ink-primary/90 [font-size:clamp(17px,1.3vw,19px)] [line-height:1.6]">
              <Rich text={block.lead} />
            </p>
            <p className="mt-5 font-sans font-normal text-ink-primary/70 [font-size:clamp(17px,1.3vw,19px)] [line-height:1.6]">
              <Rich text={block.text} />
            </p>
          </div>
          {block.aside === "modes" && <ModesAside />}
        </div>
      );

    case "factCards":
      // a surface of its own, so the row reads as a panel rather than
      // dissolving into the page
      return (
        <ul className="-mt-4 grid gap-px overflow-hidden rounded-2xl border border-border/70 bg-border/50 shadow-[0_1px_2px_rgba(24,32,30,0.02),0_14px_30px_-26px_rgba(24,32,30,0.2)] sm:grid-cols-3">
          {block.items.map((item) => (
            // a warm wash sitting between the page and white — enough to read as
            // a panel without turning into a bright card
            <li key={item.label} className="flex gap-4 bg-[#FBF7F0] p-6">
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${FACT_TINT[item.icon] ?? "bg-sage-pale"} text-ink-primary`}>
                <FactIcon id={item.icon} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="type-label block uppercase tracking-[0.2em] text-ink-subtle">{item.label}</span>
                <span className="type-body-s mt-1.5 block font-semibold text-ink-primary">{item.value}</span>
                <span className="type-body-s mt-1.5 block text-ink-secondary">{item.text}</span>
              </span>
            </li>
          ))}
        </ul>
      );

    case "lead":
      return <p className="type-body-l text-ink-primary/70">{block.text}</p>;

    case "text":
      return <p className="type-body-l text-ink-primary/75">{block.text}</p>;

    case "heading":
      return <h3 className="type-h4 pt-2 text-ink-primary">{block.text}</h3>;

    case "list":
      return (
        <ul className="flex flex-col gap-3">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3.5">
              <Bullet marker={block.marker} />
              <span className="type-body-l min-w-0 flex-1 text-ink-primary/75">{item}</span>
            </li>
          ))}
        </ul>
      );

    case "steps":
      return (
        <ol className="grid gap-x-12 gap-y-3.5 lg:grid-cols-2">
          {block.items.map((item, i) => (
            <li key={item} className="flex gap-4">
              <span className="type-label mt-1 w-6 shrink-0 tabular-nums text-ink-subtle">{String(i + 1).padStart(2, "0")}</span>
              <span className="type-body-l min-w-0 flex-1 text-ink-primary/75">{item}</span>
            </li>
          ))}
        </ol>
      );

    case "facts":
      return (
        <dl className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
          {block.items.map(([term, detail]) => (
            <div key={term}>
              <dt className="type-label uppercase tracking-[0.2em] text-ink-subtle">{term}</dt>
              <dd className="type-body-s mt-2 text-ink-secondary">{detail}</dd>
            </div>
          ))}
        </dl>
      );

    case "cards":
      return (
        <ul className="grid gap-4 sm:grid-cols-2">
          {block.items.map((item, i) => (
            <li key={item.title} className="rounded-2xl border border-border bg-surface p-6">
              <p className="type-label text-ink-subtle">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="type-h4 mt-3 text-ink-primary">{item.title}</h3>
              <p className="type-body-s mt-3 text-ink-secondary">{item.text}</p>
            </li>
          ))}
        </ul>
      );

    case "decisions":
      return (
        <ol className="flex flex-col gap-16 lg:gap-24">
          {block.items.map((item, i) => (
            <li key={item.title} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
              <div className={i % 2 ? "lg:order-2" : undefined}>
                <span aria-hidden="true" className="font-sans font-semibold leading-none tracking-tight text-ink-primary/15 [font-size:clamp(30px,2.8vw,42px)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="type-h4 mt-3 text-ink-primary">{item.title}</h3>
                <p className="type-body-l mt-4 text-ink-primary/75">{item.text}</p>
              </div>
              <Figure src={item.src} alt={item.alt} w={item.w} h={item.h} className={i % 2 ? "lg:order-1" : undefined} />
            </li>
          ))}
        </ol>
      );

    case "metrics":
      return (
        <ul className="grid gap-px overflow-hidden rounded-2xl bg-cream/15 shadow-[0_20px_44px_-26px_rgba(24,32,30,0.5)] sm:grid-cols-2">
          {block.items.map((item) => (
            <li key={item.label} className="bg-forest p-7 text-cream">
              <p className="font-sans font-semibold tracking-[-0.03em] [font-size:clamp(32px,2.8vw,42px)] [line-height:1]">{item.value}</p>
              <p className="type-body-s mt-3 text-cream/70">{item.label}</p>
            </li>
          ))}
        </ul>
      );

    case "callout":
      return (
        <p className="type-body-l rounded-2xl border-l-2 border-forest bg-sage-pale/60 px-6 py-5 text-ink-primary">{block.text}</p>
      );

    case "status":
      return (
        <p className="type-body-s inline-flex w-fit items-center gap-2.5 rounded-full border border-border bg-surface px-4 py-2 text-ink-secondary">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-forest" />
          {block.text}
        </p>
      );

    case "image":
      return <Figure src={block.src} alt={block.alt} caption={block.caption} w={block.w} h={block.h} />;

    case "gallery":
      return (
        <div className="grid gap-5 sm:grid-cols-2">
          {block.images.map((image, i) => (
            <Figure
              key={image.src + image.alt}
              {...image}
              className={i === 0 && block.images.length > 2 ? "sm:col-span-2" : undefined}
            />
          ))}
        </div>
      );

    default:
      return null;
  }
}

/* ---- share ---- */

function ShareLinks({ title }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window === "undefined" ? "" : window.location.href;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const chip = "type-label inline-flex items-center rounded-full border border-border bg-surface px-4 py-2 text-ink-secondary transition-colors hover:bg-sage-pale hover:text-ink-primary";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="type-label uppercase tracking-[0.2em] text-ink-subtle">Share</span>
      <a className={chip} href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer">
        LinkedIn
      </a>
      <a
        className={chip}
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        X
      </a>
      <button type="button" onClick={copy} className={chip}>
        {copied ? "Link copied" : "Copy link"}
      </button>
    </div>
  );
}

/* ---- hero ---- */

/* One hero for every study: the cover runs the full width of the viewport with
   the title, the one-liner and the metadata set over it.

   Two of the four covers are bright (a white desk, pale florals), so white type
   needs a scrim to stay legible. It is a gradient weighted to the bottom-left
   where the copy sits, rather than a flat wash over the whole photo, so the
   picture still reads as a picture. Below lg the copy drops under the image —
   there is not enough height to set it over the photo on a phone. */

function HeroCover({ study, story, fadeUp, reduce }) {
  return (
    <div className="relative -mx-4 sm:-mx-6 lg:mx-[calc(50%-50vw)] lg:w-screen">
      <div className="relative">
        <motion.img
          {...fadeUp}
          transition={reduce ? undefined : { ...fadeUp.transition, delay: 0.05 }}
          src={story.cover.src}
          alt={story.cover.alt}
          width={story.cover.w}
          height={story.cover.h}
          className="block h-[clamp(260px,42vw,560px)] w-full object-cover"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden lg:block"
          /* Measured, not guessed: two of the four covers are bright (a white
             desk, pale florals), and at a lighter scrim the small metadata
             text fell to 3.4:1 over them — under the 4.5:1 AA needs. These
             stops hold every cover above it across the band the copy sits in,
             while still letting the right-hand side of the photo through. */
          style={{
            background:
              "linear-gradient(100deg, rgba(8,11,10,0.92) 0%, rgba(8,11,10,0.86) 38%, rgba(8,11,10,0.42) 66%, rgba(8,11,10,0.10) 100%)",
          }}
        />
      </div>

      {/* Over the photo from lg up; underneath it below that. */}
      <motion.div
        {...fadeUp}
        className="px-4 pb-2 pt-8 sm:px-6 lg:absolute lg:inset-y-0 lg:left-0 lg:z-10 lg:flex lg:w-[62%] lg:flex-col lg:justify-center lg:px-[max(1.5rem,calc(50vw-600px))] lg:pb-0 lg:pt-0"
      >
        <h1 className="font-sans font-semibold tracking-[-0.03em] text-ink-primary [font-size:clamp(40px,6vw,76px)] [line-height:1.03] lg:text-white">
          {study.title}
        </h1>
        <p className="type-body-l mt-5 max-w-[560px] text-ink-secondary lg:text-white/80">{story.tagline ?? study.description}</p>

        <dl className="mt-8 flex flex-nowrap items-start lg:max-w-[560px]">
          {story.meta.map(([term, value], index) => (
            <div
              key={term}
              className={`min-w-0 flex-1 ${index > 0 ? "border-l border-border pl-5 lg:border-white/25" : ""} ${
                index < story.meta.length - 1 ? "pr-5" : ""
              }`}
            >
              <dt className="type-label uppercase tracking-[0.2em] text-ink-subtle lg:text-white/60">{term}</dt>
              <dd className="type-body-s mt-2 font-medium text-ink-primary lg:text-white">{value}</dd>
            </div>
          ))}
        </dl>
      </motion.div>
    </div>
  );
}

/* The seam between the summary and the full process: a ruled line with the
   next part named on it, so the page stays one scroll while still announcing
   that the detail starts here. */
function PartDivider({ label }) {
  return (
    <div className="flex items-center gap-5 py-4">
      <span aria-hidden="true" className="h-px flex-1 bg-border" />
      <span className="type-label uppercase tracking-[0.24em] text-ink-subtle">{label}</span>
      <span aria-hidden="true" className="h-px flex-1 bg-border" />
    </div>
  );
}

/* ---- page ---- */

export default function CaseStudyStory({ study, story, onBack }) {
  const reduce = useReducedMotion();

  /* The two readings are one continuous page. Section ids repeat between them
     ("overview" and "outcome" exist in both), so each gets a uid prefixed with
     its part — otherwise the anchors collide and a jump lands on whichever
     came first. `offset` keeps the alternating band counting across the seam. */
  const groups = useMemo(
    () =>
      story.views.map((view, i) => ({
        id: view.id,
        label: view.groupLabel ?? (i === 0 ? "At a Glance" : "Process"),
        // how many sections precede this part, so the alternating band keeps
        // counting across the seam instead of restarting
        offset: story.views.slice(0, i).reduce((n, v) => n + v.sections.length, 0),
        sections: view.sections.map((section) => ({ ...section, uid: `${view.id}-${section.id}` })),
      })),
    [story.views],
  );

  const firstUid = groups[0].sections[0].uid;
  const [activeUid, setActiveUid] = useState(firstUid);
  const sectionsRef = useRef(null);

  const fadeUp = reduce
    ? {}
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } };

  // Follow the section the reader is in.
  useEffect(() => {
    const uids = groups.flatMap((g) => g.sections.map((s) => s.uid));
    const nodes = uids.map((uid) => document.getElementById(`section-${uid}`)).filter(Boolean);
    if (!nodes.length) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveUid(visible[0].target.id.replace("section-", ""));
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: 0 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [groups]);

  const jumpTo = (uid) => {
    document.getElementById(`section-${uid}`)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-wall text-ink-primary">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-wall/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
          <a
            href="#work"
            onClick={onBack}
            className="type-body-s inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 font-medium text-ink-primary transition-colors hover:bg-sage-pale"
          >
            <span aria-hidden="true">←</span> Back to case studies
          </a>
          <span className="font-display text-2xl font-semibold tracking-tight">Nikita.</span>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10">
        {/* Universal header: the cover, with the title and metadata over it. */}
        <HeroCover study={study} story={story} fadeUp={fadeUp} reduce={reduce} />

        {/* Index + sections. The navigator floats over the margin, so the story
            keeps this whole column; it sticks inside this wrapper and stops
            where the story ends. */}
        <div ref={sectionsRef} className="relative scroll-mt-24 pt-10">
          <SectionNav groups={groups} activeUid={activeUid} onJump={jumpTo} reduce={reduce} />

          <div className="min-w-0">
            {groups.map((group, g) => (
              <Fragment key={group.id}>
                {g > 0 && <PartDivider label={group.label} />}

                {group.sections.map((section, i) => (
                  <motion.section
                    key={section.uid}
                    id={`section-${section.uid}`}
                    {...(reduce ? {} : { initial: { opacity: 0, y: 12 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-60px" }, transition: { duration: 0.4, ease: EASE } })}
                    className="relative scroll-mt-28 py-16 lg:py-24"
                  >
                    {/* every other section sits on a lighter full-bleed band, so
                        the story has a rhythm instead of running as one flat
                        sheet. The count carries across both parts, so the
                        banding never doubles up at the seam. */}
                    {(group.offset + i) % 2 === 1 && (
                      <span aria-hidden="true" className="absolute inset-y-0 left-1/2 z-0 w-screen -translate-x-1/2 bg-[#F7F3E9]" />
                    )}
                    <header className="relative z-[1]">
                      <p className="type-label uppercase tracking-[0.24em] text-ink-subtle">{String(i + 1).padStart(2, "0")}</p>
                      <h2 className="mt-2.5 font-serif text-ink-primary [font-size:clamp(32px,3.4vw,50px)] [line-height:1.05]">{section.title}</h2>
                    </header>
                    <div className="relative z-[1] mt-9 flex flex-col lg:mt-10">
                      {section.blocks.map((block, index) => (
                        <div key={`${section.uid}-${index}`} className={blockGap(section.blocks[index - 1]?.type, block.type)}>
                          <Block block={block} reduce={reduce} />
                        </div>
                      ))}
                    </div>
                  </motion.section>
                ))}
              </Fragment>
            ))}
          </div>
        </div>

        {/* Footer */}
        <BrowseProjects currentSlug={study.slug} />

        <div className="mb-24 mt-12 flex flex-wrap items-center justify-between gap-6 border-t border-border pt-10">
          <a
            href="#work"
            onClick={onBack}
            className="type-body-s inline-flex items-center gap-2 font-medium text-ink-primary underline decoration-ink-primary/30 decoration-1 underline-offset-[6px] transition-colors hover:decoration-ink-primary"
          >
            <span aria-hidden="true">←</span> Back to Case Studies
          </a>
          <ShareLinks title={`${study.title} — ${study.description}`} />
        </div>
      </main>
    </div>
  );
}
