// Skills applied: react-best-practices (metadata in server component),
//                 design-system/pages/projects.md (per-page metadata spec)
// Server component wrapper — exports metadata (requires server context).
// All interactive content delegated to ThesisClient (client component).
import type { Metadata } from "next";
import ThesisClient from "./ThesisClient";

export const metadata: Metadata = {
  title: "Tesi Magistrale — Regional Misallocation",
  description:
    "Tesi magistrale 110/110 su misallocation regionale in Italia vs Germania. Analisi panel NUTS-3, regressioni con effetti fissi, scenari controfattuali in Stata.",
  openGraph: {
    type: "article",
    title: "Regional Misallocation: Italia vs Germania | Michele Corbisiero",
    description:
      "Econometric research comparing Italy's centralised wage bargaining with Germany's flexible model. NUTS-3 panel data, counterfactual scenarios.",
  },
};

export default function ThesisPage() {
  return <ThesisClient />;
}
