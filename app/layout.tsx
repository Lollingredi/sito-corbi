import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import HtmlLang from "@/components/HtmlLang";

// Skills applied: ui-ux-pro-max (typography domain), frontend-design
// Fraunces: variable optical-size serif — editorial authority, The Economist feel
// Plus Jakarta Sans: humanist sans — warm, highly readable, replaces generic Inter
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Michele Corbisiero | Data Analyst",
    template: "%s | Michele Corbisiero",
  },
  description:
    "Portfolio of Michele Corbisiero — Data Analyst specialised in Python, SQL, R and Tableau. MSc Economics & Data Analysis, double degree Verona–Würzburg.",
  openGraph: {
    type: "website",
    locale: "it_IT",
    alternateLocale: "en_GB",
    title: "Michele Corbisiero | Data Analyst",
    description:
      "Data Analyst portfolio — Python · SQL · R · Tableau · Panel Econometrics",
    siteName: "corbisieroanalytics.com",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${fraunces.variable} ${plusJakartaSans.variable}`}>
      <body className="antialiased">
        <ThemeProvider>
          <LanguageProvider>
            <HtmlLang />
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
