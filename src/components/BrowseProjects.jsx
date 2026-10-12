import { caseStudies, studyHref } from "../data/caseStudies";

/* The foot of every case study: all four projects, with the one being read
   marked rather than hidden — so the set is always visible and you can see
   where you are in it. */

export default function BrowseProjects({ currentSlug }) {
  return (
    <section aria-labelledby="browse-projects" className="mt-6 border-t border-border pt-12">
      <h2 id="browse-projects" className="font-serif text-ink-primary [font-size:clamp(26px,2.4vw,34px)]">
        Browse other projects
      </h2>

      <ul className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {caseStudies.map((study) => {
          const current = study.slug === currentSlug;
          return (
            <li key={study.slug}>
              <a
                href={studyHref(study.slug)}
                aria-current={current ? "page" : undefined}
                className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-surface transition duration-300 ${
                  current
                    ? "border-forest ring-1 ring-forest"
                    : "border-border hover:-translate-y-1 hover:shadow-[0_2px_6px_rgba(24,32,30,0.06),0_22px_40px_-26px_rgba(24,32,30,0.45)]"
                }`}
              >
                <span className="relative block h-28 overflow-hidden" style={{ backgroundColor: study.theme.card }}>
                  <img
                    src={study.media.bg}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </span>

                <span className="flex flex-1 flex-col p-4">
                  <span className="type-label uppercase tracking-[0.2em] text-ink-subtle">{study.tags[study.tags.length - 1]}</span>
                  <span className="mt-1.5 block font-serif text-ink-primary [font-size:clamp(18px,1.5vw,21px)]">{study.title}</span>
                  <span className="type-body-s mt-1.5 block text-ink-secondary">{study.description}</span>

                  <span className="mt-auto pt-4">
                    {current ? (
                      <span className="type-label inline-flex items-center gap-2 rounded-full bg-sage-pale px-3 py-1.5 text-forest">
                        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-forest" />
                        You’re reading this
                      </span>
                    ) : (
                      <span className="type-body-s inline-flex items-center gap-2 font-medium text-ink-primary">
                        Read case study
                        <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </span>
                    )}
                  </span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
