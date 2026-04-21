"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useCart } from "@/components/CartProvider";
import { useTheme } from "next-themes";

const navLinks = [
  { href: "/", label: "Start" },
  { href: "/furniture", label: "Möbel" },
  { href: "/contact", label: "Kontakt" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-[1.05rem] w-[1.05rem]">
      <path d="M3 5h2l1.2 7.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L18.5 7H7.2" />
      <circle cx="9.2" cy="18.2" r="1.5" />
      <circle cx="16.8" cy="18.2" r="1.5" />
    </svg>
  );
}

function ThemeIcon({ dark }: { dark: boolean }) {
  if (dark) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-[1.05rem] w-[1.05rem]"
      >
        <path d="M12 3.8v1.9M12 18.3v1.9M5.6 5.6 7 7M17 17l1.4 1.4M3.8 12h1.9M18.3 12h1.9M5.6 18.4 7 17M17 7l1.4-1.4" />
        <circle cx="12" cy="12" r="4.1" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-[1.05rem] w-[1.05rem]"
    >
      <path d="M20.2 14.1A7.9 7.9 0 1 1 9.9 3.8a6.5 6.5 0 0 0 10.3 10.3Z" />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isContactPage = pathname === "/contact";
  const showCart = pathname.startsWith("/furniture/");
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 767px)").matches : false,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [floating, setFloating] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const { itemCount, toggleCart } = useCart();
  const { resolvedTheme, setTheme } = useTheme();
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const isDarkMode = resolvedTheme === "dark";

  const resetNavbarState = () => {
    setFloating(false);
    setHidden(false);
    setScrolled(isMobile);
    setIsOpen(false);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (isMobile) {
      setFloating(false);
      setHidden(false);
      setScrolled(true);
      return;
    }

    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(isHomePage ? latest > 14 : true);
    
    if (!isHomePage) {
      if (latest <= 24) {
        // setFloating(false);
        setHidden(false);
        return;
      }

      if (isContactPage || isOpen) {
        setFloating(true);
        setHidden(false);
        return;
      }

      if (latest < previous && latest > 80) {
        setFloating(true);
        setHidden(false);
        return;
      }

      if (latest > previous && latest > 80) {
        setFloating(true);
        setHidden(true);
        return;
      }

      return;
    }

    if (isContactPage || isOpen) {
      setHidden(false);
      return;
    }

    if (latest > previous && latest > 140) {
      setHidden(true);
      return;
    }

    setHidden(false);
  });

  const showContainedNavbar = isMobile ? true : isHomePage ? scrolled || isOpen : true;
  const useFixedNavbar = isMobile ? true : isHomePage || floating;
  const animateHidden = !isMobile && useFixedNavbar && hidden;

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: animateHidden ? -96 : 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={isMobile ? { paddingTop: "env(safe-area-inset-top)" } : undefined}
      className={`inset-x-0 top-0 z-50 ${useFixedNavbar ? "fixed" : "absolute"}`}
    >
      <motion.div
        animate={{
          width: showContainedNavbar ? "min(80rem, calc(100% - 2rem))" : "100%",
          paddingTop: showContainedNavbar ? 16 : 0,
        }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto"
      >
        <motion.nav
          animate={{
            borderColor: showContainedNavbar ? "rgba(255, 255, 255, 0.16)" : "rgba(255, 255, 255, 0.02)",
            boxShadow: showContainedNavbar
              ? "0 18px 40px rgba(0, 0, 0, 0.22)"
              : "0 0 0 rgba(0, 0, 0, 0)",
            borderRadius: showContainedNavbar ? "1rem" : "0rem",
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative overflow-hidden border"
        >
          <motion.div
            aria-hidden="true"
            animate={{
              backgroundColor: showContainedNavbar
                ? "rgba(10, 10, 10, 0.68)"
                : "rgba(10, 10, 10, 0.22)",
            }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="pointer-events-none absolute inset-0 backdrop-blur-xl"
          />

          <div className="relative z-10 flex h-14 items-center justify-between px-4 md:h-16 md:px-5 lg:px-6">
            <Link
              href="/"
              onClick={resetNavbarState}
              className="text-[1.7rem] font-bold tracking-tight text-color-gradient"
            >
              Tamas
            </Link>

            <div className="hidden items-center gap-2 md:flex">
              {navLinks.map((link) => {
                const active = isActivePath(pathname, link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={link.href === "/" ? resetNavbarState : undefined}
                    className={`relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                      active ? "text-white" : "text-white/72 hover:text-white"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="navbar-active-pill"
                        className="absolute inset-0 rounded-full bg-white/12"
                        transition={{ type: "spring", stiffness: 340, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}

              {showCart && (
                <button
                  type="button"
                  onClick={toggleCart}
                  className="relative ml-1 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white/80 transition hover:bg-white/12 hover:text-white"
                  aria-label="Warenkorb öffnen"
                >
                  <CartIcon />
                  {itemCount > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 inline-flex min-w-5 items-center justify-center rounded-full bg-secondary px-1.5 py-0.5 text-[0.64rem] font-semibold text-white shadow-[0_6px_16px_rgba(0,0,0,0.18)]">
                      {itemCount}
                    </span>
                  )}
                </button>
              )}

              {isClient && (
                <button
                  type="button"
                  onClick={() => setTheme(isDarkMode ? "light" : "dark")}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white/80 transition hover:bg-white/12 hover:text-white"
                  aria-label={isDarkMode ? "Hellen Modus aktivieren" : "Dunklen Modus aktivieren"}
                >
                  <ThemeIcon dark={isDarkMode} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 md:hidden">
              {isClient && (
                <button
                  type="button"
                  onClick={() => setTheme(isDarkMode ? "light" : "dark")}
                  className="flex h-10 w-10 touch-manipulation items-center justify-center rounded-full border border-white/12 bg-white/6 text-white"
                  aria-label={isDarkMode ? "Hellen Modus aktivieren" : "Dunklen Modus aktivieren"}
                >
                  <ThemeIcon dark={isDarkMode} />
                </button>
              )}

              {showCart && (
                <button
                  type="button"
                  onClick={toggleCart}
                  className="relative flex h-10 w-10 touch-manipulation items-center justify-center rounded-full border border-white/12 bg-white/6 text-white"
                  aria-label="Warenkorb öffnen"
                >
                  <CartIcon />
                  {itemCount > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 inline-flex min-w-5 items-center justify-center rounded-full bg-[var(--primary)] px-1.5 py-0.5 text-[0.64rem] font-semibold text-white shadow-[0_6px_16px_rgba(0,0,0,0.18)]">
                      {itemCount}
                    </span>
                  )}
                </button>
              )}

              <button
                type="button"
                aria-label={isOpen ? "Navigation schliessen" : "Navigation offnen"}
                aria-expanded={isOpen}
                onClick={() => setIsOpen((open) => !open)}
                className="relative flex h-10 w-10 touch-manipulation items-center justify-center rounded-full border border-white/12 bg-white/6 text-white"
              >
                <motion.span
                  animate={isOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }}
                  className="absolute h-[1.5px] w-4 rounded-full bg-current"
                />
                <motion.span
                  animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                  className="absolute h-[1.5px] w-4 rounded-full bg-current"
                />
                <motion.span
                  animate={isOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }}
                  className="absolute h-[1.5px] w-4 rounded-full bg-current"
                />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isOpen && (
              <>
                <motion.button
                  type="button"
                  aria-label="Navigation schliessen"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  onClick={() => setIsOpen(false)}
                  className="fixed inset-0 z-40 bg-black/24 backdrop-blur-[2px] md:hidden"
                />
                <motion.div
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="relative z-50 border-t border-white/10 md:hidden"
                >
                  <div className="flex flex-col gap-2 px-4 py-4">
                    {navLinks.map((link, index) => {
                      const active = isActivePath(pathname, link.href);

                      return (
                        <motion.div
                          key={link.href}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ delay: 0.04 * index, duration: 0.22 }}
                        >
                          <Link
                            href={link.href}
                            onClick={() => {
                              if (link.href === "/") {
                                resetNavbarState();
                                return;
                              }

                              setIsOpen(false);
                            }}
                            className={`flex touch-manipulation items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium ${
                              active
                                ? "bg-white/12 text-white"
                                : "text-white/74 hover:bg-white/8 hover:text-white"
                            }`}
                          >
                            <span>{link.label}</span>
                            {active && <span className="h-2 w-2 rounded-full bg-primary" />}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </motion.nav>
      </motion.div>
    </motion.header>
  );
}
