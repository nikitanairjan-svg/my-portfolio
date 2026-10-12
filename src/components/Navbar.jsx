const links = ["Work", "About", "Play", "Resume", "Contact"];

export default function Navbar() {
  return (
    <header className="relative z-20 flex items-center justify-between px-6 py-6 sm:px-10 md:px-14 md:py-7 lg:px-16">
      <a
        href="#top"
        className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
      >
        Nikita.
      </a>

      <div className="flex items-center gap-8 md:gap-12">
        <nav className="hidden items-center gap-7 text-[15px] font-medium text-ink/80 md:flex lg:gap-10">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="transition-colors hover:text-moss"
            >
              {link}
            </a>
          ))}
        </nav>

        <span
          aria-hidden="true"
          className="h-9 w-9 flex-shrink-0 rounded-full bg-ink"
        />
      </div>
    </header>
  );
}
