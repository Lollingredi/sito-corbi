"use client";

// Skills applied: frontend-design (editorial card design, accent top-bar),
//                 accesslint (link-purpose — descriptive link text, aria-hidden icons),
//                 ui-ux-pro-max (scale + stagger animation, shadow on hover),
//                 react-best-practices (hoist static data outside render)

import { motion, Variants, useReducedMotion } from "framer-motion";
import { FiGithub, FiExternalLink } from "react-icons/fi";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";

/* ── Static data — hoisted out of render (react-best-practices) */
const PROJECT_COLORS = ["bg-indigo-500", "bg-emerald-500"] as const;

/* ── Variants ──────────────────────────────────────────────────── */
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = (reduced: boolean): Variants => ({
  hidden: reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0, 0, 0.2, 1] },
  },
});

export default function Projects() {
  const { t } = useLang();
  const reduced = useReducedMotion() ?? false;

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
    <section
      id="projects"
      aria-label={t("projects_label")}
      className="py-24 bg-[var(--background)]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Section header */}
        <motion.div
          initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.55, ease: [0, 0, 0.2, 1] }}
          className="text-center mb-14"
        >
          <p className="text-[var(--color-primary)] font-semibold text-xs uppercase tracking-[0.2em] mb-2">
            {t("projects_label")}
          </p>
          <h2
            className="text-4xl font-bold text-[var(--foreground)] leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t("projects_title")}
          </h2>
          <p className="text-[var(--color-muted)] mt-4 max-w-xl mx-auto text-base">
            {t("projects_subtitle")}
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
        >
          {projects.map((project, i) => (
            <motion.article
              key={i}
              variants={cardVariants(reduced)}
              whileHover={reduced ? {} : { y: -4, transition: { duration: 0.2 } }}
              className="bg-[var(--background)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col group"
            >
              {/* Colour accent bar — editorial "category marker" */}
              <div className={`h-1.5 ${PROJECT_COLORS[i % PROJECT_COLORS.length]} w-full`} aria-hidden="true" />

              <div className="p-6 flex flex-col flex-1">
                <h3
                  className="text-xl font-bold text-[var(--foreground)] mb-3 leading-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {project.title}
                </h3>
                <p className="text-[var(--color-muted)] text-sm leading-relaxed flex-1">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium bg-[var(--color-surface)] text-[var(--color-primary)] px-3 py-1 rounded-full border border-[var(--color-border)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Links — descriptive text includes project title for WCAG 2.4.4 */}
                <div className="flex gap-4 mt-5 pt-4 border-t border-[var(--color-border)]">
                  {project.github ? (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Codice sorgente di «${project.title}» su GitHub`}
                      className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors duration-150"
                    >
                      <FiGithub className="w-4 h-4" aria-hidden="true" />
                      GitHub
                    </a>
                  ) : (
                    <span className="flex items-center gap-1.5 text-sm text-[var(--color-border)] cursor-not-allowed select-none">
                      <FiGithub className="w-4 h-4" aria-hidden="true" />
                      GitHub
                    </span>
                  )}

                  {project.live ? (
                    <Link
                      href={project.live}
                      aria-label={`Apri progetto «${project.title}» — visualizzazione interattiva`}
                      className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-secondary)] transition-colors duration-150"
                    >
                      <FiExternalLink className="w-4 h-4" aria-hidden="true" />
                      Live
                    </Link>
                  ) : (
                    <span className="flex items-center gap-1.5 text-sm text-[var(--color-border)] cursor-not-allowed select-none">
                      <FiExternalLink className="w-4 h-4" aria-hidden="true" />
                      Live
                    </span>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
