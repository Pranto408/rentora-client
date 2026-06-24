"use client";

import { usePathname } from "next/navigation";
// import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Navbar from "./Navber";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();

  // Hide Navbar and Footer on all dashboard routes
  const isDashboard = pathname?.startsWith("/dashboard");

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}
