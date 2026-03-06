"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { useLang } from "@/context/LanguageContext";

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLang();

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
          {/* Photo */}
          <div className="flex-shrink-0">
            <div className="w-56 h-56 rounded-2xl border-2 border-indigo-200 shadow-lg overflow-hidden bg-gradient-to-br from-indigo-100 to-emerald-100">
              <Image
                src="/michele.jpeg"
                alt="Michele Corbisiero"
                width={224}
                height={224}
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>

          {/* Text */}
          <div className="flex-1">
            <p className="text-indigo-500 font-semibold text-sm uppercase tracking-widest mb-2">
              {t("about_label")}
            </p>
            <h2
              className="text-4xl font-bold text-gray-900 mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t("about_title")}
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                {t("about_p1_pre")} <span className="font-medium text-gray-800">Michele Corbisiero</span>
                {t("about_p1_post")}{" "}
                <span className="text-indigo-500 font-medium">{t("about_p1_degree")}</span>.
              </p>
              <p>
                {t("about_p2")}{" "}
                <span className="font-medium text-gray-800">{t("about_p2_skill")}</span>{" "}
                {t("about_p2_post")}
              </p>
              <p>
                {t("about_p3_pre")}{" "}
                <span className="font-medium text-gray-800">{t("about_p3_tools")}</span>{" "}
                {t("about_p3_post")}
              </p>
            </div>

            {/* Quick facts */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: t("about_fact1_label"), value: "110/110" },
                { label: t("about_fact2_label"), value: "4" },
                { label: t("about_fact3_label"), value: "Google" },
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
