/* Shared header for home-page sections, so every section title matches:
   optional eyebrow, Display/L title, Body/L subtitle, then a fixed gap before
   the section content. The pieces are exported too, for sections that pin the
   title while the eyebrow scrolls away (Case studies). */

export function SectionEyebrow({ children }) {
  return (
    <p className="type-label mb-4 flex items-center gap-3 font-medium uppercase tracking-[0.24em] text-forest">
      <span aria-hidden="true" className="h-px w-8 bg-forest/60" />
      {children}
    </p>
  );
}

export function SectionTitle({ title, subtitle }) {
  return (
    <>
      {/* Smaller than the Display style: at 58px these read as page titles
          rather than section heads. */}
      <h2 className="font-serif text-[30px] font-semibold leading-[36px] tracking-[-0.02em] text-ink-primary lg:text-[40px] lg:leading-[46px]">{title}</h2>
      {/* One line from tablet width up; phones are too narrow, so it wraps there. */}
      <p className="mt-3 max-w-[640px] text-[15px] leading-[24px] text-ink-secondary md:max-w-none md:whitespace-nowrap lg:text-[16px] lg:leading-[26px]">{subtitle}</p>
    </>
  );
}

export default function SectionHeader({ as: Tag = "header", eyebrow, title, subtitle, children, ...rest }) {
  return (
    <Tag className="mb-10 lg:mb-12" {...rest}>
      {eyebrow && <SectionEyebrow>{eyebrow}</SectionEyebrow>}
      <SectionTitle title={title} subtitle={subtitle} />
      {children}
    </Tag>
  );
}
