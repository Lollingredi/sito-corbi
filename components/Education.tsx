"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { FiAward, FiBook } from "react-icons/fi";
import { useLang } from "@/context/LanguageContext";

export default function Education() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLang();

  const educationItems = [
    {
      title: t("edu_item0_title"),
      institution: "Google",
      period: t("edu_item0_period"),
      note: t("edu_item0_note"),
      icon: "award" as const,
    },
    {
      title: t("edu_item1_title"),
      institution: "Università di Verona & Julius-Maximilians-Universität Würzburg",
      period: t("edu_item1_period"),
      grade: "110/110 (1.0) – Economics and Data Analysis · 1.6 – International Economic Policy",
      thesis: t("edu_item1_thesis"),
      courses: "Time series and forecasting, International trade and multinational firm",
      icon: "book" as const,
    },
    {
      title: t("edu_item2_title"),
      institution: "Università Politecnica delle Marche – Ancona",
      period: t("edu_item2_period"),
      grade: "98/110 (1.8)",
      courses: "Economia degli intermediari finanziari, Demografia",
      icon: "book" as const,
    },
    {
      title: t("edu_item3_title"),
      institution: "Université de Limoges – Francia",
      period: t("edu_item3_period"),
      icon: "book" as const,
    },
  ];

  return (
    <section id="education" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-indigo-500 font-semibold text-sm uppercase tracking-widest mb-2">
            {t("edu_label")}
          </p>
          <h2
            className="text-4xl font-bold text-gray-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t("edu_title")}
          </h2>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-indigo-100 hidden sm:block" />

          <div className="space-y-8">
            {educationItems.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                className="flex gap-6"
              >
                {/* Icon */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center z-10 shadow-sm">
                  {item.icon === "award" ? (
                    <FiAward className="w-4 h-4 text-indigo-600" />
                  ) : (
                    <FiBook className="w-4 h-4 text-indigo-600" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 bg-gray-50 rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2">
                    <h3 className="font-bold text-gray-900 text-base leading-snug">{item.title}</h3>
                    <span className="text-xs text-indigo-500 font-semibold whitespace-nowrap bg-indigo-50 px-2 py-1 rounded-full self-start">
                      {item.period}
                    </span>
                  </div>
                  <p className="text-sm text-indigo-600 font-medium mb-2">{item.institution}</p>
                  {"grade" in item && item.grade && (
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium text-gray-700">{t("edu_grade")}</span> {item.grade}
                    </p>
                  )}
                  {"thesis" in item && item.thesis && (
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium text-gray-700">{t("edu_thesis")}</span>{" "}
                      <em>{item.thesis}</em>
                    </p>
                  )}
                  {"courses" in item && item.courses && (
                    <p className="text-sm text-gray-500">
                      <span className="font-medium text-gray-600">{t("edu_courses")}</span> {item.courses}
                    </p>
                  )}
                  {"note" in item && item.note && (
                    <p className="text-sm text-gray-500">{item.note}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
