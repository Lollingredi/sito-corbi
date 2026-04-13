"use client";

// Skills applied: composition-patterns (useScrollPosition hook extraction),
//                 accesslint (keyboard-nav, aria-labels, touch targets),
//                 web-design-guidelines (nav-label-icon, nav-state-active)

import { useState, useEffect, useId } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu, FiX, FiDownload } from "react-icons/fi";
import { useLang } from "@/context/LanguageContext";
import { TranslationKey } from "@/lib/translations";

/* ── Custom hook: scroll position ─────────────────────────────── */
function useScrollPosition(threshold = 20): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > threshold);
    // Passive listener — no layout thrashing (react-best-practices)
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return scrolled;
}

/* ── Nav link configuration ───────────────────────────────────── */
const navLinkKeys: { labelKey: TranslationKey; hash: string }[] = [
  { labelKey: "nav_about", hash: "about" },
  { labelKey: "nav_education", hash: "education" },
  { labelKey: "nav_internships", hash: "internships" },
  { labelKey: "nav_projects", hash: "projects" },
  { labelKey: "nav_skills", hash: "skills" },
  { labelKey: "nav_contact", hash: "contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useScrollPosition(20);
  const { lang, setLang, t } = useLang();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const linkHref = (hash: string) => (isHome ? `#${hash}` : `/#${hash}`);
  const mobileMenuId = useId();

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <nav
      aria-label="Navigazione principale"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--background)]/90 backdrop-blur-md shadow-sm border-b border-[var(--color-border)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">

        {/* Logo — min 44px touch target via py */}
        <a
          href={isHome ? "#hero" : "/"}
          className="text-lg font-bold text-[var(--foreground)] tracking-tight py-1"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Michele Corbisiero
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinkKeys.map((link) => (
            <a
              key={link.hash}
              href={linkHref(link.hash)}
              className="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors duration-150 font-medium text-sm py-2"
            >
              {t(link.labelKey)}
            </a>
          ))}

          {/* CV download — descriptive aria-label for accessibility */}
          <a
            href={t("cv_file")}
            download
            aria-label={`${t("nav_cv")} — scarica il curriculum vitae`}
            className="flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] active:scale-[0.98] text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-all duration-150 min-h-[44px]"
          >
            <FiDownload className="w-4 h-4" aria-hidden="true" />
            {t("nav_cv")}
          </a>

          {/* Language toggle — sr-only describes current state */}
          <button
            onClick={() => setLang(lang === "it" ? "en" : "it")}
            aria-label={`Cambia lingua. Lingua attuale: ${lang === "it" ? "Italiano" : "English"}`}
            className="text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-light)] transition-colors duration-150 border border-[var(--color-primary)] hover:border-[var(--color-primary-light)] px-3 py-2 rounded-full min-h-[44px] min-w-[44px]"
          >
            {lang === "it" ? "EN" : "IT"}
          </button>
        </div>

        {/* Mobile: hamburger — min 44px touch target */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Chiudi menu" : "Apri menu"}
            aria-expanded={menuOpen}
            aria-controls={mobileMenuId}
            className="text-[var(--foreground)] p-2 rounded-lg hover:bg-[var(--color-surface)] transition-colors duration-150 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            {menuOpen
              ? <FiX className="w-6 h-6" aria-hidden="true" />
              : <FiMenu className="w-6 h-6" aria-hidden="true" />
            }
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id={mobileMenuId}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden bg-[var(--background)] border-t border-[var(--color-border)] px-4 py-5 flex flex-col gap-1 shadow-lg"
          >
            {navLinkKeys.map((link) => (
              <a
                key={link.hash}
                href={linkHref(link.hash)}
                className="text-[var(--foreground)] hover:text-[var(--color-primary)] font-medium py-3 px-2 rounded-lg hover:bg-[var(--color-surface)] transition-all duration-150 min-h-[44px] flex items-center"
                onClick={() => setMenuOpen(false)}
              >
                {t(link.labelKey)}
              </a>
            ))}

            <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)] mt-2">
              <a
                href={t("cv_file")}
                download
                aria-label={`${t("nav_cv")} — scarica il curriculum vitae`}
                className="flex items-center gap-2 bg-[var(--color-primary)] text-white font-semibold px-5 py-2.5 rounded-full min-h-[44px]"
                onClick={() => setMenuOpen(false)}
              >
                <FiDownload className="w-4 h-4" aria-hidden="true" />
                {t("nav_cv")}
              </a>
              <button
                onClick={() => setLang(lang === "it" ? "en" : "it")}
                aria-label={`Cambia lingua. Lingua attuale: ${lang === "it" ? "Italiano" : "English"}`}
                className="text-sm font-semibold text-[var(--color-primary)] border border-[var(--color-primary)] px-4 py-2.5 rounded-full min-h-[44px] min-w-[44px]"
              >
                {lang === "it" ? "EN" : "IT"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
