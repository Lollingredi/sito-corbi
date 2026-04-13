"use client";

// Skills applied: react-best-practices (dynamic imports for Chart.js, useMemo for chart data),
//                 accesslint (chart aria-label + role="img", sr-only data summaries,
//                             aria-hidden decorative icons, reduced-motion),
//                 ui-ux-pro-max (chart chart-type, screen-reader-summary, gridline-subtle)

import { useMemo } from "react";
import dynamic from "next/dynamic";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  Tooltip, Legend,
  type ChartOptions,
} from "chart.js";
import { FiGithub, FiCheckCircle } from "react-icons/fi";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { motion, useReducedMotion } from "framer-motion";

// Dynamic import with ssr:false — prevents canvas errors during SSR
// and defers the ~200KB chart bundle until the component mounts.
const Bar = dynamic(
  () => import("react-chartjs-2").then((m) => m.Bar),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-[var(--color-surface)] rounded-xl h-64 w-full" aria-hidden="true" />
    ),
  }
);

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

/* ── Palette (matches CSS tokens) ────────────────────────────── */
const INDIGO       = "#4F46E5";
const INDIGO_LIGHT = "#818CF8";
const EMERALD      = "#059669";
const EMERALD_LIGHT = "#34D399";
const SLATE        = "#94A3B8";

const TAGS = [
  "Stata", "TeX", "Econometria", "Panel Data",
  "Analisi Regionale", "Analisi Controfattuale",
];

/* ── Real thesis data ─────────────────────────────────────────── */
const ELASTICITY_VALUES = [0.195, 0.137, 0.739, 0.380];
const ELASTICITY_SE     = [0.013, 0.019, 0.013, 0.008];
const CF_STATUS_QUO     = [57.32, 71.00, 64.86];
const CF_SCENARIO_1     = [70.17, 71.00, 70.63];
const CF_SCENARIO_2     = [71.24, 71.00, 71.11];

const PROF_LINK = (
  <a
    href="https://www.wiwi.uni-wuerzburg.de/en/vwl2/team/prof-dr-michael-pflueger/"
    target="_blank"
    rel="noopener noreferrer"
    className="underline hover:text-[var(--color-primary)] transition-colors duration-150"
  >
    Prof. Michael Pflüger
  </a>
);

/* ── Bilingual content ────────────────────────────────────────── */
const CONTENT = {
  it: {
    breadcrumb_projects: "Progetti",
    breadcrumb_self:     "Tesi Magistrale",
    back:                "← Progetti",
    period:              "Ott 2022 – Dic 2024",
    grade_label:         "Voto",
    grade:               "110/110",
    supervisor:          <span>Supervisore: {PROF_LINK} · Julius-Maximilian Universität Würzburg</span>,
    subtitle:            "Tesi di Laurea Magistrale · Economics and Data Analysis",

    context_label: "Contesto",
    context_title: "Il Problema Economico",
    context_text: "In Italia i contratti collettivi nazionali fissano salari minimi uniformi per settore in tutto il paese, indipendentemente dalla produttività locale. Il risultato è che un operaio metalmeccanico a Milano e uno a Crotone ricevono salari simili, nonostante la produttività delle due aree sia radicalmente diversa. Questa compressione salariale non è neutrale: se il salario minimo è troppo alto rispetto alla produttività locale, le imprese nel Sud non assumono — e chi è disoccupato non si sposta al Nord perché i costi di trasferimento sono elevati. Il mercato del lavoro non si riesce a riequilibrare.",
    context_question: "La domanda di ricerca è: quanto è grande questo effetto, e cosa succederebbe se l'Italia adottasse un sistema più simile a quello tedesco, dove la contrattazione è più decentrata e i salari si adeguano meglio alla produttività locale?",

    overview_label: "Panoramica",
    overview_title: "Il Progetto di Ricerca",
    overview_body: "Tesi magistrale della doppia laurea tra Università di Verona e Julius-Maximilian Universität (Würzburg), con voto 110/110. La ricerca indaga in che misura il sistema di contrattazione salariale genera misallocation regionale, confrontando il modello centralizzato italiano con quello flessibile tedesco — replicando ed estendendo il framework di Boeri, Ichino, Moretti & Posch (JEEA 2021). I dati sono provinciali NUTS-3 su salari, GVA (Gross Value Added) e occupazione per Italia e Germania. Tutta l'analisi è stata condotta in Stata con output LaTeX.",

    findings_label: "Risultati",
    findings_title: "Key Findings",
    findings: [
      { stat: "4–5×", label: "Elasticità salario-produttività: Germania vs Italia", desc: "Il coefficiente log GVA→salari è 0.195 (Sud IT) e 0.137 (Nord IT) contro 0.739 (Ovest DE) e 0.380 (Est DE). La Germania mostra una correlazione 4–5× più forte tra produttività locale e salari nominali." },
      { stat: "+12.85 p.p.", label: "Il costo del sistema centralizzato", desc: "Analisi controfattuale: con la flessibilità salariale tedesca, il tasso di occupazione nel Sud salirebbe da 57.32% a ~70–71% (+12.85 p.p.), e il reddito da lavoro pro-capite da €766 a €881/mese (+7.5%)." },
      { stat: "€0.32", label: "Compressione salariale Nord-Sud in Italia", desc: "In Italia il gap salariale orario Nord-Sud è solo €0.32 (€8.68 vs €8.36) nonostante differenze di produttività ben più marcate. Il sistema tedesco produce gap più ampi ma un'allocazione del lavoro più efficiente." },
    ],

    charts_label:       "Dati",
    chart1_title:       "Elasticità Salario-Produttività per Area",
    chart1_desc:        "Coefficiente log GVA → salari nominali · regressione panel con effetti fissi",
    chart1_note:        "Fonte: elaborazione propria su dati provinciali NUTS-3",
    chart1_se_prefix:   "SE:",
    chart1_explanation: "Questo grafico mostra quanto i salari nominali rispondono alle variazioni di produttività locale. Un coefficiente alto significa che dove la produttività è alta i salari sono alti — esattamente quello che accade in Germania (0.739 Ovest, 0.380 Est). In Italia i coefficienti sono molto bassi (0.195 Sud, 0.137 Nord): i salari sono compressi verso una media nazionale.",
    chart1_aria:        "Grafico a barre: elasticità salario-produttività. Italia Sud 0.195, Italia Nord 0.137, Germania Ovest 0.739, Germania Est 0.380. La Germania mostra valori 4–5 volte più alti dell'Italia.",
    chart1_sr_summary:  "Dati elasticità: IT Sud 0.195 (SE 0.013) · IT Nord 0.137 (SE 0.019) · DE Ovest 0.739 (SE 0.013) · DE Est 0.380 (SE 0.008).",
    chart2_title:       "Analisi Controfattuale — Tasso di Occupazione (%)",
    chart2_desc:        "Effetti della flessibilità salariale tedesca applicata alle province italiane",
    chart2_note:        "CF Scenario 1: top 0% · CF Scenario 2: variante top 0%",
    chart2_explanation: "Questo grafico risponde alla domanda centrale della tesi: cosa succederebbe ai tassi di occupazione italiani se l'Italia adottasse la flessibilità salariale tedesca? Il Sud salirebbe da 57.3% a ~70–71%, praticamente allineandosi al Nord, con un guadagno di circa 12.85 punti percentuali.",
    chart2_aria:        "Grafico a barre raggruppate: tassi di occupazione controfattuali. Status quo: Sud 57.32%, Nord 71%, Italia 64.86%. Scenario 1: Sud 70.17%, Italia 70.63%. Scenario 2: Sud 71.24%, Italia 71.11%.",
    chart2_sr_summary:  "Status quo: Sud IT 57.32% · Nord IT 71.00% · Italia 64.86%. CF Scenario 1: Sud IT 70.17% · Nord IT 71.00% · Italia 70.63%. CF Scenario 2: Sud IT 71.24% · Nord IT 71.00% · Italia 71.11%.",
    chart_areas_label:  ["IT Sud", "IT Nord", "DE Ovest", "DE Est"],
    chart_cf_areas:     ["Sud IT", "Nord IT", "Italia"],
    legend_status_quo:  "Status quo",
    legend_cf1:         "CF Scenario 1",
    legend_cf2:         "CF Scenario 2",

    process_label: "Metodologia",
    process_title: "Processo di Analisi",
    process_steps: [
      { phase: "Dati",          title: "Raccolta dei dati",              desc: "Dataset provinciali NUTS-3: GVA, salari, occupazione per province italiane e tedesche. Fonti: Eurostat, ISTAT, Destatis. Copertura temporale pluriennale." },
      { phase: "Wrangling",     title: "Data wrangling in Stata",         desc: "Pulizia e merge dei dataset, correzione per lavoro informale (Sud Italia), costruzione variabili panel per provincia-anno. Normalizzazione degli indicatori salariali." },
      { phase: "Regressione",   title: "Analisi di regressione panel",    desc: "Regressioni panel OLS con effetti fissi provinciali e temporali. Stima dell'elasticità salario-produttività per area geografica (Nord/Sud IT; Ovest/Est DE) e settore manifatturiero." },
      { phase: "Controfattuale",title: "Analisi controfattuale",          desc: "Simulazione: cosa succederebbe se l'Italia adottasse la flessibilità salariale tedesca? Tre scenari (top 0%, 5%, 10%, 20% delle province) con effetti su salari, occupazione e reddito aggregato." },
      { phase: "LaTeX",         title: "Scrittura & output LaTeX",        desc: <span>Tesi completa con tabelle e figure generate automaticamente da Stata, supervisione del {PROF_LINK} (Julius-Maximilian Universität Würzburg). Voto finale 110/110.</span> },
    ],

    conclusion_label:   "Conclusioni",
    conclusion_title:   "Cosa Ci Insegna Questo Confronto",
    conclusion_text:    "L'evidenza empirica è chiara: il sistema di contrattazione collettiva centralizzato italiano comprime i salari verso una media nazionale, disconnettendo la retribuzione dalla produttività locale. Il risultato è una misallocation del lavoro persistente.",
    conclusion_germany: "La Germania, con un sistema di contrattazione più decentrato, mostra elasticità salario-produttività 4–5 volte più alte. Questo non significa che il modello tedesco sia privo di svantaggi (produce gap salariali geografici più ampi), ma dimostra che una maggiore flessibilità nella determinazione dei salari locali è associata a mercati del lavoro più efficienti.",
    conclusion_policy:  "Le simulazioni controfattuali suggeriscono che una riforma in direzione di una maggiore flessibilità salariale regionale potrebbe portare il tasso di occupazione del Sud italiano da 57.3% a ~70–71%, riducendo significativamente il divario storico Nord-Sud.",

    learnings_label: "Takeaway",
    learnings_title: "Risultati & Apprendimenti",
    learnings: [
      "Prima esperienza completa di ricerca econometrica su dati reali a livello provinciale (NUTS-3)",
      "Gestione di dataset eterogenei multi-paese con pulizia avanzata in Stata",
      "Analisi panel con effetti fissi e costruzione di scenari controfattuali quantitativi",
      "Presentazione davanti a commissione accademica internazionale — doppia laurea Verona–Würzburg",
      "Output accademico formale: tesi in LaTeX con tabelle e figure automatizzate da Stata",
    ],
    empirical_evidence_label: "Evidenza empirica",
    german_case_label:        "Il caso tedesco",
    policy_label:             "Implicazioni di policy",
    research_data_title:      "Dati della Ricerca",
    github_label:             "Codice sorgente della tesi su GitHub",
  },

  en: {
    breadcrumb_projects: "Projects",
    breadcrumb_self:     "Master's Thesis",
    back:                "← Projects",
    period:              "Oct 2022 – Dec 2024",
    grade_label:         "Grade",
    grade:               "110/110",
    supervisor:          <span>Supervisor: {PROF_LINK} · Julius-Maximilian Universität Würzburg</span>,
    subtitle:            "Master's Thesis · Economics and Data Analysis",

    context_label: "Context",
    context_title: "The Economic Problem",
    context_text: "In Italy, national collective agreements set uniform minimum wages by sector across the entire country, regardless of local productivity. The result is that a metalworker in Milan and one in Crotone receive similar wages, despite the two areas having radically different productivity levels. This wage compression is not neutral: if the minimum wage is too high relative to local productivity, firms in the South don't hire — and unemployed workers don't relocate North because moving costs are high. The labour market cannot rebalance itself.",
    context_question: "The research question is: how large is this effect, and what would happen if Italy adopted a system more similar to Germany's, where bargaining is more decentralised and wages adjust more closely to local productivity?",

    overview_label: "Overview",
    overview_title: "The Research Project",
    overview_body: "Master's thesis for a double degree between the University of Verona and Julius-Maximilian Universität Würzburg, graded 110/110. The research investigates how wage-bargaining systems generate regional misallocation, comparing Italy's centralised model with Germany's more flexible approach — replicating and extending the framework of Boeri, Ichino, Moretti & Posch (JEEA 2021). Data are provincial NUTS-3 observations on wages, GVA and employment for Italy and Germany. All analysis was conducted in Stata with LaTeX output.",

    findings_label: "Results",
    findings_title: "Key Findings",
    findings: [
      { stat: "4–5×", label: "Wage-productivity elasticity: Germany vs Italy", desc: "The log GVA→wages coefficient is 0.195 (South IT) and 0.137 (North IT) against 0.739 (West DE) and 0.380 (East DE). Germany shows a 4–5× stronger correlation between local productivity and nominal wages." },
      { stat: "+12.85 p.p.", label: "The cost of centralised bargaining", desc: "Counterfactual analysis: with German wage flexibility, the employment rate in Southern Italy would rise from 57.32% to ~70–71% (+12.85 p.p.), and per-capita labour income from €766 to €881/month (+7.5%)." },
      { stat: "€0.32", label: "North-South wage compression in Italy", desc: "Italy's hourly North-South wage gap is only €0.32 (€8.68 vs €8.36) despite far larger productivity differences. Germany's system produces wider wage gaps but more efficient labour allocation." },
    ],

    charts_label:       "Data",
    chart1_title:       "Wage-Productivity Elasticity by Area",
    chart1_desc:        "Log GVA → nominal wages coefficient · panel regression with fixed effects",
    chart1_note:        "Source: own elaboration on NUTS-3 provincial data",
    chart1_se_prefix:   "SE:",
    chart1_explanation: "This chart shows how strongly nominal wages respond to local productivity changes. A high coefficient means where productivity is high, wages are high — exactly what happens in Germany (0.739 West, 0.380 East). In Italy coefficients are very low (0.195 South, 0.137 North): wages are compressed towards a national average.",
    chart1_aria:        "Bar chart: wage-productivity elasticity. Italy South 0.195, Italy North 0.137, Germany West 0.739, Germany East 0.380. Germany shows values 4–5 times higher than Italy.",
    chart1_sr_summary:  "Elasticity data: IT South 0.195 (SE 0.013) · IT North 0.137 (SE 0.019) · DE West 0.739 (SE 0.013) · DE East 0.380 (SE 0.008).",
    chart2_title:       "Counterfactual Analysis — Employment Rate (%)",
    chart2_desc:        "Effects of applying German wage flexibility to Italian provinces",
    chart2_note:        "CF Scenario 1: top 0% · CF Scenario 2: top 0% variant",
    chart2_explanation: "This chart answers the central question of the thesis: what would happen to Italian employment rates if Italy adopted German wage flexibility? The South would rise from 57.3% to ~70–71%, nearly matching the North, a gain of around 12.85 percentage points.",
    chart2_aria:        "Grouped bar chart: counterfactual employment rates. Status quo: South 57.32%, North 71%, Italy 64.86%. Scenario 1: South 70.17%, Italy 70.63%. Scenario 2: South 71.24%, Italy 71.11%.",
    chart2_sr_summary:  "Status quo: South IT 57.32% · North IT 71.00% · Italy 64.86%. CF Scenario 1: South IT 70.17% · North IT 71.00% · Italy 70.63%. CF Scenario 2: South IT 71.24% · North IT 71.00% · Italy 71.11%.",
    chart_areas_label:  ["IT South", "IT North", "DE West", "DE East"],
    chart_cf_areas:     ["South IT", "North IT", "Italy"],
    legend_status_quo:  "Status quo",
    legend_cf1:         "CF Scenario 1",
    legend_cf2:         "CF Scenario 2",

    process_label: "Methodology",
    process_title: "Analysis Process",
    process_steps: [
      { phase: "Data",          title: "Data collection",              desc: "NUTS-3 provincial datasets: GVA, wages, employment for Italian and German provinces. Sources: Eurostat, ISTAT, Destatis. Multi-year temporal coverage." },
      { phase: "Wrangling",     title: "Data wrangling in Stata",      desc: "Dataset cleaning and merging, correction for informal labour (Southern Italy), construction of province-year panel variables. Normalisation of wage indicators." },
      { phase: "Regression",    title: "Panel regression analysis",    desc: "Panel OLS regressions with provincial and time fixed effects. Estimation of wage-productivity elasticity by geographic area (North/South IT; West/East DE) and manufacturing sector." },
      { phase: "Counterfactual",title: "Counterfactual analysis",      desc: "Simulation: what would happen if Italy adopted German wage flexibility? Three scenarios (top 0%, 5%, 10%, 20% of provinces) with effects on wages, employment and aggregate income." },
      { phase: "LaTeX",         title: "Writing & LaTeX output",       desc: <span>Full thesis with tables and figures automatically generated from Stata, supervised by {PROF_LINK} (Julius-Maximilian Universität Würzburg). Final grade 110/110.</span> },
    ],

    conclusion_label:   "Conclusions",
    conclusion_title:   "What This Comparison Tells Us",
    conclusion_text:    "The empirical evidence is clear: Italy's centralised collective bargaining system compresses wages towards a national average, decoupling pay from local productivity. The result is persistent labour misallocation.",
    conclusion_germany: "Germany, with a more decentralised bargaining system, shows wage-productivity elasticities 4–5 times higher. This demonstrates that greater flexibility in setting local wages is associated with more efficient labour markets and higher employment rates in less productive areas.",
    conclusion_policy:  "The counterfactual simulations suggest that a reform towards greater regional wage flexibility could raise Southern Italy's employment rate from 57.3% to ~70–71%, significantly narrowing the historical North-South divide.",

    learnings_label: "Takeaway",
    learnings_title: "Results & Learnings",
    learnings: [
      "First complete econometric research project on real provincial-level data (NUTS-3)",
      "Management of heterogeneous multi-country datasets with advanced cleaning in Stata",
      "Panel analysis with fixed effects and construction of quantitative counterfactual scenarios",
      "Presentation before an international academic examination board — double degree Verona–Würzburg",
      "Formal academic output: thesis in LaTeX with tables and figures automated from Stata",
    ],
    empirical_evidence_label: "Empirical evidence",
    german_case_label:        "The German case",
    policy_label:             "Policy implications",
    research_data_title:      "Research Data",
    github_label:             "Thesis source code on GitHub",
  },
};

/* ── Chart card wrapper ───────────────────────────────────────── */
function ChartCard({
  title, desc, note, ariaLabel, srSummary, children,
}: {
  title: string; desc: string; note?: string;
  ariaLabel: string; srSummary: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6">
      <h3 className="font-bold text-[var(--foreground)] text-sm mb-0.5">{title}</h3>
      <p className="text-xs font-mono text-[var(--color-muted)] mb-5">{desc}</p>
      {/* aria-label + role="img" make the canvas accessible (WCAG 1.1.1) */}
      <div aria-label={ariaLabel} role="img">
        {children}
      </div>
      {/* Screen-reader text summary (WCAG chart accessibility) */}
      <p className="sr-only">{srSummary}</p>
      {note && (
        <p className="text-xs text-[var(--color-muted)] mt-3 font-mono">{note}</p>
      )}
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function ThesisClient() {
  const { lang } = useLang();
  const { dark } = useTheme();
  const reduced = useReducedMotion() ?? false;
  const c = CONTENT[lang];

  /* Chart theme — memoized to prevent recreation on every render */
  const grid  = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const muted = dark ? "#94a3b8" : "#64748b";

  const tt = useMemo(() => ({
    backgroundColor: dark ? "#1e293b" : "#ffffff",
    borderColor:     dark ? "#475569" : "#e2e8f0",
    titleColor:      dark ? "#f1f5f9" : "#0f172a",
    bodyColor:       dark ? "#cbd5e1" : "#334155",
    borderWidth: 1,
    padding: 10,
  }), [dark]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lbl = (fn: (ctx: any) => string) => fn;

  /* Chart 1 data — memoized (react-best-practices: rerender-memo) */
  const elasticityData = useMemo(() => ({
    labels: c.chart_areas_label,
    datasets: [{
      label: "Elasticità",
      data: ELASTICITY_VALUES,
      backgroundColor: [INDIGO, INDIGO_LIGHT, EMERALD, EMERALD_LIGHT],
      borderRadius: 6,
      borderSkipped: false,
    }],
  }), [c.chart_areas_label]);

  const elasticityOpts = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: reduced ? 0 : 800 },
    plugins: {
      legend: { display: false },
      tooltip: {
        ...tt,
        callbacks: {
          label: lbl(ctx => ` ${ctx.raw.toFixed(3)}`),
          afterLabel: lbl(ctx => ` ${c.chart1_se_prefix} ${ELASTICITY_SE[ctx.dataIndex].toFixed(3)}`),
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: muted, font: { size: 11 } } },
      y: { grid: { color: grid }, ticks: { color: muted, font: { size: 11 } }, min: 0, max: 0.85 },
    },
  }), [tt, grid, muted, reduced, c.chart1_se_prefix]);

  /* Chart 2 data — memoized */
  const cfData = useMemo(() => ({
    labels: c.chart_cf_areas,
    datasets: [
      { label: c.legend_status_quo, data: CF_STATUS_QUO, backgroundColor: SLATE, borderRadius: 4 },
      { label: c.legend_cf1,        data: CF_SCENARIO_1, backgroundColor: INDIGO, borderRadius: 4 },
      { label: c.legend_cf2,        data: CF_SCENARIO_2, backgroundColor: EMERALD, borderRadius: 4 },
    ],
  }), [c.chart_cf_areas, c.legend_status_quo, c.legend_cf1, c.legend_cf2]);

  const cfOpts = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: reduced ? 0 : 800 },
    plugins: {
      legend: {
        display: true,
        labels: { color: dark ? "#cbd5e1" : "#334155", font: { size: 11 }, usePointStyle: true, pointStyleWidth: 8 },
      },
      tooltip: {
        ...tt,
        callbacks: {
          label: lbl(ctx => {
            const base = CF_STATUS_QUO[ctx.dataIndex];
            const diff = (ctx.raw - base).toFixed(2);
            const sign = ctx.raw > base ? `+${diff}` : diff;
            return ` ${ctx.dataset.label}: ${ctx.raw.toFixed(2)}%${ctx.datasetIndex > 0 ? ` (${sign} p.p.)` : ""}`;
          }),
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: muted, font: { size: 11 } } },
      y: {
        grid: { color: grid },
        ticks: { color: muted, font: { size: 11 }, callback: (v: number | string) => v + "%" },
        min: 50, max: 80,
      },
    },
  }), [tt, grid, muted, dark, reduced]);

  const fadeUp = (delay = 0) => ({
    initial: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.05 } as const,
    transition: { duration: 0.45, delay, ease: [0, 0, 0.2, 1] as const },
  });

  return (
    <main className="pt-20 bg-[var(--background)] min-h-screen">

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <section
        aria-label={c.breadcrumb_self}
        className="py-16 bg-[var(--color-surface)] border-b border-[var(--color-border)]"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          {/* Breadcrumb — WCAG 2.4.8 Location */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[var(--color-muted)] mb-6">
            <Link href="/" className="hover:text-[var(--color-primary)] transition-colors duration-150">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/#projects" className="hover:text-[var(--color-primary)] transition-colors duration-150">{c.breadcrumb_projects}</Link>
            <span aria-hidden="true">/</span>
            <span className="text-[var(--foreground)]" aria-current="page">{c.breadcrumb_self}</span>
          </nav>

          <Link
            href="/#projects"
            className="inline-flex items-center gap-1 text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-light)] transition-colors duration-150 mb-8 font-medium"
          >
            {c.back}
          </Link>

          <motion.div
            initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
          >
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <p className="text-[var(--color-primary)] font-semibold text-sm uppercase tracking-widest font-mono">{c.period}</p>
              <span className="inline-flex items-center gap-1.5 bg-[var(--color-primary)] text-white text-xs font-bold px-3 py-1 rounded-full">
                {c.grade_label}: {c.grade}
              </span>
            </div>

            <h1
              className="text-4xl sm:text-5xl font-bold text-[var(--foreground)] mb-3 leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Regional Misallocation:<br />
              <span className="text-[var(--color-primary)]">Italia vs Germania</span>
            </h1>

            <p className="text-base text-[var(--color-muted)] mb-1">{c.subtitle}</p>
            <p className="text-sm text-[var(--color-muted)] font-mono mb-6">{c.supervisor}</p>

            <div className="flex flex-wrap gap-2 mb-8">
              {TAGS.map(tag => (
                <span key={tag} className="text-xs font-medium bg-indigo-50 dark:bg-indigo-950/40 text-[var(--color-primary)] px-3 py-1 rounded-full border border-[var(--color-border)]">
                  {tag}
                </span>
              ))}
            </div>

            <a
              href="https://github.com/corbisieromichele00/thesis"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={c.github_label}
              className="inline-flex items-center gap-2 bg-[var(--foreground)] hover:opacity-80 text-[var(--background)] text-sm font-semibold px-5 py-2.5 rounded-full transition-opacity duration-150 min-h-[44px]"
            >
              <FiGithub className="w-4 h-4" aria-hidden="true" />
              GitHub
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── CONTEXT ─────────────────────────────────────────────── */}
      <section aria-label={c.context_label} className="py-14 bg-[var(--background)] border-b border-[var(--color-border)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp(0.05)}>
            <p className="text-[var(--color-primary)] font-semibold text-sm uppercase tracking-widest mb-2">{c.context_label}</p>
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-5" style={{ fontFamily: "var(--font-display)" }}>{c.context_title}</h2>
            <p className="text-[var(--color-muted)] leading-relaxed text-base mb-4">{c.context_text}</p>
            <div className="bg-indigo-50 dark:bg-indigo-950/30 border-l-4 border-[var(--color-primary)] rounded-r-2xl px-6 py-4">
              <p className="text-sm text-[var(--color-primary)] leading-relaxed">{c.context_question}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── OVERVIEW ────────────────────────────────────────────── */}
      <section aria-label={c.overview_label} className="py-14 bg-[var(--background)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp()}>
            <p className="text-[var(--color-primary)] font-semibold text-sm uppercase tracking-widest mb-2">{c.overview_label}</p>
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-6" style={{ fontFamily: "var(--font-display)" }}>{c.overview_title}</h2>
            <p className="text-[var(--color-muted)] leading-relaxed text-base">{c.overview_body}</p>
          </motion.div>
        </div>
      </section>

      {/* ── KEY FINDINGS ─────────────────────────────────────────── */}
      <section aria-label={c.findings_label} className="py-14 bg-[var(--color-surface)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp()}>
            <p className="text-[var(--color-primary)] font-semibold text-sm uppercase tracking-widest mb-2">{c.findings_label}</p>
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-8" style={{ fontFamily: "var(--font-display)" }}>{c.findings_title}</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {c.findings.map((f, i) => (
              <motion.div
                key={f.stat}
                {...fadeUp(i * 0.08)}
                className="bg-[var(--background)] rounded-2xl p-6 border border-[var(--color-border)] shadow-sm"
              >
                <div
                  className="text-3xl font-black text-[var(--color-primary)] mb-1 leading-none tabular-nums"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {f.stat}
                </div>
                <div className="text-sm font-semibold text-[var(--foreground)] mb-3 mt-2">{f.label}</div>
                <p className="text-sm text-[var(--color-muted)] leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE CHARTS ───────────────────────────────────── */}
      <section aria-label={c.charts_label} className="py-14 bg-[var(--background)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp()}>
            <p className="text-[var(--color-primary)] font-semibold text-sm uppercase tracking-widest mb-2">{c.charts_label}</p>
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-8" style={{ fontFamily: "var(--font-display)" }}>{c.research_data_title}</h2>
          </motion.div>
          <div className="space-y-6">

            {/* Chart 1 — Elasticity */}
            <motion.div {...fadeUp()}>
              <ChartCard
                title={c.chart1_title}
                desc={c.chart1_desc}
                note={c.chart1_note}
                ariaLabel={c.chart1_aria}
                srSummary={c.chart1_sr_summary}
              >
                <div className="flex flex-wrap gap-4 mb-4 text-xs font-mono text-[var(--color-muted)]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm inline-block" style={{ background: INDIGO }} aria-hidden="true" />
                    IT Sud / IT Nord
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm inline-block" style={{ background: EMERALD }} aria-hidden="true" />
                    DE Ovest / DE Est
                  </span>
                </div>
                <div className="h-64">
                  <Bar data={elasticityData} options={elasticityOpts as ChartOptions<"bar">} />
                </div>
              </ChartCard>
              <p className="text-sm text-[var(--color-muted)] leading-relaxed mt-3 px-1">{c.chart1_explanation}</p>
            </motion.div>

            {/* Chart 2 — Counterfactual */}
            <motion.div {...fadeUp(0.08)}>
              <ChartCard
                title={c.chart2_title}
                desc={c.chart2_desc}
                note={c.chart2_note}
                ariaLabel={c.chart2_aria}
                srSummary={c.chart2_sr_summary}
              >
                <div className="h-72">
                  <Bar data={cfData} options={cfOpts as ChartOptions<"bar">} />
                </div>
              </ChartCard>
              <p className="text-sm text-[var(--color-muted)] leading-relaxed mt-3 px-1">{c.chart2_explanation}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── METHODOLOGY ──────────────────────────────────────────── */}
      <section aria-label={c.process_label} className="py-14 bg-[var(--color-surface)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp()}>
            <p className="text-[var(--color-primary)] font-semibold text-sm uppercase tracking-widest mb-2">{c.process_label}</p>
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-10" style={{ fontFamily: "var(--font-display)" }}>{c.process_title}</h2>
          </motion.div>
          <div className="relative">
            <div aria-hidden="true" className="absolute left-5 top-0 bottom-0 w-px bg-[var(--color-border)] hidden sm:block" />
            <div className="space-y-5">
              {c.process_steps.map((step, i) => (
                <motion.div
                  key={step.phase}
                  {...fadeUp(i * 0.07)}
                  className="flex gap-5"
                >
                  <div aria-hidden="true" className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center z-10 shadow-sm">
                    <span className="text-white text-xs font-bold">{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0 bg-[var(--background)] rounded-2xl p-5 border border-[var(--color-border)]">
                    <div className="flex items-start gap-3 mb-2 flex-wrap">
                      <span className="flex-shrink-0 text-xs font-bold text-[var(--color-primary)] bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {step.phase}
                      </span>
                      <h3 className="font-bold text-[var(--foreground)] text-sm min-w-0">{step.title}</h3>
                    </div>
                    <p className="text-sm text-[var(--color-muted)] leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONCLUSIONS ──────────────────────────────────────────── */}
      <section aria-label={c.conclusion_label} className="py-14 bg-[var(--background)] border-b border-[var(--color-border)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp()}>
            <p className="text-[var(--color-primary)] font-semibold text-sm uppercase tracking-widest mb-2">{c.conclusion_label}</p>
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-8" style={{ fontFamily: "var(--font-display)" }}>{c.conclusion_title}</h2>
          </motion.div>
          <div className="space-y-5">
            <motion.div {...fadeUp()} className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6">
              <div className="flex items-center gap-2 mb-3">
                <span aria-hidden="true" className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted)]">{c.empirical_evidence_label}</span>
              </div>
              <p className="text-sm text-[var(--color-muted)] leading-relaxed">{c.conclusion_text}</p>
            </motion.div>
            <motion.div {...fadeUp(0.07)} className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6">
              <div className="flex items-center gap-2 mb-3">
                <span aria-hidden="true" className="w-2 h-2 rounded-full bg-[var(--color-secondary)]" />
                <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted)]">{c.german_case_label}</span>
              </div>
              <p className="text-sm text-[var(--color-muted)] leading-relaxed">{c.conclusion_germany}</p>
            </motion.div>
            <motion.div {...fadeUp(0.14)} className="bg-[var(--color-primary)] rounded-2xl p-6">
              <p className="text-xs font-mono uppercase tracking-widest text-indigo-200 mb-3">{c.policy_label}</p>
              <p className="text-sm text-white leading-relaxed">{c.conclusion_policy}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TAKEAWAY ─────────────────────────────────────────────── */}
      <section aria-label={c.learnings_label} className="py-14 bg-[var(--background)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp()}>
            <p className="text-[var(--color-primary)] font-semibold text-sm uppercase tracking-widest mb-2">{c.learnings_label}</p>
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-8" style={{ fontFamily: "var(--font-display)" }}>{c.learnings_title}</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {c.learnings.map((l, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.06)}
                className="flex items-start gap-3 bg-[var(--color-surface)] rounded-2xl p-5 border border-[var(--color-border)]"
              >
                <FiCheckCircle className="w-5 h-5 text-[var(--color-secondary)] flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-sm text-[var(--color-muted)] leading-relaxed">{l}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-indigo-50 dark:hover:bg-indigo-950/30 font-semibold px-6 py-3 rounded-full transition-colors duration-150 text-sm min-h-[44px]"
            >
              {c.back}
            </Link>
            <a
              href="https://github.com/corbisieromichele00/thesis"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={c.github_label}
              className="inline-flex items-center gap-2 bg-[var(--foreground)] hover:opacity-80 text-[var(--background)] font-semibold px-6 py-3 rounded-full transition-opacity duration-150 text-sm min-h-[44px]"
            >
              <FiGithub className="w-4 h-4" aria-hidden="true" />
              GitHub
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
