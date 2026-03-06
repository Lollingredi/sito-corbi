import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import HtmlLang from "@/components/HtmlLang";

export const metadata: Metadata = {
  title: "Michele Corbisiero | Data Analyst",
  description:
    "Portfolio of Michele Corbisiero, Data Analyst specialised in Python, SQL, R and Tableau.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <LanguageProvider>
          <HtmlLang />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
