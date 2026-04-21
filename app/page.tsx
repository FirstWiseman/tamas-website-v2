import Image from "next/image";
import Link from "next/link";
import CategoryScroll from "@/components/CategoryScroll";
import HeroProduct from "@/components/HeroProduct";

export default function Home() {
  const categories = [
    {
      id: "bed",
      label: "Betten",
      description: "Reduzierte Schlafsysteme aus Holz mit klaren Linien und warmer Materialwirkung.",
      href: "/furniture/bed",
    },
    {
      id: "table",
      label: "Tische",
      description: "Esstische und Wohnobjekte mit praziser Verarbeitung und ruhiger Proportion.",
      href: "/furniture/table",
    },
    {
      id: "bench",
      label: "Bänke",
      description: "Sitzbänke fur Essbereich, Flur und Wohnraum, robust gebaut und zeitlos gedacht.",
      href: "/furniture/bench",
    },
  ];
 
  return (
    <div className="flex flex-col w-full overflow-x-clip">
      <section className="relative h-[100svh] w-full overflow-hidden">
        <HeroProduct
          title="Wix Tisch"
          title2="Der Oberklasse"
          imageSrc="/images/products/Product11.png"
          ctaHref="/furniture/table?product=wix-tisch"
        />
      </section>
 
      <section className="relative mt-14 w-full px-5 py-24 md:mt-20 md:px-10 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-14 text-center">
          <div className="max-w-3xl">
            {/* <p className="mb-4 text-xs font-semibold uppercase tracking-[0.34rem] text-black/45">
              Katalog
            </p> */}
            <h2>Unsere Produkte</h2>
            {/* <p className="mt-5 text-base leading-7 text-black/68">
              Entdecken Sie die wichtigsten Kollektionen von Tamas. Jede Kategorie
              fuhrt auf eine eigene Produktubersicht, damit Material, Ausfuhrung
              und Varianten konzentriert betrachtet werden konnen.
            </p> */}
          </div>

          <div className="mt-15 flex w-full flex-col items-center justify-center gap-10 md:flex-row md:items-stretch md:gap-0">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className="flex w-full max-w-sm flex-col items-center md:flex-1 md:flex-row md:justify-center"
              >
                <Link
                  href={category.href}
                  className="group flex w-full flex-col items-center gap-6 px-8 py-4 text-center transition-transform duration-300 hover:-translate-y-1 md:px-10"
                >
                  <Image
                    src={`/icons/${category.id}.svg`}
                    alt={`${category.label} Kategorie Icon`}
                    width={84}
                    height={84}
                    className="h-20 w-20 transition duration-300 dark:brightness-0 dark:invert"
                  />
                  <div className="flex flex-col items-center gap-3">
                    <h3 className="text-3xl font-bold tracking-[-0.03em] text-black dark:text-white">
                      {category.label}
                    </h3>
                    <p className="max-w-xs text-sm leading-6 text-black/64 dark:text-white/62">
                      {category.description}
                    </p>
                    <span className="text-xs font-semibold uppercase tracking-[0.22rem] text-black/48 transition-colors group-hover:text-black dark:text-white/46 dark:group-hover:text-white">
                      Zum Katalog
                    </span>
                  </div>
                </Link>

                {index !== categories.length - 1 && (
                  <div className="hidden h-auto w-px self-stretch bg-black/10 dark:bg-white/10 md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
 
      <CategoryScroll />
 
    </div>
  );
}
