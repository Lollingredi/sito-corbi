"use client";

// Skills applied: composition-patterns (state-context-interface, react19-no-forwardref)
// React 19: use() replaces useContext() and can be called conditionally.
// Interface follows state/actions/meta pattern for dependency-injectable design.
import { createContext, useState, useEffect, use } from "react";
import { translations, Lang, TranslationKey } from "@/lib/translations";

interface LanguageState {
  lang: Lang;
}

interface LanguageActions {
  setLang: (lang: Lang) => void;
}

interface LanguageMeta {
  t: (key: TranslationKey) => string;
}

interface LanguageContextValue {
  state: LanguageState;
  actions: LanguageActions;
  meta: LanguageMeta;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("it");

  // Allow deep-linking a language via URL, e.g. /?lang=en (used by the English QR code).
  // Runs only in the browser after mount, so it never breaks SSR/SSG.
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("lang");
    if (param === "en" || param === "it") setLang(param as Lang);
  }, []);

  const t = (key: TranslationKey): string => translations[lang][key];

  return (
    <LanguageContext value={{ state: { lang }, actions: { setLang }, meta: { t } }}>
      {children}
    </LanguageContext>
  );
}

export function useLang(): { lang: Lang; setLang: (l: Lang) => void; t: (k: TranslationKey) => string } {
  const ctx = use(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return { lang: ctx.state.lang, setLang: ctx.actions.setLang, t: ctx.meta.t };
}
