"use client";

import Image from "next/image";
import Link from "next/link";
import { DM_Serif_Display } from "next/font/google";
import { motion } from "framer-motion";

interface HeroProductProps {
  title: string;
  title2: string;
  imageSrc: string;
  ctaHref?: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.85,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const heroSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
});

const INTRO_DELAY = 0;

export default function HeroProduct({
  title,
  title2,
  imageSrc,
  ctaHref = "/furniture",
}: HeroProductProps) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <motion.div
        initial={{ scale: 1.04, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <Image
          src={imageSrc}
          alt={`${title} ${title2}`}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_50%,transparent_0%,rgba(0,0,0,0.16)_36%,rgba(0,0,0,0.72)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.74)_0%,rgba(0,0,0,0.45)_34%,rgba(0,0,0,0.08)_64%,rgba(0,0,0,0.02)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_20%,rgba(216,153,110,0.12),transparent_28%)]" />

      <div className="relative z-10 flex h-full flex-col justify-between px-5 pb-6 pt-24 md:px-10 md:pb-8 md:pt-28 lg:px-16 lg:pb-10">
        <motion.div
          initial="hidden"
          animate="visible"
          className="mt-auto max-w-4xl text-left"
        >
          <motion.div custom={INTRO_DELAY} variants={fadeUp}>
            <h1
              className={`${heroSerif.className} text-color-gradient text-[clamp(4.25rem,10vw,7.45rem)]! leading-[0.84] tracking-[0.01em]`}
            >
              {title}
            </h1>
          </motion.div>

          <motion.div custom={INTRO_DELAY + 0.14} variants={fadeUp}>
            <h1 className="text-shadow text-[clamp(2.6rem,6.8vw,5.1rem)]! font-black leading-[0.92] tracking-[-0.04em] text-white">
              {title2}
            </h1>
          </motion.div>

          <motion.div
            custom={INTRO_DELAY + 0.28}
            variants={fadeUp}
            className="mt-2 max-w-md pl-1"
          >
            <p className="text-sm leading-6 text-white/72 md:text-base">
              Massivholz, ruhige Proportionen und eine klare Formsprache fur
              einen Auftritt, der prazise und hochwertig wirkt.
            </p>
          </motion.div>

          <motion.div
            custom={INTRO_DELAY + 0.4}
            variants={fadeUp}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="mt-7 ml-1"
          >
            <Link
              href={ctaHref}
              className="group inline-flex items-center gap-3 rounded-full border border-white/14 bg-white/8 px-5 py-3 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/12"
            >
              <span className="tracking-[0.01em]">Jetzt Entdecken</span>
              <span
                aria-hidden="true"
                className="text-sm leading-none text-white/58 transition duration-300 group-hover:translate-x-0.5 group-hover:text-white"
              >
                →
              </span>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: INTRO_DELAY + 0.55, duration: 0.8, ease: "easeOut" }}
          className="mx-auto mt-8 flex flex-col items-center justify-center gap-3"
        >
          <p className="text-xs tracking-[0.38rem] text-white/78 uppercase">
            Mehr entdecken
          </p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
            className="relative h-7 w-7"
          >
            <Image
              src="/svg/arrow_down.svg"
              alt="Nach unten scrollen"
              fill
              sizes="28px"
              className="object-contain brightness-0 invert"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
