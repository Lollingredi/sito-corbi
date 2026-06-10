"use client";

// Skills applied: composition-patterns (TimelineSection compound component),
//                 accesslint (aria-hidden, landmark roles),
//                 ui-ux-pro-max (stagger-sequence via TimelineSection.List)

import { FiBriefcase } from "react-icons/fi";
import { useLang } from "@/context/LanguageContext";
import { TimelineSection } from "@/components/TimelineSection";

export default function Internships() {
  const { t } = useLang();

  const items = [
    {
      title: t("intern_item0_title"),
      org: t("intern_item0_org"),
      location: t("intern_item0_location"),
      period: t("intern_item0_period"),
    },
    {
      title: t("intern_item1_title"),
      org: t("intern_item1_org"),
      location: t("intern_item1_location"),
      period: t("intern_item1_period"),
      note: t("intern_item1_note"),
    },
    {
      title: t("intern_item2_title"),
      org: t("intern_item2_org"),
      location: t("intern_item2_location"),
      period: t("intern_item2_period"),
    },
    {
      title: t("intern_item3_title"),
      org: t("intern_item3_org"),
      location: t("intern_item3_location"),
      period: t("intern_item3_period"),
    },
  ];

  return (
    <TimelineSection.Root
      id="internships"
      ariaLabel={t("intern_label")}
      bg="bg-[var(--color-surface)]"
    >
      <TimelineSection.Header label={t("intern_label")} title={t("intern_title")} />

      <TimelineSection.List>
        {items.map((item, idx) => (
          <TimelineSection.Item
            key={idx}
            icon={
              <FiBriefcase
                className="w-4 h-4 text-[var(--color-primary)]"
                aria-hidden="true"
              />
            }
          >
            <TimelineSection.Card>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-1">
                <h3 className="font-bold text-[var(--foreground)] text-base leading-snug flex-1 min-w-0">
                  {item.title}
                </h3>
                <span className="text-xs text-[var(--color-primary)] font-semibold whitespace-nowrap bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-full flex-shrink-0">
                  {item.period}
                </span>
              </div>

              <p className="text-sm text-[var(--color-primary)] font-semibold mb-1">
                {item.org}
              </p>
              <p className="text-sm text-[var(--color-muted)]">
                {item.location}
                {"note" in item && item.note ? ` · ${item.note}` : ""}
              </p>
            </TimelineSection.Card>
          </TimelineSection.Item>
        ))}
      </TimelineSection.List>
    </TimelineSection.Root>
  );
}
