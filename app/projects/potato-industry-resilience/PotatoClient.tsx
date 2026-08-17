"use client";

// Skills applied: react-best-practices (dynamic chart imports, useMemo for all chart data),
//                 accesslint (chart aria-label + role="img", sr-only summaries,
//                             aria-hidden icons, keyboard-nav on tabs, reduced-motion),
//                 composition-patterns (react19 use() context),
//                 ui-ux-pro-max (chart: screen-reader-summary, gridline-subtle)
//
// Struttura richiesta da Michele (redi istruzioni.pptx):
//   4 tab soltanto — Redditività, Indice Prezzi Cibo, Precipitazioni, Carburante.

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, Tooltip, Legend, Filler,
  type ChartOptions,
} from "chart.js";
import { FiGithub, FiCheckCircle, FiChevronUp, FiChevronDown } from "react-icons/fi";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { motion, useReducedMotion } from "framer-motion";

// Dynamic imports with ssr:false — defers the chart bundle until mount,
// prevents canvas SSR errors, improves LCP on project pages.
const ChartLoading = () => (
  <div className="animate-pulse bg-[var(--color-surface-2)] rounded-xl w-full h-full" aria-hidden="true" />
);
const Bar  = dynamic(() => import("react-chartjs-2").then(m => m.Bar),  { ssr: false, loading: ChartLoading });
const Line = dynamic(() => import("react-chartjs-2").then(m => m.Line), { ssr: false, loading: ChartLoading });

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend, Filler);

const GITHUB_URL = "https://github.com/corbisieromichele00/Mitolo-Analysis";

const TAGS = ["Excel", "BigQuery (SQL)", "Tableau", "Data Cleaning", "Data Visualization"];

/* ── Chart palette — allineata agli export Tableau del progetto ── */
const CLR_VALUE  = "#B01116"; // rosso scuro — valore di mercato
const CLR_PRICE  = "#4E9A51"; // verde — indice prezzi patate
const CLR_CPI    = "#4372A8"; // blu acciaio — CPI ortaggi
const CLR_RAIN   = "#7FC9DE"; // azzurro — precipitazioni
const CLR_PROD   = "#C00000"; // rosso — volume di produzione
const CLR_FUEL   = "#D9C170"; // ocra — diesel
const CLR_MARGIN = "#4F46E5"; // indigo — margine netto (proxy)
const FILL_FUEL  = "rgba(233,213,138,0.45)";
const FILL_RAIN  = "rgba(127,201,222,0.12)";

/* ── Dataset ─────────────────────────────────────────────────────
   Fonti: ABARES / Horticulture Statistics Handbook (indici settore patate),
          ABS (CPI ortaggi), BOM stazione Lameroo SA (pioggia),
          AIP Terminal Gate Price Adelaide (diesel).
   Serie ricavate dai file process_data/ e dalle query BigQuery del repo.  */

/* Anni finanziari con dati completi sul settore patate */
const FY = ["2018-19", "2019-20", "2020-21", "2021-22", "2022-23", "2023-24", "2024-25", "2025-26"];
const MARKET_VALUE = [61.51, 62.06, 59.07, 66.57, 68.46, 85.22, 91.04, 100.00]; // production_val_index
const PRICE_INDEX  = [66.15, 67.16, 63.54, 68.16, 69.94, 87.01, 88.87, 100.00]; // price_index
const PROD_VOL     = [92.99, 92.41, 92.98, 97.67, 97.88, 97.94, 102.44, 100.00]; // production_vol_index
// net_margin_proxy = price_index − media(fuel, fertiliser, chemicals)   [query margin.txt]
const NET_MARGIN   = [-16.85, -12.62, -11.98, -44.21, -59.45, -23.47, -10.12, 0.00];
// diesel medio annuo (c/L) allineato all'anno finanziario, come nella query margin.txt
const FY_DIESEL    = [135.15, 135.46, 108.63, 130.33, 191.94, 184.04, 174.88, 168.06];

/* Tabella indici di costo — intero arco disponibile */
const FY_ALL = ["2016-17", "2017-18", "2018-19", "2019-20", "2020-21", "2021-22", "2022-23", "2023-24", "2024-25", "2025-26"];
const IDX_HORT = [81.37, 80.48, 84.83, 87.26, 85.76, 91.71, 98.85, 97.41, 99.67, 100.00];
const IDX_FUEL = [63.45, 73.98, 82.97, 78.83, 62.98, 105.19, 115.86, 114.75, 98.73, 100.00];
const IDX_FERT = [66.81, 69.13, 77.68, 77.18, 73.76, 124.79, 157.22, 107.48, 98.73, 100.00];
const IDX_CHEM = [71.11, 78.72, 88.33, 83.33, 89.80, 107.11, 115.08, 109.21, 99.50, 100.00];

/* Valore netto della produzione agricola australiana (milioni AUD)
   Fonte: ABARES, Agricultural Commodities — Tabella 2 "Farm costs and returns",
   riga "Net value of farm production". */
const VEG_FY = ["2017-18", "2018-19", "2019-20", "2020-21", "2021-22", "2022-23", "2023-24", "2024-25", "2025-26"];
const VEG_NET_VALUE = [10504, 8655, 8168, 13579, 21300, 21010, 9703, 16767, 22016];

/* Serie annuali (anno solare) */
const YEARS = ["2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"];
const CPI_VEG    = [76.91, 78.91, 81.89, 85.97, 86.18, 97.24, 94.33, 99.08, 102.07, 102.06];
/* CPI riallineato all'anno finanziario come nella query cpi.txt (LEFT(FY,4) = anno solare) */
const CPI_BY_FY  = [78.91, 81.89, 85.97, 86.18, 97.24, 94.33, 99.08, 102.07];
const RAIN_TOTAL = [106.8, 208.4, 227.0, 356.0, 224.8, 467.6, 420.8, 196.2, 270.6, 171.2];
const DIESEL     = [119.12, 135.15, 135.46, 108.63, 130.33, 191.94, 184.04, 174.88, 168.06, 210.67];

/* Crescita YoY — query "growth production rainfall.txt" */
const YOY_FY   = ["2019-20", "2020-21", "2021-22", "2022-23", "2023-24", "2024-25"];
const YOY_PROD = [-0.62, 0.61, 5.05, 0.21, 0.06, 4.59];
const YOY_RAIN = [8.93, 56.83, -36.85, 108.01, -10.01, -53.37];

/* ── Content ─────────────────────────────────────────────────────── */
const CONTENT = {
  it: {
    breadcrumb_projects: "Progetti",
    breadcrumb_current: "Potato Industry Resilience",
    subtitle: "Analisi indipendente — Mitolo Family Farms, Adelaide (South Australia)",
    date: "2026",
    back: "← Progetti",

    stat_value: "Valore Mercato Patate", stat_value_sub: "FY2018-19 → FY2025-26",
    stat_price: "Prezzo Patate", stat_price_sub: "indice normalizzato a 100",
    stat_vol: "Volume Produzione", stat_vol_sub: "oscillazione max nel periodo",
    stat_diesel: "Diesel Adelaide", stat_diesel_sub: "≈ +0,92 AUD/L (2017 → 2026)",
    stat_cpi: "CPI Ortaggi", stat_cpi_sub: "media annua 2017 → 2025",

    tab_margin: "Redditività", tab_cpi: "Indice Prezzi Cibo",
    tab_rain: "Precipitazioni", tab_fuel: "Carburante",

    /* Redditività */
    chart_veg_title: "Valore Netto della Produzione Agricola Australiana (2017–2026)",
    chart_veg_desc: "Valore netto annuo, in milioni di AUD — ABARES, Agricultural Commodities (tab. 2)",
    chart_veg_aria: "Grafico a barre: valore netto della produzione agricola australiana dal FY2017-18 al FY2025-26. Massimi nel 2021-22 (21.300), 2022-23 (21.010) e 2025-26 (22.016 milioni di AUD), minimo nel 2019-20 (8.168 milioni).",
    chart_dual_title: "Valore di Mercato vs Indice Prezzi delle Patate (2018–2026)",
    chart_dual_desc: "Entrambi gli indici normalizzati a 100 nel FY2025-26",
    chart_dual_aria: "Grafico a linee: valore di mercato delle patate da 61,5 a 100 e indice prezzi da 66,1 a 100 tra il FY2018-19 e il FY2025-26. Crescita di circa 35-40% per entrambe le serie.",
    chart_margin_title: "Margine Netto (proxy)",
    chart_margin_desc: "Indice prezzi − media di carburante, fertilizzanti e agrofarmaci",
    chart_margin_aria: "Grafico a barre: proxy del margine netto per anno finanziario. Minimo nel FY2022-23 a −59,5 punti, recupero fino a 0 nel FY2025-26.",
    table_idx_title: "Indici di Costo e Produzione",
    table_idx_desc: "Serie usata come base per il calcolo del margine (100 = FY2025-26)",
    col_fy: "Anno Fin.", col_hort: "Ortofrutta", col_fuelidx: "Carburante",
    col_fert: "Fertilizzanti", col_chem: "Agrofarmaci",
    profit_note_title: "Cosa dicono i dati",
    profit_text: [
      "Il valore di mercato delle patate e l'indice dei prezzi crescono entrambi di circa il 35–40% nel periodo analizzato: la teoria microeconomica di base si aspetterebbe che un aumento di prezzo riduca la quantità venduta, ma qui accade il contrario.",
      "Una lettura possibile è che la patata si comporti come bene inferiore nei periodi di pressione economica: anche con prezzi in salita i consumatori continuano ad acquistarla, sostituendo alternative più costose.",
      "Il proxy del margine netto mostra però una compressione severa nel FY2021-22 e FY2022-23, quando fertilizzanti (+157) e carburante (+116) sono cresciuti molto più dei prezzi di vendita. Dal FY2023-24 il divario si richiude.",
    ],

    /* CPI */
    chart_cpi_title: "Indice dei Prezzi al Consumo — Ortaggi (2017–2026)",
    chart_cpi_desc: "Media annua dell'indice CPI ortaggi (ABS, dato nazionale)",
    chart_cpi_aria: "Grafico a linee: CPI ortaggi da 76,9 nel 2017 a 102,1 nel 2025, con un picco nel 2022 a 97,2 e una flessione nel 2023 a 94,3.",
    chart_cpivs_title: "Prezzo Patate vs CPI Ortaggi",
    chart_cpivs_desc: "Confronto tra l'indice prezzi delle patate e l'inflazione del comparto ortaggi",
    chart_cpivs_aria: "Grafico a linee: indice prezzi patate e CPI ortaggi per anno finanziario. Nel 2023 le patate accelerano mentre il comparto ortaggi arretra.",
    cpi_note_title: "Confronto con il comparto ortaggi",
    cpi_text: [
      "Il CPI degli ortaggi è cresciuto di circa il 25–30% dal 2017, ma il valore netto del comparto non è cresciuto in modo coerente: si osservano cali marcati tra il 2017 e il 2020 e di nuovo nel 2023.",
      "Questo suggerisce che la domanda complessiva di ortaggi sia più sensibile alle pressioni inflazionistiche.",
      "Il 2023 è il caso più interessante: il valore del mercato delle patate registra un forte aumento mentre il comparto ortaggi nel suo complesso arretra. Con i prezzi in salita su tutta la linea, parte della spesa dei consumatori sembra essersi spostata verso le patate — alimento base accessibile e versatile.",
      "È un vantaggio rilevante per il settore: indica una resilienza all'inflazione superiore rispetto alle altre categorie di ortaggi.",
    ],

    /* Pioggia */
    chart_rain_title: "Resilienza Operativa: Stabilità della Produzione vs Volatilità della Pioggia",
    chart_rain_desc: "Variazione percentuale anno su anno — Lameroo (SA) vs produzione nazionale di patate",
    chart_rain_aria: "Grafico a linee: la pioggia oscilla tra −53% e +108% anno su anno, mentre la crescita dei volumi di produzione resta compresa tra −0,6% e +5,1%.",
    chart_raintot_title: "Precipitazioni Annue — Lameroo, SA",
    chart_raintot_desc: "Totale annuo in millimetri (2017 e 2026 sono anni parziali)",
    chart_raintot_aria: "Grafico a barre: precipitazioni annue a Lameroo. Massimo nel 2022 con 467,6 mm, minimo nel 2024 con 196,2 mm.",
    rain_note_title: "Quanto incide il clima sui volumi?",
    rain_text: [
      "Il grafico confronta la variazione percentuale della pioggia registrata a Lameroo, South Australia, con la variazione della produzione dell'intero settore patate. Lameroo è stata scelta come area di riferimento assumendo che da quella zona provenga una quota significativa della produzione.",
      "Rispetto all'anno base FY2019-20: il FY2020-21 ha registrato circa il 57% di pioggia in più, il FY2021-22 circa il 37% in meno, il FY2022-23 più del doppio, il FY2023-24 circa il 10% in meno e il FY2024-25 oltre il 50% in meno.",
      "Nonostante variazioni climatiche così ampie, i volumi di produzione sono rimasti notevolmente stabili, con oscillazioni non superiori al 5% circa.",
      "Una spiegazione plausibile è l'investimento di lungo periodo in innovazione agricola e sistemi di irrigazione avanzati, che riducono la dipendenza dalla pioggia naturale e migliorano l'efficienza idrica.",
    ],

    /* Carburante */
    chart_fuel_title: "Trend del Costo del Carburante: Adelaide (2017–2026)",
    chart_fuel_desc: "Prezzo diesel all'ingrosso — Terminal Gate Price, media annua in centesimi/litro",
    chart_fuel_aria: "Grafico ad area: il prezzo del diesel all'ingrosso ad Adelaide passa da 119 c/L nel 2017 a 211 c/L nel 2026, con un picco intermedio nel 2022 a 192 c/L.",
    chart_fuelvs_title: "Diesel vs Indice Prezzi Patate",
    chart_fuelvs_desc: "Prezzo diesel medio dell'anno finanziario a confronto con l'indice prezzi",
    chart_fuelvs_aria: "Grafico a linee: il diesel sale fino a 192 c/L nel FY2022-23 e poi scende, mentre l'indice prezzi delle patate continua a crescere fino a 100.",
    fuel_note_title: "Il settore assorbe l'aumento del diesel?",
    fuel_text: [
      "I costi del carburante pesano molto su Mitolo: sia la produzione sia la distribuzione dipendono da mezzi e attrezzature diesel.",
      "Il prezzo all'ingrosso è cresciuto in modo marcato nell'ultimo decennio, con un aumento di quasi un dollaro australiano al litro.",
      "Per capirne l'impatto bastano i risultati dei capitoli precedenti: i volumi di produzione sono rimasti sostanzialmente invariati, mentre valore di mercato e prezzi delle patate sono cresciuti in modo significativo.",
      "Se ne conclude che, nonostante il rincaro del diesel, il valore del mercato delle patate ha continuato a crescere. Una spiegazione plausibile è che l'aumento dei costi legati al carburante sia stato compensato — e probabilmente più che compensato — dai prezzi più alti delle patate.",
    ],

    /* Sezioni statiche */
    intro_title: "Il Progetto",
    intro_text: "Nel 2026 ho lavorato per Mitolo Family Farms, gruppo di Adelaide (South Australia) attivo nel settore delle patate. Svolgevo mansioni da operaio, ma nel tempo libero ho condotto un'analisi sull'impatto dei fattori esogeni — meteo, inflazione e costo del carburante — sui margini dell'azienda. Ho poi usato questo progetto per candidarmi a un ruolo da analista dati all'interno del gruppo, dove è stato accolto molto positivamente.",
    intro_dataset: "Non avendo accesso a dati aziendali interni, ho lavorato sui dati macroeconomici dell'intero settore agricolo australiano — insieme ai dati meteorologici — isolando la componente relativa alle patate. Poiché Mitolo detiene oltre il 60% del mercato australiano, l'analisi resta significativa per l'azienda. Il periodo osservato va dal 2017 al 2025 e il lavoro dimostra l'uso pratico di Excel, BigQuery (SQL) e Tableau.",
    disclaimer_title: "Nota metodologica",
    disclaimer_text: "I dati provengono da fonti esterne, in larga parte agenzie governative. L'analisi è stata realizzata in meno di una settimana, lavorando a tempo pieno in parallelo: non ha il grado di rigore metodologico necessario per trarre conclusioni definitive e beneficerebbe di metodi statistici più avanzati. L'obiettivo è mostrare la capacità di raccogliere, trattare, analizzare e visualizzare dati con gli strumenti citati.",
    tabs_note_title: "Come leggere questa analisi",
    tabs_note: "I contenuti sono organizzati in quattro aree: Redditività, Indice Prezzi Cibo, Precipitazioni e Carburante. Ogni scheda contiene i grafici costruiti in Tableau e la lettura dei risultati.",
    method_title: "Metodo e strumenti",
    method: [
      "Raccolta e pulizia dei dati grezzi in Excel (ABARES, ABS, BOM, AIP)",
      "Caricamento in BigQuery e modellazione con query SQL su data warehouse dedicato",
      "Calcolo di indici normalizzati, crescita YoY e proxy del margine netto in SQL",
      "Visualizzazione finale e dashboard in Tableau",
    ],
    conclusion_title: "Conclusioni",
    conclusion_label: "Resilienza climatica",
    conclusion_text: "Il gruppo dimostra una buona resilienza climatica. Nonostante le forti variazioni nelle precipitazioni, i volumi di produzione sono rimasti stabili — con fluttuazioni entro il 5% — grazie agli investimenti in sistemi di irrigazione e innovazione.",
    conclusion_opportunity_label: "Inflazione ed energia",
    conclusion_opportunity: "Mitolo ha un'eccellente reazione all'inflazione: a differenza del settore ortofrutticolo generale, il valore del mercato delle patate è cresciuto del 35–40% all'aumentare dei prezzi, comportandosi come un \"bene inferiore\" a cui i consumatori si rivolgono in periodi di pressione economica. L'azienda assorbe inoltre senza problemi l'aumento dei costi energetici: il forte rincaro del diesel, quasi +1 AUD/L, non ha frenato la crescita del mercato, perché i maggiori costi di trasporto e produzione sono stati compensati dai prezzi al consumo. In conclusione, l'analisi evidenzia l'elevata capacità del settore di assorbire gli shock esterni e mantenere la redditività nel tempo.",

    unit_mln: "mln AUD", unit_mm: "mm", unit_cl: "c/L",
    legend_value: "Valore mercato", legend_price: "Indice prezzi",
    legend_cpi: "CPI ortaggi", legend_prod: "Produzione patate YoY",
    legend_rain: "Pioggia Lameroo YoY", legend_diesel: "Diesel Adelaide",
    legend_margin: "Margine netto (proxy)", legend_rain_tot: "Precipitazioni",
    github_label: "Codice e dati dell'analisi Mitolo su GitHub",
  },

  en: {
    breadcrumb_projects: "Projects",
    breadcrumb_current: "Potato Industry Resilience",
    subtitle: "Independent analysis — Mitolo Family Farms, Adelaide (South Australia)",
    date: "2026",
    back: "← Projects",

    stat_value: "Potato Market Value", stat_value_sub: "FY2018-19 → FY2025-26",
    stat_price: "Potato Price", stat_price_sub: "index normalised to 100",
    stat_vol: "Production Volume", stat_vol_sub: "max swing over the period",
    stat_diesel: "Adelaide Diesel", stat_diesel_sub: "≈ +0.92 AUD/L (2017 → 2026)",
    stat_cpi: "Vegetables CPI", stat_cpi_sub: "annual average 2017 → 2025",

    tab_margin: "Profitability", tab_cpi: "Food Price Index",
    tab_rain: "Rainfall", tab_fuel: "Fuel",

    /* Profitability */
    chart_veg_title: "Annual Net Value of Australian Farm Production (2017–2026)",
    chart_veg_desc: "Net annual value in AUD million — ABARES, Agricultural Commodities (table 2)",
    chart_veg_aria: "Bar chart: net value of Australian farm production from FY2017-18 to FY2025-26. Peaks in 2021-22 (21,300), 2022-23 (21,010) and 2025-26 (22,016 AUD million), trough in 2019-20 (8,168 million).",
    chart_dual_title: "Potato Market Value vs Potato Price Index (2018–2026)",
    chart_dual_desc: "Both indices normalised to 100 in FY2025-26",
    chart_dual_aria: "Line chart: potato market value rises from 61.5 to 100 and the price index from 66.1 to 100 between FY2018-19 and FY2025-26 — roughly 35-40% growth for both series.",
    chart_margin_title: "Net Margin (proxy)",
    chart_margin_desc: "Price index − average of fuel, fertiliser and chemicals indices",
    chart_margin_aria: "Bar chart: net margin proxy by financial year. Trough in FY2022-23 at −59.5 points, recovering to 0 by FY2025-26.",
    table_idx_title: "Cost and Production Indices",
    table_idx_desc: "Base series used to compute the margin proxy (100 = FY2025-26)",
    col_fy: "Fin. Year", col_hort: "Horticulture", col_fuelidx: "Fuel",
    col_fert: "Fertiliser", col_chem: "Chemicals",
    profit_note_title: "What the data shows",
    profit_text: [
      "Potato market value and the price index both grow by roughly 35–40% over the period. Basic microeconomic theory would expect a price increase to reduce quantity sold — here the opposite happens.",
      "One reading is that potatoes behave as an inferior good under economic pressure: even as prices rise, consumers keep buying them and substitute away from more expensive alternatives.",
      "The net margin proxy, however, shows severe compression in FY2021-22 and FY2022-23, when fertiliser (+157) and fuel (+116) rose far faster than selling prices. From FY2023-24 the gap closes again.",
    ],

    /* CPI */
    chart_cpi_title: "Consumer Price Index — Vegetables (2017–2026)",
    chart_cpi_desc: "Annual average of the vegetables CPI (ABS, national figure)",
    chart_cpi_aria: "Line chart: vegetables CPI from 76.9 in 2017 to 102.1 in 2025, peaking at 97.2 in 2022 and dipping to 94.3 in 2023.",
    chart_cpivs_title: "Potato Price vs Vegetables CPI",
    chart_cpivs_desc: "Potato price index compared with vegetable-sector inflation",
    chart_cpivs_aria: "Line chart: potato price index and vegetables CPI by financial year. In 2023 potatoes accelerate while the wider vegetable sector declines.",
    cpi_note_title: "Comparison with the vegetable sector",
    cpi_text: [
      "The vegetables CPI has risen by roughly 25–30% since 2017, yet the sector's net value has not grown consistently: marked declines appear between 2017 and 2020, and again in 2023.",
      "This suggests overall demand for vegetables is more sensitive to inflationary pressure.",
      "2023 is the most telling case: potato market value rises sharply while the vegetable market as a whole records a significant decline. With prices rising across the board, part of consumer spending appears to have shifted toward potatoes — an affordable, versatile staple.",
      "That is a meaningful advantage for the industry: it points to greater resilience to inflation than other vegetable categories.",
    ],

    /* Rainfall */
    chart_rain_title: "Operational Resilience: Production Stability vs Rainfall Volatility",
    chart_rain_desc: "Year-over-year percentage change — Lameroo (SA) vs national potato production",
    chart_rain_aria: "Line chart: rainfall swings between −53% and +108% year over year, while production growth stays within −0.6% and +5.1%.",
    chart_raintot_title: "Annual Rainfall — Lameroo, SA",
    chart_raintot_desc: "Annual total in millimetres (2017 and 2026 are partial years)",
    chart_raintot_aria: "Bar chart: annual rainfall at Lameroo. Maximum 467.6 mm in 2022, minimum 196.2 mm in 2024.",
    rain_note_title: "How much does climate affect volumes?",
    rain_text: [
      "The chart compares the percentage change in rainfall recorded in Lameroo, South Australia, with the percentage change in production across the entire potato industry. Lameroo was selected as the reference area on the assumption that a significant share of production originates there.",
      "Relative to the FY2019-20 baseline: FY2020-21 recorded about 57% more rainfall, FY2021-22 about 37% less, FY2022-23 more than double, FY2023-24 about 10% less and FY2024-25 more than 50% less.",
      "Despite these considerable climatic variations, production volumes remained remarkably stable, with fluctuations of no more than about 5%.",
      "One plausible explanation is long-term investment in agricultural innovation and advanced irrigation systems, which reduce dependence on natural rainfall and improve water efficiency.",
    ],

    /* Fuel */
    chart_fuel_title: "Annual Fuel Cost Trend: Adelaide (2017–2026)",
    chart_fuel_desc: "Wholesale diesel price — Terminal Gate Price, annual average in cents per litre",
    chart_fuel_aria: "Area chart: wholesale diesel in Adelaide rises from 119 c/L in 2017 to 211 c/L in 2026, with an intermediate peak of 192 c/L in 2022.",
    chart_fuelvs_title: "Diesel vs Potato Price Index",
    chart_fuelvs_desc: "Financial-year average diesel price against the price index",
    chart_fuelvs_aria: "Line chart: diesel climbs to 192 c/L in FY2022-23 then falls, while the potato price index keeps rising to 100.",
    fuel_note_title: "Does the sector absorb the diesel increase?",
    fuel_text: [
      "Fuel costs matter a great deal to Mitolo: both production and distribution rely heavily on diesel-powered equipment and transport.",
      "Wholesale prices have risen significantly over the past decade, by nearly one Australian dollar per litre.",
      "To gauge the impact, the previous chapters suffice: production volumes remained largely unchanged, while potato market value and prices both increased significantly.",
      "The conclusion is that, despite the rise in diesel prices, the value of the potato market kept growing. One plausible explanation is that higher fuel-related costs were offset — and likely more than offset — by higher potato prices.",
    ],

    /* Static sections */
    intro_title: "The Project",
    intro_text: "In 2026 I worked for Mitolo Family Farms, an Adelaide-based group (South Australia) operating in the potato industry. I worked as a farmhand, but in my spare time I ran an analysis on how exogenous factors — weather, inflation and fuel costs — affect the company's margins. I then used this project to apply for a data analyst role within the group, where it was very well received.",
    intro_dataset: "With no access to internal company data, I worked with macroeconomic data covering the whole Australian agricultural sector — alongside meteorological data — isolating the potato component. Since Mitolo holds over 60% of the Australian market, the analysis remains meaningful for the company. The period covered runs from 2017 to 2025, and the work demonstrates practical use of Excel, BigQuery (SQL) and Tableau.",
    disclaimer_title: "Methodological note",
    disclaimer_text: "The data comes from external sources, primarily government agencies. The analysis was produced in under a week while working full-time in parallel: it does not meet the level of methodological rigour required to draw definitive conclusions and would benefit from more advanced statistical methods. Its purpose is to demonstrate the ability to collect, process, analyse and visualise data with the tools mentioned.",
    tabs_note_title: "How to read this analysis",
    tabs_note: "The content is organised into four areas: Profitability, Food Price Index, Rainfall and Fuel. Each tab contains the charts built in Tableau together with the reading of the results.",
    method_title: "Method and tools",
    method: [
      "Collection and cleaning of raw data in Excel (ABARES, ABS, BOM, AIP)",
      "Load into BigQuery and modelling with SQL queries on a dedicated data warehouse",
      "Normalised indices, YoY growth and net margin proxy computed in SQL",
      "Final visualisation and dashboards in Tableau",
    ],
    conclusion_title: "Conclusions",
    conclusion_label: "Climate resilience",
    conclusion_text: "The group shows solid climate resilience. Despite sharp variations in rainfall, production volumes remained stable — fluctuating within 5% — thanks to investment in irrigation systems and innovation.",
    conclusion_opportunity_label: "Inflation and energy",
    conclusion_opportunity: "Mitolo responds exceptionally well to inflation: unlike the wider vegetable sector, potato market value grew 35–40% as prices rose, behaving like an \"inferior good\" that consumers turn to under economic pressure. The company also absorbs rising energy costs without difficulty: the steep diesel increase, nearly +1 AUD/L, did not slow market growth, because higher transport and production costs were offset by consumer prices. Overall, the analysis highlights the sector's strong ability to absorb external shocks and sustain profitability over time.",

    unit_mln: "AUD m", unit_mm: "mm", unit_cl: "c/L",
    legend_value: "Market value", legend_price: "Price index",
    legend_cpi: "Vegetables CPI", legend_prod: "Potato production YoY",
    legend_rain: "Lameroo rainfall YoY", legend_diesel: "Adelaide diesel",
    legend_margin: "Net margin (proxy)", legend_rain_tot: "Rainfall",
    github_label: "Mitolo analysis code and data on GitHub",
  },
};

/* ── Stat card ─────────────────────────────────────────────────── */
function StatCard({ label, value, sub, accent }: {
  label: string; value: string; sub: string; accent: "value" | "price" | "neutral";
}) {
  const bar = accent === "value" ? "bg-[var(--color-primary)]" : accent === "price" ? "bg-[var(--color-accent)]" : "bg-[var(--color-muted)]";
  const val = accent === "value" ? "text-[var(--color-primary)]" : accent === "price" ? "text-[var(--color-accent)]" : "text-[var(--foreground)]";
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

/* ── Narrative card ────────────────────────────────────────────── */
function NoteCard({ title, paragraphs }: { title: string; paragraphs: string[] }) {
  return (
    <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] border-l-4 border-l-[var(--color-primary)] p-6 col-span-full">
      <h3 className="font-bold text-[var(--foreground)] mb-3 text-sm">{title}</h3>
      <div className="space-y-3">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-xs font-mono text-[var(--color-muted)] leading-relaxed">{p}</p>
        ))}
      </div>
    </div>
  );
}

/* ── Types ─────────────────────────────────────────────────────── */
type Tab = "margin" | "cpi" | "rain" | "fuel";
type SortKey = "fy" | "hort" | "fuel" | "fert" | "chem";
type SortDir = "asc" | "desc";

/* ── Main component ────────────────────────────────────────────── */
export default function PotatoClient() {
  const { lang } = useLang();
  const { dark } = useTheme();
  const reduced = useReducedMotion() ?? false;
  const c = CONTENT[lang];

  const [activeTab, setActiveTab] = useState<Tab>("margin");
  const [sortKey, setSortKey]     = useState<SortKey>("fy");
  const [sortDir, setSortDir]     = useState<SortDir>("asc");

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

  const animDur = reduced ? 0 : 700;

  const baseScales = useMemo(() => (yFmt?: (v: number | string) => string, xFont = 11) => ({
    x: { grid: { display: false }, ticks: { color: muted, font: { size: xFont } } },
    y: { grid: { color: grid }, ticks: { color: muted, font: { size: 11 }, ...(yFmt ? { callback: yFmt } : {}) } },
  }), [muted, grid]);

  /* ── Redditività ─────────────────────────────────────────────── */
  const vegData = useMemo(() => ({
    labels: VEG_FY,
    datasets: [{ label: c.unit_mln, data: VEG_NET_VALUE, backgroundColor: CLR_VALUE, borderRadius: 4 }],
  }), [c.unit_mln]);

  const vegOpts = useMemo(() => ({
    responsive: true, maintainAspectRatio: false,
    animation: { duration: animDur },
    plugins: { legend: { display: false }, tooltip: { ...tt, callbacks: { label: lbl(ctx => ` ${(ctx.raw / 1000).toFixed(1)}K ${c.unit_mln}`) } } },
    scales: baseScales(v => Math.round(+v / 1000) + "K", 9),
  }), [tt, animDur, baseScales, c.unit_mln]);

  const dualData = useMemo(() => ({
    labels: FY,
    datasets: [
      { label: c.legend_value, data: MARKET_VALUE, borderColor: CLR_VALUE, backgroundColor: CLR_VALUE, fill: false, tension: 0.3, pointRadius: 3, pointBackgroundColor: CLR_VALUE },
      { label: c.legend_price, data: PRICE_INDEX,  borderColor: CLR_PRICE, backgroundColor: CLR_PRICE, fill: false, tension: 0.3, pointRadius: 3, pointBackgroundColor: CLR_PRICE },
    ],
  }), [c.legend_value, c.legend_price]);

  const dualOpts = useMemo(() => ({
    responsive: true, maintainAspectRatio: false,
    animation: { duration: animDur },
    plugins: { legend: legendCfg, tooltip: { ...tt, callbacks: { label: lbl(ctx => ` ${ctx.dataset.label}: ${ctx.raw}`) } } },
    scales: {
      x: { grid: { display: false }, ticks: { color: muted, font: { size: 10 } } },
      y: { grid: { color: grid }, ticks: { color: muted, font: { size: 11 } }, suggestedMin: 40, suggestedMax: 105 },
    },
  }), [tt, legendCfg, animDur, muted, grid]);

  const marginData = useMemo(() => ({
    labels: FY,
    datasets: [{ label: c.legend_margin, data: NET_MARGIN, backgroundColor: NET_MARGIN.map(v => v <= -30 ? CLR_VALUE : CLR_MARGIN), borderRadius: 3 }],
  }), [c.legend_margin]);

  const marginOpts = useMemo(() => ({
    responsive: true, maintainAspectRatio: false,
    animation: { duration: animDur },
    plugins: { legend: { display: false }, tooltip: { ...tt, callbacks: { label: lbl(ctx => ` ${ctx.raw} pt`) } } },
    scales: baseScales(v => v + " pt", 10),
  }), [tt, animDur, baseScales]);

  /* ── CPI ─────────────────────────────────────────────────────── */
  const cpiData = useMemo(() => ({
    labels: YEARS,
    datasets: [{ label: c.legend_cpi, data: CPI_VEG, borderColor: CLR_CPI, backgroundColor: "rgba(67,114,168,0.10)", fill: true, tension: 0.35, pointRadius: 3, pointBackgroundColor: CLR_CPI, borderWidth: 3 }],
  }), [c.legend_cpi]);

  const cpiOpts = useMemo(() => ({
    responsive: true, maintainAspectRatio: false,
    animation: { duration: animDur },
    plugins: { legend: { display: false }, tooltip: { ...tt, callbacks: { label: lbl(ctx => ` CPI: ${ctx.raw}`) } } },
    scales: baseScales(undefined, 10),
  }), [tt, animDur, baseScales]);

  const cpiVsData = useMemo(() => ({
    labels: FY,
    datasets: [
      { label: c.legend_price, data: PRICE_INDEX, borderColor: CLR_PRICE, backgroundColor: CLR_PRICE, fill: false, tension: 0.3, pointRadius: 3, pointBackgroundColor: CLR_PRICE },
      { label: c.legend_cpi,   data: CPI_BY_FY, borderColor: CLR_CPI, backgroundColor: CLR_CPI, fill: false, tension: 0.3, pointRadius: 3, pointBackgroundColor: CLR_CPI, borderDash: [5, 4] },
    ],
  }), [c.legend_price, c.legend_cpi]);

  const cpiVsOpts = useMemo(() => ({
    responsive: true, maintainAspectRatio: false,
    animation: { duration: animDur },
    plugins: { legend: legendCfg, tooltip: { ...tt, callbacks: { label: lbl(ctx => ` ${ctx.dataset.label}: ${ctx.raw}`) } } },
    scales: {
      x: { grid: { display: false }, ticks: { color: muted, font: { size: 10 } } },
      y: { grid: { color: grid }, ticks: { color: muted, font: { size: 11 } }, suggestedMin: 55, suggestedMax: 110 },
    },
  }), [tt, legendCfg, animDur, muted, grid]);

  /* ── Precipitazioni ──────────────────────────────────────────── */
  const rainYoyData = useMemo(() => ({
    labels: YOY_FY,
    datasets: [
      { label: c.legend_prod, data: YOY_PROD, borderColor: CLR_PROD, backgroundColor: CLR_PROD, fill: false, tension: 0, pointRadius: 3, pointBackgroundColor: CLR_PROD, borderWidth: 3 },
      { label: c.legend_rain, data: YOY_RAIN, borderColor: CLR_RAIN, backgroundColor: FILL_RAIN, fill: false, tension: 0, pointRadius: 3, pointBackgroundColor: CLR_RAIN, borderWidth: 2 },
    ],
  }), [c.legend_prod, c.legend_rain]);

  const rainYoyOpts = useMemo(() => ({
    responsive: true, maintainAspectRatio: false,
    animation: { duration: animDur },
    plugins: { legend: legendCfg, tooltip: { ...tt, callbacks: { label: lbl(ctx => ` ${ctx.dataset.label}: ${ctx.raw}%`) } } },
    scales: baseScales(v => v + "%", 10),
  }), [tt, legendCfg, animDur, baseScales]);

  const rainTotData = useMemo(() => ({
    labels: YEARS,
    datasets: [{ label: c.legend_rain_tot, data: RAIN_TOTAL, backgroundColor: CLR_RAIN, borderRadius: 4 }],
  }), [c.legend_rain_tot]);

  const rainTotOpts = useMemo(() => ({
    responsive: true, maintainAspectRatio: false,
    animation: { duration: animDur },
    plugins: { legend: { display: false }, tooltip: { ...tt, callbacks: { label: lbl(ctx => ` ${ctx.raw} ${c.unit_mm}`) } } },
    scales: baseScales(v => v + " " + c.unit_mm, 10),
  }), [tt, animDur, baseScales, c.unit_mm]);

  /* ── Carburante ──────────────────────────────────────────────── */
  const fuelData = useMemo(() => ({
    labels: YEARS,
    datasets: [{ label: c.legend_diesel, data: DIESEL, borderColor: CLR_FUEL, backgroundColor: FILL_FUEL, fill: true, tension: 0, pointRadius: 3, pointBackgroundColor: CLR_FUEL, borderWidth: 2 }],
  }), [c.legend_diesel]);

  const fuelOpts = useMemo(() => ({
    responsive: true, maintainAspectRatio: false,
    animation: { duration: animDur },
    plugins: { legend: { display: false }, tooltip: { ...tt, callbacks: { label: lbl(ctx => ` ${ctx.raw} ${c.unit_cl}`) } } },
    scales: baseScales(v => v + " " + c.unit_cl, 10),
  }), [tt, animDur, baseScales, c.unit_cl]);

  const fuelVsData = useMemo(() => ({
    labels: FY,
    datasets: [
      { label: c.legend_diesel, data: FY_DIESEL,   borderColor: CLR_FUEL,  backgroundColor: FILL_FUEL, fill: true,  tension: 0.25, pointRadius: 3, pointBackgroundColor: CLR_FUEL, yAxisID: "y" },
      { label: c.legend_price,  data: PRICE_INDEX, borderColor: CLR_PRICE, backgroundColor: CLR_PRICE, fill: false, tension: 0.25, pointRadius: 3, pointBackgroundColor: CLR_PRICE, yAxisID: "y1", borderWidth: 3 },
    ],
  }), [c.legend_diesel, c.legend_price]);

  const fuelVsOpts = useMemo(() => ({
    responsive: true, maintainAspectRatio: false,
    animation: { duration: animDur },
    plugins: { legend: legendCfg, tooltip: { ...tt } },
    scales: {
      x:  { grid: { display: false }, ticks: { color: muted, font: { size: 10 } } },
      y:  { position: "left" as const,  grid: { color: grid }, ticks: { color: muted, font: { size: 10 }, callback: (v: number | string) => v + " " + c.unit_cl } },
      y1: { position: "right" as const, grid: { display: false }, ticks: { color: muted, font: { size: 10 } }, suggestedMin: 40, suggestedMax: 110 },
    },
  }), [tt, legendCfg, animDur, muted, grid, c.unit_cl]);

  /* ── Tabella indici ──────────────────────────────────────────── */
  const idxRows = useMemo(() => {
    const rows = FY_ALL.map((fy, i) => ({
      fy, hort: IDX_HORT[i], fuel: IDX_FUEL[i], fert: IDX_FERT[i], chem: IDX_CHEM[i],
    }));
    return [...rows].sort((a, b) => {
      const v = sortKey === "fy" ? a.fy.localeCompare(b.fy) : a[sortKey] - b[sortKey];
      return sortDir === "asc" ? v : -v;
    });
  }, [sortKey, sortDir]);

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

  /* Michele: «Qua voglio solo REDDITIVITA, INDICE PREZZI CIBO, PRECIPITAZIONI, CARBURANTE» */
  const TABS: { id: Tab; label: string }[] = [
    { id: "margin", label: c.tab_margin },
    { id: "cpi",    label: c.tab_cpi    },
    { id: "rain",   label: c.tab_rain   },
    { id: "fuel",   label: c.tab_fuel   },
  ];

  const tabAnim = { initial: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } };

  return (
    <main className="pt-20 bg-[var(--background)] min-h-screen">

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <section aria-label="Potato Industry Resilience" className="py-14 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">

          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[var(--color-muted)] mb-5">
            <Link href="/" className="hover:text-[var(--color-primary)] transition-colors duration-150">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/#projects" className="hover:text-[var(--color-primary)] transition-colors duration-150">{c.breadcrumb_projects}</Link>
            <span aria-hidden="true">/</span>
            <span className="text-[var(--foreground)]" aria-current="page">{c.breadcrumb_current}</span>
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
                <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Potato Industry <span className="text-[var(--color-primary)]">Resilience</span>
                </h1>
                <p className="text-sm text-[var(--foreground)] font-medium mb-1">
                  The Impact of Weather, Inflation and Fuel Costs (2017–2025)
                </p>
                <p className="text-sm text-[var(--color-muted)] font-mono">{c.subtitle}</p>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <a
                  href={GITHUB_URL}
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

      {/* ── INTRODUZIONE ─────────────────────────────────────────── */}
      <section aria-label={c.intro_title} className="border-b border-[var(--color-border)] bg-[var(--background)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-4" style={{ fontFamily: "var(--font-display)" }}>{c.intro_title}</h2>
          <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-3">{c.intro_text}</p>
          <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-5">{c.intro_dataset}</p>
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-5 py-4">
            <p className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-widest mb-1">{c.disclaimer_title}</p>
            <p className="text-xs text-[var(--color-muted)] leading-relaxed">{c.disclaimer_text}</p>
          </div>
        </div>
      </section>

      {/* ── STATS ROW ────────────────────────────────────────────── */}
      <section aria-label="Key figures" className="border-b border-[var(--color-border)] bg-[var(--background)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <StatCard label={c.stat_value}  value="+62.6%"   sub={c.stat_value_sub}  accent="value" />
            <StatCard label={c.stat_price}  value="+51.2%"   sub={c.stat_price_sub}  accent="value" />
            <StatCard label={c.stat_vol}    value="±5%"      sub={c.stat_vol_sub}    accent="neutral" />
            <StatCard label={c.stat_diesel} value="+76.9%"   sub={c.stat_diesel_sub} accent="price" />
            <StatCard label={c.stat_cpi}    value="+32.7%"   sub={c.stat_cpi_sub}    accent="price" />
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

      {/* ── TAB NAV ──────────────────────────────────────────────── */}
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

        {/* ── REDDITIVITÀ ──────────────────────────────────────── */}
        {activeTab === "margin" && (
          <motion.div key="margin" {...tabAnim} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ChartCard title={c.chart_dual_title} desc={c.chart_dual_desc} ariaLabel={c.chart_dual_aria}
              srSummary="Market value 61.5 → 100; price index 66.1 → 100 between FY2018-19 and FY2025-26" full>
              <div className="h-72"><Line data={dualData} options={dualOpts as ChartOptions<"line">} /></div>
            </ChartCard>

            <ChartCard title={c.chart_veg_title} desc={c.chart_veg_desc} ariaLabel={c.chart_veg_aria}
              srSummary="AUD million: 10,504 / 8,655 / 8,168 / 13,579 / 21,300 / 21,010 / 9,703 / 16,767 / 22,016">
              <div className="h-64"><Bar data={vegData} options={vegOpts as ChartOptions<"bar">} /></div>
            </ChartCard>

            <ChartCard title={c.chart_margin_title} desc={c.chart_margin_desc} ariaLabel={c.chart_margin_aria}
              srSummary="Net margin proxy: −16.9, −12.6, −12.0, −44.2, −59.5, −23.5, −10.1, 0.0">
              <div className="h-64"><Bar data={marginData} options={marginOpts as ChartOptions<"bar">} /></div>
            </ChartCard>

            <NoteCard title={c.profit_note_title} paragraphs={c.profit_text} />

            {/* Tabella indici */}
            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden col-span-full">
              <div className="px-6 pt-6 pb-4">
                <h3 className="font-bold text-[var(--foreground)] text-sm mb-0.5">{c.table_idx_title}</h3>
                <p className="text-xs font-mono text-[var(--color-muted)]">{c.table_idx_desc}</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono">
                  <thead className="bg-[var(--background)] border-y border-[var(--color-border)]">
                    <tr>
                      {([["fy", c.col_fy], ["hort", c.col_hort], ["fuel", c.col_fuelidx], ["fert", c.col_fert], ["chem", c.col_chem]] as [SortKey, string][]).map(([k, label], i) => (
                        <th
                          key={k}
                          scope="col"
                          onClick={() => handleSort(k)}
                          className={`px-6 py-3 cursor-pointer select-none text-[var(--color-muted)] hover:text-[var(--color-primary)] ${i === 0 ? "text-left" : "text-right"} ${sortKey === k ? "text-[var(--color-primary)]" : ""}`}
                        >
                          {label}<SortIco k={k} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {idxRows.map((row, i) => (
                      <motion.tr
                        key={row.fy}
                        initial={reduced ? { opacity: 1 } : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.15, delay: reduced ? 0 : i * 0.02 }}
                        className="hover:bg-[var(--color-surface-2)] transition-colors duration-100"
                      >
                        <td className="px-6 py-2.5 text-left text-[var(--foreground)]">{row.fy}</td>
                        <td className="px-6 py-2.5 text-right text-[var(--foreground)] tabular-nums">{row.hort.toFixed(1)}</td>
                        <td className="px-6 py-2.5 text-right text-[var(--foreground)] tabular-nums">{row.fuel.toFixed(1)}</td>
                        <td className="px-6 py-2.5 text-right text-[var(--foreground)] tabular-nums">{row.fert.toFixed(1)}</td>
                        <td className="px-6 py-2.5 text-right text-[var(--foreground)] tabular-nums">{row.chem.toFixed(1)}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── INDICE PREZZI CIBO ───────────────────────────────── */}
        {activeTab === "cpi" && (
          <motion.div key="cpi" {...tabAnim} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ChartCard title={c.chart_cpi_title} desc={c.chart_cpi_desc} ariaLabel={c.chart_cpi_aria}
              srSummary="Vegetables CPI 76.9 (2017) → 102.1 (2025); peak 97.2 in 2022, dip 94.3 in 2023" full>
              <div className="h-72"><Line data={cpiData} options={cpiOpts as ChartOptions<"line">} /></div>
            </ChartCard>

            <ChartCard title={c.chart_cpivs_title} desc={c.chart_cpivs_desc} ariaLabel={c.chart_cpivs_aria}
              srSummary="Potato price index vs vegetables CPI by financial year" full>
              <div className="h-64"><Line data={cpiVsData} options={cpiVsOpts as ChartOptions<"line">} /></div>
            </ChartCard>

            <NoteCard title={c.cpi_note_title} paragraphs={c.cpi_text} />
          </motion.div>
        )}

        {/* ── PRECIPITAZIONI ───────────────────────────────────── */}
        {activeTab === "rain" && (
          <motion.div key="rain" {...tabAnim} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ChartCard title={c.chart_rain_title} desc={c.chart_rain_desc} ariaLabel={c.chart_rain_aria}
              srSummary="Rainfall YoY: +8.9, +56.8, −36.9, +108.0, −10.0, −53.4 %. Production YoY: −0.6, +0.6, +5.1, +0.2, +0.1, +4.6 %" full>
              <div className="h-80"><Line data={rainYoyData} options={rainYoyOpts as ChartOptions<"line">} /></div>
            </ChartCard>

            <ChartCard title={c.chart_raintot_title} desc={c.chart_raintot_desc} ariaLabel={c.chart_raintot_aria}
              srSummary="Annual rainfall mm: 106.8, 208.4, 227.0, 356.0, 224.8, 467.6, 420.8, 196.2, 270.6, 171.2" full>
              <div className="h-64"><Bar data={rainTotData} options={rainTotOpts as ChartOptions<"bar">} /></div>
            </ChartCard>

            <NoteCard title={c.rain_note_title} paragraphs={c.rain_text} />
          </motion.div>
        )}

        {/* ── CARBURANTE ───────────────────────────────────────── */}
        {activeTab === "fuel" && (
          <motion.div key="fuel" {...tabAnim} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ChartCard title={c.chart_fuel_title} desc={c.chart_fuel_desc} ariaLabel={c.chart_fuel_aria}
              srSummary="Diesel TGP Adelaide c/L: 119.1, 135.2, 135.5, 108.6, 130.3, 191.9, 184.0, 174.9, 168.1, 210.7" full>
              <div className="h-72"><Line data={fuelData} options={fuelOpts as ChartOptions<"line">} /></div>
            </ChartCard>

            <ChartCard title={c.chart_fuelvs_title} desc={c.chart_fuelvs_desc} ariaLabel={c.chart_fuelvs_aria}
              srSummary="Diesel peaks FY2022-23 at 191.9 c/L while the potato price index keeps climbing to 100" full>
              <div className="h-64"><Line data={fuelVsData} options={fuelVsOpts as ChartOptions<"line">} /></div>
            </ChartCard>

            <NoteCard title={c.fuel_note_title} paragraphs={c.fuel_text} />
          </motion.div>
        )}
      </div>

      {/* ── METODO ───────────────────────────────────────────────── */}
      <section aria-label={c.method_title} className="border-t border-[var(--color-border)] bg-[var(--background)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-5" style={{ fontFamily: "var(--font-display)" }}>{c.method_title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {c.method.map((m, i) => (
              <div key={i} className="flex items-start gap-3 bg-[var(--color-surface)] rounded-2xl p-5 border border-[var(--color-border)]">
                <FiCheckCircle className="w-4 h-4 text-[var(--color-secondary)] flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-xs font-mono text-[var(--color-muted)] leading-relaxed">{m}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONCLUSIONI ──────────────────────────────────────────── */}
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
                  <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted)]">{c.conclusion_label}</span>
                </div>
                <p className="text-sm text-[var(--color-muted)] leading-relaxed">{c.conclusion_text}</p>
              </div>
              <div className="bg-[var(--color-primary)] rounded-2xl p-6">
                <p className="text-xs font-mono uppercase tracking-widest text-indigo-200 mb-3">{c.conclusion_opportunity_label}</p>
                <p className="text-sm text-white leading-relaxed">{c.conclusion_opportunity}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link href="/#projects" className="inline-flex items-center gap-2 border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-indigo-50 dark:hover:bg-indigo-950/30 font-semibold px-6 py-3 rounded-full transition-colors duration-150 text-sm min-h-[44px]">
                {c.back}
              </Link>
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label={c.github_label}
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
