"use client";

import { useState, useEffect } from "react";
import { FiMenu, FiX, FiDownload } from "react-icons/fi";

const navLinks = [
  { label: "Chi sono", href: "#about" },
  { label: "Istruzione", href: "#education" },
  { label: "Progetti", href: "#projects" },
  { label: "Competenze", href: "#skills" },
  { label: "Contatti", href: "#contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#hero"
          className="text-lg font-bold text-gray-900"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Michele Corbisiero
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-gray-600 hover:text-indigo-500 transition-colors font-medium text-sm"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/MC_CV_ITA.pdf"
            download
            className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
          >
            <FiDownload className="w-4 h-4" />
            Scarica CV
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-gray-700 p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4 shadow-lg">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-gray-700 hover:text-indigo-500 font-medium"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/MC_CV_ITA.pdf"
            download
            className="flex items-center gap-2 bg-indigo-500 text-white font-medium px-4 py-2 rounded-full w-fit"
            onClick={() => setMenuOpen(false)}
          >
            <FiDownload className="w-4 h-4" />
            Scarica CV
          </a>
        </div>
      )}
    </nav>
  );
}
