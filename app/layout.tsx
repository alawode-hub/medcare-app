import "./globals.css";
import Link from "next/link";
import { Suspense } from "react";
import { getCurrentUser } from "../lib/auth";
import LogoutButton from "./components/LogoutButton";
import Footer from "./components/Footer";
import MobileMenu from "./components/MobileMenu";

export const instant = false;

async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="max-w-6xl mx-auto px-5 py-4 flex justify-between items-center relative">
      <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl">
        <span className="w-8 h-8 bg-teal-400 rounded-lg flex items-center justify-center text-slate-900 text-xl font-bold">+</span>
        <span>Med<span className="text-teal-400">Care</span></span>
      </Link>

      {/* LAPTOP - show full nav */}
      <nav className="hidden md:flex gap-5 items-center">
        <Link href="/" className="text-teal-400 text-sm">Home</Link>
        <Link href="/doctors" className="text-slate-300 text-sm">Doctors</Link>
        <Link href="/dashboard" className="text-slate-300 text-sm">Appointments</Link>

        {user ? (
          <>
            <span className="text-slate-300 text-sm">Hi, {user.name.split(" ")[0]}</span>
            {user.role === "patient" && <Link href="/dashboard" className="text-white text-sm bg-slate-800 px-4 py-2 rounded-lg">Dashboard</Link>}
            {user.role === "doctor" && <Link href="/doctor" className="text-white text-sm bg-slate-800 px-4 py-2 rounded-lg">Doctor</Link>}
            {user.role === "admin" && <Link href="/admin" className="text-white text-sm bg-slate-800 px-4 py-2 rounded-lg">Admin</Link>}
            <LogoutButton />
          </>
        ) : (
          <>
            <Link href="/login" className="text-white text-sm bg-slate-800 px-4 py-2 rounded-lg">Login</Link>
            <Link href="/register" className="text-slate-900 text-sm bg-teal-400 font-bold px-4 py-2 rounded-lg">Register</Link>
          </>
        )}
      </nav>

      {/* PHONE - hamburger */}
      <MobileMenu user={user} />
    </header>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-900 min-h-screen">
        <Suspense fallback={<div className="h-16" />}>
          <Header />
        </Suspense>
        {children}
        <Footer />
      </body>
    </html>
  );
}