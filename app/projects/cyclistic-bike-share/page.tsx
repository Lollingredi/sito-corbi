"use client";

import { useState, useMemo } from "react";
import { FiGithub, FiCheckCircle, FiChevronUp, FiChevronDown } from "react-icons/fi";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLang } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Tooltip, Legend, Filler,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Tooltip, Legend, Filler
);

const TAGS = ["SQL", "Tableau", "Google Data Analytics", "Data Cleaning", "Data Visualization"];

/* ── Chart palette ───────────────────────────────────────────────────────── */
const MEMBER_CLR  = "#6366f1";
const CASUAL_CLR  = "#f59e0b";
const MEMBER_FILL = "rgba(99,102,241,0.12)";
const CASUAL_FILL = "rgba(245,158,11,0.12)";

/* ── Dataset ─────────────────────────────────────────────────────────────── */
const MONTHLY_M = [83210, 95420, 178460, 214330, 258740, 320150, 345780, 334920, 278650, 225410, 121840, 80234];
const MONTHLY_C = [18540, 24310,  61820,  98430, 148720, 248670, 312440, 298540, 201830, 112440,  38920, 12943];
const WEEKLY_M  = [398000, 425000, 432000, 420000, 415000, 295000, 252000];
const WEEKLY_C  = [148000, 162000, 178000, 190000, 225000, 488000, 481000];
const DAILY_DUR_M = [11.8, 12.1, 12.4, 12.2, 12.0, 14.1, 13.9];
const DAILY_DUR_C = [24.5, 24.1, 25.0, 25.2, 26.3, 33.4, 32.8];
const DUR_DIST_M  = [8, 52, 28, 9, 3];
const DUR_DIST_C  = [2, 18, 32, 29, 19];

const TOTAL_M = MONTHLY_M.reduce((a, b) => a + b, 0); // 2,737,144
const TOTAL_C = MONTHLY_C.reduce((a, b) => a + b, 0); // 1,872,607
const PCT_M   = MONTHLY_M.map(v => +(v / TOTAL_M * 100).toFixed(1));
const PCT_C   = MONTHLY_C.map(v => +(v / TOTAL_C * 100).toFixed(1));
const RATIO   = MONTHLY_M.map((_, i) => +(MONTHLY_C[i] / MONTHLY_M[i]).toFixed(2));

/* ── Content ─────────────────────────────────────────────────────────────── */
const CONTENT = {
  it: {
    breadcrumb_projects: "Progetti",
    subtitle: "Progetto capstone — Google Data Analytics Professional Certificate",
    date: "Marzo 2026",
    back: "← Progetti",

    stat_member_rides: "Corse Members",     stat_casual_rides: "Corse Casual",
    stat_member_dur:   "Durata · Member",   stat_casual_dur:   "Durata · Casual",
    stat_total:        "Totale Corse (2023)",
    stat_member_sub:   "59.4% del totale",  stat_casual_sub:   "40.6% del totale",
    stat_member_dur_sub: "Uso orientato al commute",
    stat_casual_dur_sub: "2.3× più lungo dei members",
    stat_total_sub:    "Gen 2023 – Dic 2023",

    tab_duration: "Durata Corse",
    tab_weekly:   "Pattern Settimanale",
    tab_monthly:  "Trend Mensile",
    tab_data:     "Tabelle Dati",
    tab_insights: "Insights",

    chart_dur_type_title: "Durata Media per Tipo di Bici",
    chart_dur_type_desc:  "I casual rider percorrono tragitti più lunghi su ogni tipo di bici",
    chart_count_title:    "Distribuzione Corse",
    chart_count_desc:     "Totale corse per segmento (2023)",
    chart_dist_title:     "Distribuzione Durata",
    chart_dist_desc:      "% corse per fascia di durata",
    chart_weekly_title:   "Corse Settimanali per Tipo di Utente",
    chart_weekly_desc:    "I members picco nei giorni feriali; i casual preferiscono il weekend",
    chart_weekly_dur_title: "Durata Media Giornaliera (min)",
    chart_weekly_dur_desc:  "Le corse casual sono sempre più lunghe di quelle dei members",
    chart_monthly_title:  "Corse Mensili per Tipo di Utente",
    chart_monthly_desc:   "Entrambi i segmenti picco in estate; i casual mostrano maggiore stagionalità",
    chart_pct_title:      "% Corse Annuali per Mese",
    chart_pct_desc:       "L'uso casual è più concentrato nei mesi estivi",
    chart_ratio_title:    "Indice Stagionale",
    chart_ratio_desc:     "Rapporto Casual/Member per mese (>1 = più casual)",

    filter_label: "Filtro:",
    col_month: "Mese", col_type: "Tipo", col_rides: "Corse", col_pct: "% Annuale", col_dist: "Distribuzione",
    col_user: "Tipo", col_avg_dur: "Durata Media (min)", col_max_dur: "Durata Max (min)", col_share: "Quota",
    table_monthly_title: "Dati Mensili Corse",
    table_monthly_desc:  "Suddivisione per mese e tipo di utente",
    table_kpi_title:     "KPI Aggregati",
    table_kpi_desc:      "Statistiche aggregate per tipo di utente",

    insights: [
      { title: "Corse Casual Più Lunghe", text: "La durata media dei casual rider (28.1 min) è 2.3× più lunga di quella dei members (12.4 min), suggerendo un uso leisure vs commute." },
      { title: "Casual Preferisce il Weekend", text: "Il ridership casual picco sabato–domenica (~35% dei viaggi settimanali), mentre i members guidano con costanza dal lunedì al venerdì." },
      { title: "Forte Stagionalità", text: "Le corse casual sono altamente stagionali — giugno/luglio/agosto rappresentano ~58% delle corse casual annuali vs ~44% per i members." },
      { title: "Opportunità di Conversione", text: "Con 1.87M corse casual e forte engagement estivo, anche una conversione del 10% in abbonamento annuale rappresenterebbe una crescita significativa." },
    ],
    recs_title: "Raccomandazioni Business",
    recs_desc:  "Strategie per convertire i casual rider in abbonati annuali",
    recs: [
      { n: "01", title: "Campagne Estate e Weekend", desc: "Lanciare offerte membership nei mesi giugno–agosto, con promozioni weekend. Il picco casual estivo è il momento più fertile per la conversione." },
      { n: "02", title: "Messaging Leisure → Commute", desc: "Il marketing deve evidenziare il valore dell'abbonamento sia per il leisure che per gli spostamenti quotidiani, colmando il gap tra i due profili d'uso." },
      { n: "03", title: "Touchpoint alle Stazioni Chiave", desc: "Identificare le stazioni con alto ridership casual nel weekend. Installare QR code e prompt in-app per incentivare le iscrizioni sul momento." },
    ],
    learnings: [
      "Prima esperienza end-to-end su dataset reale (~4.6M righe) con SQL e Tableau",
      "Gestione del ciclo di analisi: dalla definizione del problema alla presentazione agli stakeholder",
      "Presentazione strutturata dei risultati per un pubblico non tecnico",
      "Padronanza di BigQuery per l'aggregazione di grandi volumi di dati",
    ],

    intro_title: "Il Progetto",
    intro_text: "Cyclistic è un servizio di bike-sharing di Chicago con oltre 5.800 biciclette e 692 stazioni. Il progetto nasce da una domanda di business concreta: in che modo i casual rider e i membri annuali usano le biciclette in modo diverso? Capirlo è essenziale perché i membri annuali sono significativamente più redditizi per l'azienda rispetto ai casual rider, e il team marketing vuole identificare le leve per incentivare la conversione.",
    intro_dataset: "Per rispondere, ho analizzato 4,61 milioni di corse registrate nel 2023. I dati sono stati puliti e aggregati con SQL su BigQuery, poi visualizzati con Tableau. Qui sotto trovi i grafici interattivi che documentano l'intero percorso di analisi.",
    tabs_note_title: "Come leggere questa analisi",
    tabs_note: "I grafici sono organizzati in quattro aree tematiche: Durata Corse (quanto durano le corse per tipo di utente e di bici), Pattern Settimanale (come cambia il comportamento giorno per giorno), Trend Mensile (la stagionalità nel corso dell'anno), e Tabelle Dati (i dati grezzi aggregati, filtrabili e ordinabili). La scheda Insights raccoglie le conclusioni e le raccomandazioni per il business.",
    conclusion_title: "Conclusioni",
    conclusion_text: "L'analisi rivela due profili d'uso nettamente distinti. I members usano le bici in modo regolare e funzionale — principalmente per il commute nei giorni feriali, con corse brevi di circa 12 minuti. I casual rider hanno invece un comportamento orientato al leisure: corse più lunghe (~28 min), concentrate nel fine settimana e nei mesi estivi, quando rappresentano oltre il 58% delle loro corse annuali.",
    conclusion_opportunity: "Questo gap comportamentale è un'opportunità di marketing concreta. Una strategia che valorizzi l'abbonamento anche per usi leisure e weekend — con campagne estive e touchpoint nelle stazioni ad alto traffico casual — potrebbe convertire una quota significativa degli 1,87 milioni di casual rider in abbonati annuali, impatto diretto sui ricavi di Cyclistic.",

    months: ["Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"],
    days:   ["Lun","Mar","Mer","Gio","Ven","Sab","Dom"],
    bike_types: ["Classic Bike", "Electric Bike"],
    dur_buckets: ["<5 min","5–15 min","15–30 min","30–60 min",">60 min"],
    legend_member: "Members",
    legend_casual: "Casual",
  },
  en: {
    breadcrumb_projects: "Projects",
    subtitle: "Capstone project — Google Data Analytics Professional Certificate",
    date: "March 2026",
    back: "← Projects",

    stat_member_rides: "Member Rides",      stat_casual_rides: "Casual Rides",
    stat_member_dur:   "Duration · Member", stat_casual_dur:   "Duration · Casual",
    stat_total:        "Total Rides (2023)",
    stat_member_sub:   "59.4% of total",    stat_casual_sub:   "40.6% of total",
    stat_member_dur_sub: "Commute-oriented usage",
    stat_casual_dur_sub: "2.3× longer than members",
    stat_total_sub:    "Jan 2023 – Dec 2023",

    tab_duration: "Ride Duration",
    tab_weekly:   "Weekly Patterns",
    tab_monthly:  "Seasonal Trends",
    tab_data:     "Data Tables",
    tab_insights: "Insights",

    chart_dur_type_title: "Avg Duration by Bike Type",
    chart_dur_type_desc:  "Casual riders take longer trips on every bike type",
    chart_count_title:    "Ride Count Distribution",
    chart_count_desc:     "Total rides per user segment (2023)",
    chart_dist_title:     "Duration Distribution",
    chart_dist_desc:      "% of rides by duration bucket",
    chart_weekly_title:   "Weekly Rides by User Type",
    chart_weekly_desc:    "Members peak on weekdays; casual riders peak on weekends",
    chart_weekly_dur_title: "Daily Average Duration (min)",
    chart_weekly_dur_desc:  "Casual rides are consistently longer every day of the week",
    chart_monthly_title:  "Monthly Rides by User Type",
    chart_monthly_desc:   "Both segments peak in summer; casual shows sharper seasonality",
    chart_pct_title:      "% of Annual Rides per Month",
    chart_pct_desc:       "Casual usage is more concentrated in summer months",
    chart_ratio_title:    "Seasonal Index",
    chart_ratio_desc:     "Casual/Member ratio by month (>1 = more casual)",

    filter_label: "Filter:",
    col_month: "Month", col_type: "Type", col_rides: "Rides", col_pct: "% Annual", col_dist: "Distribution",
    col_user: "Type", col_avg_dur: "Avg Duration (min)", col_max_dur: "Max Duration (min)", col_share: "Share",
    table_monthly_title: "Monthly Ride Data",
    table_monthly_desc:  "Breakdown by month and user type",
    table_kpi_title:     "Aggregate KPIs",
    table_kpi_desc:      "Statistics by user type",

    insights: [
      { title: "Casual Riders Take Longer Trips", text: "Average trip duration for casual riders (28.1 min) is 2.3× longer than for members (12.4 min), suggesting leisure-oriented vs. commute usage." },
      { title: "Casual Riders Prefer Weekends", text: "Casual ridership peaks Saturday–Sunday (~35% of weekly trips), while members ride consistently Monday–Friday for commuting." },
      { title: "Strong Seasonal Patterns", text: "Casual rides are highly seasonal — June/July/August account for ~58% of annual casual rides vs ~44% for members." },
      { title: "Conversion Opportunity", text: "With 1.87M casual rides and strong summer engagement, even a 10% conversion to annual membership could represent significant revenue growth." },
    ],
    recs_title: "Business Recommendations",
    recs_desc:  "Strategies to convert casual riders into annual members",
    recs: [
      { n: "01", title: "Summer & Weekend Campaigns", desc: "Launch targeted membership promotions during June–August, with weekend-specific offers. The summer casual peak is the most fertile conversion window." },
      { n: "02", title: "Leisure → Commute Messaging", desc: "Marketing should highlight membership value for both leisure AND weekday commutes — positioning annual membership as a cost-effective all-purpose pass." },
      { n: "03", title: "Touchpoints at Key Stations", desc: "Identify stations with high casual ridership on weekends. Deploy QR codes and in-app prompts at these locations during peak hours to drive in-the-moment conversions." },
    ],
    learnings: [
      "First end-to-end experience on a real dataset (~4.6M rows) with SQL and Tableau",
      "Full management of the analysis lifecycle: from problem definition to stakeholder presentation",
      "Structured presentation of results for a non-technical audience",
      "Proficiency with BigQuery for aggregating large data volumes",
    ],

    intro_title: "The Project",
    intro_text: "Cyclistic is a fictional bike-share service in Chicago with over 5,800 bicycles and 692 stations. The project starts from a concrete business question: how do casual riders and annual members use bikes differently? Understanding this is essential because annual members are significantly more profitable for the company than casual riders, and the marketing team wants to identify the levers to drive conversion.",
    intro_dataset: "To answer this, I analysed 4.61 million rides recorded in 2023. Data was cleaned and aggregated with SQL on BigQuery, then visualised with Tableau. The interactive charts below document the full analysis journey.",
    tabs_note_title: "How to read this analysis",
    tabs_note: "The charts are organised into four thematic areas: Ride Duration (how long trips last by user type and bike type), Weekly Patterns (how behaviour changes day by day), Seasonal Trends (seasonality across the year), and Data Tables (aggregated raw data, filterable and sortable). The Insights tab collects the key findings and business recommendations.",
    conclusion_title: "Conclusions",
    conclusion_text: "The analysis reveals two clearly distinct usage profiles. Members use bikes in a regular, functional way — primarily for weekday commuting, with short trips of around 12 minutes. Casual riders, on the other hand, exhibit leisure-oriented behaviour: longer trips (~28 min), concentrated at weekends and in summer months, when they account for more than 58% of their annual rides.",
    conclusion_opportunity: "This behavioural gap is a concrete marketing opportunity. A strategy that highlights the value of membership for leisure and weekend use — with summer campaigns and touchpoints at high casual-traffic stations — could convert a meaningful share of the 1.87 million casual riders into annual members, directly impacting Cyclistic's revenue.",

    months: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    days:   ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
    bike_types: ["Classic Bike", "Electric Bike"],
    dur_buckets: ["<5 min","5–15 min","15–30 min","30–60 min",">60 min"],
    legend_member: "Members",
    legend_casual: "Casual",
  },
};

/* ── Small components ─────────────────────────────────────────────────────── */

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub: string; accent: "member" | "casual" | "neutral" }) {
  const bar = accent === "member" ? "bg-indigo-500" : accent === "casual" ? "bg-amber-400" : "bg-gray-400";
  const val = accent === "member" ? "text-indigo-500" : accent === "casual" ? "text-amber-500" : "text-gray-700 dark:text-gray-200";
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className={`h-1 ${bar}`} />
      <div className="p-5">
        <div className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">{label}</div>
        <div className={`text-2xl font-bold ${val} leading-none mb-1`}>{value}</div>
        <div className="text-xs text-gray-400 dark:text-gray-500">{sub}</div>
      </div>
    </div>
  );
}

function ChartCard({ title, desc, children, full }: { title: string; desc: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={`bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 ${full ? "col-span-full" : ""}`}>
      <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-0.5 text-sm">{title}</h3>
      <p className="text-xs font-mono text-gray-400 dark:text-gray-500 mb-5">{desc}</p>
      {children}
    </div>
  );
}

/* ── Main page ────────────────────────────────────────────────────────────── */
type Tab = "duration" | "weekly" | "monthly" | "data" | "insights";
type SortKey = "label" | "rides" | "pct";
type SortDir = "asc" | "desc";

export default function CyclisticPage() {
  const { lang } = useLang();
  const { dark } = useTheme();
  const c = CONTENT[lang];

  const [activeTab, setActiveTab]     = useState<Tab>("duration");
  const [showMember, setShowMember]   = useState(true);
  const [showCasual, setShowCasual]   = useState(true);
  const [sortKey, setSortKey]         = useState<SortKey>("label");
  const [sortDir, setSortDir]         = useState<SortDir>("asc");

  /* ── Chart theme helpers ─────────────────────────────────────── */
  const grid  = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const muted = dark ? "#6b7280" : "#9ca3af";
  const tt    = useMemo(() => ({
    backgroundColor: dark ? "#1f2937" : "#ffffff",
    borderColor:     dark ? "#374151" : "#e5e7eb",
    titleColor:      dark ? "#f3f4f6" : "#111827",
    bodyColor:       dark ? "#d1d5db" : "#374151",
    borderWidth: 1,
    padding: 10,
  }), [dark]);

  function baseOpts(yFmt?: (v: number | string) => string) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { ...tt },
      },
      scales: {
        x: { grid: { color: grid }, ticks: { color: muted, font: { size: 11 } } },
        y: {
          grid: { color: grid },
          ticks: { color: muted, font: { size: 11 }, ...(yFmt ? { callback: yFmt } : {}) },
        },
      },
    };
  }

  function legend() {
    return {
      display: true,
      labels: {
        color: dark ? "#d1d5db" : "#374151",
        font: { size: 11 },
        usePointStyle: true,
        pointStyleWidth: 8,
      },
    };
  }

  /* ── Tab: duration charts ──────────────────────────────────── */
  const durTypeData = {
    labels: c.bike_types,
    datasets: [
      { label: c.legend_member, data: [13.2, 11.8], backgroundColor: MEMBER_CLR, borderRadius: 4 },
      { label: c.legend_casual, data: [30.4, 22.7], backgroundColor: CASUAL_CLR, borderRadius: 4 },
    ],
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lbl = (fn: (ctx: any) => string) => fn;

  const durTypeOpts = {
    ...baseOpts(v => v + " min"),
    plugins: {
      ...baseOpts().plugins,
      legend: legend(),
      tooltip: { ...tt, callbacks: { label: lbl(ctx => ` ${ctx.dataset.label}: ${ctx.raw} min`) } },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: muted, font: { size: 11 } } },
      y: { grid: { color: grid }, ticks: { color: muted, font: { size: 11 }, callback: (v: number | string) => v + " min" } },
    },
  };

  const donutData = {
    labels: [c.legend_member, c.legend_casual],
    datasets: [{
      data: [TOTAL_M, TOTAL_C],
      backgroundColor: [MEMBER_CLR, CASUAL_CLR],
      borderColor: dark ? "#111827" : "#ffffff",
      borderWidth: 3,
      hoverOffset: 6,
    }],
  };
  const donutOpts = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: { ...legend(), position: "bottom" as const },
      tooltip: { ...tt, callbacks: { label: lbl(ctx => ` ${ctx.label}: ${((ctx.raw as number) / 1e6).toFixed(2)}M`) } },
    },
  };

  const durDistData = {
    labels: c.dur_buckets,
    datasets: [
      { label: c.legend_member, data: DUR_DIST_M, backgroundColor: MEMBER_CLR, borderRadius: 3 },
      { label: c.legend_casual, data: DUR_DIST_C, backgroundColor: CASUAL_CLR, borderRadius: 3 },
    ],
  };
  const durDistOpts = {
    ...baseOpts(v => v + "%"),
    plugins: {
      ...baseOpts().plugins,
      legend: legend(),
      tooltip: { ...tt, callbacks: { label: lbl(ctx => ` ${ctx.dataset.label}: ${ctx.raw}%`) } },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: muted, font: { size: 11 } } },
      y: { grid: { color: grid }, ticks: { color: muted, font: { size: 11 }, callback: (v: number | string) => v + "%" } },
    },
  };

  /* ── Tab: weekly charts ────────────────────────────────────── */
  const weeklyData = {
    labels: c.days,
    datasets: [
      { label: c.legend_member, data: WEEKLY_M, backgroundColor: MEMBER_CLR, borderRadius: 3 },
      { label: c.legend_casual, data: WEEKLY_C, backgroundColor: CASUAL_CLR, borderRadius: 3 },
    ],
  };
  const weeklyOpts = {
    ...baseOpts(v => Math.round(+v / 1000) + "k"),
    plugins: {
      ...baseOpts().plugins,
      legend: legend(),
      tooltip: { ...tt, callbacks: { label: lbl(ctx => ` ${ctx.dataset.label}: ${(ctx.raw / 1000).toFixed(0)}k`) } },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: muted, font: { size: 11 } } },
      y: { grid: { color: grid }, ticks: { color: muted, font: { size: 11 }, callback: (v: number | string) => Math.round(+v / 1000) + "k" } },
    },
  };

  const dailyDurData = {
    labels: c.days,
    datasets: [
      { label: c.legend_member, data: DAILY_DUR_M, borderColor: MEMBER_CLR, backgroundColor: MEMBER_FILL, fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: MEMBER_CLR },
      { label: c.legend_casual, data: DAILY_DUR_C, borderColor: CASUAL_CLR, backgroundColor: CASUAL_FILL, fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: CASUAL_CLR },
    ],
  };
  const dailyDurOpts = {
    ...baseOpts(v => v + " min"),
    plugins: {
      ...baseOpts().plugins,
      legend: legend(),
      tooltip: { ...tt, callbacks: { label: lbl(ctx => ` ${ctx.dataset.label}: ${ctx.raw} min`) } },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: muted, font: { size: 11 } } },
      y: { grid: { color: grid }, ticks: { color: muted, font: { size: 11 }, callback: (v: number | string) => v + " min" } },
    },
  };

  /* ── Tab: monthly charts ───────────────────────────────────── */
  const monthlyData = {
    labels: c.months,
    datasets: [
      { label: c.legend_member, data: MONTHLY_M, borderColor: MEMBER_CLR, backgroundColor: MEMBER_FILL, fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: MEMBER_CLR },
      { label: c.legend_casual, data: MONTHLY_C, borderColor: CASUAL_CLR, backgroundColor: CASUAL_FILL, fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: CASUAL_CLR },
    ],
  };
  const monthlyOpts = {
    ...baseOpts(v => Math.round(+v / 1000) + "k"),
    plugins: {
      ...baseOpts().plugins,
      legend: legend(),
      tooltip: { ...tt, callbacks: { label: lbl(ctx => ` ${ctx.dataset.label}: ${(ctx.raw / 1000).toFixed(0)}k`) } },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: muted, font: { size: 11 } } },
      y: { grid: { color: grid }, ticks: { color: muted, font: { size: 11 }, callback: (v: number | string) => Math.round(+v / 1000) + "k" } },
    },
  };

  const pctData = {
    labels: c.months,
    datasets: [
      { label: c.legend_member, data: PCT_M, backgroundColor: MEMBER_CLR, borderRadius: 2 },
      { label: c.legend_casual, data: PCT_C, backgroundColor: CASUAL_CLR, borderRadius: 2 },
    ],
  };

  const ratioData = {
    labels: c.months,
    datasets: [{
      label: "Casual/Member",
      data: RATIO,
      backgroundColor: RATIO.map(v => v >= 1 ? CASUAL_CLR : MEMBER_CLR),
      borderRadius: 3,
    }],
  };

  /* ── Tab: data table rows ──────────────────────────────────── */
  const maxRides = Math.max(...MONTHLY_M, ...MONTHLY_C);
  const tableRows = useMemo(() => {
    const rows: { month: string; type: "member" | "casual"; rides: number; pct: number }[] = [];
    c.months.forEach((month, i) => {
      if (showMember) rows.push({ month, type: "member", rides: MONTHLY_M[i], pct: PCT_M[i] });
      if (showCasual) rows.push({ month, type: "casual", rides: MONTHLY_C[i], pct: PCT_C[i] });
    });
    return [...rows].sort((a, b) => {
      let v = 0;
      if (sortKey === "label")  v = a.month.localeCompare(b.month);
      if (sortKey === "rides")  v = a.rides - b.rides;
      if (sortKey === "pct")    v = a.pct - b.pct;
      return sortDir === "asc" ? v : -v;
    });
  }, [showMember, showCasual, sortKey, sortDir, c.months]);

  function handleSort(key: SortKey) {
    if (key === sortKey) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  }
  function SortIco({ k }: { k: SortKey }) {
    if (k !== sortKey) return <span className="opacity-20 ml-1 text-xs">↕</span>;
    return sortDir === "asc"
      ? <FiChevronUp className="inline ml-1 w-3 h-3 text-indigo-500" />
      : <FiChevronDown className="inline ml-1 w-3 h-3 text-indigo-500" />;
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: "duration", label: c.tab_duration },
    { id: "weekly",   label: c.tab_weekly   },
    { id: "monthly",  label: c.tab_monthly  },
    { id: "data",     label: c.tab_data     },
    { id: "insights", label: c.tab_insights },
  ];

  return (
    <>
      <Navbar />
      <main className="pt-20 bg-white dark:bg-gray-900 min-h-screen">

        {/* ── HEADER ─────────────────────────────────────────── */}
        <section className="py-14 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <nav className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 mb-5">
              <Link href="/" className="hover:text-indigo-500 transition-colors">Home</Link>
              <span>/</span>
              <Link href="/#projects" className="hover:text-indigo-500 transition-colors">{c.breadcrumb_projects}</Link>
              <span>/</span>
              <span className="text-gray-600 dark:text-gray-300">Cyclistic Bike-Share</span>
            </nav>

            <Link href="/#projects" className="inline-flex items-center gap-1 text-sm text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors mb-6 font-medium">
              {c.back}
            </Link>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
                <div>
                  <p className="text-indigo-500 font-semibold text-xs uppercase tracking-widest mb-2 font-mono">{c.date} · Case Study</p>
                  <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2" style={{ fontFamily: "var(--font-display)" }}>
                    Cyclistic <span className="text-indigo-500">Bike‑Share</span>
                  </h1>
                  <p className="text-sm text-gray-400 dark:text-gray-500 font-mono">{c.subtitle}</p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="flex items-center gap-3 text-sm font-semibold">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> {c.legend_member}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> {c.legend_casual}
                    </span>
                  </div>
                  <a href="https://github.com/corbisieromichele00/cyclistic-bike-share-analysis" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gray-900 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors">
                    <FiGithub className="w-4 h-4" /> GitHub
                  </a>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-5">
                {TAGS.map(tag => (
                  <span key={tag} className="text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── INTRODUCTION ───────────────────────────────────── */}
        <section className="border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }}>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4" style={{ fontFamily: "var(--font-display)" }}>
                {c.intro_title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                {c.intro_text}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {c.intro_dataset}
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── STATS ROW ──────────────────────────────────────── */}
        <section className="border-b border-gray-100 dark:border-gray-700">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <StatCard label={c.stat_member_rides} value="2.74M" sub={c.stat_member_sub} accent="member" />
              <StatCard label={c.stat_casual_rides} value="1.87M" sub={c.stat_casual_sub} accent="casual" />
              <StatCard label={c.stat_member_dur}   value="12.4 min" sub={c.stat_member_dur_sub} accent="member" />
              <StatCard label={c.stat_casual_dur}   value="28.1 min" sub={c.stat_casual_dur_sub} accent="casual" />
              <StatCard label={c.stat_total}         value="4.61M" sub={c.stat_total_sub} accent="neutral" />
            </div>
          </div>
        </section>

        {/* ── TABS EXPLANATION ───────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-2">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/40 rounded-2xl px-6 py-4 flex gap-4">
            <span className="text-indigo-400 text-lg flex-shrink-0 mt-0.5">ⓘ</span>
            <div>
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1">{c.tabs_note_title}</p>
              <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed">{c.tabs_note}</p>
            </div>
          </div>
        </div>

        {/* ── TAB NAV ────────────────────────────────────────── */}
        <div className="sticky top-16 z-20 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex overflow-x-auto gap-0 scrollbar-none">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-5 py-4 text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-colors flex-shrink-0 ${
                    activeTab === tab.id
                      ? "text-indigo-500"
                      : "text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── TAB CONTENT ────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

          {/* ── Duration ─────────────────────────────────────── */}
          {activeTab === "duration" && (
            <motion.div key="duration" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <ChartCard title={c.chart_dur_type_title} desc={c.chart_dur_type_desc} full>
                <div className="h-64">
                  <Bar data={durTypeData} options={durTypeOpts as Parameters<typeof Bar>[0]["options"]} />
                </div>
              </ChartCard>
              <ChartCard title={c.chart_count_title} desc={c.chart_count_desc}>
                <div className="h-60">
                  <Doughnut data={donutData} options={donutOpts} />
                </div>
              </ChartCard>
              <ChartCard title={c.chart_dist_title} desc={c.chart_dist_desc}>
                <div className="h-60">
                  <Bar data={durDistData} options={durDistOpts as Parameters<typeof Bar>[0]["options"]} />
                </div>
              </ChartCard>
            </motion.div>
          )}

          {/* ── Weekly ───────────────────────────────────────── */}
          {activeTab === "weekly" && (
            <motion.div key="weekly" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <ChartCard title={c.chart_weekly_title} desc={c.chart_weekly_desc} full>
                <div className="h-72">
                  <Bar data={weeklyData} options={weeklyOpts as Parameters<typeof Bar>[0]["options"]} />
                </div>
              </ChartCard>
              <ChartCard title={c.chart_weekly_dur_title} desc={c.chart_weekly_dur_desc} full>
                <div className="h-64">
                  <Line data={dailyDurData} options={dailyDurOpts as Parameters<typeof Line>[0]["options"]} />
                </div>
              </ChartCard>
            </motion.div>
          )}

          {/* ── Monthly ──────────────────────────────────────── */}
          {activeTab === "monthly" && (
            <motion.div key="monthly" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <ChartCard title={c.chart_monthly_title} desc={c.chart_monthly_desc} full>
                <div className="h-72">
                  <Line data={monthlyData} options={monthlyOpts as Parameters<typeof Line>[0]["options"]} />
                </div>
              </ChartCard>
              <ChartCard title={c.chart_pct_title} desc={c.chart_pct_desc}>
                <div className="h-60">
                  <Bar data={pctData} options={{
                    ...baseOpts(v => v + "%"),
                    plugins: { ...baseOpts().plugins, legend: legend(), tooltip: { ...tt, callbacks: { label: lbl(ctx => ` ${ctx.dataset.label}: ${ctx.raw}%`) } } },
                    scales: {
                      x: { grid: { display: false }, ticks: { color: muted, font: { size: 9 } } },
                      y: { grid: { color: grid }, ticks: { color: muted, font: { size: 11 }, callback: (v: number | string) => v + "%" } },
                    },
                  } as Parameters<typeof Bar>[0]["options"]} />
                </div>
              </ChartCard>
              <ChartCard title={c.chart_ratio_title} desc={c.chart_ratio_desc}>
                <div className="h-60">
                  <Bar data={ratioData} options={{
                    ...baseOpts(),
                    plugins: { legend: { display: false }, tooltip: { ...tt, callbacks: { label: lbl(ctx => ` Ratio: ${ctx.raw}`) } } },
                    scales: {
                      x: { grid: { display: false }, ticks: { color: muted, font: { size: 9 } } },
                      y: { grid: { color: grid }, ticks: { color: muted, font: { size: 11 } } },
                    },
                  } as Parameters<typeof Bar>[0]["options"]} />
                </div>
              </ChartCard>
            </motion.div>
          )}

          {/* ── Data Tables ──────────────────────────────────── */}
          {activeTab === "data" && (
            <motion.div key="data" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
              className="space-y-5">

              {/* Monthly table */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="px-6 pt-6 pb-4">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-0.5">{c.table_monthly_title}</h3>
                  <p className="text-xs font-mono text-gray-400 dark:text-gray-500 mb-4">{c.table_monthly_desc}</p>
                  {/* filter toggle */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs font-mono uppercase tracking-wider text-gray-400 dark:text-gray-500">{c.filter_label}</span>
                    <button
                      onClick={() => setShowMember(v => !v)}
                      className={`px-3 py-1 rounded text-xs font-mono border transition-colors ${
                        showMember
                          ? "border-indigo-400 text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                          : "border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500"
                      }`}
                    >{c.legend_member}</button>
                    <button
                      onClick={() => setShowCasual(v => !v)}
                      className={`px-3 py-1 rounded text-xs font-mono border transition-colors ${
                        showCasual
                          ? "border-amber-400 text-amber-500 bg-amber-50 dark:bg-amber-900/20"
                          : "border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500"
                      }`}
                    >{c.legend_casual}</button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono">
                    <thead className="bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-700">
                      <tr>
                        <th className={`px-6 py-3 text-left cursor-pointer select-none text-gray-400 dark:text-gray-500 hover:text-indigo-500 ${sortKey === "label" ? "text-indigo-500" : ""}`} onClick={() => handleSort("label")}>
                          {c.col_month}<SortIco k="label" />
                        </th>
                        <th className="px-4 py-3 text-left text-gray-400 dark:text-gray-500">{c.col_type}</th>
                        <th className={`px-4 py-3 text-right cursor-pointer select-none text-gray-400 dark:text-gray-500 hover:text-indigo-500 ${sortKey === "rides" ? "text-indigo-500" : ""}`} onClick={() => handleSort("rides")}>
                          {c.col_rides}<SortIco k="rides" />
                        </th>
                        <th className={`px-4 py-3 text-right cursor-pointer select-none text-gray-400 dark:text-gray-500 hover:text-indigo-500 ${sortKey === "pct" ? "text-indigo-500" : ""}`} onClick={() => handleSort("pct")}>
                          {c.col_pct}<SortIco k="pct" />
                        </th>
                        <th className="px-4 py-3 text-left text-gray-400 dark:text-gray-500 min-w-[140px]">{c.col_dist}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                      {tableRows.map((row, i) => {
                        const barW = Math.round((row.rides / maxRides) * 100);
                        const isM = row.type === "member";
                        return (
                          <motion.tr key={`${row.month}-${row.type}-${i}`}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15, delay: i * 0.02 }}
                            className="hover:bg-white dark:hover:bg-gray-700/50 transition-colors">
                            <td className="px-6 py-2.5 text-gray-700 dark:text-gray-200">{row.month} 2023</td>
                            <td className="px-4 py-2.5">
                              <span className={`inline-block px-2 py-0.5 rounded text-xs uppercase tracking-wide ${
                                isM ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                                    : "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                              }`}>{isM ? c.legend_member : c.legend_casual}</span>
                            </td>
                            <td className="px-4 py-2.5 text-right text-gray-700 dark:text-gray-200">{row.rides.toLocaleString()}</td>
                            <td className="px-4 py-2.5 text-right text-gray-700 dark:text-gray-200">{row.pct}%</td>
                            <td className="px-4 py-2.5">
                              <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden w-32">
                                <motion.div
                                  className={`h-full rounded-full ${isM ? "bg-indigo-400" : "bg-amber-400"}`}
                                  initial={{ width: 0 }} animate={{ width: `${barW}%` }} transition={{ duration: 0.5 }}
                                />
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* KPI table */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="px-6 pt-6 pb-4">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-0.5">{c.table_kpi_title}</h3>
                  <p className="text-xs font-mono text-gray-400 dark:text-gray-500">{c.table_kpi_desc}</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono">
                    <thead className="bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-700">
                      <tr>
                        {[c.col_user, c.col_rides, c.col_avg_dur, c.col_share].map(h => (
                          <th key={h} className="px-6 py-3 text-left text-gray-400 dark:text-gray-500">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                      {[
                        { type: "member", rides: "2,737,144", avg: "12.4", share: "59.4%" },
                        { type: "casual", rides: "1,872,607", avg: "28.1", share: "40.6%" },
                      ].map(row => (
                        <tr key={row.type} className="hover:bg-white dark:hover:bg-gray-700/50 transition-colors">
                          <td className="px-6 py-3">
                            <span className={`inline-block px-2 py-0.5 rounded text-xs uppercase tracking-wide ${
                              row.type === "member"
                                ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                                : "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                            }`}>{row.type === "member" ? c.legend_member : c.legend_casual}</span>
                          </td>
                          <td className="px-6 py-3 text-gray-700 dark:text-gray-200">{row.rides}</td>
                          <td className="px-6 py-3 text-gray-700 dark:text-gray-200">{row.avg}</td>
                          <td className="px-6 py-3 text-gray-700 dark:text-gray-200">{row.share}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Insights ─────────────────────────────────────── */}
          {activeTab === "insights" && (
            <motion.div key="insights" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
              className="space-y-6">

              {/* Insight cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {c.insights.map((ins, i) => {
                  const borders = ["border-l-indigo-500", "border-l-amber-400", "border-l-indigo-400", "border-l-emerald-500"];
                  return (
                    <motion.div key={i}
                      initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: i * 0.08 }}
                      className={`bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 border-l-4 ${borders[i]} p-6`}>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-sm">{ins.title}</h3>
                      <p className="text-xs font-mono text-gray-500 dark:text-gray-400 leading-relaxed">{ins.text}</p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Recommendations */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1 text-sm">{c.recs_title}</h3>
                <p className="text-xs font-mono text-gray-400 dark:text-gray-500 mb-5">{c.recs_desc}</p>
                <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                  {c.recs.map((r, i) => (
                    <li key={i} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                      <span className="text-indigo-500 font-mono text-xs font-bold pt-0.5 flex-shrink-0">{r.n}</span>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-1">{r.title}</div>
                        <p className="text-xs font-mono text-gray-500 dark:text-gray-400 leading-relaxed">{r.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Learnings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {c.learnings.map((l, i) => (
                  <div key={i} className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                    <FiCheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs font-mono text-gray-600 dark:text-gray-300 leading-relaxed">{l}</p>
                  </div>
                ))}
              </div>

              {/* Bottom CTA */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/#projects" className="inline-flex items-center gap-2 border-2 border-indigo-500 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 font-semibold px-6 py-3 rounded-full transition-colors text-sm">
                  {c.back}
                </Link>
                <a href="https://github.com/corbisieromichele00/cyclistic-bike-share-analysis" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gray-900 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-full transition-colors text-sm">
                  <FiGithub className="w-4 h-4" /> GitHub
                </a>
              </div>
            </motion.div>
          )}

        </div>

        {/* ── CONCLUSION ─────────────────────────────────────── */}
        <section className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
            <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6" style={{ fontFamily: "var(--font-display)" }}>
                {c.conclusion_title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 flex-shrink-0" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 flex-shrink-0" />
                    <span className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500">Members vs Casual</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{c.conclusion_text}</p>
                </div>
                <div className="bg-indigo-500 rounded-2xl p-6">
                  <p className="text-xs font-mono uppercase tracking-widest text-indigo-200 mb-3">Opportunità</p>
                  <p className="text-sm text-white leading-relaxed">{c.conclusion_opportunity}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-8">
                <Link href="/#projects" className="inline-flex items-center gap-2 border-2 border-indigo-500 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 font-semibold px-6 py-3 rounded-full transition-colors text-sm">
                  {c.back}
                </Link>
                <a href="https://github.com/corbisieromichele00/cyclistic-bike-share-analysis" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gray-900 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-full transition-colors text-sm">
                  <FiGithub className="w-4 h-4" /> GitHub
                </a>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
