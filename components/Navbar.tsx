"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { usePathname } from "next/navigation";
import { link } from "fs/promises";

const Navbar = () => {
  const pathname = usePathname();
  const isConfiguratorPage = pathname === "/configurator";
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (isConfiguratorPage) {
      setHidden(false);
      return;
    }
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const navLinks = [
    { href: "/", label: "Start" },
    { href: "/furniture", label: "Möbel" },
    { href: "/configurator", label: "Kontakt" },
  ];

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="bg-transparent sticky top-0 z-90"
    >
      <div className="container w-full mx-5 px-10">
        <div className="flex justify-between items-center h-16">
          <div className="w-auto min-w-120">
            <Link href="/" className="text-2xl font-bold text-color-gradient">
              Tamas
            </Link>
          </div>
          <div className="hidden md:flex items-end justify-center space-x-15">
            {navLinks.map((_link, index) => (
              <div>
                <Link
                  key={index}
                  href={_link.href}
                  className="text-white hover:text-white/75"
                >
                  {_link.label}
                </Link>
                {pathname.split("/").pop() === _link.href.split("/").pop() && (
                  <div className="w-full h-[0.125rem] bg-primary mt-[0.05rem]"></div>
                )}
              </div>
            ))}
          </div>
          {/* <div className="w-auto min-w-20"></div> */}
          {/* <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div> */}
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </motion.nav>
  );
};

export default Navbar;
