"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { SiPython, SiR } from "react-icons/si";
import { TbFileExcel, TbSql, TbChartBar, TbLanguage } from "react-icons/tb";

interface Skill {
  name: string;
  sub?: string;
  icon: React.ReactNode;
  color: string;
}

interface SkillCategory {
  category: string;
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    category: "Strumenti & Linguaggi",
    skills: [
      { name: "SQL", sub: "JOIN, GROUP BY, window functions", icon: <TbSql />, color: "text-blue-500" },
      { name: "Python", sub: "pandas, NumPy, matplotlib, scikit-learn", icon: <SiPython />, color: "text-yellow-500" },
      { name: "R", sub: "dplyr, ggplot2", icon: <SiR />, color: "text-blue-700" },
      { name: "Tableau", icon: <TbChartBar />, color: "text-blue-600" },
      { name: "Microsoft Excel", sub: "Pivot Tables, XLOOKUP", icon: <TbFileExcel />, color: "text-emerald-600" },
    ],
  },
  {
    category: "Analisi dei Dati",
    skills: [
      { name: "Statistica descrittiva e inferenziale", icon: <TbChartBar />, color: "text-indigo-500" },
      { name: "Test di ipotesi e regressione", icon: <TbChartBar />, color: "text-purple-500" },
      { name: "Exploratory Data Analysis (EDA)", icon: <TbChartBar />, color: "text-amber-500" },
      { name: "Data wrangling e validazione", icon: <TbChartBar />, color: "text-emerald-500" },
      { name: "Dashboard e reporting KPI", icon: <TbChartBar />, color: "text-rose-500" },
    ],
  },
  {
    category: "Lingue",
    skills: [
      { name: "Italiano", sub: "madrelingua", icon: <TbLanguage />, color: "text-green-600" },
      { name: "Inglese", sub: "C1", icon: <TbLanguage />, color: "text-blue-500" },
      { name: "Francese", sub: "C1", icon: <TbLanguage />, color: "text-indigo-500" },
      { name: "Tedesco", sub: "B1", icon: <TbLanguage />, color: "text-gray-600" },
    ],
  },
];

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-indigo-500 font-semibold text-sm uppercase tracking-widest mb-2">
            Toolkit
          </p>
          <h2
            className="text-4xl font-bold text-gray-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Competenze
          </h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">
            Gli strumenti e le tecnologie che utilizzo per trasformare i dati in insight azionabili.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skillCategories.map((cat, catIdx) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: catIdx * 0.15 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-5">
                {cat.category}
              </h3>
              <div className="space-y-3">
                {cat.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <span className={`text-2xl mt-0.5 flex-shrink-0 ${skill.color}`}>{skill.icon}</span>
                    <div>
                      <div className="font-medium text-gray-700 text-sm">{skill.name}</div>
                      {skill.sub && (
                        <div className="text-xs text-gray-400 mt-0.5">{skill.sub}</div>
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
