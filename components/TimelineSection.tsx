"use client";

// Skills applied: composition-patterns (compound-components, state-context-interface),
//                 accesslint (aria-hidden, keyboard-nav),
//                 ui-ux-pro-max (stagger-sequence)
// Shared compound component for Education and Internships sections.
// Both share the same timeline card/dot/line visual pattern — extracted here to
// eliminate duplication (DRY) while allowing each section to compose its own content.

import { createContext, use, ReactNode } from "react";
import { motion, Variants, useReducedMotion } from "framer-motion";

/* ── Stagger variants ────────────────────────────────────────── */
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = (reduced: boolean): Variants => ({
  hidden: reduced ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0, 0, 0.2, 1] },
  },
});

/* ── Context ─────────────────────────────────────────────────── */
interface TimelineSectionContext {
  reduced: boolean;
}
const TimelineSectionCtx = createContext<TimelineSectionContext>({ reduced: false });

/* ── Root ────────────────────────────────────────────────────── */
function Root({
  id,
  ariaLabel,
  bg = "bg-[var(--background)]",
  children,
}: {
  id: string;
  ariaLabel: string;
  bg?: string;
  children: ReactNode;
}) {
  const reduced = useReducedMotion() ?? false;
  return (
    <TimelineSectionCtx value={{ reduced }}>
      <section id={id} aria-label={ariaLabel} className={`py-24 ${bg}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">{children}</div>
      </section>
    </TimelineSectionCtx>
  );
}

/* ── Header ──────────────────────────────────────────────────── */
function Header({ label, title }: { label: string; title: string }) {
  const { reduced } = use(TimelineSectionCtx);
  return (
    <motion.div
      initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.55, ease: [0, 0, 0.2, 1] }}
      className="text-center mb-14"
    >
      <p className="text-[var(--color-primary)] font-semibold text-xs uppercase tracking-[0.2em] mb-2">
        {label}
      </p>
      <h2
        className="text-4xl font-bold text-[var(--foreground)] leading-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>
    </motion.div>
  );
}

/* ── List ────────────────────────────────────────────────────── */
function List({ children }: { children: ReactNode }) {
  const { reduced } = use(TimelineSectionCtx);
  return (
    <div className="relative">
      {/* Vertical timeline line */}
      <div
        aria-hidden="true"
        className="absolute left-5 top-0 bottom-0 w-px bg-[var(--color-border)] hidden sm:block"
      />
      <motion.div
        className="space-y-7"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ── Item (animated row) ─────────────────────────────────────── */
function Item({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  const { reduced } = use(TimelineSectionCtx);
  return (
    <motion.div
      variants={itemVariants(reduced)}
      className="flex gap-5 sm:gap-6"
    >
      {/* Dot with icon */}
      <div
        aria-hidden="true"
        className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center z-10"
      >
        {icon}
      </div>
      {/* Card content slot */}
      <div className="flex-1 min-w-0">{children}</div>
    </motion.div>
  );
}

/* ── Card ────────────────────────────────────────────────────── */
function Card({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[var(--color-surface)] rounded-2xl p-5 border border-[var(--color-border)] shadow-sm hover:shadow-md hover:-translate-y-px transition-all duration-200">
      {children}
    </div>
  );
}

/* ── Export as compound component ───────────────────────────── */
export const TimelineSection = { Root, Header, List, Item, Card };
