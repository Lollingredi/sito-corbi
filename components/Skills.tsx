"use client";

// Skills applied: ui-ux-pro-max (stagger-sequence, weight-hierarchy),
//                 accesslint (aria-hidden on decorative icons),
//                 react-best-practices (hoist static outside render)

import { motion, Variants, useReducedMotion } from "framer-motion";
import { SiPython, SiR } from "react-icons/si";
import { TbFileExcel, TbSql, TbChartBar, TbLanguage, TbChartHistogram } from "react-icons/tb";
import { useLang } from "@/context/LanguageContext";

/* ── Variants ──────────────────────────────────────────────────── */
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const categoryVariants = (reduced: boolean): Variants => ({
  hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0, 0, 0.2, 1] },
  },
});

export default function Skills() {
  const { t } = useLang();
  const reduced = useReducedMotion() ?? false;

  const skillCategories = [
    {
      category: t("skills_cat1"),
      skills: [
        { name: "SQL", sub: "JOIN, GROUP BY, window functions", icon: <TbSql aria-hidden="true" />, color: "text-blue-500" },
        { name: "Python", sub: "pandas, NumPy, matplotlib, scikit-learn", icon: <SiPython aria-hidden="true" />, color: "text-yellow-500" },
        { name: "R", sub: "dplyr, ggplot2", icon: <SiR aria-hidden="true" />, color: "text-blue-700 dark:text-blue-400" },
        { name: "Stata", sub: "regressioni panel, econometria", icon: <TbChartHistogram aria-hidden="true" />, color: "text-red-500" },
        { name: "Tableau", icon: <TbChartBar aria-hidden="true" />, color: "text-blue-500" },
        { name: "Microsoft Excel", sub: "Pivot Tables, XLOOKUP", icon: <TbFileExcel aria-hidden="true" />, color: "text-emerald-500" },
      ],
    },
    {
      category: t("skills_cat2"),
      skills: [
        { name: t("skill_descriptive_stats"), icon: <TbChartBar aria-hidden="true" />, color: "text-[var(--color-primary)]" },
        { name: t("skill_hypothesis"), icon: <TbChartBar aria-hidden="true" />, color: "text-purple-500" },
        { name: t("skill_eda"), icon: <TbChartBar aria-hidden="true" />, color: "text-[var(--color-accent)]" },
        { name: t("skill_wrangling"), icon: <TbChartBar aria-hidden="true" />, color: "text-[var(--color-secondary)]" },
        { name: t("skill_dashboard"), icon: <TbChartBar aria-hidden="true" />, color: "text-rose-500" },
      ],
    },
    {
      category: t("skills_cat3"),
      skills: [
        { name: t("lang_italian"), sub: t("lang_italian_level"), icon: <TbLanguage aria-hidden="true" />, color: "text-green-500" },
        { name: t("lang_english"), sub: "C1", icon: <TbLanguage aria-hidden="true" />, color: "text-blue-500" },
        { name: t("lang_french"), sub: "C1", icon: <TbLanguage aria-hidden="true" />, color: "text-[var(--color-primary)]" },
        { name: t("lang_german"), sub: "B1", icon: <TbLanguage aria-hidden="true" />, color: "text-[var(--color-muted)]" },
      ],
    },
  ];

  return (
    <section
      id="skills"
      aria-label={t("skills_label")}
      className="py-24 bg-[var(--color-surface)]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div
          initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.55, ease: [0, 0, 0.2, 1] }}
          className="text-center mb-14"
        >
          <p className="text-[var(--color-primary)] font-semibold text-xs uppercase tracking-[0.2em] mb-2">
            {t("skills_label")}
          </p>
          <h2
            className="text-4xl font-bold text-[var(--foreground)] leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t("skills_title")}
          </h2>
          <p className="text-[var(--color-muted)] mt-4 max-w-xl mx-auto">
            {t("skills_subtitle")}
          </p>
        </motion.div>

        {/* Category grid — staggered */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
        >
          {skillCategories.map((cat, catIdx) => (
            <motion.div
              key={catIdx}
              variants={categoryVariants(reduced)}
              className="bg-[var(--background)] rounded-2xl p-6 shadow-sm border border-[var(--color-border)] hover:shadow-md transition-shadow duration-200"
            >
              <h3 className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider mb-5">
                {cat.category}
              </h3>
              <ul className="space-y-1">
                {cat.skills.map((skill, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[var(--color-surface)] transition-colors duration-150"
                  >
                    <span className={`text-2xl mt-0.5 flex-shrink-0 ${skill.color}`}>
                      {skill.icon}
                    </span>
                    <div className="min-w-0">
                      <div className="font-semibold text-[var(--foreground)] text-sm">{skill.name}</div>
                      {"sub" in skill && skill.sub && (
                        <div className="text-xs text-[var(--color-muted)] mt-0.5">{skill.sub}</div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
