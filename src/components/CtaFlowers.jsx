import { bloomCluster, bloomFern, bloomHydrangea, bloomRose, bloomSunflower, bloomTulip } from "../assets";

/* The flowers that arrive when you reach for the button.

   The call to action was a button on a flat pink panel, which for a project
   about making bouquets was a sad way to ask someone to go and make one. So the
   panel keeps a few of the app's own blooms just outside its edges, and they
   drift in when the box is hovered or the link is focused.

   They are decoration and nothing else: aria-hidden, pointer-events-none, and
   clipped by the panel's own rounded corner, so they never intercept the click
   or reach a screen reader. Reduced motion gets them without the travel. */

const PETALS = [
  { src: bloomRose,      alt: "", cls: "left-[-2%] top-[-6%] w-[86px] sm:w-[104px]",      rest: "-translate-x-6 -translate-y-6 -rotate-12", delay: "delay-0" },
  { src: bloomFern,      alt: "", cls: "left-[8%] bottom-[-14%] w-[76px] sm:w-[92px]",    rest: "-translate-x-5 translate-y-8 rotate-6",    delay: "delay-100" },
  { src: bloomHydrangea, alt: "", cls: "left-[26%] top-[-12%] w-[66px] sm:w-[78px]",      rest: "-translate-y-8 rotate-6",                  delay: "delay-75" },
  { src: bloomTulip,     alt: "", cls: "right-[24%] bottom-[-12%] w-[58px] sm:w-[70px]",  rest: "translate-y-8 -rotate-6",                  delay: "delay-150" },
  { src: bloomSunflower, alt: "", cls: "right-[6%] top-[-10%] w-[72px] sm:w-[88px]",      rest: "translate-x-5 -translate-y-7 rotate-12",   delay: "delay-100" },
  { src: bloomCluster,   alt: "", cls: "right-[-3%] bottom-[-8%] w-[92px] sm:w-[112px]",  rest: "translate-x-6 translate-y-6 -rotate-6",    delay: "delay-200" },
];

export default function CtaFlowers() {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
      {PETALS.map((p, i) => (
        <img
          key={i}
          src={p.src}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          className={`absolute ${p.cls} ${p.rest} ${p.delay} opacity-0 blur-[0.2px] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:translate-y-0 group-hover:rotate-0 group-hover:opacity-90 group-focus-within:translate-x-0 group-focus-within:translate-y-0 group-focus-within:rotate-0 group-focus-within:opacity-90 motion-reduce:transition-none`}
        />
      ))}
    </span>
  );
}
