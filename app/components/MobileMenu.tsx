"use client";
import { useState } from "react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function MobileMenu({ user }: any) {
  const [open, setOpen] = useState(false);

  const clean = user?.name?.replace(/^Dr\.\s*/i, "").trim() || "";
  const first = clean.split(" ")[0] || "";
  const hiName = user?.role === "doctor" ? `Dr. ${first}` : first;

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="text-white text-2xl px-2"
      >
        {open ? "✕" : "☰"}
      </button>

      {open && (
        <div className="absolute top-16 left-0 right-0 bg-slate-800 px-5 py-4 flex flex-col gap-4 border-t border-slate-700 z-50">
          <Link href="/" onClick={() => setOpen(false)} className="text-teal-400 text-base">Home</Link>
          <Link href="/doctors" onClick={() => setOpen(false)} className="text-slate-300 text-base">Doctors</Link>
          <Link href="/dashboard" onClick={() => setOpen(false)} className="text-slate-300 text-base">Appointments</Link>

          {user ? (
            <>
              <span className="text-slate-300 text-base">Hi, {hiName}</span>
              {user.role === "patient" && <Link href="/dashboard" onClick={() => setOpen(false)} className="text-white text-sm bg-slate-900 px-4 py-2 rounded-lg text-center">Dashboard</Link>}
              {user.role === "doctor" && <Link href="/doctor" onClick={() => setOpen(false)} className="text-white text-sm bg-slate-900 px-4 py-2 rounded-lg text-center">Doctor</Link>}
              {user.role === "admin" && <Link href="/admin" onClick={() => setOpen(false)} className="text-white text-sm bg-slate-900 px-4 py-2 rounded-lg text-center">Admin</Link>}
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)} className="text-white text-sm bg-slate-900 px-4 py-2 rounded-lg text-center">Login</Link>
              <Link href="/register" onClick={() => setOpen(false)} className="text-slate-900 text-sm bg-teal-400 font-bold px-4 py-2 rounded-lg text-center">Register</Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}