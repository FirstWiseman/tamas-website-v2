"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  catalog,
  categories,
  CategoryKey,
  filterLabels,
  FilterKey,
  Product,
} from "@/lib/furnitureCatalog";
import { useCart } from "@/components/CartProvider";

type ActiveFilters = Record<FilterKey, string | null>;

const emptyFilters = (): ActiveFilters => ({
  kante: null,
  gestell: null,
  lack: null,
  buerstung: null,
});

function formatPrice(value: number) {
  return new Intl.NumberFormat("de-AT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getDiscountedPrice(price: number, discount: number | null) {
  if (!discount) {
    return price;
  }

  return Math.round(price * (1 - discount / 100));
}

const contactCategoryByCategory: Record<CategoryKey, string> = {
  table: "Tisch",
  bench: "Bank",
  bed: "Bett",
};

function buildProductRequestHref(product: Product, category: CategoryKey) {
  const params = new URLSearchParams({
    category: contactCategoryByCategory[category],
    product: product.slug,
    message: [
      `Ich interessiere mich fuer das Produkt "${product.name}".`,
      "",
      `Produkt: ${product.name}`,
      `Preis: ${formatPrice(getDiscountedPrice(product.price, product.discount))}`,
      `Kante: ${product.kante}`,
      `Gestell: ${product.gestell}`,
      `Lack: ${product.lack}`,
      `Buerstung: ${product.buerstung}`,
      "",
      "Meine Anfrage:",
    ].join("\n"),
  });

  return `/contact?${params.toString()}`;
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1 text-[0.68rem] font-medium leading-none transition sm:px-3 sm:py-1.5 sm:text-[0.72rem] ${
        active
          ? "border-black bg-black text-white shadow-[0_10px_24px_rgba(0,0,0,0.12)] dark:border-white dark:bg-white dark:text-[#16110d]"
          : "border-black/8 bg-white/72 text-black/62 hover:border-black/16 hover:bg-white hover:text-black dark:border-white/10 dark:bg-white/[0.055] dark:text-white/62 dark:hover:border-white/18 dark:hover:bg-white/[0.08] dark:hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const hasDiscount = product.discount !== null && product.discount > 0;
  const displayPrice = getDiscountedPrice(product.price, product.discount);

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group relative h-[360px] overflow-hidden rounded-[1.25rem] shadow-[0_4px_20px_rgba(0,0,0,0.09)] transition-shadow duration-300 hover:shadow-[0_24px_64px_rgba(0,0,0,0.18)] sm:h-[320px] lg:h-[300px]"
    >
      <div className="absolute inset-0">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 28vw, (min-width: 768px) 44vw, 100vw"
          className="object-cover transition duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
        />
      </div>

      {hasDiscount && (
        <div className="absolute left-3 top-3 z-10 rounded-full border border-[#f1cb9f]/40 bg-[rgba(120,72,38,0.4)] px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[#f7d6ac] backdrop-blur-md">
          -{product.discount}%
        </div>
      )}

      {product.configurable && (
        <div className="absolute right-3 top-3 z-10 rounded-full border border-white/30 bg-white/18 px-3 py-1 text-[0.62rem] uppercase tracking-widest text-white backdrop-blur-md">
          Konfigurierbar
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-2 border-t border-white/12 bg-[rgba(18,12,8,0.45)] px-3.5 pt-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-[20px] sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:px-4 sm:pt-1.5 rounded-2xl">
        <div className="min-w-0 flex-1">
          <p className="m-0 text-[1.05rem] font-semibold tracking-[-0.01em] text-[#f5eee6]">
            {product.name}
          </p>
          <p className="mt-1 min-h-[2.05rem] max-w-full overflow-hidden text-nowrap text-ellipsis text-[0.72rem] leading-[1.3] text-[rgba(200,185,168,0.85)] sm:min-h-[2.05rem] sm:max-w-[16.5rem] sm:text-[0.68rem] sm:leading-tight">
            {product.summary}
          </p>
        </div>

        <div className="w-full shrink-0 text-left sm:w-[7.75rem] sm:self-end sm:pb-3.5 sm:text-right">
          <p
            className={`m-0 min-h-[1rem] text-[0.78rem] font-medium md:min-h-[1.1rem] md:text-[0.85rem] ${
              hasDiscount ? "text-white/48 line-through" : "opacity-0"
            }`}
          >
            {formatPrice(product.price)}
          </p>
          <p className="m-0 text-[1.22rem] font-bold leading-none text-[#d4a97a] md:text-[1.4rem]">
            {formatPrice(displayPrice)}
          </p>
          <p className="mt-1 text-[0.6rem] tracking-[0.03em] text-[rgba(160,148,134,0.75)]">
            Klicke fur mehr
          </p>
        </div>
      </div>
    </motion.article>
  );
}

function ProductModal({
  product,
  category,
  onClose,
}: {
  product: Product;
  category: CategoryKey;
  onClose: () => void;
}) {
  const hasDiscount = product.discount !== null && product.discount > 0;
  const displayPrice = getDiscountedPrice(product.price, product.discount);
  const { addItem } = useCart();

  useEffect(() => {
    const scrollY = window.scrollY;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyPosition = document.body.style.position;
    const previousBodyTop = document.body.style.top;
    const previousBodyLeft = document.body.style.left;
    const previousBodyRight = document.body.style.right;
    const previousBodyWidth = document.body.style.width;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.left = previousBodyLeft;
      document.body.style.right = previousBodyRight;
      document.body.style.width = previousBodyWidth;
      window.scrollTo(0, scrollY);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/48 px-3 py-4 backdrop-blur-sm sm:px-4 sm:py-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[1.6rem] border border-white/12 bg-[rgba(20,14,10,0.74)] shadow-[0_28px_80px_rgba(0,0,0,0.34)] backdrop-blur-3xl sm:max-h-[90vh] sm:rounded-4xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/16 bg-white/10 text-white transition hover:bg-white/18 sm:right-4 sm:top-4 sm:h-11 sm:w-11"
          aria-label="Produktansicht schliessen"
        >
          ×
        </button>

        <div className="grid max-h-[90vh] overflow-auto lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative min-h-64 sm:min-h-80 lg:min-h-[38rem]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(min-width: 1024px) 52vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/28 via-transparent to-transparent" />
            {product.configurable && (
              <div className="absolute left-5 top-5 rounded-full border border-white/22 bg-black/24 px-4 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18rem] text-white backdrop-blur-md">
                Konfigurierbar
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between gap-6 p-5 sm:p-6 md:gap-8 md:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.34rem] text-white/46">
                Produktansicht
              </p>
              <h2 className="mt-4 text-[clamp(2.4rem,5vw,4.1rem)] font-bold leading-[0.9] tracking-[-0.05em] text-white">
                {product.name}
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-7 text-white/72 md:text-base">
                {product.summary} Dieses Beispielprodukt zeigt die Richtung der
                Kollektion mit Fokus auf Material, Proportion und handwerkliche
                Ausfuhrung.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Kante", product.kante],
                ["Gestell", product.gestell],
                ["Lack", product.lack],
                ["Bürstung", product.buerstung],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-[1.2rem] border border-white/10 bg-white/6 px-4 py-4"
                >
                  <p className="text-[0.68rem] uppercase tracking-[0.16rem] text-white/42">
                    {label}
                  </p>
                  <p className="mt-2 text-sm font-medium text-white/84">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[0.7rem] uppercase tracking-[0.18rem] text-white/40">
                  Preis
                </p>
                {hasDiscount && (
                  <p className="mt-2 text-sm font-medium text-white/34 line-through">
                    {formatPrice(product.price)}
                  </p>
                )}
                <p className="mt-1 text-[1.8rem] font-bold text-[#d4a97a]">
                  {formatPrice(displayPrice)}
                </p>
                {hasDiscount && (
                  <p className="mt-2 text-[0.68rem] font-semibold uppercase tracking-[0.18rem] text-[#e1b582]">
                    {product.discount}% Rabatt
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => addItem(product, displayPrice)}
                  className="w-full rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/88 sm:w-auto"
                >
                  In den Warenkorb
                </button>
                <Link
                  href={buildProductRequestHref(product, category)}
                  className="w-full rounded-full border border-white/14 bg-white/8 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/14 sm:w-auto"
                >
                  Anfragen
                </Link>
                {product.configurable && (
                  <button
                    type="button"
                    className="w-full rounded-full border border-white/18 bg-transparent px-5 py-3 text-sm font-medium text-white transition hover:bg-white/8 sm:w-auto"
                  >
                    Konfigurieren
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function FurnitureCatalogView({
  category,
}: {
  category: CategoryKey;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(emptyFilters());

  const activeMeta = categories[category];
  const activeProducts = catalog[category];

  const filterOptions = useMemo(() => {
    return (Object.keys(filterLabels) as FilterKey[]).map((key) => ({
      key,
      label: filterLabels[key],
      options: Array.from(new Set(activeProducts.map((product) => product[key]))),
    }));
  }, [activeProducts]);

  const filteredProducts = useMemo(() => {
    return activeProducts.filter((product) =>
      (Object.keys(activeFilters) as FilterKey[]).every((key) => {
        const active = activeFilters[key];
        return !active || product[key] === active;
      }),
    );
  }, [activeFilters, activeProducts]);

  const selectedProductSlug = (() => {
    const productParam = searchParams.get("product");
    if (!productParam) return null;
    return productParam;
  })();

  const selectedProduct =
    filteredProducts.find((product) => product.slug === selectedProductSlug) ?? null;

  const hasActiveFilters = Object.values(activeFilters).some(Boolean);
  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  const setFilter = (key: FilterKey, value: string | null) => {
    setActiveFilters((current) => ({
      ...current,
      [key]: current[key] === value ? null : value,
    }));
  };

  const resetFilters = () => {
    setActiveFilters(emptyFilters());
  };

  const updateProductQuery = (productSlug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (productSlug === null) {
      params.delete("product");
    } else {
      params.set("product", productSlug);
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const openProductModal = (productSlug: string) => {
    updateProductQuery(productSlug);
  };

  const closeProductModal = () => {
    updateProductQuery(null);
  };

  return (
    <div className="min-h-screen w-full px-4 pb-14 pt-24 sm:px-5 sm:pb-16 sm:pt-28 md:px-10 lg:px-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-6 overflow-hidden rounded-[2rem] border border-black/8 bg-white/58 p-5 shadow-[0_18px_44px_rgba(0,0,0,0.08)] backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.055] sm:p-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:rounded-[2.25rem] lg:p-8"
        >
          <div className="flex flex-col justify-between gap-6 lg:gap-8">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.34rem] text-black/42 dark:text-white/40">
                {activeMeta.eyebrow}
              </p>
              <h1 className="text-color-gradient text-[clamp(2.6rem,14vw,5.7rem)] font-black leading-[0.9] tracking-[-0.05em]">
                {activeMeta.label}
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-black/68 dark:text-white/64 sm:mt-5 sm:text-base sm:leading-7">
                {activeMeta.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              {(Object.entries(categories) as [CategoryKey, (typeof categories)[CategoryKey]][]).map(
                ([key, item]) => {
                  const selected = key === category;

                  return (
                    <Link
                      key={key}
                      href={`/furniture/${key}`}
                      className={`rounded-full px-4 py-2 text-[0.78rem] font-medium transition sm:px-5 sm:py-2.5 sm:text-sm ${
                        selected
                          ? "bg-black text-white dark:bg-white dark:text-[#16110d]"
                          : "border border-black/10 bg-white/65 text-black/70 hover:bg-white dark:border-white/10 dark:bg-white/[0.055] dark:text-white/70 dark:hover:bg-white/[0.08]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                },
              )}
            </div>
          </div>

          <motion.div
            key={category}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="relative min-h-64 overflow-hidden rounded-[1.4rem] sm:min-h-80 sm:rounded-[1.8rem]"
          >
            <Image
              src={activeMeta.heroImage}
              alt={activeMeta.label}
              fill
              priority
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-tr from-black/26 via-transparent to-white/6" />
          </motion.div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-[1.45rem] border border-black/8 bg-white/52 p-3.5 shadow-[0_12px_32px_rgba(0,0,0,0.05)] backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.045] sm:rounded-[1.8rem] sm:p-4 md:p-5"
        >
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-col items-start gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.26rem] text-black/42 dark:text-white/40">
                  Filter
                </span>
                <span className="rounded-full border border-black/8 bg-white/72 px-3 py-1 text-[0.68rem] font-medium text-black/52 dark:border-white/10 dark:bg-white/[0.055] dark:text-white/52">
                  {hasActiveFilters ? `${activeFilterCount} aktiv` : "Alle Produkte"}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-black/8 bg-white/72 px-3 py-1 text-[0.68rem] font-medium text-black/52 dark:border-white/10 dark:bg-white/[0.055] dark:text-white/52">
                  {filteredProducts.length} {filteredProducts.length === 1 ? "Produkt" : "Produkte"}
                </span>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="rounded-full border border-black/10 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14rem] text-black/52 transition hover:border-black/16 hover:bg-white dark:border-white/10 dark:text-white/52 dark:hover:border-white/18 dark:hover:bg-white/[0.08]"
                  >
                    Zurücksetzen
                  </button>
                )}
              </div>
            </div>

            <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-4">
              {filterOptions.map((group) => (
                <div
                  key={group.key}
                  className="rounded-[1rem] border border-black/8 bg-white/68 px-2.5 py-2.5 shadow-[0_8px_20px_rgba(0,0,0,0.04)] dark:border-white/10 dark:bg-white/[0.055] sm:rounded-[1.25rem] sm:px-3 sm:py-3"
                >
                  <div className="mb-2 flex items-center justify-between gap-2 sm:mb-3">
                    <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16rem] text-black/42 dark:text-white/40">
                      {group.label}
                    </span>
                    <span
                      className={`h-2 w-2 rounded-full transition ${
                        activeFilters[group.key] ? "bg-secondary" : "bg-black/10 dark:bg-white/10"
                      }`}
                    />
                  </div>

                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    <FilterChip
                      label="Alle"
                      active={activeFilters[group.key] === null}
                      onClick={() => setFilter(group.key, null)}
                    />
                    {group.options.map((option) => (
                      <FilterChip
                        key={option}
                        label={option}
                        active={activeFilters[group.key] === option}
                        onClick={() => setFilter(group.key, option)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <AnimatePresence mode="wait">
          <motion.section
            key={`${category}-${JSON.stringify(activeFilters)}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => openProductModal(product.slug)}
                  className="cursor-pointer text-left"
                >
                  <ProductCard product={product} index={index} />
                </button>
              ))
            ) : (
              <div className="col-span-full rounded-[1.8rem] border border-dashed border-black/10 bg-white/42 px-6 py-20 text-center backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.035]">
                <p className="text-xl font-semibold text-black/72 dark:text-white/74">
                  Keine Produkte gefunden
                </p>
                <p className="mt-3 text-sm leading-6 text-black/52 dark:text-white/54">
                  Versuche andere Filteroptionen oder setze die aktuelle Auswahl
                  zuruck.
                </p>
              </div>
            )}
          </motion.section>
        </AnimatePresence>

        <AnimatePresence>
          {selectedProduct && (
            <ProductModal
              product={selectedProduct}
              category={category}
              onClose={closeProductModal}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
