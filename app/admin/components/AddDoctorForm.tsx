"use client";
import { useState } from "react";
import { addDoctor } from "@/actions/admin";

export default function AddDoctorForm() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <form
      action={async (fd) => {
        setError(""); setSuccess(""); setLoading(true);
        const res = await addDoctor(fd);
        setLoading(false);
        if (res?.error) setError(res.error);
        else { setSuccess("Doctor added successfully!"); (document.getElementById("add-doctor-form") as HTMLFormElement)?.reset(); }
      }}
      id="add-doctor-form"
      className="bg-slate-800 border border-slate-700 rounded-2xl p-5 grid sm:grid-cols-2 gap-3"
    >
      <div className="sm:col-span-2 flex justify-between"><h3 className="text-white font-bold">Add New Doctor</h3>{success && <p className="text-green-300 text-sm">{success}</p>}{error && <p className="text-red-300 text-sm">{error}</p>}</div>
      <input name="name" required placeholder="Doctor full name e.g Bam Adams" className="bg-slate-900 border border-slate-700 p-3 rounded-xl text-white text-sm outline-none" />
      <input name="email" required type="email" placeholder="Doctor email" className="bg-slate-900 border border-slate-700 p-3 rounded-xl text-white text-sm outline-none" />
      <input name="password" required type="password" placeholder="Password for doctor to login" className="bg-slate-900 border border-slate-700 p-3 rounded-xl text-white text-sm outline-none" />
      <select name="specialty" required className="bg-slate-900 border border-slate-700 p-3 rounded-xl text-white text-sm outline-none">
        <option value="">Select specialty</option>
        <option>General Practitioner</option><option>Dentist</option><option>Cardiologist</option><option>Dermatologist</option><option>Pediatrician</option><option>Gynecologist</option>
      </select>
      <button disabled={loading} className="sm:col-span-2 bg-teal-400 text-slate-900 font-bold py-3 rounded-xl text-sm disabled:opacity-50">{loading ? "Adding..." : "+ Add Doctor"}</button>
    </form>
  );
}