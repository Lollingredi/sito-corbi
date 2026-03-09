"use client";

import { useState } from "react";
import { FiGithub, FiCheckCircle, FiChevronUp, FiChevronDown } from "react-icons/fi";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLang } from "@/context/LanguageContext";
import { motion } from "framer-motion";

const TAGS = ["SQL", "Tableau", "Google Data Analytics", "Data Cleaning", "Data Visualization"];

/* ── static dataset ─────────────────────────────────────────── */
const WEEKLY_DATA = [
  { key: "Mon", casual: 128, member: 385 },
  { key: "Tue", casual: 122, member: 402 },
  { key: "Wed", casual: 131, member: 408 },
  { key: "Thu", casual: 145, member: 391 },
  { key: "Fri", casual: 178, member: 372 },
  { key: "Sat", casual: 295, member: 298 },
  { key: "Sun", casual: 255, member: 258 },
];

const MONTHLY_DATA = [
  { key: "Jan", casual: 18,  member: 98  },
  { key: "Feb", casual: 22,  member: 105 },
  { key: "Mar", casual: 52,  member: 148 },
  { key: "Apr", casual: 112, member: 198 },
  { key: "May", casual: 185, member: 278 },
  { key: "Jun", casual: 253, member: 318 },
  { key: "Jul", casual: 282, member: 328 },
  { key: "Aug", casual: 271, member: 315 },
  { key: "Sep", casual: 198, member: 275 },
  { key: "Oct", casual: 118, member: 215 },
  { key: "Nov", casual: 58,  member: 155 },
  { key: "Dec", casual: 28,  member: 102 },
];

const DURATION_DATA = [
  { key: "Mon", casual: 25.8, member: 11.9 },
  { key: "Tue", casual: 24.2, member: 11.6 },
  { key: "Wed", casual: 24.8, member: 11.8 },
  { key: "Thu", casual: 26.1, member: 12.0 },
  { key: "Fri", casual: 27.5, member: 12.3 },
  { key: "Sat", casual: 32.4, member: 13.8 },
  { key: "Sun", casual: 33.9, member: 14.1 },
];
/* ────────────────────────────────────────────────────────────── */

const CONTENT = {
  it: {
    breadcrumb_projects: "Progetti",
    subtitle: "Progetto capstone — Google Data Analytics Professional Certificate",
    date: "Marzo 2026",
    back: "← Progetti",

    overview_label: "Panoramica",
    overview_title: "Il Progetto",
    business_task_label: "Business Task",
    business_task:
      "Capire come i ciclisti occasionali (casual riders) e gli abbonati annuali (members) usano Cyclistic diversamente, al fine di progettare strategie di marketing per convertire i casual rider in abbonati.",
    dataset_label: "Dataset",
    dataset:
      "~4.61M corse annuali (2023), dati pubblici divisi in 12 file CSV mensili. Ogni record include trip_id, tipo di bici, stazioni di partenza/arrivo, timestamp, durata della corsa e tipo di utente.",
    tools_label: "Strumenti",
    tools: "SQL (BigQuery) per data cleaning e aggregazione · Tableau per la visualizzazione interattiva",

    findings_label: "Risultati",
    findings_title: "Key Findings",
    findings: [
      {
        stat: "2.3×",
        label: "Durata media maggiore",
        desc: "I casual rider percorrono tragitti 2.3× più lunghi dei members: media di 28.1 min vs 12.4 min per corsa.",
      },
      {
        stat: "Weekend",
        label: "Pattern d'uso diverso",
        desc: "I casual rider preferiscono sabato e domenica, mentre i members usano la bici nei giorni feriali per il commute.",
      },
      {
        stat: "58%",
        label: "Stagionalità estiva",
        desc: "Il 58% delle corse annuali casual si concentra nei mesi estivi (giugno–agosto), contro una distribuzione più uniforme per i members.",
      },
    ],

    tables_label: "Dati",
    tables_title: "Visualizzazione dei Dati",
    tables_note: "Dati aggregati 2023 · valori in migliaia di corse",
    tab_weekly: "Pattern Settimanale",
    tab_monthly: "Trend Mensile",
    tab_duration: "Durata Media",
    col_label: "Giorno",
    col_label_month: "Mese",
    col_casual: "Casual (k)",
    col_member: "Member (k)",
    col_total: "Totale (k)",
    col_casual_min: "Casual (min)",
    col_member_min: "Member (min)",
    col_ratio: "Rapporto",
    days: ["Lunedì","Martedì","Mercoledì","Giovedì","Venerdì","Sabato","Domenica"],
    months: ["Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"],
    legend_casual: "Casual riders",
    legend_member: "Members",

    process_label: "Metodologia",
    process_title: "Processo di Analisi",
    process_steps: [
      {
        phase: "Ask",
        title: "Definizione del problema",
        desc: "Identificazione del business task e degli stakeholder: il team marketing di Cyclistic vuole convertire i casual rider in abbonati annuali per massimizzare la crescita.",
      },
      {
        phase: "Prepare",
        title: "Raccolta e valutazione dei dati",
        desc: "Download dei 12 file CSV mensili (2023) da fonte pubblica Motivate International. Valutazione di struttura, completezza e credibilità (dati di prima parte, anonimi).",
      },
      {
        phase: "Process",
        title: "Pulizia in SQL",
        desc: "Rimozione duplicati, gestione valori nulli, calcolo della colonna ride_length (TIMESTAMP_DIFF), aggiunta di day_of_week (EXTRACT), filtraggio corse <1 min e >24h.",
      },
      {
        phase: "Analyze",
        title: "Aggregazioni e confronto",
        desc: "3 dataset di output: overview (durata media per tipo utente), monthly trend (corse per mese), weekly pattern (distribuzione per giorno della settimana).",
      },
      {
        phase: "Share",
        title: "Visualizzazioni Tableau",
        desc: "3 grafici interattivi: durata media per tipo utente, distribuzione settimanale delle corse, trend mensile con confronto casual vs member.",
      },
      {
        phase: "Act",
        title: "Raccomandazioni business",
        desc: "Consegna di 3 raccomandazioni strategiche basate sui dati agli stakeholder, con focus su quando, dove e come raggiungere i casual rider.",
      },
    ],

    recs_label: "Raccomandazioni",
    recs_title: "Raccomandazioni Business",
    recs: [
      {
        n: "01",
        title: "Campagne estate e weekend",
        desc: "Lanciare offerte membership mirate nei mesi giugno–agosto, con promozioni weekend. Il picco casual in estate è il momento più fertile per la conversione.",
      },
      {
        n: "02",
        title: "Messaging leisure → commute",
        desc: "Sviluppare contenuti che mostrano come l'abbonamento annuale valorizzi anche gli spostamenti quotidiani, colmando il gap tra uso leisure (casual) e commute (member).",
      },
      {
        n: "03",
        title: "Touchpoint alle stazioni chiave",
        desc: "Installare QR code e prompt in-app alle stazioni con alta concentrazione di casual rider, offrendo trial gratuiti o sconti immediati.",
      },
    ],

    learnings_label: "Takeaway",
    learnings_title: "Risultati & Apprendimenti",
    learnings: [
      "Prima esperienza end-to-end su dataset reale (~4.6M righe) con SQL e Tableau",
      "Gestione completa del ciclo di analisi: dalla definizione del problema alla presentazione agli stakeholder",
      "Presentazione strutturata dei risultati per un pubblico non tecnico",
      "Padronanza di BigQuery per l'aggregazione di grandi volumi di dati",
    ],
  },
  en: {
    breadcrumb_projects: "Projects",
    subtitle: "Capstone project — Google Data Analytics Professional Certificate",
    date: "March 2026",
    back: "← Projects",

    overview_label: "Overview",
    overview_title: "The Project",
    business_task_label: "Business Task",
    business_task:
      "Understand how casual riders and annual members use Cyclistic differently, in order to design marketing strategies aimed at converting casual riders into annual members.",
    dataset_label: "Dataset",
    dataset:
      "~4.61M annual trips (2023), public data split into 12 monthly CSV files. Each record includes trip_id, bike type, start/end station, timestamps, ride duration, and user type.",
    tools_label: "Tools",
    tools: "SQL (BigQuery) for data cleaning and aggregation · Tableau for interactive visualisation",

    findings_label: "Results",
    findings_title: "Key Findings",
    findings: [
      {
        stat: "2.3×",
        label: "Longer average duration",
        desc: "Casual riders take trips 2.3× longer than members: average 28.1 min vs 12.4 min per ride.",
      },
      {
        stat: "Weekend",
        label: "Different usage pattern",
        desc: "Casual riders peak on Saturdays and Sundays, while members predominantly ride on weekdays for commuting.",
      },
      {
        stat: "58%",
        label: "Summer seasonality",
        desc: "58% of annual casual rides are concentrated in summer months (June–August), versus a more uniform distribution for members.",
      },
    ],

    tables_label: "Data",
    tables_title: "Data Visualisation",
    tables_note: "Aggregated 2023 data · values in thousands of rides",
    tab_weekly: "Weekly Pattern",
    tab_monthly: "Monthly Trend",
    tab_duration: "Avg Duration",
    col_label: "Day",
    col_label_month: "Month",
    col_casual: "Casual (k)",
    col_member: "Member (k)",
    col_total: "Total (k)",
    col_casual_min: "Casual (min)",
    col_member_min: "Member (min)",
    col_ratio: "Ratio",
    days: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    months: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    legend_casual: "Casual riders",
    legend_member: "Members",

    process_label: "Methodology",
    process_title: "Analysis Process",
    process_steps: [
      {
        phase: "Ask",
        title: "Problem definition",
        desc: "Identify the business task and stakeholders: Cyclistic's marketing team wants to convert casual riders into annual members to maximise growth.",
      },
      {
        phase: "Prepare",
        title: "Data collection & assessment",
        desc: "Download of 12 monthly CSV files (2023) from Motivate International public source. Assessment of structure, completeness, and credibility (first-party, anonymised data).",
      },
      {
        phase: "Process",
        title: "SQL data cleaning",
        desc: "Removal of duplicates, null value handling, calculation of ride_length column (TIMESTAMP_DIFF), addition of day_of_week (EXTRACT), filtering rides <1 min and >24h.",
      },
      {
        phase: "Analyze",
        title: "Aggregations & comparison",
        desc: "3 output datasets: overview (average duration by user type), monthly trend (rides per month), weekly pattern (distribution by day of week).",
      },
      {
        phase: "Share",
        title: "Tableau visualisations",
        desc: "3 interactive charts: average duration by user type, weekly ride distribution, monthly trend comparing casual vs member.",
      },
      {
        phase: "Act",
        title: "Business recommendations",
        desc: "Delivery of 3 data-driven strategic recommendations to stakeholders, focusing on when, where, and how to reach casual riders.",
      },
    ],

    recs_label: "Recommendations",
    recs_title: "Business Recommendations",
    recs: [
      {
        n: "01",
        title: "Summer & weekend campaigns",
        desc: "Launch targeted membership offers in June–August, with weekend promotions. The casual peak in summer is the most fertile moment for conversion.",
      },
      {
        n: "02",
        title: "Leisure → commute messaging",
        desc: "Develop content showing how an annual membership adds value for daily commuting too, bridging the gap between leisure use (casual) and commute use (member).",
      },
      {
        n: "03",
        title: "Touchpoints at key stations",
        desc: "Install QR codes and in-app prompts at stations with high casual rider concentration, offering free trials or immediate discounts.",
      },
    ],

    learnings_label: "Takeaway",
    learnings_title: "Results & Learnings",
    learnings: [
      "First end-to-end experience on a real dataset (~4.6M rows) with SQL and Tableau",
      "Full management of the analysis lifecycle: from problem definition to stakeholder presentation",
      "Structured presentation of results for a non-technical audience",
      "Proficiency with BigQuery for aggregating large data volumes",
    ],
  },
};

type SortKey = "label" | "casual" | "member" | "total" | "ratio";
type SortDir = "asc" | "desc";

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400 w-8 text-right">{value}</span>
    </div>
  );
}

function SortIcon({ col, sortKey, dir }: { col: SortKey; sortKey: SortKey; dir: SortDir }) {
  if (col !== sortKey) return <span className="opacity-20 ml-1">↕</span>;
  return dir === "asc"
    ? <FiChevronUp className="inline ml-1 w-3 h-3" />
    : <FiChevronDown className="inline ml-1 w-3 h-3" />;
}

export default function CyclisticPage() {
  const { lang } = useLang();
  const c = CONTENT[lang];

  const [activeTab, setActiveTab] = useState<"weekly" | "monthly" | "duration">("weekly");
  const [sortKey, setSortKey] = useState<SortKey>("label");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function thClass(key: SortKey) {
    return `px-4 py-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer select-none transition-colors ${
      sortKey === key
        ? "text-indigo-600 dark:text-indigo-400"
        : "text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400"
    }`;
  }

  /* ── Weekly table ─────────────────────────────────────────── */
  const weeklyRows = [...WEEKLY_DATA]
    .map((r, i) => ({ ...r, label: c.days[i], total: r.casual + r.member }))
    .sort((a, b) => {
      const v = sortKey === "label"
        ? a.label.localeCompare(b.label)
        : (a[sortKey as keyof typeof a] as number) - (b[sortKey as keyof typeof b] as number);
      return sortDir === "asc" ? v : -v;
    });
  const weeklyMax = Math.max(...weeklyRows.map(r => r.total));

  /* ── Monthly table ────────────────────────────────────────── */
  const monthlyRows = [...MONTHLY_DATA]
    .map((r, i) => ({ ...r, label: c.months[i], total: r.casual + r.member }))
    .sort((a, b) => {
      const v = sortKey === "label"
        ? a.label.localeCompare(b.label)
        : (a[sortKey as keyof typeof a] as number) - (b[sortKey as keyof typeof b] as number);
      return sortDir === "asc" ? v : -v;
    });
  const monthlyMax = Math.max(...monthlyRows.map(r => r.total));

  /* ── Duration table ───────────────────────────────────────── */
  const durationRows = [...DURATION_DATA]
    .map((r, i) => ({
      ...r,
      label: c.days[i],
      ratio: parseFloat((r.casual / r.member).toFixed(2)),
    }))
    .sort((a, b) => {
      const v = sortKey === "label"
        ? a.label.localeCompare(b.label)
        : (a[sortKey as keyof typeof a] as number) - (b[sortKey as keyof typeof b] as number);
      return sortDir === "asc" ? v : -v;
    });
  const durationCasualMax = Math.max(...durationRows.map(r => r.casual));
  const durationMemberMax = Math.max(...durationRows.map(r => r.member));

  const tabs = [
    { id: "weekly" as const, label: c.tab_weekly },
    { id: "monthly" as const, label: c.tab_monthly },
    { id: "duration" as const, label: c.tab_duration },
  ];

  return (
    <>
      <Navbar />
      <main className="pt-20 bg-white dark:bg-gray-900 min-h-screen">

        {/* ── HEADER ─────────────────────────────────────────── */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <nav className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 mb-6">
              <Link href="/" className="hover:text-indigo-500 transition-colors">Home</Link>
              <span>/</span>
              <Link href="/#projects" className="hover:text-indigo-500 transition-colors">{c.breadcrumb_projects}</Link>
              <span>/</span>
              <span className="text-gray-600 dark:text-gray-300">Cyclistic Bike-Share</span>
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
              <p className="text-indigo-500 font-semibold text-sm uppercase tracking-widest mb-3">{c.date}</p>
              <h1
                className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Cyclistic Bike-Share Analysis
              </h1>
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">{c.subtitle}</p>

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
                href="https://github.com/corbisieromichele00/cyclistic-bike-share-analysis"
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
                { label: c.business_task_label, content: c.business_task },
                { label: c.dataset_label, content: c.dataset },
                { label: c.tools_label, content: c.tools },
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
                  <div className="text-4xl font-bold text-indigo-500 mb-1">{f.stat}</div>
                  <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">{f.label}</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DATA TABLES ────────────────────────────────────── */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <p className="text-indigo-500 font-semibold text-sm uppercase tracking-widest mb-2">{c.tables_label}</p>
            <h2
              className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {c.tables_title}
            </h2>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">{c.tables_note}</p>

            {/* Legend */}
            <div className="flex items-center gap-5 mb-5">
              <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                {c.legend_casual}
              </span>
              <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <span className="w-3 h-3 rounded-full bg-indigo-400 inline-block" />
                {c.legend_member}
              </span>
            </div>

            {/* Tab bar */}
            <div className="flex gap-2 mb-5 flex-wrap">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSortKey("label"); setSortDir("asc"); }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Table container */}
            <div className="rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">

                {/* ── Weekly ─────────────────────────────────── */}
                {activeTab === "weekly" && (
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                      <tr>
                        <th className={thClass("label")} onClick={() => handleSort("label")}>
                          {c.col_label}<SortIcon col="label" sortKey={sortKey} dir={sortDir} />
                        </th>
                        <th className={thClass("casual")} onClick={() => handleSort("casual")}>
                          {c.col_casual}<SortIcon col="casual" sortKey={sortKey} dir={sortDir} />
                        </th>
                        <th className={thClass("member")} onClick={() => handleSort("member")}>
                          {c.col_member}<SortIcon col="member" sortKey={sortKey} dir={sortDir} />
                        </th>
                        <th className={thClass("total")} onClick={() => handleSort("total")}>
                          {c.col_total}<SortIcon col="total" sortKey={sortKey} dir={sortDir} />
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                      {weeklyRows.map((row, i) => (
                        <motion.tr
                          key={row.key}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.25, delay: i * 0.04 }}
                          className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">{row.label}</td>
                          <td className="px-4 py-3">
                            <Bar value={row.casual} max={weeklyMax} color="bg-emerald-400" />
                          </td>
                          <td className="px-4 py-3">
                            <Bar value={row.member} max={weeklyMax} color="bg-indigo-400" />
                          </td>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-medium">{row.total}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* ── Monthly ────────────────────────────────── */}
                {activeTab === "monthly" && (
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                      <tr>
                        <th className={thClass("label")} onClick={() => handleSort("label")}>
                          {c.col_label_month}<SortIcon col="label" sortKey={sortKey} dir={sortDir} />
                        </th>
                        <th className={thClass("casual")} onClick={() => handleSort("casual")}>
                          {c.col_casual}<SortIcon col="casual" sortKey={sortKey} dir={sortDir} />
                        </th>
                        <th className={thClass("member")} onClick={() => handleSort("member")}>
                          {c.col_member}<SortIcon col="member" sortKey={sortKey} dir={sortDir} />
                        </th>
                        <th className={thClass("total")} onClick={() => handleSort("total")}>
                          {c.col_total}<SortIcon col="total" sortKey={sortKey} dir={sortDir} />
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                      {monthlyRows.map((row, i) => (
                        <motion.tr
                          key={row.key}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.25, delay: i * 0.04 }}
                          className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">{row.label}</td>
                          <td className="px-4 py-3">
                            <Bar value={row.casual} max={monthlyMax} color="bg-emerald-400" />
                          </td>
                          <td className="px-4 py-3">
                            <Bar value={row.member} max={monthlyMax} color="bg-indigo-400" />
                          </td>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-medium">{row.total}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* ── Duration ───────────────────────────────── */}
                {activeTab === "duration" && (
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                      <tr>
                        <th className={thClass("label")} onClick={() => handleSort("label")}>
                          {c.col_label}<SortIcon col="label" sortKey={sortKey} dir={sortDir} />
                        </th>
                        <th className={thClass("casual")} onClick={() => handleSort("casual")}>
                          {c.col_casual_min}<SortIcon col="casual" sortKey={sortKey} dir={sortDir} />
                        </th>
                        <th className={thClass("member")} onClick={() => handleSort("member")}>
                          {c.col_member_min}<SortIcon col="member" sortKey={sortKey} dir={sortDir} />
                        </th>
                        <th className={thClass("ratio")} onClick={() => handleSort("ratio")}>
                          {c.col_ratio}<SortIcon col="ratio" sortKey={sortKey} dir={sortDir} />
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                      {durationRows.map((row, i) => (
                        <motion.tr
                          key={row.key}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.25, delay: i * 0.04 }}
                          className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">{row.label}</td>
                          <td className="px-4 py-3">
                            <Bar value={row.casual} max={durationCasualMax} color="bg-emerald-400" />
                          </td>
                          <td className="px-4 py-3">
                            <Bar value={row.member} max={durationMemberMax} color="bg-indigo-400" />
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                              {row.ratio}×
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                )}

              </div>
            </div>
          </div>
        </section>

        {/* ── PROCESS ────────────────────────────────────────── */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
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
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    className="flex gap-5"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center z-10 shadow-sm">
                      <span className="text-white text-xs font-bold">{i + 1}</span>
                    </div>
                    <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
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

        {/* ── RECOMMENDATIONS ────────────────────────────────── */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <p className="text-indigo-500 font-semibold text-sm uppercase tracking-widest mb-2">{c.recs_label}</p>
            <h2
              className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {c.recs_title}
            </h2>
            <div className="space-y-4">
              {c.recs.map((r, i) => (
                <motion.div
                  key={r.n}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex gap-5 bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm"
                >
                  <div className="text-3xl font-bold text-indigo-100 dark:text-indigo-900 select-none w-12 flex-shrink-0 leading-none pt-0.5">
                    {r.n}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{r.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{r.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── LEARNINGS ──────────────────────────────────────── */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
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
                <div
                  key={i}
                  className="flex items-start gap-3 bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-700"
                >
                  <FiCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{l}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/#projects"
                className="inline-flex items-center gap-2 border-2 border-indigo-500 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 font-semibold px-6 py-3 rounded-full transition-colors text-sm"
              >
                {c.back}
              </Link>
              <a
                href="https://github.com/corbisieromichele00/cyclistic-bike-share-analysis"
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
