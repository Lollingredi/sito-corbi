// Skills applied: composition-patterns (shared layout eliminates Navbar/Footer duplication),
//                 react-best-practices (server component — no "use client" needed here)
// Server component: Navbar and Footer are client components but can be imported from here.
// This eliminates copy-pasted <Navbar /><Footer /> from both project pages.
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
