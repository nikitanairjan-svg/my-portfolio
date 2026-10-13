import { motion, useReducedMotion } from "framer-motion";
import CaseStudyMedia, { PhonePair, Screen } from "./CaseStudyMedia";
import CaseStudyStory from "./CaseStudyStory";
import { Tags } from "./CaseStudies";
import { studyHref } from "../data/caseStudies";
import shipthisStory from "../data/shipthisStory";
import axFlowStory from "../data/axFlowStory";
import bloomCraftStory from "../data/bloomCraftStory";
import hcRoboticsStory from "../data/hcRoboticsStory";

// Studies that have their story written; the rest still show the outline below.
const STORIES = {
  shipthis: shipthisStory,
  "ax-flow": axFlowStory,
  "hc-robotics": hcRoboticsStory,
  "bloom-craft": bloomCraftStory,
};

/* Detail page for one case study. Everything below the hero is placeholder
   structure to be filled in with the real story. */

function Placeholder({ children }) {
  return <p className="type-body-l text-ink-secondary">{children}</p>;
}

function Section({ label, title, children }) {
  return (
    <section className="grid gap-6 border-t border-border py-16 lg:grid-cols-[280px_1fr] lg:gap-16 lg:py-20">
      <div>
        <p className="type-label uppercase tracking-[0.24em] text-ink-subtle">{label}</p>
        {title && <h2 className="type-h4 mt-3 text-ink-primary">{title}</h2>}
      </div>
      <div className="flex flex-col gap-6">{children}</div>
    </section>
  );
}

/* Dispatcher only — no hooks here, so moving between a written study and an
   outlined one can never change the hook order of a mounted component. */
export default function CaseStudyPage({ study, next, onBack }) {
  const story = STORIES[study.slug];
  if (story) return <CaseStudyStory study={study} story={story} next={next} onBack={onBack} />;
  return <OutlinePage study={study} next={next} onBack={onBack} />;
}

function OutlinePage({ study, next, onBack }) {
  const reduce = useReducedMotion();
  const dark = study.theme.tone === "dark";
  const fadeUp = reduce
    ? {}
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } };

  const facts = [
    ["Company", study.company],
    ["Role", "Product Designer"],
    ["Platform", study.details.platform],
    ["Timeline", "To be added"],
  ];

  return (
    <div className="min-h-screen bg-canvas text-ink-primary">
      <header className="sticky top-0 z-20 border-b border-border/70 bg-canvas/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] items-center px-4 py-4 sm:px-6 lg:px-10">
          {/* Straight from the home page this steps back in history, so the
              visitor lands where they left off; otherwise it opens the top. */}
          <a
            href="#top"
            onClick={onBack}
            className="group inline-flex items-center gap-2 py-1 text-[14px] font-medium leading-[20px] text-ink-primary underline-offset-4 transition-colors hover:text-forest hover:underline"
          >
            <span aria-hidden="true" className="transition-transform duration-200 group-hover:-translate-x-0.5">←</span> Back to home
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10">
        <motion.div {...fadeUp} className="pb-12 pt-16 lg:pb-16 lg:pt-24">
          <p className="type-label uppercase tracking-[0.24em] text-ink-secondary">{study.company}</p>
          <h1 className="type-display mt-4">{study.title}</h1>
          <p className="type-body-l mt-6 max-w-[640px] text-ink-secondary">{study.description}</p>
          <div className="mt-8">
            <Tags tags={study.tags} />
          </div>

          <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-border pt-8 lg:grid-cols-4">
            {facts.map(([term, value]) => (
              <div key={term}>
                <dt className="type-label uppercase tracking-[0.2em] text-ink-subtle">{term}</dt>
                <dd className="type-body-s mt-2 font-medium text-ink-primary">{value}</dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={reduce ? undefined : { ...fadeUp.transition, delay: 0.1 }}
          className="relative h-[380px] overflow-hidden rounded-3xl sm:h-[520px] lg:h-[680px]"
          style={{ backgroundColor: study.theme.card }}
        >
          <CaseStudyMedia study={study} layout="hero" />
        </motion.div>

        <Section label="Overview" title="Context">
          <Placeholder>
            Placeholder: introduce {study.title} here: who the product is for, what it helps them do, and where it sits in the
            business.
          </Placeholder>
        </Section>

        <Section label="The problem" title="What wasn’t working">
          <Placeholder>
            Placeholder: describe the core problem, how it showed up for users, and the constraints the team was working with.
          </Placeholder>
        </Section>

        <Section label="Approach" title="How I got there">
          <ol className="grid gap-4 sm:grid-cols-3">
            {["Understand", "Explore", "Refine"].map((step, i) => (
              <li key={step} className="rounded-2xl border border-border bg-surface p-6">
                <p className="type-label text-ink-subtle">0{i + 1}</p>
                <p className="type-h4 mt-3 text-ink-primary">{step}</p>
                <p className="type-body-s mt-2 text-ink-secondary">Placeholder: what happened in this phase.</p>
              </li>
            ))}
          </ol>
        </Section>

        <Section label="Designs" title="Key screens">
          {study.media.kind === "phones" ? (
            <div className="relative h-[520px] rounded-3xl bg-sage-pale sm:h-[640px] lg:h-[760px]">
              <PhonePair media={study.media} className="absolute inset-y-[7%] left-1/2 -translate-x-1/2" />
            </div>
          ) : (
            <div className={`rounded-3xl p-4 sm:p-8 lg:p-12 ${dark ? "bg-ink-primary" : "bg-sage-pale"}`}>
              <Screen src={study.media.screens[0]} alt={study.media.alt[0]} frame={study.media.frame} />
            </div>
          )}
          <Placeholder>Placeholder: walk through the key screens and the decisions behind them.</Placeholder>
        </Section>

        <Section label="Outcome" title="Impact">
          <ul className="grid gap-4 sm:grid-cols-3">
            <li className="rounded-2xl bg-sage p-6">
              <p className="type-h4 text-forest">{study.note.join(" ")}</p>
            </li>
            {["Metric", "Metric"].map((label, i) => (
              <li key={i} className="rounded-2xl border border-dashed border-border bg-surface p-6">
                <p className="type-h4 text-ink-subtle">{label}</p>
                <p className="type-body-s mt-2 text-ink-subtle">Placeholder: add a result.</p>
              </li>
            ))}
          </ul>
          <Placeholder>Placeholder: results, what I learned, and what I’d do next.</Placeholder>
        </Section>

        {next && (
          <a
            href={studyHref(next.slug)}
            className="group mb-24 mt-4 flex items-center justify-between gap-6 rounded-3xl border border-border bg-surface px-6 py-8 transition-colors hover:bg-sage-pale sm:px-10"
          >
            <span>
              <span className="type-label block uppercase tracking-[0.24em] text-ink-subtle">Next case study</span>
              <span className="type-h2 mt-2 block text-ink-primary">{next.title}</span>
            </span>
            <span aria-hidden="true" className="type-h4 text-ink-primary transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
        )}
      </main>
    </div>
  );
}
