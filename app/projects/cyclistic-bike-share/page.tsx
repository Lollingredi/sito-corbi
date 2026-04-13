// Skills applied: react-best-practices (metadata in server component),
//                 design-system/pages/projects.md (per-page metadata spec)
import type { Metadata } from "next";
import CyclisticClient from "./CyclisticClient";

export const metadata: Metadata = {
  title: "Cyclistic Bike-Share Analysis",
  description:
    "Google Data Analytics capstone: analysis of 5.4M bike-share rides in Chicago with SQL and Tableau. Identifies behaviour differences between casual riders and annual members.",
  openGraph: {
    type: "article",
    title: "Cyclistic Bike-Share Analysis | Michele Corbisiero",
    description:
      "SQL + Tableau capstone: 5.4M rides, member vs casual segmentation, seasonal patterns and business recommendations.",
  },
};

export default function CyclisticPage() {
  return <CyclisticClient />;
}
