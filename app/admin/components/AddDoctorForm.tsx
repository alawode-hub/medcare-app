"use client";
import { useState } from "react";
import { addDoctor } from "@/actions/admin";

export default function AddDoctorForm() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [picError, setPicError] = useState("");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPicError("");
    setPreview("");
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPicError("Pic must be image file");
      e.target.value = "";
      return;
    }
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowed.includes(file.type)) {
      setPicError("Only JPG, PNG or WEBP allowed");
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setPicError("Pic too big - max 2MB. Pick smaller pic.");
      e.target.value = "";
      return;
    }
    // Show preview
    setPreview(URL.createObjectURL(file));
  };

  return (
    <form
      action={async (fd) => {
        if (picError) return;
        setError(""); setSuccess(""); setLoading(true);
        const res = await addDoctor(fd);
        setLoading(false);
        if (res?.error) setError(res.error);
        else { setSuccess("Doctor added successfully!"); setPreview(""); (document.getElementById("add-doctor-form") as HTMLFormElement)?.reset(); }
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

      <div className="sm:col-span-2 bg-slate-900 border border-slate-700 rounded-xl p-3">
        <label className="text-slate-400 text-xs font-bold">Doctor Picture (Optional - JPG, PNG, WEBP, max 2MB)</label>
        <div className="flex items-center gap-3 mt-2">
          {preview ? (
            <img src={preview} alt="Preview" className="w-14 h-14 rounded-full object-cover border border-slate-600" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 text-xl">👨‍⚕️</div>
          )}
          <input type="file" name="imageFile" accept="image/jpeg,image/png,image/webp,image/jpg" onChange={handleFile} className="text-slate-400 text-sm flex-1" />
        </div>
        {picError && <p className="text-red-300 text-xs mt-2">{picError}</p>}
        <input name="imageUrl" placeholder="Or paste pic link e.g https://... (if you no upload file)" className="w-full mt-2 bg-slate-800 border border-slate-700 p-2.5 rounded-lg text-white text-sm outline-none" />
      </div>

      <input name="experience" placeholder="Experience e.g 8 years" className="bg-slate-900 border border-slate-700 p-3 rounded-xl text-white text-sm outline-none" />
      <textarea name="bio" placeholder="Short bio about doctor..." className="bg-slate-900 border border-slate-700 p-3 rounded-xl text-white text-sm outline-none" rows={2} />
      <button disabled={loading || !!picError} className="sm:col-span-2 bg-teal-400 text-slate-900 font-bold py-3 rounded-xl text-sm disabled:opacity-50">{loading ? "Adding..." : "+ Add Doctor"}</button>
    </form>
  );
}