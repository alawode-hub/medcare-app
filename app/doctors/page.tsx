"use client";
import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import DoctorCard from "../components/DoctorCard";
import { doctors } from "../data/doctors";

function clean(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function DoctorsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All specialties");
  const [checking, setChecking] = useState(true);


  const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
  fetch("/api/me")
    .then((r) => r.json())
    .then((d) => setIsLoggedIn(d.loggedIn))
    .catch(() => setIsLoggedIn(false));
      }, []);
      

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setSpecialty(searchParams.get("specialty") || "All specialties");
  }, [searchParams]);

  if (checking) {
    return <div className="max-w-6xl mx-auto px-5 py-10 text-slate-400">Checking your account...</div>;
  }

  const filtered = doctors.filter((d) => {
    const matchName = clean(d.name).includes(clean(search));
    const matchSpecialty = specialty === "All specialties" || d.specialty === specialty;
    return matchName && matchSpecialty;
  });

  return (
    <div className="bg-slate-900 min-h-screen">
    <div className="max-w-6xl mx-auto px-5 py-10">
      <p className="text-teal-400 text-sm font-bold tracking-widest">ALL DOCTORS</p>
      <h1 className="text-3xl font-bold mt-1 text-white">Find a doctor</h1>
      <p className="text-slate-400 mt-2">All doctors, with next open time.</p>
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search doctor by name..."
          className="flex-1 bg-slate-800 border border-slate-700 text-white p-3 rounded-lg"
        />
        <select value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="bg-slate-800 border border-slate-700 text-white p-3 rounded-lg">
          <option>All specialties</option>
          <option>General Practitioner</option>
          <option>Dentist</option>
          <option>Cardiologist</option>
          <option>Dermatologist</option>
          <option>Pediatrician</option>
          <option>Gynecologist</option>
        </select>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {filtered.map((d) => (
          <DoctorCard key={d.id} doctor={d} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-slate-400 text-center mt-10">No doctor found for &quot;{search}&quot;</p>
      )}
    </div>
    </div>
  );
}

export default function DoctorsPage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-5 py-10 text-slate-400">Loading...</div>}>
      <DoctorsContent />
    </Suspense>
  );
}