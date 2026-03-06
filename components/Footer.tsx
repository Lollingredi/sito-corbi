import { FiLinkedin, FiGithub, FiMail } from "react-icons/fi";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div
          className="text-white font-bold text-lg"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Michele Cobisiero
        </div>

        <div className="text-sm text-center">
          © {year} Michele Cobisiero · Data Analyst
        </div>

        <div className="flex items-center gap-4">
          <a
            href="mailto:michele@example.com"
            className="hover:text-white transition-colors"
            aria-label="Email"
          >
            <FiMail className="w-5 h-5" />
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
            aria-label="LinkedIn"
          >
            <FiLinkedin className="w-5 h-5" />
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
            aria-label="GitHub"
          >
            <FiGithub className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
