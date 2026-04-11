"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  MotionValue,
  MotionStyle,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useEffectEvent, useRef, useState } from "react";

interface SlideImage {
  src: string;
  alt: string;
}

interface Slide {
  id: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  align: "left" | "right";
  center: SlideImage;
  topRight: SlideImage;
  bottomLeft: SlideImage;
}

const slides: Slide[] = [
  {
    id: "table-1",
    title: "Tische",
    description:
      "Gefertigt aus Massivholz, mit ruhigen Proportionen und einer Oberfläche, die Material und Handwerk in den Vordergrund stellt.",
    cta: "Ansehen",
    href: "/furniture/table",
    align: "right",
    center: {
      src: "/images/home/table1.png",
      alt: "Essbereich mit Massivholztisch",
    },
    topRight: {
      src: "/images/home/table2.png",
      alt: "Detailaufnahme eines Holztischs",
    },
    bottomLeft: {
      src: "/images/products/Product11.png",
      alt: "Holzbank als Ergänzung zum Tisch",
    },
  },
  {
    id: "bench-1",
    title: "Bänke",
    description:
      "Wenn weiter gescrollt wird, wechselt das Hauptbild und die Inszenierung baut sich erneut auf. Genau das passiert hier.",
    cta: "Ansehen",
    href: "/furniture/bench",
    align: "right",
    center: {
      src: "/images/products/Product10.jpg",
      alt: "Langer Tisch mit klarer Linienführung",
    },
    topRight: {
      src: "/images/home/table2.png",
      alt: "Tischkante und Holzmaserung",
    },
    bottomLeft: {
      src: "/images/home/table1.png",
      alt: "Tisch in heller Wohnsituation",
    },
  },
  {
    id: "bed-1",
    title: "Betten",
    description:
      "Reduzierte Sitzmöbel mit robuster Konstruktion. Die Bildstaffel bleibt gleich, aber der Schwerpunkt verschiebt sich in eine neue Produktgruppe.",
    cta: "Ansehen",
    href: "/furniture/bed",
    align: "left",
    center: {
      src: "/images/products/Product8.jpg",
      alt: "Gepolsterte Holzbank im Innenraum",
    },
    topRight: {
      src: "/images/products/Product9.jpg",
      alt: "Detail einer Eckbank aus Holz",
    },
    bottomLeft: {
      src: "/images/products/Product11.png",
      alt: "Bank in warmem Sonnenlicht",
    },
  }
];

const SLIDE_COUNT = slides.length;
const VIEWPORTS_PER_SLIDE = 1.75;
const TOTAL_VH = SLIDE_COUNT * VIEWPORTS_PER_SLIDE + 1;
const PANEL_HEIGHT = "100dvh";

type PanelMode = "start" | "fixed" | "end";

function AnimatedImageFrame({
  image,
  frameClassName,
  priority,
  style,
  floatY,
  floatRotate,
  floatDuration,
  floatDelay = 0,
}: {
  image: SlideImage;
  frameClassName: string;
  priority?: boolean;
  style?: MotionStyle;
  floatY?: [number, number, number];
  floatRotate?: [number, number, number];
  floatDuration?: number;
  floatDelay?: number;
}) {
  return (
    <motion.div
      style={style}
      className={`absolute ${frameClassName}`}
    >
      <motion.div
        animate={
          floatY && floatRotate
            ? { y: floatY, rotate: floatRotate }
            : undefined
        }
        transition={
          floatY && floatRotate && floatDuration
            ? {
                duration: floatDuration,
                delay: floatDelay,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }
            : undefined
        }
        className="h-full w-full"
      >
        <div className="relative h-full w-full overflow-hidden rounded-[1.35rem] bg-neutral-100 shadow-[0_18px_50px_rgba(0,0,0,0.16)]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 38vw, (min-width: 768px) 44vw, 88vw"
            className="object-cover"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

function CategoryLinkButton({
  href,
  label,
  style,
}: {
  href: string;
  label: string;
  style?: MotionStyle;
}) {
  return (
    <motion.div style={style} className="mt-6">
      <Link
        href={href}
        className="group inline-flex items-center gap-2 rounded-full border border-black/12 bg-white/72 px-4 py-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-black/68 backdrop-blur-sm transition duration-300 hover:border-black/22 hover:bg-white hover:text-black"
      >
        <span>{label}</span>
        <span
          aria-hidden="true"
          className="text-sm leading-none text-black/34 transition duration-300 group-hover:translate-x-0.5 group-hover:text-black/72"
        >
          →
        </span>
      </Link>
    </motion.div>
  );
}

export default function CategoryScroll() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [panelMode, setPanelMode] = useState<PanelMode>("start");
  const [activeIndex, setActiveIndex] = useState(0);

  const rawProgress = useMotionValue(0);
  const smooth = useSpring(rawProgress, { stiffness: 70, damping: 24 });

  const syncPanel = useEffectEvent(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const { top, bottom, height } = wrapper.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const scrollable = Math.max(height - viewportHeight, 0);
    const progress =
      scrollable > 0 ? Math.min(1, Math.max(0, -top / scrollable)) : 0;
    const nextMode =
      top > 0 ? "start" : bottom < viewportHeight ? "end" : "fixed";

    rawProgress.set(progress);
    setPanelMode((current) => (current === nextMode ? current : nextMode));
  });

  useEffect(() => {
    let frameId = 0;
    const scheduleSync = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        syncPanel();
      });
    };

    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync);
    scheduleSync();

    return () => {
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  useEffect(() => {
    const updateActiveIndex = (value: number) => {
      const nextIndex = Math.min(
        SLIDE_COUNT - 1,
        Math.max(0, Math.floor(value * SLIDE_COUNT)),
      );

      setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
    };

    updateActiveIndex(smooth.get());
    const unsubscribe = smooth.on("change", updateActiveIndex);

    return () => {
      unsubscribe();
    };
  }, [smooth]);

  const panelStyle =
    panelMode === "fixed"
      ? {
          position: "fixed" as const,
          top: 0,
          left: 0,
          right: 0,
          height: PANEL_HEIGHT,
        }
      : panelMode === "end"
        ? {
            position: "absolute" as const,
            left: 0,
            right: 0,
            bottom: 0,
            height: PANEL_HEIGHT,
          }
        : {
            position: "absolute" as const,
            top: 0,
            left: 0,
            right: 0,
            height: PANEL_HEIGHT,
          };

  return (
    <section
      ref={wrapperRef}
      style={{ height: `${TOTAL_VH * 100}dvh`, position: "relative" }}
      className="w-full"
    >
      <div
        style={panelStyle}
      className="overflow-hidden"
    >
        {slides.map((slide, index) => (
          <SlideLayer
            key={slide.id}
            slide={slide}
            index={index}
            isActive={index === activeIndex}
            total={SLIDE_COUNT}
            smooth={smooth}
          />
        ))}
        <DotsIndicator smooth={smooth} />
      </div>
    </section>
  );
}

function SlideLayer({
  slide,
  index,
  isActive,
  total,
  smooth,
}: {
  slide: Slide;
  index: number;
  isActive: boolean;
  total: number;
  smooth: MotionValue<number>;
}) {
  const start = index / total;
  const end = (index + 1) / total;
  const t = useTransform(smooth, [start, end], [0, 1]);

  const defaultLayerOpacity = useTransform(t, [0, 0.06, 0.94, 1], [0, 1, 1, 0]);
  const firstLayerOpacity = useTransform(t, [0, 0.94, 1], [1, 1, 0]);
  const layerOpacity = index === 0 ? firstLayerOpacity : defaultLayerOpacity;

  const defaultCenterOpacity = useTransform(t, [0.02, 0.18], [0, 1]);
  const firstCenterOpacity = useTransform(t, [0, 0.14], [1, 1]);
  const centerOpacity = index === 0 ? firstCenterOpacity : defaultCenterOpacity;

  const defaultCenterScale = useTransform(t, [0.02, 0.18], [0.92, 1]);
  const firstCenterScale = useTransform(t, [0, 0.16], [1, 1]);
  const centerScale = index === 0 ? firstCenterScale : defaultCenterScale;

  const topRightX = useTransform(t, [0.12, 0.34], [200, 0]);
  const topRightY = useTransform(t, [0.12, 0.34], [-160, 0]);
  const topRightRotate = useTransform(t, [0.12, 0.34], [14, 0]);
  const topRightOpacity = useTransform(t, [0.12, 0.3], [0, 1]);

  const bottomLeftX = useTransform(t, [0.34, 0.58], [-180, 0]);
  const bottomLeftY = useTransform(t, [0.34, 0.58], [150, 0]);
  const bottomLeftRotate = useTransform(t, [0.34, 0.58], [-14, 0]);
  const bottomLeftOpacity = useTransform(t, [0.34, 0.54], [0, 1]);

  const textOpacity = useTransform(t, [0.52, 0.72], [0, 1]);
  const textY = useTransform(t, [0.52, 0.74], [26, 0]);
  const buttonOpacity = useTransform(t, [0.62, 0.8], [0, 1]);
  const buttonY = useTransform(t, [0.62, 0.8], [16, 0]);

  const imageOrder = slide.align === "left" ? "lg:order-2" : "lg:order-1";
  const copyOrder = slide.align === "left" ? "lg:order-1" : "lg:order-2";

  return (
    <motion.article
      style={{ opacity: layerOpacity }}
      aria-hidden={!isActive}
      className={`absolute inset-0 flex items-center justify-center ${
        isActive ? "pointer-events-auto z-20" : "pointer-events-none z-10"
      }`}
    >
      <div className="mx-auto grid h-full w-full max-w-7xl grid-cols-1 items-center gap-10 px-5 py-10 md:px-8 lg:grid-cols-2 lg:gap-16 lg:px-10">
        <div className={`${imageOrder} relative h-[19rem] w-full md:h-[26rem] lg:h-[30rem]`}>
          <AnimatedImageFrame
            image={slide.center}
            priority={index === 0}
            style={{ opacity: centerOpacity, scale: centerScale }}
            frameClassName="left-[7%] top-[10%] h-[62%] w-[78%] md:left-[10%] md:top-[12%] md:h-[64%] md:w-[74%] z-10"
          />

          <AnimatedImageFrame
            image={slide.topRight}
            style={{
              x: topRightX,
              y: topRightY,
              rotate: topRightRotate,
              opacity: topRightOpacity,
            }}
            frameClassName="right-[1%] top-[1%] h-[54%] w-[68%] md:h-[36%] md:w-[46%] z-20"
            floatY={[0, -10, 0]}
            floatRotate={[0, 1.4, 0]}
            floatDuration={3.8}
            floatDelay={0.2}
          />

          <AnimatedImageFrame
            image={slide.bottomLeft}
            style={{
              x: bottomLeftX,
              y: bottomLeftY,
              rotate: bottomLeftRotate,
              opacity: bottomLeftOpacity,
            }}
            frameClassName="bottom-[4%] left-0 h-[51%] w-[56%] md:bottom-[6%] md:h-[33%] md:w-[34%] z-20"
            floatY={[0, -8, 0]}
            floatRotate={[0, -1.3, 0]}
            floatDuration={4.4}
            floatDelay={0.45}
          />
        </div>

        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className={`${copyOrder} mx-auto flex w-full max-w-sm flex-col items-start justify-center text-left`}
        >
          <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-black/45">
            Kollektion
          </p>
          <h2 className="text-color-gradient">{slide.title}</h2>
          <p className="mt-4 max-w-[26rem] text-sm leading-6 text-black/65 md:text-[0.95rem]">
            {slide.description}
          </p>
          <CategoryLinkButton
            href={slide.href}
            label={slide.cta}
            style={{ opacity: buttonOpacity, y: buttonY }}
          />
        </motion.div>
      </div>
    </motion.article>
  );
}

function Dot({
  smooth,
  index,
}: {
  smooth: MotionValue<number>;
  index: number;
}) {
  const start = index / SLIDE_COUNT;
  const end = (index + 1) / SLIDE_COUNT;
  const dotProgress = useTransform(smooth, [start, end], [0, 1]);
  const width = useTransform(dotProgress, [0.08, 0.44], [8, 26]);
  const opacity = useTransform(dotProgress, [0, 0.08, 0.9, 1], [0.25, 1, 1, 0.25]);

  return (
    <motion.div
      style={{ width, opacity }}
      className="h-2 rounded-full bg-primary"
    />
  );
}

function DotsIndicator({ smooth }: { smooth: MotionValue<number> }) {
  return (
    <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2">
      {slides.map((slide, index) => (
        <Dot key={slide.id} smooth={smooth} index={index} />
      ))}
    </div>
  );
}
