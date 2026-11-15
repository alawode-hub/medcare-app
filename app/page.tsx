"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import DoctorCard from "./components/DoctorCard";
import { doctors } from "./data/doctors";

const specialties = [
  ["General Practitioner", "Check-ups and everyday care", "1 doctor", "🩺"],
  ["Dentist", "Cleanings, fillings and braces", "1 doctor", "🦷"],
  ["Cardiologist", "Heart health and blood pressure", "1 doctor", "❤️"],
  ["Dermatologist", "Skin, hair and nails", "1 doctor", "💧"],
  ["Pediatrician", "Care for babies and children", "1 doctor", "😊"],
  ["Gynecologist", "Women's health and pregnancy", "1 doctor", "♀️"],
];

function clean(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All specialties");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => setIsLoggedIn(d.loggedIn))
      .catch(() => setIsLoggedIn(false));
  }, []);

  const doctorsLink = "/doctors";

  const isSearching = search !== "" || specialty !== "All specialties";

  const filtered = doctors.filter((d) => {
    const matchName = clean(d.name).includes(clean(search));
    const matchSpecialty = specialty === "All specialties" || d.specialty === specialty;
    return matchName && matchSpecialty;
  });

  return (
    <div className="bg-slate-900 min-h-screen">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-8 md:py-12">
          <div>
            <p className="text-teal-400 text-xs sm:text-sm font-bold tracking-widest">ONLINE CLINIC APPOINTMENTS</p>
            <h1 className="text-3xl sm:text-5xl font-bold mt-3 leading-tight text-white">Quality Healthcare,<br />Made Simple</h1>
            <p className="text-slate-400 mt-4 text-sm sm:text-base">Find a trusted doctor, see real open times and book your visit in under a minute. No phone calls and no waiting on hold.</p>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Link href={doctorsLink} className="bg-teal-400 text-slate-900 font-bold px-5 py-3 rounded-lg text-sm text-center">Find a Doctor →</Link>
              <button className="bg-slate-800 px-5 py-3 rounded-lg text-sm font-bold border border-slate-700 text-white">How it works</button>
            </div>
          </div>
          <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
            <p className="font-bold text-white">Open soon</p>
            <p className="text-slate-400 text-sm">The next free appointment with each doctor</p>
            <div className="mt-4 space-y-3">
              {doctors.slice(0, 3).map((d) => (
                <div key={d.id} className="flex justify-between items-center gap-3 bg-slate-900 p-3 rounded-xl">
                  <span className="text-sm font-bold text-white">{d.name}<br /><span className="text-slate-400 text-xs font-normal">{d.specialty}</span></span>
                  <span className="text-teal-400 text-xs font-bold shrink-0">{d.next}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-2xl p-3 flex flex-col sm:flex-row gap-3 border border-slate-700">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name "
            className="flex-1 bg-slate-900 p-3 rounded-lg outline-none text-sm text-white"
          />
          <select value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="bg-slate-900 p-3 rounded-lg text-sm text-white">
            <option>All specialties</option>
            <option>General Practitioner</option>
            <option>Dentist</option>
            <option>Cardiologist</option>
            <option>Dermatologist</option>
            <option>Pediatrician</option>
            <option>Gynecologist</option>
          </select>
        </div>

        {isSearching ? (
          <div className="py-10">
            <p className="text-teal-400 text-sm font-bold tracking-widest">SEARCH RESULT</p>
            <h2 className="text-2xl font-bold mt-1 text-white">{filtered.length} doctor(s) found</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {filtered.map((d) => <DoctorCard key={d.id} doctor={d} />)}
            </div>
            {filtered.length === 0 && <p className="text-slate-400 mt-4">No doctor found for &quot;{search}&quot;. Try just first name like adisa.</p>}
            <button onClick={() => { setSearch(""); setSpecialty("All specialties"); }} className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm mt-6">Clear search</button>
          </div>
        ) : (
          <>
            <div className="py-12">
              <p className="text-teal-400 text-sm font-bold tracking-widest">POPULAR SPECIALTIES</p>
              <h2 className="text-2xl font-bold mt-1 text-white">Who do you need to see?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {specialties.map(([title, desc, count, icon]) => (
                  <button key={title} onClick={() => setSpecialty(title)} className="bg-slate-800 p-5 rounded-2xl border border-slate-700 text-left">
                    <span className="bg-teal-400 text-slate-900 w-8 h-8 flex items-center justify-center rounded-lg">{icon}</span>
                    <p className="font-bold mt-3 text-white">{title}</p><p className="text-slate-400 text-sm">{desc}</p><p className="text-slate-400 text-xs mt-2">{count}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="pb-10">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div>
                  <p className="text-teal-400 text-sm font-bold tracking-widest">FEATURED DOCTORS</p>
                  <h2 className="text-2xl font-bold mt-1 text-white">Experienced and ready to help</h2>
                </div>
                <Link href={doctorsLink} className="text-sm text-teal-400 font-bold shrink-0">See all doctors →</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {doctors.map((d) => <DoctorCard key={d.id} doctor={d} />)}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}