import { motion, useReducedMotion } from "framer-motion";

/* The four-week research timeline, rebuilt in the page's own palette.

   The original is a dark slide dropped into a cream page; at the size it
   renders here its labels are also close to unreadable. This is the same
   content as live type — light ground, design-system colours, real text that
   scales and can be read by a screen reader — with each week easing in as it
   arrives. */

const WEEKS = [
  {
    label: "Week 1",
    items: [
      { name: "Product analysis", note: "Reviewed the existing platform and attended a product demo." },
      { name: "Domain analysis" },
      { name: "Competitive analysis" },
    ],
  },
  {
    label: "Week 2",
    items: [
      { name: "Stakeholder interviews" },
      { name: "User interviews", note: "Conducted 10+ interviews to gather insights." },
      { name: "Persona creation", note: "Created personas for sales reps, operations, pricing strategists and the CEO." },
    ],
  },
  {
    label: "Week 3",
    items: [
      { name: "Feature listing" },
      { name: "Use cases" },
      { name: "User journey", note: "Mapped the end-to-end journey for the new platform experience." },
    ],
  },
  {
    label: "Week 4",
    items: [{ name: "Information architecture" }, { name: "Conclusion document" }],
  },
];

export default function ResearchTimeline() {
  const reduce = useReducedMotion();

  return (
    <figure className="rounded-2xl bg-[#FBF8F2] px-6 py-8 ring-1 ring-border sm:px-8">
      <figcaption className="mb-7">
        <p className="font-serif text-[18px] font-semibold leading-[26px] text-ink-primary">Research Timeline</p>
        <p className="mt-1 text-[13px] leading-[20px] text-ink-secondary">Conducted over a period of one month.</p>
      </figcaption>

      <ol className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {WEEKS.map((week, w) => (
          <motion.li
            key={week.label}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: reduce ? 0 : w * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="relative pl-4"
          >
            {/* the week's spine */}
            <span aria-hidden="true" className="absolute inset-y-1 left-0 w-px border-l border-dashed border-ink-primary/25" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-subtle">{week.label}</p>

            <ul className="mt-4 flex flex-col gap-3.5">
              {week.items.map((item) => (
                <li key={item.name}>
                  <span className="inline-block rounded-full bg-sage-pale px-3 py-1.5 text-[13px] font-medium leading-[18px] text-forest ring-1 ring-forest/15">
                    {item.name}
                  </span>
                  {item.note && <p className="mt-1.5 text-[12px] leading-[17px] text-ink-subtle">{item.note}</p>}
                </li>
              ))}
            </ul>
          </motion.li>
        ))}
      </ol>
    </figure>
  );
}
