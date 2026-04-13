"use client";

// Skills applied: accesslint (aria-hidden on icons, touch targets ≥44px, link-purpose),
//                 ui-ux-pro-max (stagger-sequence, hover micro-interactions),
//                 frontend-design (card depth on hover)

import { motion, Variants, useReducedMotion } from "framer-motion";
import { FiMail, FiLinkedin, FiGithub, FiPhone } from "react-icons/fi";
import { useLang } from "@/context/LanguageContext";

/* ── Variants ──────────────────────────────────────────────────── */
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = (reduced: boolean): Variants => ({
  hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0, 0, 0.2, 1] },
  },
});

export default function Contact() {
  const { t } = useLang();
  const reduced = useReducedMotion() ?? false;

  const contacts = [
    {
      label: t("contact_phone"),
      value: "+39 350 5336746",
      href: "tel:+393505336746",
      icon: <FiPhone className="w-5 h-5" aria-hidden="true" />,
      iconBg: "bg-emerald-100 dark:bg-emerald-950/40",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      hoverBorder: "hover:border-emerald-300 dark:hover:border-emerald-700",
      hoverBg: "hover:bg-emerald-50 dark:hover:bg-emerald-950/20",
      ariaLabel: `Chiama Michele Corbisiero al ${"+39 350 5336746"}`,
    },
    {
      label: "Email",
      value: "corbisieromichele00@gmail.com",
      href: "mailto:corbisieromichele00@gmail.com",
      icon: <FiMail className="w-5 h-5" aria-hidden="true" />,
      iconBg: "bg-indigo-100 dark:bg-indigo-950/40",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      hoverBorder: "hover:border-indigo-300 dark:hover:border-indigo-700",
      hoverBg: "hover:bg-indigo-50 dark:hover:bg-indigo-950/20",
      ariaLabel: "Invia email a corbisieromichele00@gmail.com",
    },
    {
      label: "LinkedIn",
      value: t("contact_linkedin_sub"),
      href: "https://www.linkedin.com/in/michele-corbisiero-190512238/",
      external: true,
      icon: <FiLinkedin className="w-5 h-5" aria-hidden="true" />,
      iconBg: "bg-blue-100 dark:bg-blue-950/40",
      iconColor: "text-blue-600 dark:text-blue-400",
      hoverBorder: "hover:border-blue-300 dark:hover:border-blue-700",
      hoverBg: "hover:bg-blue-50 dark:hover:bg-blue-950/20",
      ariaLabel: "Profilo LinkedIn di Michele Corbisiero (apre in nuova finestra)",
    },
    {
      label: "GitHub",
      value: t("contact_github_sub"),
      href: "https://github.com/corbisieromichele00",
      external: true,
      icon: <FiGithub className="w-5 h-5" aria-hidden="true" />,
      iconBg: "bg-[var(--color-surface-2)]",
      iconColor: "text-[var(--foreground)]",
      hoverBorder: "hover:border-[var(--color-muted)]",
      hoverBg: "hover:bg-[var(--color-surface)]",
      ariaLabel: "Profilo GitHub di Michele Corbisiero (apre in nuova finestra)",
    },
  ] as const;

  return (
    <section
      id="contact"
      aria-label={t("contact_label")}
      className="py-24 bg-[var(--background)]"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.55, ease: [0, 0, 0.2, 1] }}
        >
          <p className="text-[var(--color-primary)] font-semibold text-xs uppercase tracking-[0.2em] mb-2">
            {t("contact_label")}
          </p>
          <h2
            className="text-4xl font-bold text-[var(--foreground)] mb-4 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t("contact_title")}
          </h2>
          <p className="text-[var(--color-muted)] max-w-lg mx-auto">
            {t("contact_subtitle")}
          </p>
        </motion.div>

        {/* Contact cards — staggered */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {contacts.map((c) => (
            <motion.a
              key={c.label}
              href={c.href}
              target={"external" in c && c.external ? "_blank" : undefined}
              rel={"external" in c && c.external ? "noopener noreferrer" : undefined}
              aria-label={c.ariaLabel}
              variants={cardVariants(reduced)}
              whileHover={reduced ? {} : { y: -3, transition: { duration: 0.2 } }}
              className={`flex flex-col items-center gap-3 p-6 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] ${c.hoverBorder} ${c.hoverBg} transition-all duration-200 group min-h-[44px]`}
            >
              {/* Icon circle */}
              <div className={`w-12 h-12 ${c.iconBg} group-hover:opacity-80 rounded-full flex items-center justify-center transition-opacity duration-150 ${c.iconColor}`}>
                {c.icon}
              </div>
              <div className="text-center min-w-0 w-full">
                <div className="font-semibold text-[var(--foreground)] text-sm">{c.label}</div>
                <div className="text-[var(--color-muted)] text-xs mt-1 truncate">{c.value}</div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
