"use client";

// Skills applied: frontend-design (asymmetric layout, slide-in animation),
//                 accesslint (alt-text, aria-hidden, reduced-motion),
//                 ui-ux-pro-max (whitespace-balance, weight-hierarchy)

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useLang } from "@/context/LanguageContext";

export default function About() {
  const { t } = useLang();
  const reduced = useReducedMotion() ?? false;

  const slideLeft = {
    initial: reduced ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, amount: 0.15 } as const,
    transition: { duration: 0.65, ease: [0, 0, 0.2, 1] as const },
  };

  const slideRight = {
    initial: reduced ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, amount: 0.15 } as const,
    transition: { duration: 0.65, delay: 0.1, ease: [0, 0, 0.2, 1] as const },
  };

  const facts = [
    { label: t("about_fact1_label"), value: "110/110" },
    { label: t("about_fact2_label"), value: "4" },
    { label: t("about_fact3_label"), value: "Google" },
  ];

  return (
    <section
      id="about"
      aria-label={t("about_label")}
      className="py-24 bg-[var(--color-surface)]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center gap-14 md:gap-20">

          {/* Photo — slides in from right on desktop */}
          <motion.div
            {...slideRight}
            className="flex-shrink-0 order-first md:order-last"
          >
            <div className="relative w-56 h-56 md:w-64 md:h-64">
              {/* Decorative accent square behind photo */}
              <div
                aria-hidden="true"
                className="absolute -bottom-3 -right-3 w-full h-full rounded-2xl border-2 border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5"
              />
              <div className="relative w-full h-full rounded-2xl border border-[var(--color-border)] shadow-lg overflow-hidden bg-gradient-to-br from-indigo-50 to-emerald-50 dark:from-indigo-950 dark:to-emerald-950">
                <Image
                  src="/corbi.jpg"
                  alt="Michele Corbisiero in abito formale, Data Analyst"
                  width={256}
                  height={256}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </motion.div>

          {/* Text — slides in from left */}
          <motion.div {...slideLeft} className="flex-1">
            <p className="text-[var(--color-primary)] font-semibold text-xs uppercase tracking-[0.2em] mb-2">
              {t("about_label")}
            </p>
            <h2
              className="text-4xl font-bold text-[var(--foreground)] mb-6 leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t("about_title")}
            </h2>

            <div className="space-y-4 text-[var(--color-muted)] leading-relaxed max-w-[60ch]">
              <p>
                {t("about_p1_pre")}{" "}
                <span className="font-semibold text-[var(--foreground)]">Michele Corbisiero</span>
                {t("about_p1_post")}{" "}
                <span className="text-[var(--color-primary)] font-semibold">{t("about_p1_degree")}</span>.
              </p>
              <p>
                {t("about_p2")}{" "}
                <span className="font-semibold text-[var(--foreground)]">{t("about_p2_skill")}</span>{" "}
                {t("about_p2_post")}
              </p>
              <p>
                {t("about_p3_pre")}{" "}
                <span className="font-semibold text-[var(--foreground)]">{t("about_p3_tools")}</span>{" "}
                {t("about_p3_post")}
              </p>
            </div>

            {/* Quick facts — stat callouts */}
            <div className="mt-8 grid grid-cols-3 gap-3">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="bg-[var(--background)] rounded-xl p-4 shadow-sm border border-[var(--color-border)] text-center"
                >
                  <div
                    className="text-2xl font-black text-[var(--color-primary)] tabular-nums"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {fact.value}
                  </div>
                  <div className="text-xs text-[var(--color-muted)] mt-1 leading-tight">{fact.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
