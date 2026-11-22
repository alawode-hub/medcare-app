import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";
import { bookAppointment } from "@/actions/appointment";

async function handleBook(formData: FormData) {
  "use server";
  await bookAppointment(formData);
}

async function BookForm({ doctorId }: { doctorId: string }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  await connectDB();
  const doctors = await User.find({ role: "doctor" }).sort({ name: 1 }).lean();
  const selected = doctors.find((d: any) => d._id.toString() === doctorId);

  return (
    <div className="max-w-xl mx-auto px-5 py-10">
      <h1 className="text-3xl font-bold text-white">Book Appointment</h1>
      <p className="text-slate-400 text-sm mt-2">
        {selected ? `Booking with ${selected.name} - ${selected.specialty}` : "Choose a doctor"}
      </p>

      <form action={handleBook} className="mt-6 space-y-4 bg-slate-800 border border-slate-700 rounded-2xl p-6">
        <input type="hidden" name="doctorId" value={selected?._id.toString() || doctorId} />
        <input type="hidden" name="doctorName" value={selected?.name || ""} />
        <input type="hidden" name="specialty" value={selected?.specialty || ""} />

        <div>
          <label className="text-slate-400 text-xs">Doctor</label>
          <select defaultValue={selected?._id.toString() || ""} disabled className="w-full mt-1 bg-slate-900 border border-slate-700 p-3 rounded-xl text-white text-sm">
            {doctors.map((d: any) => (
              <option key={d._id.toString()} value={d._id.toString()}>{d.name} - {d.specialty}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-slate-400 text-xs">Date</label>
          <input type="date" name="date" required className="w-full mt-1 bg-slate-900 border border-slate-700 p-3 rounded-xl text-white text-sm" />
        </div>

        <div>
          <label className="text-slate-400 text-xs">Time</label>
          <input type="time" name="time" required className="w-full mt-1 bg-slate-900 border border-slate-700 p-3 rounded-xl text-white text-sm" />
        </div>

        <div>
          <label className="text-slate-400 text-xs">Reason</label>
          <textarea name="reason" required placeholder="State your reason" className="w-full mt-1 bg-slate-900 border border-slate-700 p-3 rounded-xl text-white text-sm" />
        </div>

        <button className="w-full bg-teal-400 text-slate-900 font-bold py-3 rounded-xl text-sm">Confirm Booking</button>
      </form>
    </div>
  );
}

export default async function BookPage({ searchParams }: { searchParams: Promise<{ doctor?: string }> }) {
  const { doctor } = await searchParams;
  return (
    <Suspense fallback={<div className="max-w-xl mx-auto px-5 py-10 text-slate-400">Loading...</div>}>
      <BookForm doctorId={doctor || ""} />
    </Suspense>
  );
}