"use client";

// Sito realizzato da Redi Bako — https://www.rediverse.cc/

import { FiLinkedin, FiGithub, FiMail } from "react-icons/fi";
import { useLang } from "@/context/LanguageContext";

export default function Footer() {
  const year = new Date().getFullYear();
  const { t } = useLang();

  return (
    <footer className="bg-gray-900 text-gray-400 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-center md:text-left flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>© {year} Michele Corbisiero · {t("footer_role")}</span>
          <span className="hidden md:inline text-gray-600">|</span>
          <span className="text-xs text-gray-500">
            Sito realizzato da{" "}
            <a
              href="https://www.rediverse.cc/projects"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition-colors underline"
            >
              Redi Bako
            </a>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="mailto:corbisieromichele00@gmail.com"
            className="hover:text-white transition-colors"
            aria-label="Email"
          >
            <FiMail className="w-5 h-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/michele-corbisiero-190512238/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
            aria-label="LinkedIn"
          >
            <FiLinkedin className="w-5 h-5" />
          </a>
          <a
            href="https://github.com/corbisieromichele00"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
            aria-label="GitHub"
          >
            <FiGithub className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
