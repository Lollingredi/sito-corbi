// Skills applied: react-best-practices (metadata in server component),
//                 design-system/pages/projects.md (per-page metadata spec)
import type { Metadata } from "next";
import PotatoClient from "./PotatoClient";

export const metadata: Metadata = {
  title: "Potato Industry Resilience",
  description:
    "Independent analysis for Mitolo Family Farms: how weather, inflation and fuel costs shaped potato-industry margins in Australia between 2017 and 2025, built with Excel, BigQuery and Tableau.",
  openGraph: {
    type: "article",
    title: "Potato Industry Resilience | Michele Corbisiero",
    description:
      "Excel + BigQuery (SQL) + Tableau: rainfall volatility, vegetable CPI and diesel prices against potato market value and margins, 2017–2025.",
  },
};

export default function PotatoIndustryResiliencePage() {
  return <PotatoClient />;
}
