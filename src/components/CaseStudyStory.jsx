import { Fragment, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import SectionNav from "./SectionNav";
import BrowseProjects from "./BrowseProjects";
import Carousel from "./Carousel";
import Lightbox from "./Lightbox";
import ImageSet from "./ImageSet";
import ForwarderFlow from "./ForwarderFlow";
import LidarFlow from "./LidarFlow";
import CtaFlowers from "./CtaFlowers";
import ResearchTimeline from "./ResearchTimeline";

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
  "carousel", "grid", "featured", "glanceCards", "insightCards", "decisionGrid", "flow",
]);
const OPENS_GROUP = new Set(["subsection", "heading"]);
// Layouts that already hold their own copy, so they open at full distance
// rather than hugging the line above them.
const SELF_CONTAINED = new Set(["split", "glanceCards", "insightCards", "decisionGrid", "metrics"]);

function blockGap(prev, cur) {
  if (!prev) return "";
  if (OPENS_GROUP.has(cur)) return "mt-16 lg:mt-20";
  if (SELF_CONTAINED.has(cur)) return "mt-10 lg:mt-12";
  if (FIGURE_BLOCKS.has(cur) && (OPENS_GROUP.has(prev) || prev === "lead" || prev === "text")) return "mt-6 lg:mt-7";
  if (cur === "highlight" || cur === "callout" || cur === "note") return "mt-9 lg:mt-10";
  return "mt-7 lg:mt-8";
}

/* The tool marks.

   Drawn rather than imported: the project only ever had icon files for three of
   these, and one of those turned out to be a saved HTML page rather than an
   SVG. These are simplified, recognisable marks in one weight and one colour,
   so the row reads as a set — they are not the official logos. */
function ToolMark({ name }) {
  const svg = { viewBox: "0 0 24 24", className: "h-full w-full", "aria-hidden": "true" };
  switch (name) {
    case "Claude Code": // the radial burst
      return (
        <svg {...svg} fill="currentColor">
          {Array.from({ length: 8 }, (_, i) => (
            <rect key={i} x="11.1" y="2.6" width="1.8" height="18.8" rx="0.9" transform={`rotate(${i * 22.5} 12 12)`} />
          ))}
        </svg>
      );
    /* The folded ribbon. Outlined it read as a "send" arrow, so it is filled,
       with the fold cut out by the even-odd rule. */
    case "VS Code":
      return (
        <svg {...svg} fill="currentColor" fillRule="evenodd" clipRule="evenodd">
          <path d="M17.2 2.4 21.6 4.6v14.8l-4.4 2.2-8.9-7.1-4.3 3.3-1.9-1.1 3.6-4.7-3.6-4.7 1.9-1.1 4.3 3.3 8.9-7.1Zm.5 5.2L11.8 12l5.9 4.4V7.6Z" />
        </svg>
      );
    /* The five shapes. Drawn as rounded rects they all collapsed to circles
       (a 6-wide rect with rx 3 is a circle), which lost the stacked slabs the
       mark is actually built from. */
    case "Figma":
      return (
        <svg {...svg} fill="currentColor">
          <path d="M9 3h3v6H9a3 3 0 1 1 0-6Z" />
          <path d="M12 3h3a3 3 0 1 1 0 6h-3V3Z" />
          <path d="M9 9h3v6H9a3 3 0 1 1 0-6Z" />
          <circle cx="15" cy="12" r="3" />
          <path d="M9 15h3v3a3 3 0 1 1-3-3Z" />
        </svg>
      );
    case "Gemini": // the four-pointed spark
      return (
        <svg {...svg} fill="currentColor">
          <path d="M12 2c.6 4.9 4.5 8.8 9.4 9.4-4.9.6-8.8 4.5-9.4 9.4-.6-4.9-4.5-8.8-9.4-9.4C7.5 10.8 11.4 6.9 12 2Z" />
        </svg>
      );
    case "ChatGPT": // the interlocking knot, reduced to its hexagon
      return (
        <svg {...svg} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
          <path d="M12 3.2 19.3 7.4v9.2L12 20.8 4.7 16.6V7.4L12 3.2Z" />
          <path d="M12 3.2v8.3l7.3 4.2M12 11.5 4.7 15.7" />
        </svg>
      );
    case "Vercel": // the triangle
      return (
        <svg {...svg} fill="currentColor">
          <path d="M12 3.5 22 20.5H2L12 3.5Z" />
        </svg>
      );
    case "Google Analytics": // three rising bars
      return (
        <svg {...svg} fill="currentColor">
          <rect x="16.4" y="3" width="4.4" height="18" rx="2.2" />
          <rect x="9.8" y="8.6" width="4.4" height="12.4" rx="2.2" />
          <rect x="3.2" y="14.2" width="4.4" height="6.8" rx="2.2" />
        </svg>
      );
    default:
      return <svg {...svg} fill="currentColor"><circle cx="12" cy="12" r="4" /></svg>;
  }
}

function Block({ block, reduce }) {
  switch (block.type) {
    case "highlight":
      return (
        <div className="flex gap-5 rounded-2xl bg-[#E9F0E6] px-6 py-6 lg:gap-6 lg:px-8">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-surface/70 text-forest">
            <CtxIcon id={block.icon} />
          </span>
          <div className="min-w-0 flex-1 border-l border-forest/25 pl-5">
            <h4 className="font-serif font-semibold text-ink-primary [font-size:clamp(18px,1.6vw,23px)]">{block.title}</h4>
            <p className="text-[13px] leading-[20px] mt-2 text-ink-primary/75">{block.text}</p>
          </div>
        </div>
      );

    case "painpoints":
      return (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {block.items.map((item) => (
            <li key={item.title} className="rounded-2xl bg-[#FBF8F2] p-6 ring-1 ring-border">
              <CtxIcon id={item.icon} className="h-7 w-7 text-ink-primary" />
              <p className="mt-5 font-serif font-semibold text-ink-primary [font-size:clamp(17px,1.4vw,20px)]">{item.title}</p>
              <p className="text-[13px] leading-[20px] mt-2 text-ink-secondary">{item.text}</p>
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
      return <p className="text-[13px] leading-[20px] border-l border-border pl-5 text-ink-secondary">{block.text}</p>;

    // Both carry the emphasis markers: **bold** for the phrase that matters,
    // __underline__ for the longer clause.
    case "lead":
      return (
        <p className="text-[16px] leading-[1.6] text-ink-primary/70">
          <Rich text={block.text} />
        </p>
      );

    case "text":
      return (
        <p className="text-[16px] leading-[1.6] text-ink-primary/75">
          <Rich text={block.text} />
        </p>
      );

    case "list":
      return (
        <ul className="flex flex-col gap-3">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3.5">
              <Bullet marker={block.marker} />
              <span className="min-w-0 flex-1 text-[16px] leading-[1.6] text-ink-primary/75"><Rich text={item} /></span>
            </li>
          ))}
        </ul>
      );

    case "facts":
      return (
        <dl className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
          {block.items.map(([term, detail]) => (
            <div key={term}>
              <dt className="type-label uppercase tracking-[0.2em] text-ink-subtle">{term}</dt>
              <dd className="text-[13px] leading-[20px] mt-2 text-ink-secondary">{detail}</dd>
            </div>
          ))}
        </dl>
      );

    case "cards":
      return (
        <ul className="grid gap-4 sm:grid-cols-2">
          {block.items.map((item, i) => (
            <li key={item.title} className="rounded-2xl border border-border bg-surface p-6">
              {!block.plain && <p className="type-label text-ink-subtle">{String(i + 1).padStart(2, "0")}</p>}
              <h3 className={`${block.plain ? "" : "mt-3 "}font-serif text-[18px] font-semibold leading-[26px] text-ink-primary`}>{item.title}</h3>
              <p className="text-[13px] leading-[20px] mt-3 text-ink-secondary">{item.text}</p>
            </li>
          ))}
        </ul>
      );

    case "metrics":
      return (
        <ul
          className={`grid gap-px overflow-hidden rounded-2xl bg-cream/15 shadow-[0_20px_44px_-26px_rgba(24,32,30,0.5)] ${
            block.items.length >= 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2"
          }`}
        >
          {block.items.map((item) => (
            <li key={item.label} className="bg-forest px-6 py-9 text-cream">
              <p className="font-serif font-semibold tracking-[-0.04em] [font-size:clamp(40px,4.4vw,60px)] [line-height:0.95]">{item.value}</p>
              <p className="text-[13px] leading-[20px] mt-3.5 text-cream/70">{item.label}</p>
            </li>
          ))}
        </ul>
      );

    case "callout":
      return (
        <p className="rounded-2xl border-l-2 border-forest bg-sage-pale/60 px-6 py-5 text-[16px] leading-[1.6] text-ink-primary">{block.text}</p>
      );

    case "status":
      return (
        <p className="text-[13px] leading-[20px] inline-flex w-fit items-center gap-2.5 rounded-full border border-border bg-surface px-4 py-2 text-ink-secondary">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-forest" />
          {block.text}
        </p>
      );

    /* The way out to the thing itself. On a project whose point is to be used,
       the link is the content, so it gets the weight a section heading would.
       White on the clay token measures 4.48:1 — under AA for type this size —
       so the ground is a step darker (5.67:1) and clay stays decorative. */
    case "cta":
      return (
        <div className="group relative overflow-hidden rounded-3xl bg-[#F6E4E1] px-6 py-10 text-center ring-1 ring-[#E2C3BC] sm:px-10 sm:py-12">
          <CtaFlowers />
          <div className="relative z-[1]">
          {block.href ? (
            <a
              href={block.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-[#A14F3E] px-8 py-4 font-serif text-[18px] font-semibold text-[#FFFCF7] shadow-[0_10px_24px_-10px_rgba(90,38,28,0.6)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#8E4435] motion-reduce:transition-none sm:text-[20px]"
            >
              <span aria-hidden="true">→</span>
              {block.label}
            </a>
          ) : (
            <span className="inline-flex items-center gap-3 rounded-full border border-dashed border-[#A14F3E]/50 px-8 py-4 font-serif text-[18px] font-semibold text-[#A14F3E] sm:text-[20px]">
              <span aria-hidden="true">→</span>
              {block.label}
            </span>
          )}
            <p className="mt-4 text-[14px] leading-[20px] text-ink-secondary">{block.href ? block.note : block.pending}</p>
          </div>
        </div>
      );

    /* A plain inventory. Naming the tools is the whole content — any more
       would be elaboration the brief does not want. */
    case "tools":
      return (
        <div>
          {block.label && <p className="type-label uppercase tracking-[0.2em] text-ink-subtle">{block.label}</p>}
          <ul className="mt-3 flex flex-wrap gap-2">
            {block.items.map((item) => (
              <li
                key={item}
                className="inline-flex items-center gap-2 rounded-full bg-surface py-1.5 pl-2.5 pr-4 text-[14px] font-medium text-ink-primary ring-1 ring-border"
              >
                <span className="grid h-[18px] w-[18px] shrink-0 place-items-center text-ink-primary/75">
                  <ToolMark name={item} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      );

    case "carousel":
      return <Carousel images={block.images} caption={block.caption} />;

    // A tight grid of equal tiles — for sets where seeing them together is the
    // point (sketch variations, research artefacts) rather than one at a time.
    case "grid":
      return (
        <ul className={`grid gap-3 ${block.cols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
          {block.images.map((image) => (
            <li key={image.src} className="group overflow-hidden rounded-xl border border-border bg-surface">
              <img
                src={image.src}
                alt={image.alt}
                width={image.w}
                height={image.h}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="aspect-[4/3] w-full bg-surface object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
              />
            </li>
          ))}
        </ul>
      );

    /* A feature: the copy beside the screen that shows it. The image leads on
       width here — these are the product shots people came to look at — and
       clicking one opens it full size. Looping artwork (an exported GIF) plays
       by itself and is not a still. */
    case "features":
      return <FeatureGroup blocks={block.items} />;

    /* The chain of parties, revealed step by step on hover. */
    case "flowDiagram":
      return <ForwarderFlow caption={block.caption} />;

    /* The LiDAR pipeline, rebuilt as markup rather than an exported slide. */
    case "lidarFlow":
      return <LidarFlow caption={block.caption} />;

    /* The four-week research plan, in the page's own palette. */
    case "timeline":
      return <ResearchTimeline />;

    /* A set of related images, each opening full size. */
    case "imageSet":
      return <ImageSet images={block.images} cols={block.cols} feature={block.feature} caption={block.caption} />;

    /* Problem against solution, point for point — the comparison is the
       content, so the two columns sit side by side and line up. */
    case "compare":
      return (
        <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
          {[block.left, block.right].map((col, side) => (
            <div
              key={col.title}
              className={`rounded-2xl p-6 ring-1 ${
                side === 0 ? "bg-[#FBF5F1] ring-[#E4D3C6]" : "bg-sage-pale/70 ring-forest/15"
              }`}
            >
              <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${side === 0 ? "text-[#9A6246]" : "text-forest"}`}>
                {col.title}
              </p>
              <ul className="mt-5 flex flex-col gap-4">
                {col.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true" className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${side === 0 ? "bg-[#B5775A]" : "bg-forest"}`} />
                    <span className="min-w-0 flex-1 text-[15px] leading-[1.6] text-ink-primary/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );

    /* Verbatim user quotes, each in its own box with the question it answers
       as the heading — the shape they had in the original write-up. */
    case "quotes":
      return (
        <ul className="grid gap-4 sm:grid-cols-2">
          {block.items.map((item) => (
            <li key={item.ask} className="flex flex-col rounded-2xl bg-surface p-6 ring-1 ring-border">
              {/* the quote mark sits on the question's own line rather than
                  taking a line of its own above it */}
              <p className="font-serif text-[17px] font-semibold leading-[24px] text-ink-primary">
                <span aria-hidden="true" className="mr-1.5 font-serif text-[22px] leading-none text-forest/40">“</span>
                {item.ask}
              </p>
              <p className="mt-2.5 flex-1 text-[14px] leading-[1.6] text-ink-secondary">{item.said}</p>
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-secondary">{item.who}</p>
            </li>
          ))}
        </ul>
      );

    /* Closing takeaways — numbered, not ticked. */
    case "takeaways":
      return (
        <ol className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
          {block.items.map((item, i) => (
            <li key={item} className="flex gap-4">
              <span className="font-serif text-[20px] font-semibold leading-[26px] tabular-nums text-forest/45">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1 text-[15px] leading-[1.6] text-ink-primary/80">{item}</span>
            </li>
          ))}
        </ol>
      );

    /* One image, given room but not the whole column — unless it is the only
       visual a study has, in which case `wide` lets it take the full measure. */
    case "featured":
      return (
        <figure className={`mx-auto w-full ${block.wide ? "" : "max-w-[68%] max-lg:max-w-full"}`}>
          <img
            src={block.src}
            alt={block.alt}
            width={block.w}
            height={block.h}
            loading="lazy"
            decoding="async"
            draggable={false}
            className={`w-full rounded-xl border border-border bg-surface object-contain shadow-[0_8px_24px_rgba(24,32,30,0.12)] ${
              block.wide ? "max-h-[640px]" : "max-h-[440px]"
            }`}
          />
          {block.caption && (
            <figcaption className="mt-3 text-center text-[13px] italic leading-[20px] text-ink-subtle">{block.caption}</figcaption>
          )}
        </figure>
      );

    /* The close: the numbers on the left, what they taught on the right. */
    case "outcomeSplit":
      return (
        <div className="grid gap-10 lg:grid-cols-[minmax(0,45fr)_minmax(0,55fr)]">
          <ul className="grid grid-cols-2 gap-3 self-start">
            {block.metrics.map((metric) => (
              <li key={metric.label} className="rounded-xl bg-surface px-5 py-6">
                <p className="font-serif text-[30px] font-semibold leading-none tracking-[-0.02em] text-forest">{metric.value}</p>
                <p className="mt-2.5 text-[13px] leading-[18px] text-ink-secondary">{metric.label}</p>
              </li>
            ))}
          </ul>
          <ul className="flex flex-col gap-3">
            {block.learnings.map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-forest/55" />
                <span className="text-[16px] leading-[1.6] text-ink-primary/80">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    // The five cards that open the study: scannable in about thirty seconds.
    case "glanceCards":
      return (
        <ul className="grid gap-4 sm:grid-cols-2">
          {block.items.map((item, i) => (
            <li
              key={item.label}
              className={`flex flex-col rounded-2xl border border-border bg-surface p-6 transition-shadow duration-300 hover:shadow-[0_8px_24px_rgba(24,32,30,0.1)] ${
                item.wide || (block.items.length % 2 === 1 && i === block.items.length - 1) ? "sm:col-span-2" : ""
              }`}
            >
              <span className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sage-pale text-forest">
                  <CtxIcon id={item.icon} className="h-[18px] w-[18px]" />
                </span>
                <span className="type-label uppercase tracking-[0.24em] text-ink-subtle">{item.label}</span>
              </span>
              <p className="mt-4 font-serif font-semibold text-ink-primary [font-size:clamp(19px,1.7vw,24px)] [line-height:1.3]">{item.text}</p>
              {item.src && (
                <img
                  src={item.src}
                  alt={item.alt}
                  width={item.w}
                  height={item.h}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="mt-5 h-40 w-full rounded-xl border border-border bg-canvas object-cover"
                />
              )}
            </li>
          ))}
        </ul>
      );

    // Three findings, side by side, so they read as a set rather than a list.
    case "insightCards":
      return (
        <ul className="grid gap-4 sm:grid-cols-3">
          {block.items.map((item, i) => (
            <li key={item.title} className="rounded-2xl border border-border bg-surface p-6">
              <span className="type-label tabular-nums text-ink-subtle">{String(i + 1).padStart(2, "0")}</span>
              <p className="mt-3 font-serif font-semibold text-ink-primary [font-size:clamp(18px,1.5vw,22px)] [line-height:1.25]">{item.title}</p>
              <p className="text-[13px] leading-[20px] mt-2.5 text-ink-secondary">{item.text}</p>
            </li>
          ))}
        </ul>
      );

    // Decisions as a two-up grid: mark, one line of reasoning, and the screen
    // it produced — small, inline, not a full-width dump.
    case "decisionGrid":
      return (
        <ul className="grid gap-5 sm:grid-cols-2">
          {block.items.map((item) => (
            <li key={item.title} className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface">
              {item.src && (
                <img
                  src={item.src}
                  alt={item.alt}
                  width={item.w}
                  height={item.h}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="aspect-[16/9] w-full bg-canvas object-cover"
                />
              )}
              <div className="flex flex-1 flex-col p-6">
                <span className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sage-pale text-forest">
                    <CtxIcon id={item.icon} className="h-4 w-4" />
                  </span>
                  <span className="font-serif font-semibold text-ink-primary [font-size:clamp(17px,1.4vw,20px)]">{item.title}</span>
                </span>
                <p className="text-[13px] leading-[20px] mt-3 text-ink-secondary">{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      );

    // The walkthrough as a row of steps rather than a numbered paragraph.
    case "flow":
      return (
        <ol className="flex flex-col gap-2 lg:flex-row lg:items-stretch lg:gap-0">
          {block.steps.map((step, i) => (
            <Fragment key={step}>
              <li className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-[#FBF8F2] px-4 py-3.5 ring-1 ring-border lg:flex-col lg:items-start lg:gap-2 lg:px-5">
                <span className="type-label shrink-0 tabular-nums text-ink-subtle">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[13px] leading-[20px] min-w-0 text-ink-primary">{step}</span>
              </li>
              {i < block.steps.length - 1 && (
                <span aria-hidden="true" className="flex shrink-0 items-center justify-center py-0.5 text-ink-primary/30 lg:w-7 lg:py-0">
                  <svg viewBox="0 0 24 12" className="h-3 w-5 rotate-90 lg:rotate-0" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M0 6h19M15 2l4 4-4 4" />
                  </svg>
                </span>
              )}
            </Fragment>
          ))}
        </ol>
      );

    default:
      return null;
  }
}

/* One feature: copy on one side, the screen on the other.

   The image is the larger column and opens full size on click, because these
   are the shots a reader actually wants to inspect. Animated exports play on
   a loop and carry no zoom affordance — there is nothing more to see. */
function FeatureRow({ block, onOpen }) {

  return (
    <>
      {/* Both columns are the same width whichever side the image is on, and
          the copy aligns to the top of the image rather than its middle. */}
      <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
        <div className={`min-w-0 lg:pt-1 ${block.flip ? "lg:order-2" : ""}`}>
          {block.eyebrow && <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-ink-subtle">{block.eyebrow}</p>}
          {block.title && (
            <h3 className="mt-2 font-serif text-[18px] font-semibold leading-[26px] text-ink-primary">{block.title}</h3>
          )}
          <p className="mt-3 text-[16px] leading-[1.6] text-ink-secondary">
            <Rich text={block.text} />
          </p>
        </div>

        <div className={`min-w-0 ${block.flip ? "lg:order-1" : ""}`}>
          {(
            <button
              type="button"
              onClick={onOpen}
              aria-label={`View full size: ${block.alt}`}
              className="group relative block w-full overflow-hidden rounded-xl border border-border bg-surface outline-offset-4 focus-visible:outline-2 focus-visible:outline-forest"
            >
              <img
                src={block.src}
                alt={block.alt}
                width={block.w}
                height={block.h}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="w-full transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:transition-none"
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
          )}
        </div>
      </div>

    </>
  );
}

/* All of a section's features share one viewer, so opening any still screen
   lets you step through the rest of that section — not just the one clicked. */
function FeatureGroup({ blocks }) {
  const [open, setOpen] = useState(null);
  // Every feature opens, animations included — a looping WebP enlarges and
  // keeps playing, so there is no reason to exclude it from the viewer.
  const images = blocks.map((b) => ({ src: b.src, alt: b.alt, caption: b.title }));

  return (
    <div className="flex flex-col gap-14 lg:gap-20">
      {blocks.map((block, i) => (
        <FeatureRow key={block.title} block={block} onOpen={() => setOpen(i)} />
      ))}
      <Lightbox images={images} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
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

/* The composite cover: a scene built around the product, with empty space on
   its left for the copy. It takes live type rather than a scrim and a centred
   block — the artwork was made for exactly this. Below lg the copy drops under
   the image, where there is room for it. */
function HeroComposite({ study, story, fadeUp, reduce }) {
  return (
    <div className="relative -mx-5 sm:-mx-8 lg:mx-[calc(50%-50vw)] lg:w-screen">
      <motion.img
        {...fadeUp}
        transition={reduce ? undefined : { ...fadeUp.transition, delay: 0.05 }}
        src={story.cover.src}
        alt={story.cover.alt}
        width={story.cover.w}
        height={story.cover.h}
        className="mt-6 block w-full lg:mt-0"
      />

      {/* The cover now carries its own typography, set into the artwork by the
          designer, so there is nothing to overlay and no wash to make an
          overlay readable. Below lg the baked type would scale to a few
          pixels — measured at ~5px for the labels at 1024px — so the copy
          takes over there and is merely sr-only above it, which keeps the h1
          and the metadata in the accessibility tree at every width. */}
      <motion.div
        {...fadeUp}
        className="px-5 pb-2 pt-8 sm:px-8 lg:sr-only"
      >
        <div className="lg:max-w-[560px]">
          <h1 className="font-serif text-[44px] font-semibold leading-[1.02] tracking-[-0.02em] text-ink-primary lg:text-[clamp(48px,4.8vw,72px)]">
            {study.title}
          </h1>
          <p className="mt-5 max-w-[520px] text-[16px] leading-[1.6] text-ink-secondary lg:text-[17px]">
            {story.tagline ?? study.description}
          </p>

          {/* Phone-width only, now that the cover carries its own metadata — so it
              simply has to fit. The row was once flex-nowrap with nowrap values,
              which kept ROLE off the ship back when the copy sat on the artwork;
              with Bloom Craft's longer values that spilled 47px past a 350px
              column as text, invisible to any element-rectangle check. */}
          <dl className="mt-7 flex flex-wrap items-start gap-x-7 gap-y-4">
            {story.meta.map(([term, value]) => (
              /* No dividing rules: the row wraps on a phone, and a left border
                 then dangles at the start of the second line with nothing before
                 it. The gap separates the columns on its own — which is also how
                 the other hero variant has always done it. */
              <div key={term} className="min-w-0">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-forest">{term}</dt>
                <dd className="mt-1.5 text-[14px] font-medium leading-[19px] text-ink-primary">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </motion.div>
    </div>
  );
}

function HeroCover({ study, story, fadeUp, reduce }) {
  if (story.heroLayout === "composite") {
    return <HeroComposite study={study} story={story} fadeUp={fadeUp} reduce={reduce} />;
  }
  return (
    <div className="relative -mx-5 overflow-hidden sm:-mx-8 lg:mx-[calc(50%-50vw)] lg:w-screen">
      <motion.img
        {...fadeUp}
        transition={reduce ? undefined : { ...fadeUp.transition, delay: 0.05 }}
        src={story.cover.src}
        alt={story.cover.alt}
        width={story.cover.w}
        height={story.cover.h}
        className="block h-[60vh] max-h-[620px] min-h-[380px] w-full object-cover"
      />

      {/* A flat 40% wash, plus a soft darkening behind the centred block only.
          Two of the four covers are bright, and at 40% alone white type sits
          near 2:1 over them — far under AA. The extra weight is local to the
          text, so the picture still reads as a picture at the edges. */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[rgba(8,11,10,0.40)]" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 78% 72% at 50% 50%, rgba(8,11,10,0.66) 0%, rgba(8,11,10,0.46) 58%, rgba(8,11,10,0) 100%)" }}
      />

      <motion.div
        {...fadeUp}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
      >
        <h1 className="font-serif text-[32px] font-semibold leading-[1.1] tracking-[-0.02em] text-white [text-shadow:0_2px_4px_rgba(8,11,10,0.6)] sm:text-[40px] lg:text-[48px]">
          {study.title}
        </h1>
        {/* The spec's #626762 is a grey for pale grounds; over a darkened photo
            it is barely visible, so the one-liner is white at 80% instead. */}
        <p className="mt-4 max-w-[620px] text-[16px] leading-[1.6] text-white/80 [text-shadow:0_2px_3px_rgba(8,11,10,0.55)] sm:text-[18px]">
          {story.tagline ?? study.description}
        </p>

        <dl className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {story.meta.map(([term, value]) => (
            <div key={term} className="flex items-center gap-2">
              <dt className="text-[11px] uppercase tracking-[0.18em] text-white/55">{term}</dt>
              <dd className="text-[13px] font-medium text-white">{value}</dd>
            </div>
          ))}
        </dl>
      </motion.div>
    </div>
  );
}

/* ---- page ---- */

export default function CaseStudyStory({ study, story, onBack }) {
  const reduce = useReducedMotion();

  // One flat run of sections, in the order the project actually happened.
  const sections = story.sections;
  const [activeId, setActiveId] = useState(sections[0].id);
  const sectionsRef = useRef(null);

  const fadeUp = reduce
    ? {}
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } };

  // Follow the section the reader is in.
  useEffect(() => {
    const nodes = sections.map((s) => document.getElementById(`section-${s.id}`)).filter(Boolean);
    if (!nodes.length) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id.replace("section-", ""));
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: 0 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [sections]);

  /* The rail sits in the left margin, which the full-bleed hero spans — so at
     the top of the page its labels would land on the cover photo. It appears
     once the story has reached the top of the viewport.

     This is driven by an observer rather than a scroll listener: the listener
     version latched false on its first run, when the ref was not yet attached,
     and never recovered. The observer re-fires whenever the boundary is
     crossed, so there is no first-run ordering to get wrong. */
  const railSentinel = useRef(null);
  const [railReady, setRailReady] = useState(false);
  useEffect(() => {
    const node = railSentinel.current;
    if (!node) return undefined;

    /* Fourth attempt at this, so here is what actually goes wrong.

       An IntersectionObserver only fires when the target *crosses* the root
       boundary. Watching a zero-height marker means that once it is thousands
       of pixels above the viewport no further callback ever arrives, so a
       reading taken before first paint — when the marker had not yet moved —
       latches and never corrects. A scroll listener had the mirror-image bug.

       Observing a tall element instead gives a boundary that is continuously
       being crossed while the reader moves through the story, so the state
       stays honest: the wrapper's top edge is the thing we care about, and
       it is tracked by giving the sentinel the wrapper's full height. */
    const measure = () => {
      const top = node.getBoundingClientRect().top;
      setRailReady(top <= 96);
    };
    measure();

    const observer = new IntersectionObserver(measure, {
      // a tall stack of thresholds keeps the callback firing as it travels
      threshold: Array.from({ length: 21 }, (_, i) => i / 20),
    });
    observer.observe(node);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const jumpTo = (id) => {
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-wall text-ink-primary">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-wall/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
          <a
            href="#work"
            onClick={onBack}
            className="text-[13px] leading-[20px] inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 font-medium text-ink-primary transition-colors hover:bg-sage-pale"
          >
            <span aria-hidden="true">←</span> Back to case studies
          </a>
          <span className="font-display text-2xl font-semibold tracking-tight">Nikita.</span>
        </div>
      </header>

      {/* A 1000px column: long measures are the main reason a case study reads
          as a document rather than a piece of design. */}
      <main className="mx-auto max-w-[1000px] px-5 sm:px-8 lg:px-10">
        {/* Universal header: the cover, with the title and metadata over it. */}
        <HeroCover study={study} story={story} fadeUp={fadeUp} reduce={reduce} />

        {/* Index + sections. The navigator floats over the margin, so the story
            keeps this whole column; it sticks inside this wrapper and stops
            where the story ends. */}
        <div ref={sectionsRef} className="relative scroll-mt-24 pt-10">
          {/* Spans the whole story, so its top edge keeps crossing thresholds
              as the reader scrolls and the rail's state stays live. */}
          <span ref={railSentinel} aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-px" />
          <SectionNav sections={sections} activeId={activeId} onJump={jumpTo} reduce={reduce} ready={railReady} numbered={story.numbered !== false} />

          <div className="min-w-0">

            {sections.map((section, i) => (
              <Fragment key={section.id}>
              <motion.section
                id={`section-${section.id}`}
                {...(reduce ? {} : { initial: { opacity: 0, y: 12 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-60px" }, transition: { duration: 0.4, ease: EASE } })}
                className="relative scroll-mt-28 py-[44px] lg:py-[50px]"
              >
                {/* Alternating grounds give the page a rhythm instead of one
                    flat sheet; the closing section takes the sage accent. */}
                {section.accent ? (
                  <span aria-hidden="true" className="absolute inset-y-0 left-1/2 z-0 w-screen -translate-x-1/2 bg-sage" />
                ) : (
                  i % 2 === 1 && (
                    <span aria-hidden="true" className="absolute inset-y-0 left-1/2 z-0 w-screen -translate-x-1/2 bg-[#F6F1E6]" />
                  )
                )}
                <header className="relative z-[1]">
                  {story.numbered !== false && (
                    <p className="text-[14px] font-semibold tabular-nums tracking-[0.14em] text-ink-secondary">{String(i + 1).padStart(2, "0")}</p>
                  )}
                  {/* Hierarchy, not volume: 20px semibold carries a section
                      head at this measure without shouting over the body. */}
                  <h2 className="mt-2.5 font-serif text-[20px] font-semibold leading-[28px] text-ink-primary">{section.title}</h2>
                  {section.standfirst && (
                    <p className="mt-3 max-w-[700px] text-[16px] leading-[1.6] text-ink-secondary">{section.standfirst}</p>
                  )}
                </header>
                <div className="relative z-[1] mt-7 flex flex-col">
                  {section.blocks.map((block, index) => (
                    <div key={`${section.id}-${index}`} className={blockGap(section.blocks[index - 1]?.type, block.type)}>
                      <Block block={block} reduce={reduce} />
                    </div>
                  ))}
                </div>
              </motion.section>
              </Fragment>
            ))}
          </div>
        </div>

        {/* Footer — the other projects, and nothing else. The header already
            carries the way back, so repeating it here only adds noise. */}
        <BrowseProjects currentSlug={study.slug} />

        {/* The header goes back to the case studies; this goes all the way out.
            No onBack handler: that one steps through history to restore the
            home scroll position, which is the opposite of "take me to the top". */}
        <div className="mt-14 border-t border-border pt-8">
          <a
            href="#top"
            className="text-[13px] leading-[20px] inline-flex items-center gap-2 font-medium text-ink-secondary transition-colors hover:text-ink-primary"
          >
            <span aria-hidden="true">←</span> Back to Home
          </a>
        </div>
        <div className="h-24" />
      </main>
    </div>
  );
}
