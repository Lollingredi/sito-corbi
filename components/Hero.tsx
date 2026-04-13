"use client";

// Skills applied: ui-ux-pro-max (animation: stagger-sequence, spring-physics),
//                 frontend-design (asymmetric layout, spatial depth),
//                 accesslint (alt-text, reduced-motion, aria-hidden)

import { motion, useReducedMotion } from "framer-motion";
import { FiArrowDown, FiMail } from "react-icons/fi";
import Image from "next/image";
import { useLang } from "@/context/LanguageContext";

/* ── Animation variants ──────────────────────────────────────── */
// Each child element gets a unique stagger delay conveying hierarchy:
// role label → name → tagline → CTAs → photo
const makeSlideUp = (delay: number, reduced: boolean) => ({
  initial: reduced ? { opacity: 1, y: 0 } : { opacity: 1, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: reduced ? 0 : 0.55, delay, ease: [0, 0, 0.2, 1] as const },
});

const makePhotoAnim = (reduced: boolean) => ({
  initial: reduced ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: reduced ? 0 : 0.65, delay: 0.2, ease: [0, 0, 0.2, 1] as const },
});

export default function Hero() {
  const { t } = useLang();
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      id="hero"
      aria-label="Introduzione"
      className="min-h-screen flex items-center justify-center bg-[var(--background)] pt-16"
    >
      {/* Subtle radial gradient for depth — purely decorative */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/[0.07] blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-emerald-500/5 dark:bg-emerald-500/[0.05] blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 md:py-32 flex flex-col-reverse md:flex-row items-center gap-14 md:gap-20">

        {/* ── Text content ── */}
        <div className="flex-1 text-center md:text-left">
          {/* Eyebrow role label */}
          <motion.p
            {...makeSlideUp(0, reduced)}
            className="text-[var(--color-primary)] font-semibold text-xs uppercase tracking-[0.2em] mb-4"
          >
            {t("hero_role")}
          </motion.p>

          {/* Name — largest element, most prominent entrance */}
          <motion.h1
            {...makeSlideUp(0.12, reduced)}
            className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.05] tracking-tight text-[var(--foreground)] mb-5"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Michele
            <br />
            <span className="text-[var(--color-primary)]">Corbisiero</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            {...makeSlideUp(0.27, reduced)}
            className="text-lg text-[var(--color-muted)] max-w-[48ch] mb-10 leading-relaxed"
          >
            {t("hero_tagline_1")}{" "}
            <span className="text-[var(--color-secondary)] font-semibold">{t("hero_tagline_2")}</span>{" "}
            {t("hero_tagline_3")}{" "}
            <span className="text-[var(--color-accent)] font-semibold">{t("hero_tagline_4")}</span>.
          </motion.p>

          {/* CTAs */}
          <motion.div
            {...makeSlideUp(0.42, reduced)}
            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
          >
            <a
              href="#projects"
              className="inline-flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] active:scale-[0.98] text-white font-semibold px-6 py-3 rounded-full transition-all duration-150 min-h-[44px]"
            >
              {t("hero_cta_projects")}
              <FiArrowDown className="w-4 h-4" aria-hidden="true" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-indigo-50 dark:hover:bg-indigo-950/40 active:scale-[0.98] font-semibold px-6 py-3 rounded-full transition-all duration-150 min-h-[44px]"
            >
              <FiMail className="w-4 h-4" aria-hidden="true" />
              {t("hero_cta_contact")}
            </a>
          </motion.div>
        </div>

        {/* ── Profile photo ── */}
        <motion.div
          {...makePhotoAnim(reduced)}
          className="flex-shrink-0"
        >
          <div className="relative">
            {/* Decorative ring with depth */}
            <div
              aria-hidden="true"
              className="absolute -inset-3 rounded-full bg-gradient-to-br from-indigo-400/30 via-transparent to-emerald-400/20 blur-sm"
            />
            <div className="relative w-52 h-52 sm:w-68 sm:h-68 md:w-72 md:h-72 rounded-full border-[3px] border-[var(--color-border)] shadow-2xl overflow-hidden bg-gradient-to-br from-indigo-100 to-emerald-100 dark:from-indigo-950 dark:to-emerald-950">
              <Image
                src="/michele.jpeg"
                alt="Michele Corbisiero, Data Analyst"
                width={288}
                height={288}
                className="w-full h-full object-cover object-top"
                priority
              />
            </div>
          </div>
        </motion.div>

      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        aria-label="Scorri verso il basso"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors duration-150 p-2"
      >
        <motion.div
          animate={reduced ? {} : { y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <FiArrowDown className="w-5 h-5" aria-hidden="true" />
        </motion.div>
      </motion.a>
    </section>
  );
}
