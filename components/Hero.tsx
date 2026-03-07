"use client";

import { motion } from "framer-motion";
import { FiArrowDown, FiMail } from "react-icons/fi";
import Image from "next/image";
import { useLang } from "@/context/LanguageContext";

export default function Hero() {
  const { t } = useLang();

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 pt-16"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 flex flex-col-reverse md:flex-row items-center gap-12">
        {/* Text content */}
        <motion.div
          className="flex-1 text-center md:text-left"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="text-indigo-500 font-semibold text-sm uppercase tracking-widest mb-3">
            {t("hero_role")}
          </p>
          <h1
            className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Michele
            <br />
            <span className="text-indigo-500">Corbisiero</span>
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-lg mb-8 leading-relaxed">
            {t("hero_tagline_1")}{" "}
            <span className="text-emerald-500 font-semibold">{t("hero_tagline_2")}</span>{" "}
            {t("hero_tagline_3")}{" "}
            <span className="text-amber-500 font-semibold">{t("hero_tagline_4")}</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-6 py-3 rounded-full transition-colors"
            >
              {t("hero_cta_projects")}
              <FiArrowDown className="w-4 h-4" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 border-2 border-indigo-500 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 font-semibold px-6 py-3 rounded-full transition-colors"
            >
              <FiMail className="w-4 h-4" />
              {t("hero_cta_contact")}
            </a>
          </div>
        </motion.div>

        {/* Profile image */}
        <motion.div
          className="flex-shrink-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        >
          <div className="w-56 h-56 sm:w-72 sm:h-72 rounded-full border-4 border-indigo-200 shadow-xl overflow-hidden bg-gradient-to-br from-indigo-100 to-emerald-100">
            <Image
              src="/michele.jpeg"
              alt="Michele Corbisiero"
              width={288}
              height={288}
              className="w-full h-full object-cover object-top"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
