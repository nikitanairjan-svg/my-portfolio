/* Shared header for home-page sections, so every section title matches:
   optional eyebrow, Display/L title, Body/L subtitle, then a fixed gap before
   the section content. The pieces are exported too, for sections that pin the
   title while the eyebrow scrolls away (Case studies). */

export function SectionEyebrow({ children }) {
  return <p className="type-label mb-4 uppercase tracking-[0.24em] text-ink-secondary">{children}</p>;
}

export function SectionTitle({ title, subtitle }) {
  return (
    <>
      <h2 className="type-display">{title}</h2>
      {/* One line from tablet width up; phones are too narrow, so it wraps there. */}
      <p className="type-body-l mt-4 text-ink-secondary md:whitespace-nowrap">{subtitle}</p>
    </>
  );
}

export default function SectionHeader({ as: Tag = "header", eyebrow, title, subtitle, children, ...rest }) {
  return (
    <Tag className="mb-12 lg:mb-16" {...rest}>
      {eyebrow && <SectionEyebrow>{eyebrow}</SectionEyebrow>}
      <SectionTitle title={title} subtitle={subtitle} />
      {children}
    </Tag>
  );
}
