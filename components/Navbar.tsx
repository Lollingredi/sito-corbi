"use client";

import { useState, useEffect } from "react";
import { FiMenu, FiX, FiDownload, FiSun, FiMoon } from "react-icons/fi";
import { useLang } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { TranslationKey } from "@/lib/translations";

const navLinkKeys: { labelKey: TranslationKey; href: string }[] = [
  { labelKey: "nav_about", href: "#about" },
  { labelKey: "nav_education", href: "#education" },
  { labelKey: "nav_projects", href: "#projects" },
  { labelKey: "nav_skills", href: "#skills" },
  { labelKey: "nav_contact", href: "#contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang, t } = useLang();
  const { dark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-900"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Left: toggles + logo */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {dark ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
          </button>
          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === "it" ? "en" : "it")}
            className="hidden md:block text-sm font-semibold text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors border border-indigo-300 hover:border-indigo-500 px-3 py-1.5 rounded-full"
          >
            {lang === "it" ? "EN" : "IT"}
          </button>
          {/* Logo */}
          <a
            href="#hero"
            className="text-lg font-bold text-gray-900 dark:text-gray-100"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Michele Corbisiero
          </a>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinkKeys.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors font-medium text-sm"
            >
              {t(link.labelKey)}
            </a>
          ))}
          <a
            href={t("cv_file")}
            download
            className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
          >
            <FiDownload className="w-4 h-4" />
            {t("nav_cv")}
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-gray-700 dark:text-gray-300 p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 px-4 py-4 flex flex-col gap-4 shadow-lg">
          {navLinkKeys.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 font-medium"
              onClick={() => setMenuOpen(false)}
            >
              {t(link.labelKey)}
            </a>
          ))}
          <button
            onClick={() => { setLang(lang === "it" ? "en" : "it"); }}
            className="text-sm font-semibold text-indigo-500 border border-indigo-300 px-3 py-1.5 rounded-full w-fit"
          >
            {lang === "it" ? "EN" : "IT"}
          </button>
          <a
            href={t("cv_file")}
            download
            className="flex items-center gap-2 bg-indigo-500 text-white font-medium px-4 py-2 rounded-full w-fit"
            onClick={() => setMenuOpen(false)}
          >
            <FiDownload className="w-4 h-4" />
            {t("nav_cv")}
          </a>
        </div>
      )}
    </nav>
  );
}
