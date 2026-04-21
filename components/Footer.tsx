import type { ReactNode } from "react";
import Link from "next/link";

const navigationLinks = [
  { href: "/", label: "Start" },
  { href: "/furniture", label: "Katalog" },
  { href: "/contact", label: "Kontakt" },
];

const collectionLinks = [
  { href: "/furniture/table", label: "Tische" },
  { href: "/furniture/bench", label: "Bänke" },
  { href: "/furniture/bed", label: "Betten" },
];

const socialLinks = [
  {
    href: "#",
    label: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-7 w-7">
        <path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.6.4-1 1-1Z" />
      </svg>
    ),
  },
  {
    href: "#",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-7 w-7">
        <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.4" cy="6.6" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    href: "#",
    label: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
        <path d="M5.8 8.4A1.4 1.4 0 1 1 5.8 5.6a1.4 1.4 0 0 1 0 2.8ZM4.6 9.8h2.4V19H4.6V9.8ZM10.2 9.8h2.3v1.3h.1c.3-.6 1.1-1.5 2.8-1.5 3 0 3.6 2 3.6 4.5V19h-2.4v-4.3c0-1 0-2.4-1.5-2.4s-1.7 1.1-1.7 2.3V19h-2.4V9.8Z" />
      </svg>
    ),
  },
];

function FooterSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22rem] text-black/38 dark:text-white/40">
        {title}
      </p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-black/8 bg-white/44 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 md:py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.3fr_0.85fr_0.85fr_0.85fr] md:gap-12">
          <div className="max-w-xl">
            <h3 className="text-[1.4rem] font-semibold tracking-[-0.03em] text-black dark:text-white">
              Tamas
            </h3>
            <p className="mt-3 text-[0.98rem] leading-7 text-black/64 dark:text-white/62">
              Individuell gefertigte Holztische und Möbel aus Meisterhand.
            </p>
          </div>

          <FooterSection title="Navigation">
            <div className="flex flex-col gap-3">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[0.96rem] text-black/62 transition hover:text-black dark:text-white/62 dark:hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </FooterSection>

          <FooterSection title="Kollektion">
              <div className="flex flex-col gap-3">
                {collectionLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-[0.96rem] text-black/62 transition hover:text-black dark:text-white/62 dark:hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </FooterSection>

            <FooterSection title="Folge uns">
              <div className="flex items-center gap-3 text-black/72 dark:text-white/72">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    aria-label={link.label}
                    className="transition hover:text-black dark:hover:text-white"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </FooterSection>
        </div>

        <div className="mt-10 border-t border-black/8 pt-4 dark:border-white/10">
          <p className="text-[0.82rem] text-black/42 dark:text-white/42">
            NordTal. Möbel in Meisterhand gefertigt.
          </p>
        </div>
      </div>
    </footer>
  );
}
