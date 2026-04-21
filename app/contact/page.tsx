"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  FormEvent,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type ContactFormState = {
  name: string;
  email: string;
  phone: string;
  category: string;
  message: string;
};

type SubmitStatus = "idle" | "mail-opened" | "copied" | "manual";

const initialFormState: ContactFormState = {
  name: "",
  email: "",
  phone: "",
  category: "Tische",
  message: "",
};

const requestCategories = ["Tisch", "Bank", "Bett", "Allgemeine Anfrage"];
const requestCategorySet = new Set(requestCategories);

const processSteps = [
  {
    step: "01",
    title: "Anfrage senden",
    text: "Sie schicken uns die wichtigsten Informationen zu Format, Einsatzbereich und Materialwünschen.",
  },
  {
    step: "02",
    title: "Rückmeldung erhalten",
    text: "Wir melden uns mit einer ersten Einschätzung, möglichen Ausführungen und dem weiteren Ablauf.",
  },
  {
    step: "03",
    title: "Projekt abstimmen",
    text: "Danach klären wir Details, Masse und Oberflächen, bis das Möbelstück sauber definiert ist.",
  },
];

const requestHints = [
  "Gewünschte Masse oder Raumgrösse",
  "Material- und Oberflächenwunsch",
  "Nutzungsbereich oder Produkttyp",
  "Ungefähre zeitliche Vorstellung",
];

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

function getInitialFormState() {
  if (typeof window === "undefined") {
    return initialFormState;
  }

  const params = new URLSearchParams(window.location.search);
  const categoryParam = params.get("category");
  const messageParam = params.get("message");

  return {
    ...initialFormState,
    category:
      categoryParam && requestCategorySet.has(categoryParam)
        ? categoryParam
        : initialFormState.category,
    message: messageParam ?? initialFormState.message,
  };
}

function InfoCard({
  eyebrow,
  title,
  text,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  text: string;
  align?: "left" | "right";
}) {
  return (
    <div
      className={`rounded-[1.45rem] border border-black/8 bg-white/60 p-5 shadow-[0_14px_32px_rgba(0,0,0,0.05)] backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.055] ${
        align === "right" ? "text-left sm:text-right" : ""
      }`}
    >
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24rem] text-black/38 dark:text-white/38">
        {eyebrow}
      </p>
      <p className="mt-3 text-[1.15rem] font-semibold tracking-[-0.03em] text-black dark:text-white">
        {title}
      </p>
      <p className="mt-2 text-sm leading-6 text-black/62 dark:text-white/62">
        {text}
      </p>
    </div>
  );
}

function ProcessCard({
  step,
  title,
  text,
}: {
  step: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[1.35rem] border border-black/8 bg-white/54 p-5 shadow-[0_12px_28px_rgba(0,0,0,0.04)] backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.05]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22rem] text-black/38 dark:text-white/38">
            Schritt {step}
          </p>
          <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-black dark:text-white">
            {title}
          </p>
        </div>
        <span className="rounded-full border border-[var(--primary)]/16 bg-[var(--primary)]/8 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16rem] text-[var(--primary)]">
          {step}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-black/62 dark:text-white/62">
        {text}
      </p>
    </div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[0.68rem] font-semibold uppercase tracking-[0.2rem] text-black/42 dark:text-white/40">
        {label}
      </span>
      {children}
    </label>
  );
}

function FieldBase({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[1rem] border border-black/10 bg-white/78 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] transition focus-within:border-black/20 focus-within:bg-white dark:border-white/10 dark:bg-white/[0.055] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] dark:focus-within:border-white/18 dark:focus-within:bg-white/[0.075]">
      {children}
    </div>
  );
}

function SelectField({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <FieldBase>
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="group flex w-full items-center justify-between gap-3 rounded-[1rem] px-4 py-2.5 text-left"
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <p className="min-w-0 truncate text-sm text-black dark:text-white/88">{value}</p>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--primary)]/12 bg-[linear-gradient(180deg,rgba(121,68,32,0.06)_0%,rgba(216,153,110,0.14)_100%)] transition group-hover:border-[var(--primary)]/20 group-hover:bg-[linear-gradient(180deg,rgba(121,68,32,0.08)_0%,rgba(216,153,110,0.18)_100%)] dark:border-white/12 dark:bg-white/[0.06] dark:group-hover:bg-white/[0.1]">
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="text-sm leading-none text-[var(--primary)]"
            >
              ⌄
            </motion.span>
          </div>
        </button>
      </FieldBase>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 right-0 top-[calc(100%+0.55rem)] z-30 overflow-hidden rounded-[1.1rem] border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.84)_100%)] p-1.5 shadow-[0_22px_44px_rgba(0,0,0,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(35,26,21,0.96)_0%,rgba(26,19,15,0.92)_100%)]"
          >
            <div className="absolute inset-x-3 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(121,68,32,0.28),transparent)]" />
            <div
              role="listbox"
              aria-label="Anfragekategorie"
              className="relative flex flex-col gap-1"
            >
              {options.map((option) => {
                const active = option === value;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      onChange(option);
                      setOpen(false);
                    }}
                    className={`flex items-center justify-between gap-3 rounded-[0.9rem] px-3 py-2.5 text-left transition ${
                      active
                        ? "bg-[linear-gradient(90deg,rgba(121,68,32,0.12)_0%,rgba(216,153,110,0.12)_100%)] text-black dark:text-white"
                        : "text-black/66 hover:bg-black/[0.035] hover:text-black dark:text-white/66 dark:hover:bg-white/[0.06] dark:hover:text-white"
                    }`}
                    role="option"
                    aria-selected={active}
                  >
                    <div>
                      <p className="text-sm font-medium">{option}</p>
                    </div>
                    <span
                      className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full border px-1.5 text-[0.62rem] font-semibold transition ${
                        active
                          ? "border-[var(--primary)]/16 bg-[var(--primary)]/10 text-[var(--primary)]"
                          : "border-black/8 text-black/32 dark:border-white/10 dark:text-white/32"
                      }`}
                    >
                      {active ? "✓" : ""}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormState>(getInitialFormState);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");

  const emailSubject = useMemo(() => `Projektanfrage: ${form.category}`, [form.category]);

  const emailBody = useMemo(
    () =>
      [
      `Name: ${form.name}`,
      `E-Mail: ${form.email}`,
      `Telefon: ${form.phone || "-"}`,
      `Kategorie: ${form.category}`,
      "",
      "Nachricht:",
      form.message,
    ].join("\n"),
    [form],
  );

  const preparedEmailText = useMemo(
    () => `An: kontakt@nordtal.at\nBetreff: ${emailSubject}\n\n${emailBody}`,
    [emailBody, emailSubject],
  );

  const mailtoHref = useMemo(
    () =>
      `mailto:kontakt@nordtal.at?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`,
    [emailBody, emailSubject],
  );

  const copyPreparedRequest = async () => {
    try {
      await navigator.clipboard.writeText(preparedEmailText);
      setSubmitStatus("copied");
    } catch {
      setSubmitStatus("manual");
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitStatus("mail-opened");

    const mailLink = document.createElement("a");
    mailLink.href = mailtoHref;
    mailLink.rel = "noopener noreferrer";
    mailLink.style.display = "none";
    document.body.appendChild(mailLink);
    mailLink.click();
    mailLink.remove();
  };

  return (
    <div className="min-h-screen w-full px-4 pb-18 pt-24 sm:px-5 sm:pb-20 sm:pt-28 md:px-10 lg:px-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:gap-10">
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="grid gap-6 overflow-hidden rounded-[2.2rem] border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0.52)_100%)] p-6 shadow-[0_22px_52px_rgba(0,0,0,0.08)] backdrop-blur-md dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(31,23,18,0.78)_0%,rgba(20,15,12,0.64)_100%)] lg:grid-cols-[1.08fr_0.92fr] lg:gap-8 lg:p-8"
        >
          <div className="flex flex-col justify-between gap-8">
            <div>
              <p className="mb-4 text-[0.72rem] font-semibold uppercase tracking-[0.34rem] text-black/40 dark:text-white/38">
                Kontakt
              </p>
              <h1 className="max-w-4xl text-[clamp(3rem,11vw,5.5rem)]! font-black leading-[0.9] tracking-[-0.06em] text-black dark:text-white">
                Massivholz.
                <span className="text-color-gradient block pb-2">
                  Direkt angefragt.
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-sm leading-6 text-black/66 dark:text-white/64 sm:text-base sm:leading-7">
                Für Einzelstücke, Sondermasse und konkrete Produktanfragen. Die Seite
                ist bewusst direkt gehalten: Sie schicken die Eckdaten, wir melden uns
                mit einer ersten Einschätzung und den nächsten Schritten zur Umsetzung.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr]">
              <InfoCard
                eyebrow="Kontakt"
                title="kontakt@nordtal.at"
                text="Für Produktanfragen, Abstimmungen zu Materialien und individuelle Massanfertigungen."
              />
              <InfoCard
                eyebrow="Rückmeldung"
                title="Innerhalb weniger Werktage"
                text="Schnelle Ersteinschaetzung zu Ausfuehrung, Ablauf und Machbarkeit."
                align="left"
              />
            </div>
          </div>

          <motion.div
            custom={0.1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="relative overflow-hidden rounded-[1.8rem] border border-black/8 bg-[radial-gradient(circle_at_top_left,rgba(216,153,110,0.16),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(255,255,255,0.64)_100%)] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.06)] backdrop-blur-md dark:border-white/10 dark:bg-[radial-gradient(circle_at_top_left,rgba(216,153,110,0.14),transparent_34%),linear-gradient(180deg,rgba(35,26,21,0.86)_0%,rgba(23,17,13,0.76)_100%)]"
          >
            <div className="absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(121,68,32,0.3),transparent)]" />
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3rem] text-black/38 dark:text-white/38">
              Ablauf
            </p>
            <h2 className="mt-4 text-[clamp(2rem,5vw,3.4rem)]! leading-[0.9] tracking-[-0.05em] text-black dark:text-white">
              Von der Anfrage zur Abstimmung
            </h2>
            <div className="mt-6 grid gap-4">
              {processSteps.map((item) => (
                <ProcessCard
                  key={item.step}
                  step={item.step}
                  title={item.title}
                  text={item.text}
                />
              ))}
            </div>
          </motion.div>
        </motion.section>

        <section className="grid gap-8 lg:grid-cols-[0.76fr_1.24fr]">
          <motion.div
            custom={0.14}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex flex-col gap-5"
          >
            <div className="rounded-[1.8rem] border border-black/8 bg-white/56 p-6 shadow-[0_18px_42px_rgba(0,0,0,0.06)] backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.055]">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28rem] text-black/38 dark:text-white/38">
                Gute Anfrage
              </p>
              <h2 className="mt-4 text-[clamp(2rem,5vw,2.2rem)]! leading-[0.92] tracking-[-0.05em] text-black dark:text-white">
                Was wir für eine erste Einschätzung brauchen
              </h2>
              <div className="mt-6 space-y-4">
                {requestHints.map((hint, index) => (
                  <div
                    key={hint}
                    className="flex items-start gap-4 rounded-[1.15rem] border border-black/8 bg-white/58 px-4 py-4 dark:border-white/10 dark:bg-white/[0.045]"
                  >
                    <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--primary)]/16 bg-[var(--primary)]/8 text-[0.72rem] font-semibold text-[var(--primary)]">
                      0{index + 1}
                    </span>
                    <p className="text-sm leading-6 text-black/66 dark:text-white/62">
                      {hint}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.8rem] border border-black/8 bg-white/52 p-6 shadow-[0_14px_32px_rgba(0,0,0,0.05)] backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.045]">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28rem] text-black/38 dark:text-white/38">
                Hinweis
              </p>
              <p className="mt-4 text-sm leading-6 text-black/64 dark:text-white/62">
                Beim Absenden öffnet sich Ihre Standard-Mail-App mit einer
                vorbereiteten Projektanfrage. So bleiben alle Informationen direkt in
                Ihrer Kommunikation erhalten.
              </p>
              <a
                href={mailtoHref}
                className="mt-5 inline-flex items-center gap-2 text-[0.78rem] font-semibold uppercase tracking-[0.16rem] text-[var(--primary)] transition hover:text-black dark:hover:text-white"
              >
                Direkt per Mail schreiben
                <span aria-hidden="true">-&gt;</span>
              </a>
            </div>
          </motion.div>

          <motion.div
            custom={0.2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="rounded-[1.9rem] border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.78)_0%,rgba(255,255,255,0.62)_100%)] p-5 shadow-[0_22px_48px_rgba(0,0,0,0.07)] backdrop-blur-md dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(35,26,21,0.82)_0%,rgba(24,18,14,0.7)_100%)] sm:p-6 lg:p-7"
          >
            <div className="mb-6 flex flex-col gap-3 border-b border-black/8 pb-5 dark:border-white/10 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28rem] text-black/38 dark:text-white/38">
                  Anfrageformular
                </p>
                <p className="mt-3 text-[1.45rem] font-semibold tracking-[-0.04em] text-black dark:text-white sm:text-[1.7rem]">
                  Projekt, Möbelstück oder Rueckfrage anfragen
                </p>
              </div>
              <span className="inline-flex w-fit items-center rounded-full border border-black/8 bg-white/72 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16rem] text-black/46 dark:border-white/10 dark:bg-white/[0.055] dark:text-white/46">
                E-Mail vorbereitet
              </span>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Name">
                  <FieldBase>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, name: event.target.value }))
                      }
                      className="w-full bg-transparent px-4 py-3 text-sm text-black outline-none placeholder:text-black/34 dark:text-white dark:placeholder:text-white/34"
                      placeholder="Ihr Name"
                    />
                  </FieldBase>
                </FormField>

                <FormField label="E-Mail">
                  <FieldBase>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, email: event.target.value }))
                      }
                      className="w-full bg-transparent px-4 py-3 text-sm text-black outline-none placeholder:text-black/34 dark:text-white dark:placeholder:text-white/34"
                      placeholder="ihre@email.at"
                    />
                  </FieldBase>
                </FormField>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Telefon">
                  <FieldBase>
                    <input
                      type="text"
                      value={form.phone}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, phone: event.target.value }))
                      }
                      className="w-full bg-transparent px-4 py-3 text-sm text-black outline-none placeholder:text-black/34 dark:text-white dark:placeholder:text-white/34"
                      placeholder="Optional"
                    />
                  </FieldBase>
                </FormField>

                <FormField label="Kategorie">
                  <div className="flex flex-col gap-1">
                    <SelectField
                      value={form.category}
                      onChange={(value) =>
                        setForm((current) => ({ ...current, category: value }))
                      }
                      options={requestCategories}
                    />
                    <p className="pl-2 text-[0.72rem] leading-5 text-black/42 dark:text-white/42">
                      Wählbar für Produkttypen oder allgemeine Projektanfragen.
                    </p>
                  </div>
                </FormField>
              </div>

              <FormField label="Nachricht">
                <FieldBase>
                  <textarea
                    required
                    rows={9}
                    value={form.message}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, message: event.target.value }))
                    }
                    className="w-full resize-none bg-transparent px-4 py-3 text-sm leading-6 text-black outline-none placeholder:text-black/34 dark:text-white dark:placeholder:text-white/34"
                    placeholder="Beschreiben Sie kurz Ihr Projekt, gewuenschte Masse, Einsatzbereich oder Materialwünsche."
                  />
                </FieldBase>
              </FormField>

              <div className="flex flex-col gap-4 border-t border-black/8 pt-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-md text-xs leading-5 text-black/46 dark:text-white/46">
                  Nach dem Klick öffnet sich Ihre Mail-App mit einer vorbereiteten
                  Anfrage. Falls das nicht funktioniert, können Sie die Anfrage
                  darunter kopieren.
                </p>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-[0.78rem] font-semibold uppercase tracking-[0.18rem] text-white shadow-[0_14px_28px_rgba(121,68,32,0.22)] transition hover:bg-[#643717]"
                >
                  Anfragen
                </button>
              </div>

              {submitStatus !== "idle" && (
                <div className="rounded-[1rem] border border-[var(--primary)]/14 bg-[var(--primary)]/6 px-4 py-3 text-sm leading-6 text-black/62 dark:text-white/62">
                  {submitStatus === "mail-opened" &&
                    "Falls sich keine Mail-App geöffnet hat, können Sie die Anfrage alternativ kopieren."}
                  {submitStatus === "copied" &&
                    "Die Anfrage wurde in die Zwischenablage kopiert."}
                  {submitStatus === "manual" &&
                    "Die automatische Zwischenablage ist in diesem Browser blockiert. Der vorbereitete Text steht unten zum manuellen Kopieren bereit."}
                  <button
                    type="button"
                    onClick={copyPreparedRequest}
                    className="ml-1 font-semibold text-[var(--primary)] transition hover:text-black dark:hover:text-white"
                  >
                    Anfrage kopieren
                  </button>
                  <div className="mt-3 rounded-[0.85rem] border border-black/8 bg-white/60 p-3 text-xs leading-5 text-black/58 dark:border-white/10 dark:bg-white/[0.045] dark:text-white/58">
                    <p className="font-semibold text-black/70 dark:text-white/70">
                      kontakt@nordtal.at
                    </p>
                    <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap font-sans">
                      {preparedEmailText}
                    </pre>
                  </div>
                </div>
              )}
            </form>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
