"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { FiMail, FiLinkedin, FiGithub, FiPhone } from "react-icons/fi";
import { useLang } from "@/context/LanguageContext";

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLang();

  return (
    <section id="contact" className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          ref={ref}
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-indigo-500 font-semibold text-sm uppercase tracking-widest mb-2">
            {t("contact_label")}
          </p>
          <h2
            className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t("contact_title")}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            {t("contact_subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
        >
          {/* Phone */}
          <a
            href="tel:+393505336746"
            className="flex flex-col items-center gap-3 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all group"
          >
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/60 rounded-full flex items-center justify-center transition-colors">
              <FiPhone className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{t("contact_phone")}</div>
              <div className="text-gray-500 dark:text-gray-400 text-sm mt-1">+39 350 5336746</div>
            </div>
          </a>

          {/* Email */}
          <a
            href="mailto:corbisieromichele00@gmail.com"
            className="flex flex-col items-center gap-3 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-indigo-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all group"
          >
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/40 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/60 rounded-full flex items-center justify-center transition-colors">
              <FiMail className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-800 dark:text-gray-100 text-sm">Email</div>
              <div className="text-gray-500 dark:text-gray-400 text-sm mt-1">corbisieromichele00@gmail.com</div>
            </div>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/michele-corbisiero-190512238/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
          >
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/60 rounded-full flex items-center justify-center transition-colors">
              <FiLinkedin className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-800 dark:text-gray-100 text-sm">LinkedIn</div>
              <div className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t("contact_linkedin_sub")}</div>
            </div>
          </a>

          {/* GitHub */}
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all group"
          >
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 group-hover:bg-gray-300 dark:group-hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors">
              <FiGithub className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-800 dark:text-gray-100 text-sm">GitHub</div>
              <div className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t("contact_github_sub")}</div>
            </div>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
