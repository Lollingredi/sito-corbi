"use client";

// Skills applied: composition-patterns (TimelineSection compound component),
//                 accesslint (aria-hidden icons, descriptive download links),
//                 ui-ux-pro-max (stagger-sequence via TimelineSection.List)

import { FiAward, FiBook, FiDownload } from "react-icons/fi";
import { useLang } from "@/context/LanguageContext";
import { TimelineSection } from "@/components/TimelineSection";

export default function Education() {
  const { t } = useLang();

  const educationItems = [
    {
      title: t("edu_item0_title"),
      institution: "Google",
      period: t("edu_item0_period"),
      note: t("edu_item0_note"),
      icon: "award" as const,
      diploma: "/google_certificate.pdf",
    },
    {
      title: t("edu_item1_title"),
      institution: "Università di Verona & Julius-Maximilians-Universität Würzburg",
      period: t("edu_item1_period"),
      grade: "110/110 (1.0) – Economics and Data Analysis · 1.6 – International Economic Policy",
      thesis: t("edu_item1_thesis"),
      courses: "Time series and forecasting, International trade and multinational firm",
      icon: "book" as const,
      diploma: "/double_diploma_uni.pdf",
    },
    {
      title: t("edu_item2_title"),
      institution: "Università Politecnica delle Marche – Ancona",
      period: t("edu_item2_period"),
      grade: "98/110 (1.8)",
      courses: "Economia degli intermediari finanziari, Demografia",
      icon: "book" as const,
      diploma: "/ancona_diploma.pdf",
    },
    {
      title: t("edu_item3_title"),
      institution: "Université de Limoges – Francia",
      period: t("edu_item3_period"),
      icon: "book" as const,
    },
  ];

  return (
    <TimelineSection.Root
      id="education"
      ariaLabel={t("edu_label")}
      bg="bg-[var(--background)]"
    >
      <TimelineSection.Header label={t("edu_label")} title={t("edu_title")} />

      <TimelineSection.List>
        {educationItems.map((item, idx) => (
          <TimelineSection.Item
            key={idx}
            icon={
              item.icon === "award"
                ? <FiAward className="w-4 h-4 text-[var(--color-primary)]" aria-hidden="true" />
                : <FiBook className="w-4 h-4 text-[var(--color-primary)]" aria-hidden="true" />
            }
          >
            <TimelineSection.Card>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-1">
                <h3 className="font-bold text-[var(--foreground)] text-base leading-snug flex-1 min-w-0">
                  {item.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-[var(--color-primary)] font-semibold whitespace-nowrap bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-full">
                    {item.period}
                  </span>
                  {"diploma" in item && item.diploma && (
                    <a
                      href={item.diploma}
                      download
                      aria-label={`${t("edu_download")} — ${item.title}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)] bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-950/60 px-3 py-1.5 rounded-full transition-colors duration-150 whitespace-nowrap min-h-[32px]"
                    >
                      <FiDownload className="w-3.5 h-3.5" aria-hidden="true" />
                      {t("edu_download")}
                    </a>
                  )}
                </div>
              </div>

              <p className="text-sm text-[var(--color-primary)] font-semibold mb-2 break-words">
                {item.institution}
              </p>

              {"grade" in item && item.grade && (
                <p className="text-sm text-[var(--color-muted)] mb-1">
                  <span className="font-semibold text-[var(--foreground)]">{t("edu_grade")}</span>{" "}
                  {item.grade}
                </p>
              )}
              {"thesis" in item && item.thesis && (
                <p className="text-sm text-[var(--color-muted)] mb-1">
                  <span className="font-semibold text-[var(--foreground)]">{t("edu_thesis")}</span>{" "}
                  <em>{item.thesis}</em>
                </p>
              )}
              {"courses" in item && item.courses && (
                <p className="text-sm text-[var(--color-muted)]">
                  <span className="font-semibold text-[var(--foreground)]">{t("edu_courses")}</span>{" "}
                  {item.courses}
                </p>
              )}
              {"note" in item && item.note && (
                <p className="text-sm text-[var(--color-muted)]">{item.note}</p>
              )}
            </TimelineSection.Card>
          </TimelineSection.Item>
        ))}
      </TimelineSection.List>
    </TimelineSection.Root>
  );
}
