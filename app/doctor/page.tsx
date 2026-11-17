import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import DoctorActions from "../components/DoctorActions";

export default async function DoctorPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "doctor") redirect("/");

  await connectDB();

  
  const clean = (n: string) => n.toLowerCase().replace("dr. ", "").replace("dr ", "").trim();
  const myName = clean(user.name);

  const appointments = await Appointment.find({
    $or: [
      { doctorId: user.doctorId },
      { doctorId: user.id },
      { doctorName: user.name },
      { doctorName: { $regex: myName, $options: "i" } },
    ],
  })
    .sort({ date: 1 })
    .lean();

  const pending = appointments.filter((a: any) => a.status === "pending").length;
  const accepted = appointments.filter((a: any) => a.status === "confirmed").length;

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <p className="text-teal-400 text-sm font-bold tracking-widest">DOCTOR DASHBOARD</p>
      <h1 className="text-3xl font-bold text-white mt-1">Welcome, {user.name}</h1>
      <p className="text-slate-400 text-sm mt-2">Review appointments - accept or reject them here.</p>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700"><p className="text-slate-400 text-sm">Total</p><p className="text-white text-2xl font-bold">{appointments.length}</p></div>
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700"><p className="text-slate-400 text-sm">Waiting for Review</p><p className="text-yellow-300 text-2xl font-bold">{pending}</p></div>
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700"><p className="text-slate-400 text-sm">Accepted</p><p className="text-teal-300 text-2xl font-bold">{accepted}</p></div>
      </div>

      <div className="grid gap-4 mt-8">
        {appointments.length === 0 && <p className="text-slate-400">No appointments yet.</p>}
        {appointments.map((a: any) => (
          <div key={a._id.toString()} className="bg-slate-800 rounded-2xl p-5 border border-slate-700 flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <p className="font-bold text-white">{a.patientName} <span className="text-slate-400 font-normal text-sm">- {a.patientEmail}</span></p>
              <p className="text-slate-400 text-sm mt-1">{a.date} at {a.time} - {a.specialty}</p>
              <p className="text-slate-300 text-sm mt-2 bg-slate-900 p-3 rounded-lg">Reason: {a.reason || "No reason given"}</p>
              <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full mt-3 bg-slate-900 text-white">
                {a.status === "pending" ? "WAITING FOR REVIEW" : a.status === "confirmed" ? "ACCEPTED" : a.status === "completed" ? "COMPLETED" : "REJECTED"}
              </span>
            </div>
            <DoctorActions id={a._id.toString()} status={a.status} />
          </div>
        ))}
      </div>
    </div>
  );
}