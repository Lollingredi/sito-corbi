"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { FiGithub, FiExternalLink } from "react-icons/fi";

interface Project {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  live?: string;
  emoji: string;
}

const projects: Project[] = [
  {
    title: "Analisi delle Vendite Retail",
    description:
      "Analisi esplorativa di un dataset di vendite retail per identificare trend stagionali, prodotti più performanti e aree di miglioramento. Dashboard interattiva creata con Tableau.",
    tags: ["Python", "Pandas", "Tableau", "Excel"],
    emoji: "📊",
  },
  {
    title: "Dashboard KPI Aziendale",
    description:
      "Sviluppo di una dashboard Power BI per il monitoraggio dei KPI aziendali in tempo reale, con integrazione di dati da SQL Server e automazione del reporting mensile.",
    tags: ["Power BI", "SQL", "DAX", "Excel"],
    emoji: "📈",
  },
  {
    title: "Segmentazione Clienti con ML",
    description:
      "Progetto di clustering per la segmentazione della base clienti di un e-commerce, utilizzando algoritmi K-Means per identificare profili di acquisto e personalizzare le campagne marketing.",
    tags: ["Python", "Scikit-learn", "Pandas", "Matplotlib"],
    emoji: "🤖",
  },
];

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-indigo-500 font-semibold text-sm uppercase tracking-widest mb-2">
            Portfolio
          </p>
          <h2
            className="text-4xl font-bold text-gray-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            I miei Progetti
          </h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">
            Una selezione di progetti che mostrano le mie competenze nell&apos;analisi dati,
            nella visualizzazione e nel machine learning.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="text-4xl mb-4">{project.emoji}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{project.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed flex-1">{project.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex gap-3 mt-5">
                {project.github ? (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-indigo-500 transition-colors"
                  >
                    <FiGithub className="w-4 h-4" /> GitHub
                  </a>
                ) : (
                  <span className="flex items-center gap-1 text-sm text-gray-300 cursor-not-allowed">
                    <FiGithub className="w-4 h-4" /> GitHub
                  </span>
                )}
                {project.live ? (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-emerald-500 transition-colors"
                  >
                    <FiExternalLink className="w-4 h-4" /> Live
                  </a>
                ) : (
                  <span className="flex items-center gap-1 text-sm text-gray-300 cursor-not-allowed">
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
