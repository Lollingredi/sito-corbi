"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { FiDownload } from "react-icons/fi";

export default function Resume() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="resume" className="py-20 bg-indigo-500">
      <motion.div
        ref={ref}
        className="max-w-4xl mx-auto px-4 sm:px-6 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2
          className="text-4xl font-bold text-white mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Vuoi saperne di più?
        </h2>
        <p className="text-indigo-100 text-lg mb-8 max-w-xl mx-auto">
          Scarica il mio CV per scoprire la mia esperienza completa, i progetti
          e le competenze tecniche.
        </p>
        <a
          href="/resume-placeholder.pdf"
          download
          className="inline-flex items-center gap-3 bg-white text-indigo-600 font-bold px-8 py-4 rounded-full hover:bg-indigo-50 transition-colors shadow-lg text-lg"
        >
          <FiDownload className="w-5 h-5" />
          Scarica il CV
        </a>
      </motion.div>
    </section>
  );
}
