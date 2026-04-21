"use client";

import Image from "next/image";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Product } from "@/lib/furnitureCatalog";

type CartItem = {
  product: Product;
  quantity: number;
  price: number;
};

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  subtotal: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, price?: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "nordtal-cart";

function formatPrice(value: number) {
  return new Intl.NumberFormat("de-AT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function AnimatedPrice({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const motionValue = useMotionValue(value);
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    });

    return () => {
      controls.stop();
    };
  }, [motionValue, value]);

  useMotionValueEvent(motionValue, "change", (latest) => {
    setDisplayValue(latest);
  });

  return <p className={className}>{formatPrice(Math.round(displayValue))}</p>;
}

function CartIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={className}>
      <path d="M3 5h2l1.2 7.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L18.5 7H7.2" />
      <circle cx="9.2" cy="18.2" r="1.5" />
      <circle cx="16.8" cy="18.2" r="1.5" />
    </svg>
  );
}

function CartDrawer({
  items,
  isOpen,
  subtotal,
  itemCount,
  closeCart,
  updateQuantity,
  removeItem,
}: {
  items: CartItem[];
  isOpen: boolean;
  subtotal: number;
  itemCount: number;
  closeCart: () => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
}) {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCart();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeCart, isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Warenkorb schliessen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={closeCart}
            className="fixed inset-0 z-[75] bg-black/30 backdrop-blur-[2px]"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-[80] flex w-full max-w-md flex-col border-l border-black/8 bg-[rgba(255,255,255,0.88)] shadow-[-18px_0_48px_rgba(0,0,0,0.12)] backdrop-blur-2xl dark:border-white/10 dark:bg-[rgba(16,12,10,0.8)]"
          >
            <div className="flex items-center justify-between border-b border-black/8 px-5 py-5 dark:border-white/10 sm:px-6">
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22rem] text-black/40 dark:text-white/40">
                  Warenkorb
                </p>
                <p className="mt-1 text-sm text-black/58 dark:text-white/58">
                  {itemCount} {itemCount === 1 ? "Artikel" : "Artikel"}
                </p>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/72 text-black/64 transition hover:border-black/18 hover:text-black dark:border-white/10 dark:bg-white/[0.06] dark:text-white/64 dark:hover:border-white/18 dark:hover:text-white"
                aria-label="Warenkorb schliessen"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-black/8 bg-white/72 text-black/42 dark:border-white/10 dark:bg-white/[0.06] dark:text-white/42">
                    <CartIcon className="h-7 w-7" />
                  </div>
                  <p className="mt-5 text-lg font-semibold text-black/72 dark:text-white/76">
                    Dein Warenkorb ist leer
                  </p>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-black/52 dark:text-white/54">
                    Füge Produkte aus der Kollektion hinzu, um deine Auswahl gesammelt zu sehen.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="rounded-[1.4rem] border border-black/8 bg-white/72 p-3 shadow-[0_10px_28px_rgba(0,0,0,0.05)] dark:border-white/10 dark:bg-white/[0.055]"
                    >
                      <div className="flex gap-3">
                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[1rem]">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-[0.98rem] font-semibold tracking-[-0.02em] text-black dark:text-white">
                                {item.product.name}
                              </p>
                              <p className="mt-1 text-xs leading-5 text-black/52 dark:text-white/54">
                                {item.product.summary}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeItem(item.product.id)}
                              className="text-xs font-medium uppercase tracking-[0.12rem] text-black/40 transition hover:text-black dark:text-white/40 dark:hover:text-white"
                            >
                              Entfernen
                            </button>
                          </div>

                          <div className="mt-4 flex items-end justify-between gap-3">
                            <div className="inline-flex items-center rounded-full border border-black/10 bg-white/78 dark:border-white/10 dark:bg-white/[0.06]">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="h-9 w-9 text-lg text-black/62 transition hover:text-black dark:text-white/62 dark:hover:text-white"
                                aria-label="Menge verringern"
                              >
                                −
                              </button>
                              <span className="min-w-8 text-center text-sm font-medium text-black/72 dark:text-white/72">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="h-9 w-9 text-lg text-black/62 transition hover:text-black dark:text-white/62 dark:hover:text-white"
                                aria-label="Menge erhöhen"
                              >
                                +
                              </button>
                            </div>

                            <div className="text-right">
                              <p className="text-[0.72rem] uppercase tracking-[0.14rem] text-black/38 dark:text-white/40">
                                Summe
                              </p>
                              <AnimatedPrice
                                value={item.price * item.quantity}
                                className="mt-1 text-[1.02rem] font-semibold text-secondary"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-black/8 px-5 py-5 dark:border-white/10 sm:px-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[0.72rem] uppercase tracking-[0.16rem] text-black/40 dark:text-white/40">
                    Zwischensumme
                  </p>
                  <AnimatedPrice
                    value={subtotal}
                    className="mt-1 text-[1.7rem] font-semibold tracking-[-0.03em] text-secondary"
                  />
                </div>
                <button
                  type="button"
                  disabled={items.length === 0}
                  className="rounded-full bg-black px-5 py-3 text-[0.76rem] font-semibold uppercase tracking-[0.16rem] text-white transition enabled:hover:bg-black/88 disabled:cursor-not-allowed disabled:bg-black/18 dark:bg-white dark:text-[#16110d] dark:enabled:hover:bg-white/88 dark:disabled:bg-white/18"
                >
                  Zur Anfrage
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as CartItem[];
      setItems(parsed);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((open) => !open), []);

  const addItem = useCallback((product: Product, price = product.price) => {
    setItems((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1, price }
            : item,
        );
      }

      return [...current, { product, quantity: 1, price }];
    });
    setIsOpen(true);
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    setItems((current) =>
      current
        .map((item) =>
          item.product.id === productId ? { ...item, quantity } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const removeItem = useCallback((productId: number) => {
    setItems((current) => current.filter((item) => item.product.id !== productId));
  }, []);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      isOpen,
      itemCount,
      subtotal,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      updateQuantity,
      removeItem,
    }),
    [
      items,
      isOpen,
      itemCount,
      subtotal,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      updateQuantity,
      removeItem,
    ],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer
        items={items}
        isOpen={isOpen}
        itemCount={itemCount}
        subtotal={subtotal}
        closeCart={closeCart}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
      />
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
