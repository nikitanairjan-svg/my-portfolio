import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { SIGNATURE_PATH, SIGNATURE_PEN, SIGNATURE_VIEWBOX } from "./Signature";

/* The opening: the signature is written out large in the middle of the
   screen, then shrinks and flies into its place in the header while the
   cover fades to reveal the page.

   The writing is a mask, not a stroke: the pen's route (SIGNATURE_PEN) is
   stroked wide inside a mask and drawn on with a dash, revealing the traced
   outline behind it, so what appears is exactly the real signature.

   It plays on every page load (a reload brings it back), but not again when
   the visitor returns to the home page from a case study within the same
   load. It is skipped for reduced motion, and a click or key press jumps to
   the end. While it plays the header's own
   signature is hidden through html[data-intro], so there is only ever one. */

// Only a visit that starts on the home page opens with the signature; one that
// lands straight on a case study link should not get it on the way back.
const STARTED_ON_HOME = !window.location.hash.startsWith("#/work/");
const WRITE = 1.9; // seconds to sign
const HOLD = 0.25; // a beat on the finished signature
const FLY = 0.85; // into the header
const EASE = [0.65, 0, 0.35, 1];

// Lives for this page load only, so a reload plays it again.
let played = false;
const alreadyPlayed = () => played;
const markPlayed = () => {
  played = true;
};

export default function SignatureIntro() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(() => STARTED_ON_HOME && !alreadyPlayed());
  const sigRef = useRef(null);
  const ink = useMotionValue(1); // dash offset: 1 = nothing written, 0 = all of it
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const cover = useMotionValue(1);

  const playing = show && !reduce;

  // Hide the header signature and hold the page still until the intro is done.
  useLayoutEffect(() => {
    if (!playing) return undefined;
    const root = document.documentElement;
    root.dataset.intro = "playing";
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      delete root.dataset.intro;
      document.body.style.overflow = overflow;
    };
  }, [playing]);

  useEffect(() => {
    if (!show) return undefined;
    if (reduce) {
      // nothing renders for reduced motion; just don't offer it again
      markPlayed();
      return undefined;
    }

    let cancelled = false;
    const running = [];
    const run = (value, to, options) =>
      new Promise((resolve) => {
        running.push(animate(value, to, { ...options, onComplete: resolve }));
      });

    // Where the header keeps the signature, relative to where it is now.
    const flight = () => {
      const from = sigRef.current?.getBoundingClientRect();
      const to = document.querySelector("[data-signature-target] svg")?.getBoundingClientRect();
      if (!from || !to) return null;
      return {
        x: to.left + to.width / 2 - (from.left + from.width / 2),
        y: to.top + to.height / 2 - (from.top + from.height / 2),
        scale: to.width / from.width,
      };
    };

    const finish = () => {
      if (cancelled) return;
      cancelled = true;
      running.forEach((a) => a.stop());
      markPlayed();
      setShow(false);
    };

    const skip = () => {
      running.forEach((a) => a.stop());
      ink.set(0);
      const to = flight();
      if (to) {
        x.set(to.x);
        y.set(to.y);
        scale.set(to.scale);
      }
      finish();
    };

    (async () => {
      await run(ink, 0, { duration: WRITE, ease: [0.45, 0.05, 0.4, 1] });
      if (cancelled) return;
      await new Promise((r) => setTimeout(r, HOLD * 1000));
      if (cancelled) return;
      const to = flight();
      if (!to) return finish();
      await Promise.all([
        run(x, to.x, { duration: FLY, ease: EASE }),
        run(y, to.y, { duration: FLY, ease: EASE }),
        run(scale, to.scale, { duration: FLY, ease: EASE }),
        run(cover, 0, { duration: FLY * 0.9, ease: "easeOut", delay: FLY * 0.1 }),
      ]);
      finish();
    })();

    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    return () => {
      cancelled = true;
      running.forEach((a) => a.stop());
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
    };
  }, [show, reduce, ink, x, y, scale, cover]);

  if (!playing) return null;

  return (
    <div aria-hidden="true" className="fixed inset-0 z-[90] cursor-default">
      <motion.div className="absolute inset-0 bg-wall" style={{ opacity: cover }} />
      <div className="absolute inset-0 grid place-items-center px-6">
        <motion.svg
          ref={sigRef}
          viewBox={SIGNATURE_VIEWBOX}
          className="w-[min(78vw,560px)] text-ink"
          style={{ x, y, scale, originX: 0.5, originY: 0.5 }}
        >
          <defs>
            <mask id="nn-ink" maskUnits="userSpaceOnUse">
              <motion.path
                d={SIGNATURE_PEN}
                fill="none"
                stroke="white"
                strokeWidth="4.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength="1"
                strokeDasharray="1 1"
                style={{ strokeDashoffset: ink }}
              />
            </mask>
          </defs>
          <path d={SIGNATURE_PATH} fill="currentColor" fillRule="evenodd" mask="url(#nn-ink)" />
        </motion.svg>
      </div>
    </div>
  );
}
