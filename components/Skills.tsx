"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { SiPython, SiR } from "react-icons/si";
import { TbFileExcel, TbSql, TbChartBar, TbLanguage } from "react-icons/tb";
import { useLang } from "@/context/LanguageContext";

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLang();

  const skillCategories = [
    {
      category: t("skills_cat1"),
      skills: [
        { name: "SQL", sub: "JOIN, GROUP BY, window functions", icon: <TbSql />, color: "text-blue-500" },
        { name: "Python", sub: "pandas, NumPy, matplotlib, scikit-learn", icon: <SiPython />, color: "text-yellow-500" },
        { name: "R", sub: "dplyr, ggplot2", icon: <SiR />, color: "text-blue-700" },
        { name: "Tableau", icon: <TbChartBar />, color: "text-blue-600" },
        { name: "Microsoft Excel", sub: "Pivot Tables, XLOOKUP", icon: <TbFileExcel />, color: "text-emerald-600" },
      ],
    },
    {
      category: t("skills_cat2"),
      skills: [
        { name: t("skill_descriptive_stats"), icon: <TbChartBar />, color: "text-indigo-500" },
        { name: t("skill_hypothesis"), icon: <TbChartBar />, color: "text-purple-500" },
        { name: t("skill_eda"), icon: <TbChartBar />, color: "text-amber-500" },
        { name: t("skill_wrangling"), icon: <TbChartBar />, color: "text-emerald-500" },
        { name: t("skill_dashboard"), icon: <TbChartBar />, color: "text-rose-500" },
      ],
    },
    {
      category: t("skills_cat3"),
      skills: [
        { name: t("lang_italian"), sub: t("lang_italian_level"), icon: <TbLanguage />, color: "text-green-600" },
        { name: t("lang_english"), sub: "C1", icon: <TbLanguage />, color: "text-blue-500" },
        { name: t("lang_french"), sub: "C1", icon: <TbLanguage />, color: "text-indigo-500" },
        { name: t("lang_german"), sub: "B1", icon: <TbLanguage />, color: "text-gray-600" },
      ],
    },
  ];

  return (
    <section id="skills" className="py-24 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-indigo-500 font-semibold text-sm uppercase tracking-widest mb-2">
            {t("skills_label")}
          </p>
          <h2
            className="text-4xl font-bold text-gray-900 dark:text-gray-100"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t("skills_title")}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-xl mx-auto">
            {t("skills_subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skillCategories.map((cat, catIdx) => (
            <motion.div
              key={catIdx}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: catIdx * 0.15 }}
              className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-600"
            >
              <h3 className="text-sm font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider mb-5">
                {cat.category}
              </h3>
              <div className="space-y-3">
                {cat.skills.map((skill, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    <span className={`text-2xl mt-0.5 flex-shrink-0 ${skill.color}`}>{skill.icon}</span>
                    <div>
                      <div className="font-medium text-gray-700 dark:text-gray-200 text-sm">{skill.name}</div>
                      {"sub" in skill && skill.sub && (
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{skill.sub}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
