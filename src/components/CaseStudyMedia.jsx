/* Project imagery shared by the stacking cards and the detail page: the
   lifestyle photo and the product screen(s) in a device frame. */

function Phone({ src, alt, className = "" }) {
  return (
    <div
      className={`rounded-[28px] bg-ink-primary p-[5px] shadow-[0_28px_56px_-24px_rgba(24,32,30,0.55)] ${className}`}
      style={{ aspectRatio: "1560 / 3404" }}
    >
      <img src={src} alt={alt} draggable={false} className="h-full w-full rounded-[23px] object-cover" />
    </div>
  );
}

/* Cards show the screens leaning slightly in 3D: the right side turns away and
   the top tips back. The angles are CSS variables so a hovered card can ease
   them (see CaseStudies). */
const CARD_TILT = {
  transform: "perspective(1400px) rotateY(var(--tilt-y, 8deg)) rotateX(var(--tilt-x, 4deg))",
};
const TILT_TRANSITION = "transition-transform duration-500 ease-out motion-reduce:transition-none";

export function Screen({ src, alt, frame = "dark", className = "", style }) {
  const frameStyle =
    frame === "light"
      ? "bg-surface ring-1 ring-border"
      : "bg-ink-primary ring-1 ring-white/10";
  return (
    <div className={`rounded-2xl p-2 shadow-[0_36px_72px_-28px_rgba(24,32,30,0.5)] ${frameStyle} ${className}`} style={style}>
      <img src={src} alt={alt} draggable={false} className="block w-full rounded-lg" />
    </div>
  );
}

export function PhonePair({ media, className = "", style }) {
  return (
    <div className={`flex items-center gap-4 lg:gap-5 ${className}`} style={style}>
      <Phone src={media.screens[0]} alt={media.alt[0]} className="h-full" />
      <Phone src={media.screens[1]} alt={media.alt[1]} className="h-full translate-y-6" />
    </div>
  );
}

/* Fills its (positioned) parent. `layout="card"` fades the photo into the card
   colour from the left on large screens and from the top on small ones. */
export default function CaseStudyMedia({ study, layout = "card" }) {
  const { media, theme } = study;
  const card = layout === "card";
  return (
    <>
      <img src={media.bg} alt="" aria-hidden="true" draggable={false} className="absolute inset-0 h-full w-full object-cover" />
      {card && (
        <>
          <div aria-hidden="true" className="absolute inset-0 lg:hidden" style={{ background: `linear-gradient(180deg, ${theme.card} 0%, ${theme.card}00 38%)` }} />
          <div aria-hidden="true" className="absolute inset-0 hidden lg:block" style={{ background: `linear-gradient(90deg, ${theme.card} 0%, ${theme.card}d9 16%, ${theme.card}00 52%)` }} />
        </>
      )}

      {media.kind === "phones" ? (
        <PhonePair
          media={media}
          style={card ? CARD_TILT : undefined}
          className={
            card
              ? `absolute inset-y-[9%] left-1/2 -translate-x-1/2 lg:bottom-[6%] lg:top-[15%] lg:left-[6%] lg:translate-x-0 ${TILT_TRANSITION}`
              : "absolute inset-y-[8%] left-1/2 -translate-x-1/2"
          }
        />
      ) : (
        <Screen
          src={media.screens[0]}
          alt={media.alt[0]}
          frame={media.frame}
          style={card ? CARD_TILT : undefined}
          className={
            card
              ? `absolute left-1/2 top-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2 lg:left-[7%] lg:w-[88%] lg:translate-x-0 ${TILT_TRANSITION}`
              : "absolute left-1/2 top-1/2 w-[86%] -translate-x-1/2 -translate-y-1/2 lg:w-[72%]"
          }
        />
      )}
    </>
  );
}
