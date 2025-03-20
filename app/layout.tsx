import type { Metadata } from "next";
import "./globals.css"; // Global styles
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "Employee Hub - Manage Your Workforce",
  description: "A powerful employee management system for tracking performance and efficiency.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        {/* ✅ Navbar - Stays on all pages */}
        <Navbar />

        {/* ✅ Page content */}
        <main className="h-[90vh]">{children}</main>

        {/* ✅ Footer - Stays on all pages */}
        <Footer />
      </body>
    </html>
  );
}
