"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { FiGithub, FiExternalLink } from "react-icons/fi";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLang();

  const projects = [
    {
      title: t("proj1_title"),
      description: t("proj1_desc"),
      tags: ["SQL", "Tableau", "Google Data Analytics"],
      github: "https://github.com/corbisieromichele00/cyclistic-bike-share-analysis",
      live: "/projects/cyclistic-bike-share",
    },
    {
      title: t("proj4_title"),
      description: t("proj4_desc"),
      tags: ["Stata", "TeX", "Econometria", "Panel Data"],
      github: "https://github.com/corbisieromichele00/thesis",
      live: "/projects/thesis",
    },
  ];

  return (
    <section id="projects" className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-indigo-500 font-semibold text-sm uppercase tracking-widest mb-2">
            {t("projects_label")}
          </p>
          <h2
            className="text-4xl font-bold text-gray-900 dark:text-gray-100"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t("projects_title")}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-xl mx-auto">
            {t("projects_subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{project.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed flex-1">{project.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex gap-3 mt-5">
                {"github" in project && project.github ? (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                  >
                    <FiGithub className="w-4 h-4" /> GitHub
                  </a>
                ) : (
                  <span className="flex items-center gap-1 text-sm text-gray-300 dark:text-gray-600 cursor-not-allowed">
                    <FiGithub className="w-4 h-4" /> GitHub
                  </span>
                )}
                {"live" in project && project.live ? (
                  <Link
                    href={project.live}
                    className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                  >
                    <FiExternalLink className="w-4 h-4" /> Live
                  </Link>
                ) : (
                  <span className="flex items-center gap-1 text-sm text-gray-300 dark:text-gray-600 cursor-not-allowed">
                    <FiExternalLink className="w-4 h-4" /> Live
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
