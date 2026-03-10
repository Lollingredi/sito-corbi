"use client";

import { FiGithub, FiCheckCircle } from "react-icons/fi";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLang } from "@/context/LanguageContext";
import { motion } from "framer-motion";

const TAGS = ["R", "dplyr", "ggplot2", "Econometria", "Panel Data", "Analisi Regionale"];

const CONTENT = {
  it: {
    breadcrumb_projects: "Progetti",
    breadcrumb_self: "Tesi Magistrale",
    back: "← Progetti",
    period: "Ott 2022 – Dic 2024",
    grade_label: "Voto",
    grade: "110/110",
    uni: "Università di Verona & Julius-Maximilians-Universität Würzburg",
    subtitle: "Tesi di Laurea Magistrale · Doppia Laurea in Economics and Data Analysis",

    overview_label: "Contesto",
    overview_title: "Il Progetto di Ricerca",
    context_label: "Domanda di Ricerca",
    context: "In che misura il sistema di contrattazione salariale influenza la misallocation regionale? Confronto tra il modello centralizzato italiano e quello flessibile tedesco.",
    academic_label: "Contesto Accademico",
    academic: "Tesi magistrale discussa nell'ambito della doppia laurea tra Università di Verona e Julius-Maximilians-Universität Würzburg. Commissione internazionale, valutazione 110/110.",
    framework_label: "Framework Teorico",
    framework: "Riferimento al framework di Boeri, Ichino, Moretti & Posch (JEEA, 2021), che modella l'impatto dei salari nazionali sulla produttività regionale.",

    findings_label: "Risultati",
    findings_title: "Key Findings",
    findings: [
      {
        stat: "IT ≈ 0",
        label: "Salari vs Produttività in Italia",
        desc: "In Italia, i contratti nazionali creano una quasi-assenza di correlazione tra salari locali e produttività provinciale: le retribuzioni restano uniformi indipendentemente dalla performance territoriale.",
      },
      {
        stat: "DE > IT",
        label: "Flessibilità Salariale in Germania",
        desc: "Il sistema tedesco, più decentralizzato, mostra un legame più stretto tra salari e produttività a livello provinciale, consentendo un'allocazione più efficiente delle risorse.",
      },
      {
        stat: "N/S",
        label: "Gap Geografico Comune",
        desc: "Entrambi i paesi presentano disparità geografiche simili nella produttività (Nord/Sud in IT; Ovest/Est in DE), ma con esiti salariali divergenti per effetto dei diversi sistemi di contrattazione.",
      },
    ],

    process_label: "Metodologia",
    process_title: "Processo di Analisi",
    process_steps: [
      {
        phase: "Dati",
        title: "Raccolta dei dati",
        desc: "Raccolta di dataset provinciali su salari, occupazione e produttività per Italia e Germania da fonti istituzionali (ISTAT, Destatis, Eurostat). Copertura temporale pluriennale.",
      },
      {
        phase: "Wrangling",
        title: "Data wrangling in R",
        desc: "Pulizia e manipolazione dei dati con dplyr e tidyr: gestione dei valori mancanti, normalizzazione degli indicatori, costruzione del panel dataset bilanciato a livello provinciale.",
      },
      {
        phase: "Econometria",
        title: "Analisi econometrica",
        desc: "Regressioni panel con effetti fissi e random, statistiche descrittive comparative, test di Hausman per la specifica del modello e analisi cross-country dei coefficienti.",
      },
      {
        phase: "Visualizzazione",
        title: "Mappe e grafici con ggplot2",
        desc: "Mappe provinciali e grafici comparativi realizzati con ggplot2, per illustrare la distribuzione geografica della produttività e dei salari in Italia e Germania.",
      },
    ],

    stack_label: "Tecnologie",
    stack_title: "Stack Tecnologico",
    stack_items: ["R", "dplyr", "ggplot2", "tidyr", "Panel Data Econometrics", "Regression Analysis", "Hausman Test", "LaTeX"],

    learnings_label: "Takeaway",
    learnings_title: "Risultati & Apprendimenti",
    learnings: [
      "Primo progetto di ricerca econometrica su dati reali a livello provinciale (~NUTS-3)",
      "Esperienza end-to-end: dalla raccolta dati alla presentazione davanti a commissione internazionale",
      "Analisi comparativa cross-country su sistemi istituzionali diversi (IT vs DE)",
      "Padronanza di R per econometria e visualizzazione avanzata con ggplot2",
      "Redazione della tesi in formato accademico internazionale (doppia laurea)",
    ],
  },
  en: {
    breadcrumb_projects: "Projects",
    breadcrumb_self: "Master's Thesis",
    back: "← Projects",
    period: "Oct 2022 – Dec 2024",
    grade_label: "Grade",
    grade: "110/110",
    uni: "University of Verona & Julius-Maximilians-Universität Würzburg",
    subtitle: "Master's Thesis · Double Master's Degree in Economics and Data Analysis",

    overview_label: "Context",
    overview_title: "The Research Project",
    context_label: "Research Question",
    context: "To what extent does the wage-bargaining system influence regional misallocation? A comparison between Italy's centralised model and Germany's more flexible approach.",
    academic_label: "Academic Context",
    academic: "Master's thesis defended as part of a double degree programme between the University of Verona and Julius-Maximilians-Universität Würzburg. International examination board, grade 110/110.",
    framework_label: "Theoretical Framework",
    framework: "Built on the framework by Boeri, Ichino, Moretti & Posch (JEEA, 2021), which models the impact of national wage agreements on regional productivity.",

    findings_label: "Results",
    findings_title: "Key Findings",
    findings: [
      {
        stat: "IT ≈ 0",
        label: "Wages vs Productivity in Italy",
        desc: "In Italy, national collective agreements create a near-zero correlation between local wages and provincial productivity: remuneration remains uniform regardless of territorial performance.",
      },
      {
        stat: "DE > IT",
        label: "Wage Flexibility in Germany",
        desc: "Germany's more decentralised system shows a closer link between wages and provincial productivity, allowing for a more efficient allocation of resources across regions.",
      },
      {
        stat: "N/S",
        label: "Common Geographic Gap",
        desc: "Both countries show similar geographic productivity disparities (North/South in IT; West/East in DE), but with diverging wage outcomes due to their different bargaining systems.",
      },
    ],

    process_label: "Methodology",
    process_title: "Analysis Process",
    process_steps: [
      {
        phase: "Data",
        title: "Data collection",
        desc: "Collection of provincial datasets on wages, employment and productivity for Italy and Germany from institutional sources (ISTAT, Destatis, Eurostat). Multi-year temporal coverage.",
      },
      {
        phase: "Wrangling",
        title: "Data wrangling in R",
        desc: "Data cleaning and manipulation with dplyr and tidyr: handling missing values, normalising indicators, and building a balanced panel dataset at the provincial level.",
      },
      {
        phase: "Econometrics",
        title: "Econometric analysis",
        desc: "Panel regressions with fixed and random effects, comparative descriptive statistics, Hausman test for model specification, and cross-country coefficient analysis.",
      },
      {
        phase: "Visualisation",
        title: "Maps and charts with ggplot2",
        desc: "Provincial maps and comparative charts built with ggplot2 to illustrate the geographic distribution of productivity and wages across Italy and Germany.",
      },
    ],

    stack_label: "Technologies",
    stack_title: "Tech Stack",
    stack_items: ["R", "dplyr", "ggplot2", "tidyr", "Panel Data Econometrics", "Regression Analysis", "Hausman Test", "LaTeX"],

    learnings_label: "Takeaway",
    learnings_title: "Results & Learnings",
    learnings: [
      "First econometric research project on real provincial-level data (~NUTS-3)",
      "End-to-end experience: from data collection to presentation before an international examination board",
      "Cross-country comparative analysis of different institutional systems (IT vs DE)",
      "Proficiency in R for econometrics and advanced visualisation with ggplot2",
      "Academic thesis written in international format as part of a double degree programme",
    ],
  },
};

export default function ThesisPage() {
  const { lang } = useLang();
  const c = CONTENT[lang];

  return (
    <>
      <Navbar />
      <main className="pt-20 bg-white dark:bg-gray-900 min-h-screen">

        {/* ── HEADER ─────────────────────────────────────────── */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 mb-6">
              <Link href="/" className="hover:text-indigo-500 transition-colors">Home</Link>
              <span>/</span>
              <Link href="/#projects" className="hover:text-indigo-500 transition-colors">{c.breadcrumb_projects}</Link>
              <span>/</span>
              <span className="text-gray-600 dark:text-gray-300">{c.breadcrumb_self}</span>
            </nav>

            <Link
              href="/#projects"
              className="inline-flex items-center gap-1 text-sm text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors mb-8 font-medium"
            >
              {c.back}
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Period + grade row */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <p className="text-indigo-500 font-semibold text-sm uppercase tracking-widest font-mono">{c.period}</p>
                <span className="inline-flex items-center gap-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold px-3 py-1 rounded-full">
                  ★ {c.grade_label}: {c.grade}
                </span>
              </div>

              <h1
                className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-3 leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Regional Misallocation:<br />
                <span className="text-indigo-500">Italia vs Germania</span>
              </h1>

              <p className="text-base text-gray-500 dark:text-gray-400 mb-1">{c.subtitle}</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 font-mono mb-6">{c.uni}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {TAGS.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <a
                href="https://github.com/corbisieromichele00/thesis"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gray-900 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
              >
                <FiGithub className="w-4 h-4" /> GitHub
              </a>
            </motion.div>
          </div>
        </section>

        {/* ── OVERVIEW ───────────────────────────────────────── */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <p className="text-indigo-500 font-semibold text-sm uppercase tracking-widest mb-2">{c.overview_label}</p>
            <h2
              className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {c.overview_title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { label: c.context_label,   content: c.context   },
                { label: c.academic_label,  content: c.academic  },
                { label: c.framework_label, content: c.framework },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700"
                >
                  <div className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-3">{item.label}</div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{item.content}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── KEY FINDINGS ───────────────────────────────────── */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <p className="text-indigo-500 font-semibold text-sm uppercase tracking-widest mb-2">{c.findings_label}</p>
            <h2
              className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {c.findings_title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {c.findings.map((f, i) => (
                <motion.div
                  key={f.stat}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-white dark:bg-gray-700 rounded-2xl p-6 border border-gray-100 dark:border-gray-600 shadow-sm"
                >
                  <div className="text-3xl font-bold text-indigo-500 mb-1 font-mono">{f.stat}</div>
                  <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">{f.label}</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── METHODOLOGY ────────────────────────────────────── */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <p className="text-indigo-500 font-semibold text-sm uppercase tracking-widest mb-2">{c.process_label}</p>
            <h2
              className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-10"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {c.process_title}
            </h2>
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-indigo-100 dark:bg-indigo-900 hidden sm:block" />
              <div className="space-y-5">
                {c.process_steps.map((step, i) => (
                  <motion.div
                    key={step.phase}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="flex gap-5"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center z-10 shadow-sm">
                      <span className="text-white text-xs font-bold">{i + 1}</span>
                    </div>
                    <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {step.phase}
                        </span>
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{step.title}</h3>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── TECH STACK ─────────────────────────────────────── */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <p className="text-indigo-500 font-semibold text-sm uppercase tracking-widest mb-2">{c.stack_label}</p>
            <h2
              className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {c.stack_title}
            </h2>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4 }}
              className="bg-white dark:bg-gray-700 rounded-2xl p-8 border border-gray-100 dark:border-gray-600 shadow-sm"
            >
              <div className="flex flex-wrap gap-3">
                {c.stack_items.map((item, i) => (
                  <motion.span
                    key={item}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                    className="text-sm font-semibold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-full border border-indigo-100 dark:border-indigo-800"
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── LEARNINGS ──────────────────────────────────────── */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <p className="text-indigo-500 font-semibold text-sm uppercase tracking-widest mb-2">{c.learnings_label}</p>
            <h2
              className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {c.learnings_title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              {c.learnings.map((l, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.35, delay: i * 0.07 }}
                  className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700"
                >
                  <FiCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{l}</p>
                </motion.div>
              ))}
            </div>

            {/* Bottom CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/#projects"
                className="inline-flex items-center gap-2 border-2 border-indigo-500 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 font-semibold px-6 py-3 rounded-full transition-colors text-sm"
              >
                {c.back}
              </Link>
              <a
                href="https://github.com/corbisieromichele00/thesis"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gray-900 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-full transition-colors text-sm"
              >
                <FiGithub className="w-4 h-4" /> GitHub
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
