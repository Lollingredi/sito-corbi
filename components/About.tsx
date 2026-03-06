"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          ref={ref}
          className="flex flex-col md:flex-row items-center gap-12"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Photo placeholder */}
          <div className="flex-shrink-0">
            <div className="w-56 h-56 rounded-2xl bg-gradient-to-br from-indigo-100 to-emerald-100 border-2 border-indigo-200 flex items-center justify-center shadow-lg">
              <span className="text-6xl select-none">🧑‍💻</span>
            </div>
          </div>

          {/* Text */}
          <div className="flex-1">
            <p className="text-indigo-500 font-semibold text-sm uppercase tracking-widest mb-2">
              Chi sono
            </p>
            <h2
              className="text-4xl font-bold text-gray-900 mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Un po&apos; di me
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Sono Michele Cobisiero, un Data Analyst appassionato di dati e storytelling.
                Credo che i numeri, da soli, non bastino: è il{" "}
                <span className="text-indigo-500 font-medium">contesto e la narrazione</span>{" "}
                a renderli potenti.
              </p>
              <p>
                Il mio percorso mi ha portato a padroneggiare strumenti come{" "}
                <span className="font-medium text-gray-800">Python, SQL, Tableau</span> e{" "}
                <span className="font-medium text-gray-800">Power BI</span>, con i quali
                aiuto le aziende a prendere decisioni basate sui dati.
              </p>
              <p>
                [Questa sezione verrà aggiornata con la bio completa di Michele
                non appena il CV sarà disponibile.]
              </p>
            </div>

            {/* Quick facts */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: "Anni di esperienza", value: "—" },
                { label: "Progetti completati", value: "—" },
                { label: "Settori analizzati", value: "—" },
              ].map((fact) => (
                <div key={fact.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                  <div className="text-2xl font-bold text-indigo-500">{fact.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{fact.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
