"use client";

// Skills applied: react-best-practices (dynamic chart imports, useMemo for all chart data),
//                 accesslint (chart aria-label + role="img", sr-only summaries,
//                             aria-hidden icons, keyboard-nav on tabs, reduced-motion),
//                 composition-patterns (react19 use() context),
//                 ui-ux-pro-max (chart: screen-reader-summary, gridline-subtle)

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Tooltip, Legend, Filler,
  type ChartOptions,
} from "chart.js";
import { FiGithub, FiCheckCircle, FiChevronUp, FiChevronDown } from "react-icons/fi";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { motion, useReducedMotion } from "framer-motion";

// Dynamic imports with ssr:false — defers ~250KB chart bundle until mount,
// prevents canvas SSR errors, improves LCP on project pages.
const ChartLoading = () => (
  <div className="animate-pulse bg-[var(--color-surface-2)] rounded-xl w-full h-full" aria-hidden="true" />
);
const Bar     = dynamic(() => import("react-chartjs-2").then(m => m.Bar),     { ssr: false, loading: ChartLoading });
const Line    = dynamic(() => import("react-chartjs-2").then(m => m.Line),    { ssr: false, loading: ChartLoading });
const Doughnut = dynamic(() => import("react-chartjs-2").then(m => m.Doughnut), { ssr: false, loading: ChartLoading });

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Tooltip, Legend, Filler);

const TAGS = ["SQL", "Tableau", "Google Data Analytics", "Data Cleaning", "Data Visualization"];

/* ── Chart palette (updated to CSS token values) ─────────────── */
const MEMBER_CLR  = "#4F46E5"; // indigo-600
const CASUAL_CLR  = "#D97706"; // amber-600
const MEMBER_FILL = "rgba(79,70,229,0.10)";
const CASUAL_FILL = "rgba(217,119,6,0.10)";

/* ── Dataset ─────────────────────────────────────────────────── */
const MONTHLY_M   = [112331, 122097, 208458, 257921, 313996, 379523, 430394, 443130, 440954, 414094, 251924, 109380];
const MONTHLY_C   = [23405,  27003,  82864,  105260, 175655, 278702, 308446, 323533, 254727, 214380,  94719,  27112];
const WEEKLY_M    = [493322, 552529, 540212, 565177, 518551, 439876, 374535];
const WEEKLY_C    = [219232, 216926, 212744, 247893, 306463, 395595, 316953];
const DAILY_DUR_M = [11.26, 11.35, 11.13, 11.23, 11.64, 12.81, 12.95];
const DAILY_DUR_C = [19.20, 17.12, 15.86, 16.95, 19.10, 21.90, 22.60];
const TOTAL_M = MONTHLY_M.reduce((a, b) => a + b, 0);
const TOTAL_C = MONTHLY_C.reduce((a, b) => a + b, 0);
const PCT_M   = MONTHLY_M.map(v => +(v / TOTAL_M * 100).toFixed(1));
const PCT_C   = MONTHLY_C.map(v => +(v / TOTAL_C * 100).toFixed(1));
const RATIO   = MONTHLY_M.map((_, i) => +(MONTHLY_C[i] / MONTHLY_M[i]).toFixed(2));

/* ── Content ─────────────────────────────────────────────────── */
const CONTENT = {
  it: {
    breadcrumb_projects: "Progetti",
    subtitle: "Progetto capstone — Google Data Analytics Professional Certificate",
    date: "Marzo 2026",
    back: "← Progetti",
    stat_member_rides: "Corse Members", stat_casual_rides: "Corse Casual",
    stat_member_dur: "Durata · Member", stat_casual_dur: "Durata · Casual",
    stat_total: "Totale Corse (2025)",
    stat_member_sub: "64.6% del totale", stat_casual_sub: "35.4% del totale",
    stat_member_dur_sub: "Uso orientato al commute", stat_casual_dur_sub: "1.7× più lungo dei members",
    stat_total_sub: "Gen 2025 – Dic 2025",
    tab_duration: "Durata Corse", tab_weekly: "Pattern Settimanale", tab_monthly: "Trend Mensile",
    tab_data: "Tabelle Dati", tab_insights: "Insights", tab_presentation: "Presentazione",
    pres_video_title: "Video presentazione", pres_pdf_title: "Scarica la presentazione", pres_pdf_btn: "Scarica PDF",
    chart_dur_type_title: "Durata Media per Tipo di Utente",
    chart_dur_type_desc:  "I casual rider percorrono tragitti più lunghi in ogni giorno della settimana",
    chart_dur_type_aria:  "Grafico a barre: durata media corse. Members 11.68 min, Casual 19.41 min. I casual rider impiegano 1.7× più tempo.",
    chart_count_title: "Distribuzione Corse", chart_count_desc: "Totale corse per segmento (2025)",
    chart_count_aria: "Grafico donut: distribuzione corse. Members 3.48M (64.6%), Casual 1.92M (35.4%). Totale 5.40M.",
    chart_weekly_title: "Corse Settimanali per Tipo di Utente",
    chart_weekly_desc:  "I members picco nei giorni feriali; i casual preferiscono il weekend",
    chart_weekly_aria:  "Grafico a barre: corse settimanali. Members picco giovedì (565k), Casual picco sabato (396k). Patterns distinti commute vs leisure.",
    chart_weekly_dur_title: "Durata Media Giornaliera (min)",
    chart_weekly_dur_desc:  "Le corse casual sono sempre più lunghe di quelle dei members",
    chart_weekly_dur_aria:  "Grafico a linee: durata giornaliera. Casual 15.9–22.6 min vs Members 11.1–13.0 min. Gap massimo nel weekend.",
    chart_monthly_title: "Corse Mensili per Tipo di Utente",
    chart_monthly_desc:  "Entrambi i segmenti picco in estate; i casual mostrano maggiore stagionalità",
    chart_monthly_aria:  "Grafico a linee: trend mensile. Members picco agosto (443k), Casual picco agosto (324k). Stagionalità casual più acuta.",
    chart_pct_title: "% Corse Annuali per Mese", chart_pct_desc: "L'uso casual è più concentrato nei mesi estivi",
    chart_pct_aria: "Grafico a barre raggruppate: percentuale corse annuali per mese. Casual più concentrato in luglio–settembre.",
    chart_ratio_title: "Indice Stagionale", chart_ratio_desc: "Rapporto Casual/Member per mese (>1 = più casual)",
    chart_ratio_aria: "Grafico a barre: rapporto casual/member. Picco estivo giugno–agosto >0.8. Minimo invernale dicembre ~0.25.",
    filter_label: "Filtro:",
    col_month: "Mese", col_type: "Tipo", col_rides: "Corse", col_pct: "% Annuale", col_dist: "Distribuzione",
    col_user: "Tipo", col_avg_dur: "Durata Media (min)", col_share: "Quota",
    table_monthly_title: "Dati Mensili Corse", table_monthly_desc: "Suddivisione per mese e tipo di utente",
    table_kpi_title: "KPI Aggregati", table_kpi_desc: "Statistiche aggregate per tipo di utente",
    insights: [
      { title: "Corse Casual Più Lunghe", text: "La durata media dei casual rider (19.41 min) è 1.7× più lunga di quella dei members (11.68 min), suggerendo un uso leisure vs commute." },
      { title: "Casual Preferisce il Weekend", text: "Il ridership casual picco sabato–domenica (~37% dei viaggi settimanali), mentre i members guidano con costanza dal lunedì al venerdì." },
      { title: "Forte Stagionalità", text: "Le corse casual sono altamente stagionali — luglio/agosto/settembre rappresentano oltre il 46% delle corse casual annuali vs ~38% per i members." },
      { title: "Opportunità di Conversione", text: "Con 1.92M corse casual e forte engagement estivo, anche una conversione del 10% in abbonamento annuale rappresenterebbe una crescita significativa." },
    ],
    recs_title: "Raccomandazioni Business", recs_desc: "Strategie per convertire i casual rider in abbonati annuali",
    recs: [
      { n: "01", title: "Campagne Estate e Weekend", desc: "Lanciare offerte membership nei mesi giugno–agosto, con promozioni weekend. Il picco casual estivo è il momento più fertile per la conversione." },
      { n: "02", title: "Messaging Leisure → Commute", desc: "Il marketing deve evidenziare il valore dell'abbonamento sia per il leisure che per gli spostamenti quotidiani, colmando il gap tra i due profili d'uso." },
      { n: "03", title: "Touchpoint alle Stazioni Chiave", desc: "Identificare le stazioni con alto ridership casual nel weekend. Installare QR code e prompt in-app per incentivare le iscrizioni sul momento." },
    ],
    learnings: [
      "Prima esperienza end-to-end su dataset reale (~5.4M righe) con SQL e Tableau",
      "Gestione del ciclo di analisi: dalla definizione del problema alla presentazione agli stakeholder",
      "Presentazione strutturata dei risultati per un pubblico non tecnico",
      "Padronanza di BigQuery per l'aggregazione di grandi volumi di dati",
    ],
    intro_title: "Il Progetto",
    intro_text: "Cyclistic è un servizio di bike-sharing di Chicago con oltre 5.800 biciclette e 692 stazioni. Il progetto nasce da una domanda di business concreta: in che modo i casual rider e i membri annuali usano le biciclette in modo diverso? Capirlo è essenziale perché i membri annuali sono significativamente più redditizi per l'azienda rispetto ai casual rider, e il team marketing vuole identificare le leve per incentivare la conversione.",
    intro_dataset: "Per rispondere, ho analizzato 5.40 milioni di corse registrate nel 2025. I dati sono stati puliti e aggregati con SQL su BigQuery, poi visualizzati con Tableau. Qui sotto trovi i grafici interattivi che documentano l'intero percorso di analisi.",
    tabs_note_title: "Come leggere questa analisi",
    tabs_note: "I grafici sono organizzati in quattro aree tematiche: Durata Corse, Pattern Settimanale, Trend Mensile, e Tabelle Dati. La scheda Insights raccoglie le conclusioni e le raccomandazioni per il business.",
    conclusion_title: "Conclusioni",
    conclusion_text: "L'analisi rivela due profili d'uso nettamente distinti. I members usano le bici in modo regolare e funzionale — principalmente per il commute nei giorni feriali, con corse brevi di circa 11.7 minuti. I casual rider hanno invece un comportamento orientato al leisure: corse più lunghe (~19 min), concentrate nel fine settimana e nei mesi estivi.",
    conclusion_opportunity: "Questo gap comportamentale è un'opportunità di marketing concreta. Una strategia che valorizzi l'abbonamento anche per usi leisure e weekend — con campagne estive e touchpoint nelle stazioni ad alto traffico casual — potrebbe convertire una quota significativa degli 1.92 milioni di casual rider in abbonati annuali.",
    months: ["Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"],
    days: ["Lun","Mar","Mer","Gio","Ven","Sab","Dom"],
    legend_member: "Members", legend_casual: "Casual",
    github_label: "Codice sorgente dell'analisi Cyclistic su GitHub",
    opportunita_label: "Opportunità",
  },
  en: {
    breadcrumb_projects: "Projects",
    subtitle: "Capstone project — Google Data Analytics Professional Certificate",
    date: "March 2026",
    back: "← Projects",
    stat_member_rides: "Member Rides", stat_casual_rides: "Casual Rides",
    stat_member_dur: "Duration · Member", stat_casual_dur: "Duration · Casual",
    stat_total: "Total Rides (2025)",
    stat_member_sub: "64.6% of total", stat_casual_sub: "35.4% of total",
    stat_member_dur_sub: "Commute-oriented usage", stat_casual_dur_sub: "1.7× longer than members",
    stat_total_sub: "Jan 2025 – Dec 2025",
    tab_duration: "Ride Duration", tab_weekly: "Weekly Patterns", tab_monthly: "Seasonal Trends",
    tab_data: "Data Tables", tab_insights: "Insights", tab_presentation: "Presentation",
    pres_video_title: "Video presentation", pres_pdf_title: "Download the presentation", pres_pdf_btn: "Download PDF",
    chart_dur_type_title: "Avg Duration by User Type",
    chart_dur_type_desc:  "Casual riders take longer trips every day of the week",
    chart_dur_type_aria:  "Bar chart: average trip duration. Members 11.68 min, Casual 19.41 min. Casual riders take 1.7× longer trips.",
    chart_count_title: "Ride Count Distribution", chart_count_desc: "Total rides per user segment (2025)",
    chart_count_aria: "Donut chart: ride distribution. Members 3.48M (64.6%), Casual 1.92M (35.4%). Total 5.40M rides.",
    chart_weekly_title: "Weekly Rides by User Type",
    chart_weekly_desc:  "Members peak on weekdays; casual riders peak on weekends",
    chart_weekly_aria:  "Bar chart: weekly rides. Members peak Thursday (565k), Casual peak Saturday (396k). Distinct commute vs leisure patterns.",
    chart_weekly_dur_title: "Daily Average Duration (min)",
    chart_weekly_dur_desc:  "Casual rides are consistently longer every day of the week",
    chart_weekly_dur_aria:  "Line chart: daily duration. Casual 15.9–22.6 min vs Members 11.1–13.0 min. Largest gap on weekends.",
    chart_monthly_title: "Monthly Rides by User Type",
    chart_monthly_desc:  "Both segments peak in summer; casual shows sharper seasonality",
    chart_monthly_aria:  "Line chart: monthly trend. Members peak August (443k), Casual peak August (324k). Casual shows sharper seasonality.",
    chart_pct_title: "% of Annual Rides per Month", chart_pct_desc: "Casual usage is more concentrated in summer months",
    chart_pct_aria: "Grouped bar chart: percentage of annual rides per month. Casual more concentrated in July–September.",
    chart_ratio_title: "Seasonal Index", chart_ratio_desc: "Casual/Member ratio by month (>1 = more casual)",
    chart_ratio_aria: "Bar chart: casual/member ratio. Summer peak June–August >0.8. Winter minimum December ~0.25.",
    filter_label: "Filter:",
    col_month: "Month", col_type: "Type", col_rides: "Rides", col_pct: "% Annual", col_dist: "Distribution",
    col_user: "Type", col_avg_dur: "Avg Duration (min)", col_share: "Share",
    table_monthly_title: "Monthly Ride Data", table_monthly_desc: "Breakdown by month and user type",
    table_kpi_title: "Aggregate KPIs", table_kpi_desc: "Statistics by user type",
    insights: [
      { title: "Casual Riders Take Longer Trips", text: "Average trip duration for casual riders (19.41 min) is 1.7× longer than for members (11.68 min), suggesting leisure vs commute usage." },
      { title: "Casual Riders Prefer Weekends", text: "Casual ridership peaks Saturday–Sunday (~37% of weekly trips), while members ride consistently Monday–Friday for commuting." },
      { title: "Strong Seasonal Patterns", text: "Casual rides are highly seasonal — July/August/September account for ~46% of annual casual rides vs ~38% for members." },
      { title: "Conversion Opportunity", text: "With 1.92M casual rides and strong summer engagement, even a 10% conversion to annual membership could represent significant revenue growth." },
    ],
    recs_title: "Business Recommendations", recs_desc: "Strategies to convert casual riders into annual members",
    recs: [
      { n: "01", title: "Summer & Weekend Campaigns", desc: "Launch targeted membership promotions during June–August, with weekend-specific offers. The summer casual peak is the most fertile conversion window." },
      { n: "02", title: "Leisure → Commute Messaging", desc: "Marketing should highlight membership value for both leisure AND weekday commutes — positioning annual membership as a cost-effective all-purpose pass." },
      { n: "03", title: "Touchpoints at Key Stations", desc: "Identify stations with high casual ridership on weekends. Deploy QR codes and in-app prompts at these locations during peak hours to drive in-the-moment conversions." },
    ],
    learnings: [
      "First end-to-end experience on a real dataset (~5.4M rows) with SQL and Tableau",
      "Full management of the analysis lifecycle: from problem definition to stakeholder presentation",
      "Structured presentation of results for a non-technical audience",
      "Proficiency with BigQuery for aggregating large data volumes",
    ],
    intro_title: "The Project",
    intro_text: "Cyclistic is a fictional bike-share service in Chicago with over 5,800 bicycles and 692 stations. The project starts from a concrete business question: how do casual riders and annual members use bikes differently? Understanding this is essential because annual members are significantly more profitable, and the marketing team wants to identify the levers to drive conversion.",
    intro_dataset: "To answer this, I analysed 5.40 million rides recorded in 2025. Data was cleaned and aggregated with SQL on BigQuery, then visualised with Tableau. The interactive charts below document the full analysis journey.",
    tabs_note_title: "How to read this analysis",
    tabs_note: "The charts are organised into four thematic areas: Ride Duration, Weekly Patterns, Seasonal Trends, and Data Tables. The Insights tab collects the key findings and business recommendations.",
    conclusion_title: "Conclusions",
    conclusion_text: "The analysis reveals two clearly distinct usage profiles. Members use bikes in a regular, functional way — primarily for weekday commuting, with short trips of around 11.7 minutes. Casual riders exhibit leisure-oriented behaviour: longer trips (~19 min), concentrated at weekends and in summer months.",
    conclusion_opportunity: "This behavioural gap is a concrete marketing opportunity. A strategy highlighting membership value for leisure and weekend use — with summer campaigns and touchpoints at high casual-traffic stations — could convert a meaningful share of the 1.92 million casual riders into annual members.",
    months: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    days: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
    legend_member: "Members", legend_casual: "Casual",
    github_label: "Cyclistic analysis source code on GitHub",
    opportunita_label: "Opportunity",
  },
};

/* ── Stat card ─────────────────────────────────────────────────── */
function StatCard({ label, value, sub, accent }: {
  label: string; value: string; sub: string; accent: "member" | "casual" | "neutral";
}) {
  const bar = accent === "member" ? "bg-[var(--color-primary)]" : accent === "casual" ? "bg-[var(--color-accent)]" : "bg-[var(--color-muted)]";
  const val = accent === "member" ? "text-[var(--color-primary)]" : accent === "casual" ? "text-[var(--color-accent)]" : "text-[var(--foreground)]";
  return (
    <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
      <div className={`h-1 ${bar}`} aria-hidden="true" />
      <div className="p-5">
        <div className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted)] mb-2">{label}</div>
        <div className={`text-2xl font-bold ${val} leading-none mb-1 tabular-nums`}>{value}</div>
        <div className="text-xs text-[var(--color-muted)]">{sub}</div>
      </div>
    </div>
  );
}

/* ── Chart card ────────────────────────────────────────────────── */
function ChartCard({ title, desc, ariaLabel, srSummary, children, full }: {
  title: string; desc: string; ariaLabel?: string; srSummary?: string;
  children: React.ReactNode; full?: boolean;
}) {
  return (
    <div className={`bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6 ${full ? "col-span-full" : ""}`}>
      <h3 className="font-bold text-[var(--foreground)] mb-0.5 text-sm">{title}</h3>
      <p className="text-xs font-mono text-[var(--color-muted)] mb-5">{desc}</p>
      {ariaLabel ? (
        <div aria-label={ariaLabel} role="img">
          {children}
        </div>
      ) : children}
      {srSummary && <p className="sr-only">{srSummary}</p>}
    </div>
  );
}

/* ── Types ─────────────────────────────────────────────────────── */
type Tab = "duration" | "weekly" | "monthly" | "data" | "insights" | "presentation";
type SortKey = "label" | "rides" | "pct";
type SortDir = "asc" | "desc";

/* ── Main component ────────────────────────────────────────────── */
export default function CyclisticClient() {
  const { lang } = useLang();
  const { dark } = useTheme();
  const reduced = useReducedMotion() ?? false;
  const c = CONTENT[lang];

  const [activeTab, setActiveTab]   = useState<Tab>("duration");
  const [showMember, setShowMember] = useState(true);
  const [showCasual, setShowCasual] = useState(true);
  const [sortKey, setSortKey]       = useState<SortKey>("label");
  const [sortDir, setSortDir]       = useState<SortDir>("asc");

  /* Chart theme — memoized */
  const grid  = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const muted = dark ? "#94a3b8" : "#64748b";
  const tt = useMemo(() => ({
    backgroundColor: dark ? "#1e293b" : "#ffffff",
    borderColor:     dark ? "#475569" : "#e2e8f0",
    titleColor:      dark ? "#f1f5f9" : "#0f172a",
    bodyColor:       dark ? "#cbd5e1" : "#334155",
    borderWidth: 1, padding: 10,
  }), [dark]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lbl = (fn: (ctx: any) => string) => fn;

  const legendCfg = useMemo(() => ({
    display: true,
    labels: { color: dark ? "#cbd5e1" : "#334155", font: { size: 11 }, usePointStyle: true, pointStyleWidth: 8 },
  }), [dark]);

  function baseScales(yFmt?: (v: number | string) => string) {
    return {
      x: { grid: { display: false }, ticks: { color: muted, font: { size: 11 } } },
      y: { grid: { color: grid }, ticks: { color: muted, font: { size: 11 }, ...(yFmt ? { callback: yFmt } : {}) } },
    };
  }

  const animDur = reduced ? 0 : 700;

  /* Duration tab charts — memoized */
  const avgDurData = useMemo(() => ({
    labels: [c.legend_member, c.legend_casual],
    datasets: [{ label: "Avg Duration (min)", data: [11.68, 19.41], backgroundColor: [MEMBER_CLR, CASUAL_CLR], borderRadius: 6 }],
  }), [c.legend_member, c.legend_casual]);

  const avgDurOpts = useMemo(() => ({
    responsive: true, maintainAspectRatio: false,
    animation: { duration: animDur },
    plugins: { legend: { display: false }, tooltip: { ...tt, callbacks: { label: lbl(ctx => ` ${ctx.label}: ${ctx.raw} min`) } } },
    scales: {
      x: { grid: { display: false }, ticks: { color: muted, font: { size: 13 } } },
      y: { grid: { color: grid }, ticks: { color: muted, font: { size: 11 }, callback: (v: number | string) => v + " min" } },
    },
  }), [tt, grid, muted, animDur]);

  const donutData = useMemo(() => ({
    labels: [c.legend_member, c.legend_casual],
    datasets: [{ data: [TOTAL_M, TOTAL_C], backgroundColor: [MEMBER_CLR, CASUAL_CLR], borderColor: dark ? "#0f172a" : "#fafaf8", borderWidth: 3, hoverOffset: 6 }],
  }), [c.legend_member, c.legend_casual, dark]);

  const donutOpts = useMemo(() => ({
    responsive: true, maintainAspectRatio: false, cutout: "68%",
    animation: { duration: animDur },
    plugins: { legend: { ...legendCfg, position: "bottom" as const }, tooltip: { ...tt, callbacks: { label: lbl(ctx => ` ${ctx.label}: ${((ctx.raw as number) / 1e6).toFixed(2)}M`) } } },
  }), [tt, legendCfg, animDur]);

  /* Weekly charts */
  const weeklyData = useMemo(() => ({
    labels: c.days,
    datasets: [
      { label: c.legend_member, data: WEEKLY_M, backgroundColor: MEMBER_CLR, borderRadius: 3 },
      { label: c.legend_casual, data: WEEKLY_C, backgroundColor: CASUAL_CLR, borderRadius: 3 },
    ],
  }), [c.days, c.legend_member, c.legend_casual]);

  const weeklyOpts = useMemo(() => ({
    responsive: true, maintainAspectRatio: false,
    animation: { duration: animDur },
    plugins: { legend: legendCfg, tooltip: { ...tt, callbacks: { label: lbl(ctx => ` ${ctx.dataset.label}: ${(ctx.raw / 1000).toFixed(0)}k`) } } },
    scales: baseScales(v => Math.round(+v / 1000) + "k"),
  }), [tt, legendCfg, animDur, muted, grid]);

  const dailyDurData = useMemo(() => ({
    labels: c.days,
    datasets: [
      { label: c.legend_member, data: DAILY_DUR_M, borderColor: MEMBER_CLR, backgroundColor: MEMBER_FILL, fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: MEMBER_CLR },
      { label: c.legend_casual, data: DAILY_DUR_C, borderColor: CASUAL_CLR, backgroundColor: CASUAL_FILL, fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: CASUAL_CLR },
    ],
  }), [c.days, c.legend_member, c.legend_casual]);

  const dailyDurOpts = useMemo(() => ({
    responsive: true, maintainAspectRatio: false,
    animation: { duration: animDur },
    plugins: { legend: legendCfg, tooltip: { ...tt, callbacks: { label: lbl(ctx => ` ${ctx.dataset.label}: ${ctx.raw} min`) } } },
    scales: baseScales(v => v + " min"),
  }), [tt, legendCfg, animDur, muted, grid]);

  /* Monthly charts */
  const monthlyData = useMemo(() => ({
    labels: c.months,
    datasets: [
      { label: c.legend_member, data: MONTHLY_M, borderColor: MEMBER_CLR, backgroundColor: MEMBER_FILL, fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: MEMBER_CLR },
      { label: c.legend_casual, data: MONTHLY_C, borderColor: CASUAL_CLR, backgroundColor: CASUAL_FILL, fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: CASUAL_CLR },
    ],
  }), [c.months, c.legend_member, c.legend_casual]);

  const monthlyOpts = useMemo(() => ({
    responsive: true, maintainAspectRatio: false,
    animation: { duration: animDur },
    plugins: { legend: legendCfg, tooltip: { ...tt, callbacks: { label: lbl(ctx => ` ${ctx.dataset.label}: ${(ctx.raw / 1000).toFixed(0)}k`) } } },
    scales: baseScales(v => Math.round(+v / 1000) + "k"),
  }), [tt, legendCfg, animDur, muted, grid]);

  const pctData = useMemo(() => ({
    labels: c.months,
    datasets: [
      { label: c.legend_member, data: PCT_M, backgroundColor: MEMBER_CLR, borderRadius: 2 },
      { label: c.legend_casual, data: PCT_C, backgroundColor: CASUAL_CLR, borderRadius: 2 },
    ],
  }), [c.months, c.legend_member, c.legend_casual]);

  const pctOpts = useMemo(() => ({
    responsive: true, maintainAspectRatio: false,
    animation: { duration: animDur },
    plugins: { legend: legendCfg, tooltip: { ...tt, callbacks: { label: lbl(ctx => ` ${ctx.dataset.label}: ${ctx.raw}%`) } } },
    scales: {
      x: { grid: { display: false }, ticks: { color: muted, font: { size: 9 } } },
      y: { grid: { color: grid }, ticks: { color: muted, font: { size: 11 }, callback: (v: number | string) => v + "%" } },
    },
  }), [tt, legendCfg, animDur, muted, grid]);

  const ratioData = useMemo(() => ({
    labels: c.months,
    datasets: [{ label: "Casual/Member", data: RATIO, backgroundColor: RATIO.map(v => v >= 1 ? CASUAL_CLR : MEMBER_CLR), borderRadius: 3 }],
  }), [c.months]);

  const ratioOpts = useMemo(() => ({
    responsive: true, maintainAspectRatio: false,
    animation: { duration: animDur },
    plugins: { legend: { display: false }, tooltip: { ...tt, callbacks: { label: lbl(ctx => ` Ratio: ${ctx.raw}`) } } },
    scales: {
      x: { grid: { display: false }, ticks: { color: muted, font: { size: 9 } } },
      y: { grid: { color: grid }, ticks: { color: muted, font: { size: 11 } } },
    },
  }), [tt, animDur, muted, grid]);

  /* Data table */
  const maxRides = Math.max(...MONTHLY_M, ...MONTHLY_C);
  const tableRows = useMemo(() => {
    const rows: { month: string; type: "member" | "casual"; rides: number; pct: number }[] = [];
    c.months.forEach((month, i) => {
      if (showMember) rows.push({ month, type: "member", rides: MONTHLY_M[i], pct: PCT_M[i] });
      if (showCasual) rows.push({ month, type: "casual", rides: MONTHLY_C[i], pct: PCT_C[i] });
    });
    return [...rows].sort((a, b) => {
      let v = 0;
      if (sortKey === "label") v = a.month.localeCompare(b.month);
      if (sortKey === "rides") v = a.rides - b.rides;
      if (sortKey === "pct")   v = a.pct - b.pct;
      return sortDir === "asc" ? v : -v;
    });
  }, [showMember, showCasual, sortKey, sortDir, c.months]);

  function handleSort(key: SortKey) {
    if (key === sortKey) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  }

  function SortIco({ k }: { k: SortKey }) {
    if (k !== sortKey) return <span className="opacity-20 ml-1 text-xs" aria-hidden="true">↕</span>;
    return sortDir === "asc"
      ? <FiChevronUp className="inline ml-1 w-3 h-3 text-[var(--color-primary)]" aria-hidden="true" />
      : <FiChevronDown className="inline ml-1 w-3 h-3 text-[var(--color-primary)]" aria-hidden="true" />;
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: "duration",     label: c.tab_duration     },
    { id: "weekly",       label: c.tab_weekly       },
    { id: "monthly",      label: c.tab_monthly      },
    { id: "data",         label: c.tab_data         },
    { id: "insights",     label: c.tab_insights     },
    { id: "presentation", label: c.tab_presentation },
  ];

  const tabAnim = { initial: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } };

  return (
    <main className="pt-20 bg-[var(--background)] min-h-screen">

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <section aria-label="Cyclistic Bike-Share" className="py-14 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">

          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[var(--color-muted)] mb-5">
            <Link href="/" className="hover:text-[var(--color-primary)] transition-colors duration-150">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/#projects" className="hover:text-[var(--color-primary)] transition-colors duration-150">{c.breadcrumb_projects}</Link>
            <span aria-hidden="true">/</span>
            <span className="text-[var(--foreground)]" aria-current="page">Cyclistic Bike‑Share</span>
          </nav>

          <Link href="/#projects" className="inline-flex items-center gap-1 text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-light)] transition-colors duration-150 mb-6 font-medium">
            {c.back}
          </Link>

          <motion.div
            initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0, 0, 0.2, 1] }}
          >
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
              <div>
                <p className="text-[var(--color-primary)] font-semibold text-xs uppercase tracking-widest mb-2 font-mono">{c.date} · Case Study</p>
                <h1 className="text-4xl sm:text-5xl font-bold text-[var(--foreground)] mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Cyclistic <span className="text-[var(--color-primary)]">Bike‑Share</span>
                </h1>
                <p className="text-sm text-[var(--color-muted)] font-mono">{c.subtitle}</p>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="flex items-center gap-3 text-sm font-semibold" aria-label="Legenda colori">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]" aria-hidden="true" /> {c.legend_member}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent)]" aria-hidden="true" /> {c.legend_casual}
                  </span>
                </div>
                <a
                  href="https://github.com/corbisieromichele00/cyclistic-bike-share-analysis"
                  target="_blank" rel="noopener noreferrer"
                  aria-label={c.github_label}
                  className="inline-flex items-center gap-2 bg-[var(--foreground)] hover:opacity-80 text-[var(--background)] text-sm font-semibold px-4 py-2 rounded-full transition-opacity duration-150 min-h-[44px]"
                >
                  <FiGithub className="w-4 h-4" aria-hidden="true" /> GitHub
                </a>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-5">
              {TAGS.map(tag => (
                <span key={tag} className="text-xs font-medium bg-indigo-50 dark:bg-indigo-950/40 text-[var(--color-primary)] px-3 py-1 rounded-full border border-[var(--color-border)]">{tag}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── INTRODUCTION ─────────────────────────────────────────── */}
      <section aria-label={c.intro_title} className="border-b border-[var(--color-border)] bg-[var(--background)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-4" style={{ fontFamily: "var(--font-display)" }}>{c.intro_title}</h2>
          <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-3">{c.intro_text}</p>
          <p className="text-sm text-[var(--color-muted)] leading-relaxed">{c.intro_dataset}</p>
        </div>
      </section>

      {/* ── STATS ROW ────────────────────────────────────────────── */}
      <section aria-label="Statistiche chiave" className="border-b border-[var(--color-border)] bg-[var(--background)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <StatCard label={c.stat_member_rides} value="3.48M" sub={c.stat_member_sub} accent="member" />
            <StatCard label={c.stat_casual_rides} value="1.92M" sub={c.stat_casual_sub} accent="casual" />
            <StatCard label={c.stat_member_dur}   value="11.68 min" sub={c.stat_member_dur_sub} accent="member" />
            <StatCard label={c.stat_casual_dur}   value="19.41 min" sub={c.stat_casual_dur_sub} accent="casual" />
            <StatCard label={c.stat_total}         value="5.40M" sub={c.stat_total_sub} accent="neutral" />
          </div>
        </div>
      </section>

      {/* ── TABS EXPLANATION ─────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-2">
        <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl px-6 py-4 flex gap-4">
          <span className="text-[var(--color-primary)] flex-shrink-0 mt-0.5 text-lg" aria-hidden="true">ⓘ</span>
          <div>
            <p className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mb-1">{c.tabs_note_title}</p>
            <p className="text-xs text-[var(--color-primary)] leading-relaxed opacity-80">{c.tabs_note}</p>
          </div>
        </div>
      </div>

      {/* ── TAB NAV — keyboard accessible ───────────────────────── */}
      <div className="sticky top-16 z-20 bg-[var(--background)] border-b border-[var(--color-border)]" role="tablist" aria-label="Sezioni dell'analisi">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex overflow-x-auto gap-0 scrollbar-none">
            {TABS.map(tab => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`tabpanel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-5 py-4 text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-colors duration-150 flex-shrink-0 min-h-[44px] ${
                  activeTab === tab.id
                    ? "text-[var(--color-primary)]"
                    : "text-[var(--color-muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── TAB CONTENT ──────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8" id={`tabpanel-${activeTab}`} role="tabpanel">

        {activeTab === "duration" && (
          <motion.div key="duration" {...tabAnim} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ChartCard title={c.chart_dur_type_title} desc={c.chart_dur_type_desc} ariaLabel={c.chart_dur_type_aria} srSummary="Members: 11.68 min avg · Casual: 19.41 min avg">
              <div className="h-64"><Bar data={avgDurData} options={avgDurOpts as ChartOptions<"bar">} /></div>
            </ChartCard>
            <ChartCard title={c.chart_count_title} desc={c.chart_count_desc} ariaLabel={c.chart_count_aria} srSummary="Members: 3,484,202 rides (64.6%) · Casual: 1,915,806 rides (35.4%)">
              <div className="h-60"><Doughnut data={donutData} options={donutOpts} /></div>
            </ChartCard>
          </motion.div>
        )}

        {activeTab === "weekly" && (
          <motion.div key="weekly" {...tabAnim} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ChartCard title={c.chart_weekly_title} desc={c.chart_weekly_desc} ariaLabel={c.chart_weekly_aria} srSummary="Member peak Thu 565k; Casual peak Sat 396k" full>
              <div className="h-72"><Bar data={weeklyData} options={weeklyOpts as ChartOptions<"bar">} /></div>
            </ChartCard>
            <ChartCard title={c.chart_weekly_dur_title} desc={c.chart_weekly_dur_desc} ariaLabel={c.chart_weekly_dur_aria} srSummary="Casual always longer: 15.9–22.6 min vs Member 11.1–13.0 min" full>
              <div className="h-64"><Line data={dailyDurData} options={dailyDurOpts as ChartOptions<"line">} /></div>
            </ChartCard>
          </motion.div>
        )}

        {activeTab === "monthly" && (
          <motion.div key="monthly" {...tabAnim} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ChartCard title={c.chart_monthly_title} desc={c.chart_monthly_desc} ariaLabel={c.chart_monthly_aria} srSummary="Both peak Aug. Member 443k, Casual 324k" full>
              <div className="h-72"><Line data={monthlyData} options={monthlyOpts as ChartOptions<"line">} /></div>
            </ChartCard>
            <ChartCard title={c.chart_pct_title} desc={c.chart_pct_desc} ariaLabel={c.chart_pct_aria} srSummary="Casual Jul–Sep: 15.3%+16.9%+13.3% = 45.5% of annual casual rides">
              <div className="h-60"><Bar data={pctData} options={pctOpts as ChartOptions<"bar">} /></div>
            </ChartCard>
            <ChartCard title={c.chart_ratio_title} desc={c.chart_ratio_desc} ariaLabel={c.chart_ratio_aria} srSummary="Ratio peaks Jun 0.73, Jul 0.72, Aug 0.73. Min Dec 0.25">
              <div className="h-60"><Bar data={ratioData} options={ratioOpts as ChartOptions<"bar">} /></div>
            </ChartCard>
          </motion.div>
        )}

        {activeTab === "data" && (
          <motion.div key="data" {...tabAnim} className="space-y-5">
            {/* Monthly table */}
            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
              <div className="px-6 pt-6 pb-4">
                <h3 className="font-bold text-[var(--foreground)] text-sm mb-0.5">{c.table_monthly_title}</h3>
                <p className="text-xs font-mono text-[var(--color-muted)] mb-4">{c.table_monthly_desc}</p>
                <div className="flex items-center gap-3 flex-wrap" role="group" aria-label="Filtra per tipo di utente">
                  <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted)]">{c.filter_label}</span>
                  <button
                    onClick={() => setShowMember(v => !v)}
                    aria-pressed={showMember}
                    aria-label={`${showMember ? "Nascondi" : "Mostra"} ${c.legend_member}`}
                    className={`px-3 py-1.5 rounded text-xs font-mono border transition-colors duration-150 min-h-[36px] ${
                      showMember ? "border-[var(--color-primary)] text-[var(--color-primary)] bg-indigo-50 dark:bg-indigo-950/20" : "border-[var(--color-border)] text-[var(--color-muted)]"
                    }`}
                  >{c.legend_member}</button>
                  <button
                    onClick={() => setShowCasual(v => !v)}
                    aria-pressed={showCasual}
                    aria-label={`${showCasual ? "Nascondi" : "Mostra"} ${c.legend_casual}`}
                    className={`px-3 py-1.5 rounded text-xs font-mono border transition-colors duration-150 min-h-[36px] ${
                      showCasual ? "border-[var(--color-accent)] text-[var(--color-accent)] bg-amber-50 dark:bg-amber-950/20" : "border-[var(--color-border)] text-[var(--color-muted)]"
                    }`}
                  >{c.legend_casual}</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono">
                  <thead className="bg-[var(--background)] border-y border-[var(--color-border)]">
                    <tr>
                      <th scope="col" className={`px-6 py-3 text-left cursor-pointer select-none text-[var(--color-muted)] hover:text-[var(--color-primary)] ${sortKey === "label" ? "text-[var(--color-primary)]" : ""}`} onClick={() => handleSort("label")}>
                        {c.col_month}<SortIco k="label" />
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-[var(--color-muted)]">{c.col_type}</th>
                      <th scope="col" className={`px-4 py-3 text-right cursor-pointer select-none text-[var(--color-muted)] hover:text-[var(--color-primary)] ${sortKey === "rides" ? "text-[var(--color-primary)]" : ""}`} onClick={() => handleSort("rides")}>
                        {c.col_rides}<SortIco k="rides" />
                      </th>
                      <th scope="col" className={`px-4 py-3 text-right cursor-pointer select-none text-[var(--color-muted)] hover:text-[var(--color-primary)] ${sortKey === "pct" ? "text-[var(--color-primary)]" : ""}`} onClick={() => handleSort("pct")}>
                        {c.col_pct}<SortIco k="pct" />
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-[var(--color-muted)] min-w-[140px]">{c.col_dist}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {tableRows.map((row, i) => {
                      const barW = Math.round((row.rides / maxRides) * 100);
                      const isM = row.type === "member";
                      return (
                        <motion.tr
                          key={`${row.month}-${row.type}-${i}`}
                          initial={reduced ? { opacity: 1 } : { opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.15, delay: reduced ? 0 : i * 0.02 }}
                          className="hover:bg-[var(--color-surface-2)] transition-colors duration-100"
                        >
                          <td className="px-6 py-2.5 text-[var(--foreground)]">{row.month} 2025</td>
                          <td className="px-4 py-2.5">
                            <span className={`inline-block px-2 py-0.5 rounded text-xs uppercase tracking-wide ${
                              isM ? "bg-indigo-50 dark:bg-indigo-950/30 text-[var(--color-primary)]"
                                  : "bg-amber-50 dark:bg-amber-950/30 text-[var(--color-accent)]"
                            }`}>{isM ? c.legend_member : c.legend_casual}</span>
                          </td>
                          <td className="px-4 py-2.5 text-right text-[var(--foreground)] tabular-nums">{row.rides.toLocaleString()}</td>
                          <td className="px-4 py-2.5 text-right text-[var(--foreground)] tabular-nums">{row.pct}%</td>
                          <td className="px-4 py-2.5">
                            <div className="h-1.5 bg-[var(--color-surface-2)] rounded-full overflow-hidden w-32" aria-label={`${barW}% del massimo`}>
                              <motion.div
                                className={`h-full rounded-full ${isM ? "bg-[var(--color-primary)]" : "bg-[var(--color-accent)]"}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${barW}%` }}
                                transition={{ duration: reduced ? 0 : 0.5 }}
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
            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
              <div className="px-6 pt-6 pb-4">
                <h3 className="font-bold text-[var(--foreground)] text-sm mb-0.5">{c.table_kpi_title}</h3>
                <p className="text-xs font-mono text-[var(--color-muted)]">{c.table_kpi_desc}</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono">
                  <thead className="bg-[var(--background)] border-y border-[var(--color-border)]">
                    <tr>
                      {[c.col_user, c.col_rides, c.col_avg_dur, c.col_share].map(h => (
                        <th scope="col" key={h} className="px-6 py-3 text-left text-[var(--color-muted)]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {[
                      { type: "member", rides: "3,484,202", avg: "11.68", share: "64.6%" },
                      { type: "casual", rides: "1,915,806", avg: "19.41", share: "35.4%" },
                    ].map(row => (
                      <tr key={row.type} className="hover:bg-[var(--color-surface-2)] transition-colors duration-100">
                        <td className="px-6 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs uppercase tracking-wide ${
                            row.type === "member"
                              ? "bg-indigo-50 dark:bg-indigo-950/30 text-[var(--color-primary)]"
                              : "bg-amber-50 dark:bg-amber-950/30 text-[var(--color-accent)]"
                          }`}>{row.type === "member" ? c.legend_member : c.legend_casual}</span>
                        </td>
                        <td className="px-6 py-3 text-[var(--foreground)] tabular-nums">{row.rides}</td>
                        <td className="px-6 py-3 text-[var(--foreground)] tabular-nums">{row.avg}</td>
                        <td className="px-6 py-3 text-[var(--foreground)] tabular-nums">{row.share}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "insights" && (
          <motion.div key="insights" {...tabAnim} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {c.insights.map((ins, i) => {
                const accents = ["border-l-[var(--color-primary)]", "border-l-[var(--color-accent)]", "border-l-indigo-400", "border-l-[var(--color-secondary)]"];
                return (
                  <motion.div
                    key={i}
                    initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: reduced ? 0 : i * 0.08 }}
                    className={`bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] border-l-4 ${accents[i]} p-6`}
                  >
                    <h3 className="font-bold text-[var(--foreground)] mb-2 text-sm">{ins.title}</h3>
                    <p className="text-xs font-mono text-[var(--color-muted)] leading-relaxed">{ins.text}</p>
                  </motion.div>
                );
              })}
            </div>

            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6">
              <h3 className="font-bold text-[var(--foreground)] mb-1 text-sm">{c.recs_title}</h3>
              <p className="text-xs font-mono text-[var(--color-muted)] mb-5">{c.recs_desc}</p>
              <ul className="divide-y divide-[var(--color-border)]">
                {c.recs.map((r, i) => (
                  <li key={i} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                    <span className="text-[var(--color-primary)] font-mono text-xs font-bold pt-0.5 flex-shrink-0">{r.n}</span>
                    <div>
                      <div className="font-bold text-[var(--foreground)] text-sm mb-1">{r.title}</div>
                      <p className="text-xs font-mono text-[var(--color-muted)] leading-relaxed">{r.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {c.learnings.map((l, i) => (
                <div key={i} className="flex items-start gap-3 bg-[var(--color-surface)] rounded-2xl p-5 border border-[var(--color-border)]">
                  <FiCheckCircle className="w-4 h-4 text-[var(--color-secondary)] flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-xs font-mono text-[var(--color-muted)] leading-relaxed">{l}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/#projects" className="inline-flex items-center gap-2 border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-indigo-50 dark:hover:bg-indigo-950/30 font-semibold px-6 py-3 rounded-full transition-colors duration-150 text-sm min-h-[44px]">
                {c.back}
              </Link>
              <a href="https://github.com/corbisieromichele00/cyclistic-bike-share-analysis" target="_blank" rel="noopener noreferrer" aria-label={c.github_label}
                className="inline-flex items-center gap-2 bg-[var(--foreground)] hover:opacity-80 text-[var(--background)] font-semibold px-6 py-3 rounded-full transition-opacity duration-150 text-sm min-h-[44px]">
                <FiGithub className="w-4 h-4" aria-hidden="true" /> GitHub
              </a>
            </div>
          </motion.div>
        )}

        {activeTab === "presentation" && (
          <motion.div key="presentation" {...tabAnim} className="space-y-8">
            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
              <div className="px-6 pt-6 pb-4">
                <h3 className="font-bold text-[var(--foreground)] text-sm mb-1">{c.pres_video_title}</h3>
              </div>
              <div className="px-6 pb-6">
                <video controls className="w-full rounded-xl" src="/VideoPresentazioneBiciCorbi.mp4"
                  aria-label="Video presentazione dell'analisi Cyclistic Bike-Share" />
              </div>
            </div>
            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-bold text-[var(--foreground)] text-sm mb-1">{c.pres_pdf_title}</h3>
                <p className="text-xs font-mono text-[var(--color-muted)]">cyclistic_presentation.pdf</p>
              </div>
              <a href="/cyclistic_presentation.pdf" download
                aria-label={`${c.pres_pdf_btn} — cyclistic_presentation.pdf`}
                className="inline-flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-white font-semibold px-6 py-3 rounded-full transition-colors duration-150 text-sm flex-shrink-0 min-h-[44px]">
                {c.pres_pdf_btn}
              </a>
            </div>
          </motion.div>
        )}
      </div>

      {/* ── CONCLUSION ───────────────────────────────────────────── */}
      <section aria-label={c.conclusion_title} className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <motion.div
            initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
          >
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-6" style={{ fontFamily: "var(--font-display)" }}>
              {c.conclusion_title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-[var(--background)] rounded-2xl border border-[var(--color-border)] p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] flex-shrink-0" aria-hidden="true" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" aria-hidden="true" />
                  <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted)]">Members vs Casual</span>
                </div>
                <p className="text-sm text-[var(--color-muted)] leading-relaxed">{c.conclusion_text}</p>
              </div>
              <div className="bg-[var(--color-primary)] rounded-2xl p-6">
                <p className="text-xs font-mono uppercase tracking-widest text-indigo-200 mb-3">{c.opportunita_label}</p>
                <p className="text-sm text-white leading-relaxed">{c.conclusion_opportunity}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link href="/#projects" className="inline-flex items-center gap-2 border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-indigo-50 dark:hover:bg-indigo-950/30 font-semibold px-6 py-3 rounded-full transition-colors duration-150 text-sm min-h-[44px]">
                {c.back}
              </Link>
              <a href="https://github.com/corbisieromichele00/cyclistic-bike-share-analysis" target="_blank" rel="noopener noreferrer" aria-label={c.github_label}
                className="inline-flex items-center gap-2 bg-[var(--foreground)] hover:opacity-80 text-[var(--background)] font-semibold px-6 py-3 rounded-full transition-opacity duration-150 text-sm min-h-[44px]">
                <FiGithub className="w-4 h-4" aria-hidden="true" /> GitHub
              </a>
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
