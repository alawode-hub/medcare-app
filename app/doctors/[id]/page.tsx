"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { doctors } from "../../data/doctors";
import { bookAppointment, getBookedSlots } from "../../../actions/appointment";

const availability: Record<string, string[]> = {
  "1": ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM"],
  "2": ["10:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"],
  "3": ["9:00 AM", "11:00 AM", "3:00 PM"],
  "4": ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM"],
  "5": ["9:00 AM", "10:00 AM", "3:00 PM", "4:00 PM"],
  "6": ["11:00 AM", "2:00 PM", "4:00 PM"],
};

const allSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"];

export default function DoctorDetail({ params }: { params: Promise<{ id: string }> }) {
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [today, setToday] = useState("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [selected, setSelected] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    params.then((p) => setDoctorId(p.id));
  }, [params]);

  useEffect(() => {
    const t = new Date().toISOString().split("T")[0];
    setToday(t);
    setDate(t);
  }, []);

  useEffect(() => {
    if (!doctorId || !date) return;
    getBookedSlots(doctorId, date).then(setBookedSlots);
    setSelected("");
  }, [doctorId, date]);

  const doctor = doctors.find((d) => d.id === doctorId) || doctors[0];
  const available = availability[doctor.id] || allSlots;

  const handleBook = async (formData: FormData) => {
    setError("");
    setLoading(true);
    const result = await bookAppointment(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-5 py-10 grid md:grid-cols-2 gap-6">
      <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
        <div className="relative h-72 w-full bg-slate-700">
          <Image
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80"
            alt={doctor.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="p-6">
          <span className="bg-teal-400 text-slate-900 text-xs px-3 py-1 rounded-full font-bold">{doctor.specialty}</span>
          <h1 className="text-2xl font-bold mt-3 text-white">{doctor.name}</h1>
          <p className="text-slate-400 text-sm mt-2">{doctor.about}</p>
          <p className="text-sm mt-3 text-white">{doctor.experience} years experience • Next: <span className="text-teal-400 font-bold">{doctor.next}</span></p>
        </div>
      </div>

      <form action={handleBook} className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <h2 className="font-bold text-lg text-white">Book appointment</h2>
        <p className="text-slate-400 text-sm mt-1">Pick date, pick time, tell us why.</p>
        {error && <p className="bg-red-500/20 text-red-300 text-sm p-3 rounded-lg mt-4">{error}</p>}
        <input type="hidden" name="doctorId" value={doctor.id} />
        <input type="hidden" name="doctorName" value={doctor.name} />
        <input type="hidden" name="specialty" value={doctor.specialty} />
        <input type="hidden" name="time" value={selected} />
        <label className="block text-sm font-bold mt-5 mb-2 text-white">Pick a date</label>
        <input type="date" name="date" value={date} min={today} onChange={(e) => setDate(e.target.value)} required className="w-full bg-slate-900 p-3 rounded-xl text-sm outline-none border border-slate-700 text-white" />
        <label className="block text-sm font-bold mt-5 mb-2 text-white">Pick a time - {date}</label>
        <div className="grid grid-cols-2 gap-3">
          {allSlots.map((slot) => {
            const isAvailable = available.includes(slot);
            const isBooked = bookedSlots.includes(slot);
            const isSelected = selected === slot;
            if (!isAvailable) {
              return <div key={slot} className="bg-slate-900 border border-slate-700 text-center py-3 rounded-xl text-sm text-slate-400 opacity-50">{slot} - N/A</div>;
            }
            if (isBooked) {
              return <div key={slot} className="bg-red-500/20 border border-red-500/30 text-center py-3 rounded-xl text-sm text-red-300 font-bold">{slot} - Booked</div>;
            }
            return (
              <button type="button" key={slot} onClick={() => setSelected(slot)} className={`py-3 rounded-xl text-sm font-bold border ${isSelected ? "bg-teal-400 text-slate-900 border-teal-400" : "bg-slate-900 border-slate-700 text-white hover:border-teal-400"}`}>
                {slot}
              </button>
            );
          })}
        </div>
        <label className="block text-sm font-bold mt-5 mb-2 text-white">Reason for visit (optional)</label>
        <textarea name="reason" placeholder="e.g I have tooth pain..." rows={2} className="w-full bg-slate-900 p-3 rounded-xl text-sm outline-none border border-slate-700 text-white" />
        <button disabled={!selected || loading} className="w-full bg-teal-400 text-slate-900 font-bold py-3 rounded-xl mt-6 text-sm disabled:opacity-50">
          {loading ? "Booking..." : selected ? `Confirm Booking - ${date}, ${selected}` : "Select a time to Book"}
        </button>
        <Link href="/doctors" className="block text-center text-sm mt-3 text-slate-400">← Back to doctors</Link>
      </form>
    </div>
  );
}