import { useEffect, useState } from "react";
import Signature from "./Signature";

const links = [
  { label: "Case studies", id: "work" },
  { label: "How I work", id: "approach" },
  { label: "Contact", id: "contact" },
];

/* The home page header: fixed to the top as a frosted bar, so it stays in
   reach and reads as a header over the pegboard and every section below it.
   The link for the section in view is marked, and the bar firms up (more
   opaque, a hairline and a soft shadow) once the page has scrolled. */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const nodes = links.map((l) => document.getElementById(l.id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
          else setActive((current) => (current === entry.target.id ? null : current));
        }
      },
      // a section counts as current while it crosses the middle band of the screen
      { rootMargin: "-45% 0px -50% 0px" },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      data-native-cursor
      className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl backdrop-saturate-150 transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled
          ? "border-ink-primary/10 bg-wall/75 shadow-[0_8px_24px_-16px_rgba(24,32,30,0.35)]"
          : "border-ink-primary/[0.06] bg-wall/60"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-4 px-4 sm:h-[72px] sm:px-6 lg:px-10">
        <a href="#top" aria-label="Nikita Nair, home" className="-ml-1 shrink-0 text-ink transition-colors hover:text-moss">
          <Signature className="h-auto w-[92px] sm:w-[150px]" title="Nikita Nair" />
        </a>

        <nav aria-label="Main">
          <ul className="flex items-center gap-0.5 sm:gap-2">
            {links.map((link) => {
              const current = active === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    aria-current={current ? "location" : undefined}
                    className={`relative block whitespace-nowrap rounded-full px-2 py-1.5 text-[13px] font-medium transition-colors sm:px-4 sm:py-2 sm:text-[15px] ${
                      current ? "bg-ink-primary/[0.07] text-ink-primary" : "text-ink/75 hover:bg-ink-primary/[0.05] hover:text-ink-primary"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
