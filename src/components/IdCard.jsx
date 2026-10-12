import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { profilePhoto } from "../assets";

function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0 md:h-3.5 md:w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 12.5c2.7 1.6 5.7 2.5 9 2.5s6.3-.9 9-2.5" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0 md:h-3.5 md:w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 22s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

export default function IdCard() {
  const ref = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateY = useSpring(rawX, { stiffness: 200, damping: 20 });
  const rotateX = useSpring(rawY, { stiffness: 200, damping: 20 });
  const lift = useSpring(0, { stiffness: 200, damping: 20 });

  function handleMouseMove(e) {
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rawX.set(px * 16);
    rawY.set(-py * 16);
  }

  function handleEnter() {
    lift.set(-8);
  }

  function handleLeave() {
    rawX.set(0);
    rawY.set(0);
    lift.set(0);
  }

  return (
    <div
      className="flex flex-col items-center md:h-full md:min-h-0 md:justify-center"
      style={{ perspective: 900 }}
    >
      {/* lanyard strap */}
      <div className="relative flex flex-shrink-0 flex-col items-center">
        <div className="h-14 w-9 rounded-t-md rounded-b-sm bg-gradient-to-b from-moss to-moss-dark shadow-[inset_-3px_0_6px_rgba(0,0,0,0.25)] sm:h-20 md:h-8 md:w-6 lg:h-10 lg:w-7">
          <span className="font-display absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-semibold text-cream/90 md:text-xs lg:text-sm">
            N
          </span>
        </div>
        {/* metal clip */}
        <div className="-mt-0.5 h-4 w-7 rounded-[3px] bg-gradient-to-b from-neutral-200 via-neutral-400 to-neutral-500 shadow-sm ring-1 ring-black/10 md:h-2.5 md:w-5 lg:h-3 lg:w-6" />
        <div className="h-3 w-1.5 bg-gradient-to-b from-neutral-300 to-neutral-500 md:h-1.5 md:w-1" />
      </div>

      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={{ rotateX, rotateY, y: lift, transformStyle: "preserve-3d" }}
        className="relative w-56 flex-shrink-0 rounded-2xl bg-cream p-4 shadow-[0_20px_45px_-12px_rgba(35,34,31,0.35)] ring-1 ring-black/5 sm:w-64 sm:p-5 md:w-[clamp(8rem,11vw,10rem)] md:p-2.5 lg:w-[clamp(9rem,10vw,10.5rem)] lg:p-2.5 dark:bg-neutral-800 dark:ring-white/10"
      >
        <span className="absolute left-0 top-0 h-8 w-8 rounded-tl-2xl border-l-[3px] border-t-[3px] border-moss/70 md:h-5 md:w-5" />
        <span className="absolute bottom-0 right-0 h-8 w-8 rounded-br-2xl border-b-[3px] border-r-[3px] border-moss/70 md:h-5 md:w-5" />

        <div className="overflow-hidden rounded-xl bg-neutral-200 md:rounded-lg">
          <img
            src={profilePhoto}
            alt="Nikita Nair"
            className="aspect-[4/5] w-full object-cover"
            draggable={false}
          />
        </div>

        <div className="mt-4 text-left md:mt-2">
          <h1 className="font-display text-xl font-semibold leading-tight text-ink sm:text-2xl md:text-sm lg:text-base dark:text-cream">
            Nikita Nair
          </h1>
          <p className="mt-0.5 text-sm font-medium text-moss md:text-[11px] lg:text-xs dark:text-moss/80">
            Product Designer
          </p>

          <div className="mt-3 space-y-1.5 border-t border-ink/10 pt-3 text-[13px] text-ink/70 md:mt-1.5 md:space-y-1 md:pt-1.5 md:text-[10px] lg:text-[11px] dark:border-cream/10 dark:text-cream/70">
            <div className="flex items-center gap-2 md:gap-1.5">
              <BriefcaseIcon />
              <span>4+ years experience</span>
            </div>
            <div className="flex items-center gap-2 md:gap-1.5">
              <PinIcon />
              <span>Hyderabad, India</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
