"use client";

// Sito realizzato da Redi Bako — https://www.rediverse.cc/
// Skills applied: accesslint (aria-label on icon links, theme toggle label),
//                 web-design-guidelines (nav-label-icon)

import { FiLinkedin, FiGithub, FiMail, FiSun, FiMoon } from "react-icons/fi";
import { useLang } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

export default function Footer() {
  const year = new Date().getFullYear();
  const { t } = useLang();
  const { dark, toggleTheme } = useTheme();

  return (
    <footer className="bg-slate-950 dark:bg-[#070c16] text-slate-400 py-10 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-5">

        {/* Copyright + credit */}
        <div className="text-sm text-center md:text-left flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>© {year} Michele Corbisiero · {t("footer_role")}</span>
          <span className="hidden md:inline text-slate-700" aria-hidden="true">|</span>
          <span className="text-xs text-slate-600">
            Sito realizzato da{" "}
            <a
              href="https://www.rediverse.cc/projects"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors duration-150 underline underline-offset-2"
            >
              Redi Bako
            </a>
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle — aria-label describes current state AND action */}
          <button
            onClick={toggleTheme}
            aria-label={dark ? "Attiva modalità chiara" : "Attiva modalità scura"}
            className="p-2.5 rounded-full hover:text-white hover:bg-slate-800 transition-colors duration-150 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            {dark
              ? <FiSun className="w-5 h-5" aria-hidden="true" />
              : <FiMoon className="w-5 h-5" aria-hidden="true" />
            }
          </button>

          <a
            href="mailto:corbisieromichele00@gmail.com"
            aria-label="Email a Michele Corbisiero"
            className="p-2.5 rounded-full hover:text-white hover:bg-slate-800 transition-colors duration-150 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <FiMail className="w-5 h-5" aria-hidden="true" />
          </a>

          <a
            href="https://www.linkedin.com/in/michele-corbisiero-190512238/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Profilo LinkedIn di Michele Corbisiero (apre in nuova finestra)"
            className="p-2.5 rounded-full hover:text-white hover:bg-slate-800 transition-colors duration-150 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <FiLinkedin className="w-5 h-5" aria-hidden="true" />
          </a>

          <a
            href="https://github.com/corbisieromichele00"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Profilo GitHub di Michele Corbisiero (apre in nuova finestra)"
            className="p-2.5 rounded-full hover:text-white hover:bg-slate-800 transition-colors duration-150 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <FiGithub className="w-5 h-5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
