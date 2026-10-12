import { caseStudies, studyHref } from "../data/caseStudies";

/* The foot of every case study: the other three projects, as cards.

   They echo the home page's stacking cards — same rounded corners, same hairline
   ring — just smaller, so arriving here from the home page feels like meeting
   the same objects again.

   The one being read is left out rather than marked: you are already on it, and
   a card pointing at the current page is a dead end. */

export default function BrowseProjects({ currentSlug }) {
  const others = caseStudies.filter((study) => study.slug !== currentSlug);

  return (
    <section aria-labelledby="browse-projects" className="border-t border-border pt-12">
      <h2 id="browse-projects" className="font-serif text-[20px] font-semibold leading-[28px] text-ink-primary">
        Browse other projects
      </h2>

      {/* One surface for all three. Per-project colours made the row read as
          three unrelated objects; a single warm off-white lets the artwork
          carry the difference and keeps the type in one tone. */}
      <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {others.map((study) => (
          <li key={study.slug}>
            <a
              href={studyHref(study.slug)}
              className="group flex h-full flex-col overflow-hidden rounded-3xl bg-surface ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_2px_8px_rgba(24,32,30,0.08),0_22px_44px_-26px_rgba(24,32,30,0.45)] motion-reduce:transition-none"
            >
              {/* the project's own colour stays behind its artwork, so the
                  image still has a ground of its own while it loads */}
              <span className="block overflow-hidden" style={{ backgroundColor: study.theme.card }}>
                <img
                  src={study.media.bg}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="h-[168px] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                />
              </span>

              <span className="flex flex-1 flex-col p-5">
                <span className="font-serif text-[18px] font-semibold leading-[24px] text-ink-primary">{study.title}</span>
                <span className="mt-1.5 block text-[13px] leading-[20px] text-ink-secondary">{study.description}</span>

                <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[13px] font-medium text-ink-primary">
                  View
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none">
                    →
                  </span>
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
