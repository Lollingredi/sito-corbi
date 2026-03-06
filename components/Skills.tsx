"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { SiPython, SiMysql, SiJupyter, SiGit } from "react-icons/si";
import {
  TbChartBar,
  TbFileExcel,
  TbDatabase,
  TbChartPie,
  TbReportAnalytics,
  TbSql,
} from "react-icons/tb";

interface Skill {
  name: string;
  icon: React.ReactNode;
  color: string;
}

interface SkillCategory {
  category: string;
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    category: "Linguaggi & Query",
    skills: [
      { name: "Python", icon: <SiPython />, color: "text-yellow-500" },
      { name: "SQL", icon: <TbSql />, color: "text-blue-500" },
      { name: "MySQL", icon: <SiMysql />, color: "text-orange-500" },
    ],
  },
  {
    category: "Visualizzazione",
    skills: [
      { name: "Tableau", icon: <TbChartBar />, color: "text-blue-600" },
      { name: "Power BI", icon: <TbChartPie />, color: "text-yellow-500" },
      { name: "Excel", icon: <TbFileExcel />, color: "text-emerald-600" },
    ],
  },
  {
    category: "Tools & Altro",
    skills: [
      { name: "Jupyter", icon: <SiJupyter />, color: "text-orange-400" },
      { name: "Git", icon: <SiGit />, color: "text-red-500" },
      { name: "Analisi Dati", icon: <TbReportAnalytics />, color: "text-indigo-500" },
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
            Gli strumenti e le tecnologie che utilizzo ogni giorno per trasformare
            i dati in insight azionabili.
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
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <span className={`text-2xl ${skill.color}`}>{skill.icon}</span>
                    <span className="font-medium text-gray-700">{skill.name}</span>
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
