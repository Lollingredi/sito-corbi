"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { FiDownload } from "react-icons/fi";
import { useLang } from "@/context/LanguageContext";

export default function Resume() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLang();

  return (
    <section id="resume" className="py-20 bg-indigo-500 dark:bg-indigo-800">
      <motion.div
        ref={ref}
        className="max-w-4xl mx-auto px-4 sm:px-6 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2
          className="text-4xl font-bold text-white mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {t("resume_title")}
        </h2>
        <p className="text-indigo-100 text-lg mb-8 max-w-xl mx-auto">
          {t("resume_subtitle")}
        </p>
        <a
          href={t("cv_file")}
          download
          className="inline-flex items-center gap-3 bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 font-bold px-8 py-4 rounded-full hover:bg-indigo-50 dark:hover:bg-gray-800 transition-colors shadow-lg text-lg"
        >
          <FiDownload className="w-5 h-5" />
          {t("resume_cta")}
        </a>
      </motion.div>
    </section>
  );
}
