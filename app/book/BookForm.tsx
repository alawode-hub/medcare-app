"use client";

import { useState } from "react";
import { bookAppointment } from "@/actions/appointment";

const TIME_SLOTS = ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM"];

export default function BookForm({ doctors, doctorId }: { doctors: any[]; doctorId: string }) {
  const [selectedId, setSelectedId] = useState(doctorId || doctors[0]?.id || "");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selected = doctors.find((d) => d.id === selectedId);
  const today = new Date().toISOString().split("T")[0];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!time) {
      setError("Please select a time");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("doctorId", selectedId);
    formData.append("doctorName", selected?.name || "");
    formData.append("specialty", selected?.specialty || "");
    formData.append("date", date);
    formData.append("time", time);
    formData.append("reason", reason);

    const result = await bookAppointment(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-5 py-5 w-full">
      <h1 className="text-2xl sm:text-3xl font-bold text-white">Book Appointment</h1>
      <p className="text-slate-400 text-sm mt-2">
        {selected ? `Booking with ${selected.name} - ${selected.specialty}` : "Choose a doctor"}
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-5 bg-slate-800 border border-slate-700 rounded-2xl p-5">
        <div>
          <label className="block text-white text-sm font-bold mb-2">Doctor</label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 px-3 py-3 rounded-xl text-white text-sm outline-none"
          >
            {doctors.map((d: any) => (
              <option key={d.id} value={d.id}>{d.name} - {d.specialty}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-white text-sm font-bold mb-2">Date</label>
          <input
            type="date"
            value={date}
            min={today}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full bg-slate-900 border border-slate-700 px-3 py-3 rounded-xl text-white text-sm outline-none"
          />
        </div>

        <div>
          <label className="block text-white text-sm font-bold mb-2">Time</label>
          <div className="grid grid-cols-3 gap-2">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setTime(slot)}
                className={
                  time === slot
                    ? "bg-teal-400 text-slate-900 text-xs font-bold py-2.5 rounded-lg"
                    : "bg-slate-900 border border-slate-700 text-white text-xs font-bold py-2.5 rounded-lg"
                }
              >
                {slot}
              </button>
            ))}
          </div>
          {time && <p className="text-teal-400 text-xs font-bold mt-2">Selected: {time}</p>}
        </div>

        <div>
          <label className="block text-white text-sm font-bold mb-2">Reason</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            placeholder="State your reason"
            rows={3}
            className="w-full bg-slate-900 border border-slate-700 px-3 py-3 rounded-xl text-white text-sm outline-none resize-none"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-400 text-slate-900 font-bold py-3.5 rounded-xl text-sm disabled:opacity-60"
        >
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
}