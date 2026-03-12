"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { FiBriefcase } from "react-icons/fi";
import { useLang } from "@/context/LanguageContext";

export default function Internships() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLang();

  const items = [
    {
      title: t("intern_item0_title"),
      org: t("intern_item0_org"),
      location: t("intern_item0_location"),
      period: t("intern_item0_period"),
    },
    {
      title: t("intern_item1_title"),
      org: t("intern_item1_org"),
      location: t("intern_item1_location"),
      period: t("intern_item1_period"),
      note: t("intern_item1_note"),
    },
    {
      title: t("intern_item2_title"),
      org: t("intern_item2_org"),
      location: t("intern_item2_location"),
      period: t("intern_item2_period"),
    },
  ];

  return (
    <section id="internships" className="py-24 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-indigo-500 font-semibold text-sm uppercase tracking-widest mb-2">
            {t("intern_label")}
          </p>
          <h2
            className="text-4xl font-bold text-gray-900 dark:text-gray-100"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t("intern_title")}
          </h2>
        </motion.div>

        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-indigo-100 dark:bg-indigo-900 hidden sm:block" />

          <div className="space-y-8">
            {items.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                className="flex gap-6"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center z-10 shadow-sm">
                  <FiBriefcase className="w-4 h-4 text-indigo-600" />
                </div>

                <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-0">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base leading-snug min-w-0 flex-1">
                      {item.title}
                    </h3>
                    <span className="text-xs text-indigo-500 dark:text-indigo-400 font-semibold whitespace-nowrap bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-full flex-shrink-0">
                      {item.period}
                    </span>
                  </div>
                  <p className="text-sm text-indigo-600 font-medium mt-0 mb-1">
                    {item.org}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.location}
                    {"note" in item && item.note ? ` · ${item.note}` : ""}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
