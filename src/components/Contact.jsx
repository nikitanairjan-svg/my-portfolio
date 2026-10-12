import { motion, useReducedMotion } from "framer-motion";
import { contactBoard, contactCards, contactClips, contactTiles } from "../assets";
import { playKnock, tileVoices } from "./tileSound";
import layout from "../data/contactLayout.json";

/* Section 4 — Contact. From md up, the artwork (built by
   scripts/build-contact-art.py) is the whole section, in layers: the board (with
   every shadow), the letter tiles, the contact cards and, on top, the clips that
   hold them. Cards and tiles are live slices of their layer laid exactly over
   their printed position, so the scene is identical at rest but a card can lift
   and a tile can swing under its clip. Phones get a crop of the letter tiles
   with regular, tappable cards below. */

const EMAIL = "nikitanair.design@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/nikita-nair-4a9696214/";

const ART = layout.canvas;
const CARD_META = {
  email: { label: "Email", href: `mailto:${EMAIL}` },
  linkedin: { label: "LinkedIn", href: LINKEDIN, external: true },
  resume: { label: "Resume", disabled: true },
};
const CARDS = layout.cards.map((box) => ({ id: box.id, box, ...CARD_META[box.id] }));

// One note per tile, fixed for the life of the page.
const VOICES = tileVoices(layout.tiles);

// Place a box over the artwork (percent of the section).
const place = ({ x, y, w, h }) => ({
  left: `${(x / ART.w) * 100}%`,
  top: `${(y / ART.h) * 100}%`,
  width: `${(w / ART.w) * 100}%`,
  height: `${(h / ART.h) * 100}%`,
});

// Show the part of an artwork-sized image that sits under the box.
const slice = ({ x, y, w, h }, src) => ({
  backgroundImage: `url(${src})`,
  backgroundSize: `${(ART.w / w) * 100}% ${(ART.h / h) * 100}%`,
  backgroundPosition: `${(x / (ART.w - w)) * 100}% ${(y / (ART.h - h)) * 100}%`,
});

const radius = `calc(${layout.cardRadius} / ${ART.w} * 100cqw)`;

/* One letter tile: swings from the point its clip grips it, as if knocked.
   Underdamped on purpose — it overshoots and wobbles before it settles. */
function Tile({ tile, index }) {
  const reduce = useReducedMotion();
  const swing = index % 2 ? 10 : -10;
  return (
    <motion.div
      data-tile
      aria-hidden="true"
      className="absolute hover:z-10"
      style={{
        ...place(tile),
        ...slice(tile, contactTiles),
        transformOrigin: `${(tile.pivot[0] / tile.w) * 100}% ${(tile.pivot[1] / tile.h) * 100}%`,
      }}
      onHoverStart={reduce ? undefined : () => playKnock(VOICES[index])}
      whileHover={reduce ? undefined : { rotate: swing, y: 3 }}
      transition={{ type: "spring", stiffness: 300, damping: 8, mass: 0.6 }}
    />
  );
}

function ArtCard({ card }) {
  const style = { ...place(card.box), ...slice(card.box, contactCards), borderRadius: radius };

  if (card.disabled) {
    return (
      <div aria-disabled="true" title="Resume coming soon" className="absolute cursor-not-allowed" style={style}>
        <span className="sr-only">Resume (coming soon)</span>
        {/* fade the printed label, icon and arrow */}
        <span aria-hidden="true" className="absolute inset-0 bg-[#EFE8DE]/55" style={{ borderRadius: radius }} />
        <span
          aria-hidden="true"
          className="type-label absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 whitespace-nowrap rounded-full border border-border bg-surface px-2.5 py-1 text-ink-primary/65 shadow-sm"
        >
          Coming soon
        </span>
      </div>
    );
  }

  return (
    <a
      href={card.href}
      aria-label={card.external ? `${card.label} (opens in a new tab)` : card.label}
      {...(card.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="absolute z-10 transition duration-300 ease-out hover:z-20 hover:scale-105 hover:shadow-[0_4px_10px_rgba(24,32,30,0.1),0_22px_40px_-14px_rgba(24,32,30,0.42)] focus-visible:z-20 focus-visible:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest"
      style={style}
    />
  );
}

/* ---- Phone layout: tappable cards ---- */

function Peg({ className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute rounded-full ${className}`}
      style={{ background: "linear-gradient(90deg, #A9A38F 0%, #CFC8B6 45%, #9C9582 100%)", boxShadow: "0 1px 2px rgba(24,32,30,0.22)" }}
    />
  );
}

function GmailIcon(props) {
  return (
    <svg viewBox="0 0 48 36" {...props}>
      <path fill="#4285F4" d="M3 36h8V15.3L0 7.6V33c0 1.7 1.3 3 3 3z" />
      <path fill="#34A853" d="M37 36h8c1.7 0 3-1.3 3-3V7.6l-11 7.7z" />
      <path fill="#FBBC04" d="M37 3v12.3l11-7.7V4.6c0-3.8-4.3-6-7.4-3.7z" />
      <path fill="#EA4335" d="M11 15.3V3l13 9.1L37 3v12.3l-13 9.1z" />
      <path fill="#C5221F" d="M0 4.6v3l11 7.7V3L7.4.9C4.3-1.4 0 .8 0 4.6z" />
    </svg>
  );
}

function LinkedInIcon(props) {
  return (
    <svg viewBox="0 0 48 48" {...props}>
      <rect width="48" height="48" rx="8" fill="#0A66C2" />
      <circle cx="13.6" cy="13.2" r="3.3" fill="#fff" />
      <rect x="10.7" y="19" width="5.8" height="18.5" rx="0.6" fill="#fff" />
      <path fill="#fff" d="M21.6 19h5.5v2.6c.9-1.6 3-3.1 6.1-3.1 5.6 0 6.9 3.6 6.9 8.4v10.6h-5.8v-9.4c0-2.3-.1-4.9-3.1-4.9s-3.7 2.3-3.7 4.8v9.5h-5.9z" />
    </svg>
  );
}

function DocumentIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M7 2.8h7.2l4.8 4.8v12.6a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3.8a1 1 0 0 1 1-1z" />
      <path d="M14 2.8v4.9h5" />
      <path d="M9.2 12h5.6M9.2 15.3h5.6M9.2 18.6h3.6" />
    </svg>
  );
}

function ArrowIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 12h15M13.5 6.5 19 12l-5.5 5.5" />
    </svg>
  );
}

const CARD_BASE =
  "relative flex items-center gap-4 rounded-2xl bg-[#EFE8DE] px-5 py-4 shadow-[0_2px_4px_rgba(24,32,30,0.08),0_10px_24px_-12px_rgba(24,32,30,0.3)]";

function CardPegs() {
  return (
    <>
      <Peg className="left-[12%] -top-2.5 h-[18px] w-1.5" />
      <Peg className="right-[12%] -top-2.5 h-[18px] w-1.5" />
    </>
  );
}

function PhoneCard({ card }) {
  const icon =
    card.id === "email" ? <GmailIcon className="h-auto w-7" /> : card.id === "linkedin" ? <LinkedInIcon className="h-7 w-7" /> : <DocumentIcon className="h-7 w-7" />;

  if (card.disabled) {
    return (
      <div aria-disabled="true" title="Resume coming soon" className={`${CARD_BASE} cursor-not-allowed`}>
        <CardPegs />
        <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center text-ink-primary/40">{icon}</span>
        <span className="flex flex-1 flex-wrap items-center gap-x-3 gap-y-1 text-[20px] font-semibold leading-7 text-ink-primary/45">
          Resume
          <span className="type-label rounded-full border border-border bg-surface px-2.5 py-1 font-medium text-ink-primary/60">Coming soon</span>
        </span>
        <ArrowIcon aria-hidden="true" className="h-6 w-6 shrink-0 text-ink-primary/25" />
      </div>
    );
  }

  return (
    <a
      href={card.href}
      {...(card.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`${CARD_BASE} transition duration-300 ease-out active:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest`}
    >
      <CardPegs />
      <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center">{icon}</span>
      <span className="flex-1 text-[20px] font-semibold leading-7 text-ink-primary">{card.label}</span>
      <ArrowIcon aria-hidden="true" className="h-6 w-6 shrink-0 text-ink-primary" />
    </a>
  );
}

export default function Contact() {
  const crop = layout.tilesCrop;
  return (
    <section id="contact" className="wall-surface">
      <h2 className="sr-only">Okay, enough about me. Let’s connect.</h2>

      {/* md and up: the artwork in layers, with live tiles and cards */}
      <div className="@container relative hidden w-full md:block" style={{ aspectRatio: `${ART.w} / ${ART.h}` }}>
        <div aria-hidden="true" className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${contactBoard})` }} />
        {/* Fade the artwork's top margin in from the wall above */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-30 h-[5%] bg-gradient-to-b from-wall to-transparent" />

        {layout.tiles.map((tile, i) => (
          <Tile key={i} tile={tile} index={i} />
        ))}

        <ul>
          {CARDS.map((card) => (
            <li key={card.id}>
              <ArtCard card={card} />
            </li>
          ))}
        </ul>

        {/* Clips stay in front, so a lifted card or a nudged tile still hangs from them */}
        <div
          data-clips
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 bg-cover bg-center"
          style={{ backgroundImage: `url(${contactClips})` }}
        />
      </div>

      {/* Phones: letter-tile crop, then tappable cards */}
      <div className="md:hidden">
        <div aria-hidden="true" className="relative w-full" style={{ aspectRatio: `${crop.w} / ${crop.h}` }}>
          {[contactBoard, contactTiles, contactClips].map((src) => (
            <div key={src} className="absolute inset-0" style={slice(crop, src)} />
          ))}
        </div>
        <ul className="mx-auto flex max-w-[440px] flex-col gap-8 px-5 pb-16 pt-10">
          {CARDS.map((card) => (
            <li key={card.id}>
              <PhoneCard card={card} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
