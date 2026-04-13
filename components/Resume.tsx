"use client";

// Skills applied: frontend-design (gradient CTA band),
//                 accesslint (aria-hidden, descriptive download link),
//                 ui-ux-pro-max (reduced-motion)

import { motion, useReducedMotion } from "framer-motion";
import { FiDownload } from "react-icons/fi";
import { useLang } from "@/context/LanguageContext";

export default function Resume() {
  const { t } = useLang();
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      id="resume"
      aria-label={t("resume_title")}
      className="py-20 bg-gradient-to-br from-indigo-600 to-indigo-800 dark:from-indigo-700 dark:to-indigo-950"
    >
      {/* Subtle texture overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <motion.div
        className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center"
        initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
      >
        <h2
          className="text-4xl font-bold text-white mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {t("resume_title")}
        </h2>
        <p className="text-indigo-200 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          {t("resume_subtitle")}
        </p>
        <motion.a
          href={t("cv_file")}
          download
          aria-label={`${t("resume_cta")} — scarica il curriculum vitae in PDF`}
          whileHover={reduced ? {} : { scale: 1.03 }}
          whileTap={reduced ? {} : { scale: 0.97 }}
          transition={{ duration: 0.15 }}
          className="inline-flex items-center gap-3 bg-white text-indigo-700 font-bold px-8 py-4 rounded-full hover:bg-indigo-50 transition-colors duration-150 shadow-xl text-lg min-h-[56px]"
        >
          <FiDownload className="w-5 h-5" aria-hidden="true" />
          {t("resume_cta")}
        </motion.a>
      </motion.div>
    </section>
  );
}
