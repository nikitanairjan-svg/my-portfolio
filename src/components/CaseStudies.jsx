import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import CaseStudyMedia from "./CaseStudyMedia";
import SectionHeader from "./SectionHeader";
import { caseStudies, studyHref } from "../data/caseStudies";

/* Section 2 — Case studies, as a stack of cards.

   Each card sticks a little lower than the one before it, so as you scroll the
   next card rises over the last and the stack builds up like a curtain, with a
   sliver of every card underneath still showing. The card that has been covered
   eases back slightly, which gives the pile depth without any of it moving
   sideways.

   Reduced motion gets the same cards in a plain list — no sticking, no scaling. */

const PEEK = 26; // how much of each covered card stays visible
const TOP = 88; // where the first card settles, clear of the sticky header

export function Tags({ tags, dark = false }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li
          key={tag}
          className={`type-label rounded-full border px-3 py-1.5 ${dark ? "border-white/20 text-white/80" : "border-ink-primary/15 text-ink-secondary"}`}
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}

/* ---- the card itself: the existing design, unchanged ---- */

function CardBody({ study }) {
  const dark = study.theme.tone === "dark";
  return (
    <>
      <div className="relative z-10 flex flex-col px-6 pb-8 pt-10 sm:px-10 lg:absolute lg:inset-y-0 lg:left-0 lg:w-[40%] lg:justify-center lg:py-16 lg:pl-14 lg:pr-6">
        <p className={`type-label uppercase tracking-[0.24em] ${dark ? "text-white/60" : "text-ink-secondary"}`}>{study.company}</p>
        <h3 className={`type-h2 mt-4 ${dark ? "text-surface" : "text-ink-primary"}`}>{study.title}</h3>
        <p className={`type-body-l mt-4 max-w-[380px] ${dark ? "text-white/75" : "text-ink-secondary"}`}>{study.description}</p>
        <div className="mt-6">
          <Tags tags={study.tags} dark={dark} />
        </div>
        {/* Visual call to action; the whole card is the link */}
        {study.inProgress ? (
          <span
            className={`type-label mt-8 inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 font-medium ${
              dark ? "border-white/25 text-white/80" : "border-ink-primary/20 bg-surface/60 text-ink-secondary"
            }`}
          >
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#C9893B]" />
            Case study in progress
          </span>
        ) : (
        <span
          aria-hidden="true"
          className={`type-body-s mt-8 inline-flex w-fit items-center gap-2 font-medium underline decoration-1 underline-offset-[6px] transition-colors ${dark ? "text-surface decoration-white/40 group-hover/card:decoration-white" : "text-ink-primary decoration-ink-primary/30 group-hover/card:decoration-ink-primary"}`}
        >
          View case study
          <span className="transition-transform duration-300 group-hover/card:translate-x-1">→</span>
        </span>
        )}
      </div>

      <div className="relative h-[320px] sm:h-[420px] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[64%]">
        <CaseStudyMedia study={study} />
      </div>
    </>
  );
}

function Card({ study, className = "" }) {
  return (
    <article
      className={`group/card relative overflow-hidden rounded-3xl ring-1 ring-black/5 lg:h-[min(560px,max(430px,calc(100svh-220px)))] ${className}`}
      style={{ backgroundColor: study.theme.card }}
    >
      <CardBody study={study} />
      {!study.inProgress && (
        <a
          href={studyHref(study.slug)}
          aria-label={`View case study: ${study.title}`}
          className="absolute inset-0 z-20 rounded-3xl outline-offset-4 focus-visible:outline-2 focus-visible:outline-forest"
        />
      )}
    </article>
  );
}

/* ---- one card in the stack ---- */

function StackedCard({ study, index }) {
  const ref = useRef(null);
  // Progress of this card being covered by the one after it. Measured on the
  // card's own slot, so each card recedes on its own schedule.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.93]);
  const shade = useTransform(scrollYProgress, [0, 1], [0, 0.14]);

  return (
    <li ref={ref} className="sticky" style={{ top: TOP + index * PEEK, zIndex: index + 1 }}>
      <motion.div
        style={{ scale }}
        className="origin-top will-change-transform"
        // the pile reads as depth, so a hovered card lifts clear of it
      >
        <div className={`relative transition-transform duration-300 ease-out ${study.inProgress ? "" : "hover:-translate-y-1.5"}`}>
          <Card
            study={study}
            className={`shadow-[0_2px_6px_rgba(24,32,30,0.06),0_24px_48px_-28px_rgba(24,32,30,0.45)] transition-shadow duration-300 ${
              study.inProgress
                ? ""
                : "group-hover/card:shadow-[0_6px_14px_rgba(24,32,30,0.1),0_40px_72px_-30px_rgba(24,32,30,0.6)] hover:[--tilt-x:2deg] hover:[--tilt-y:4deg]"
            }`}
          />
          {/* the covered card dims a little, so the top of the pile stays the
              one you are reading */}
          <motion.span
            aria-hidden="true"
            style={{ opacity: shade }}
            className="pointer-events-none absolute inset-0 z-30 rounded-3xl bg-ink-primary"
          />
        </div>
      </motion.div>
    </li>
  );
}

const HEADER = {
  title: "Case studies",
  subtitle: "A closer look at the problems I’ve worked on and how I approach them.",
};

export default function CaseStudies() {
  const reduce = useReducedMotion();

  return (
    <section id="work" className="wall-surface text-ink-primary scroll-mt-16 sm:scroll-mt-[72px]">
      <div className="px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1200px]">
          <SectionHeader {...HEADER} />

          {reduce ? (
            <ul className="mt-12 flex flex-col gap-6 lg:gap-10">
              {caseStudies.map((study) => (
                <li key={study.slug}>
                  <Card study={study} className="shadow-[0_1px_2px_rgba(24,32,30,0.05),0_18px_40px_-28px_rgba(24,32,30,0.25)]" />
                </li>
              ))}
            </ul>
          ) : (
            // The gap between slots is what gives each card its run of scroll
            // before the next one covers it.
            <ul className="mt-12 flex flex-col gap-10 lg:gap-16">
              {caseStudies.map((study, index) => (
                <StackedCard key={study.slug} study={study} index={index} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
