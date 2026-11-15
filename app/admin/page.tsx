import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import { updateAppointmentStatus } from "@/actions/appointment";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/");

  await connectDB();
  const appointments = await Appointment.find({}).sort({ createdAt: -1 }).lean();
  const total = appointments.length;
  const pending = appointments.filter((a: any) => a.status === "pending").length;
  const confirmed = appointments.filter((a: any) => a.status === "confirmed").length;
  const rejected = appointments.filter((a: any) => a.status === "cancelled").length;

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <p className="text-teal-400 text-sm font-bold tracking-widest">ADMIN DASHBOARD</p>
      <h1 className="text-3xl font-bold text-white mt-1">Review All Appointments</h1>
      <p className="text-slate-400 text-sm mt-2">Admin can accept or reject any appointment.</p>

      <div className="grid grid-cols-4 gap-4 mt-6">
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700"><p className="text-slate-400 text-sm">Total</p><p className="text-white text-2xl font-bold">{total}</p></div>
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700"><p className="text-slate-400 text-sm">Waiting Review</p><p className="text-yellow-300 text-2xl font-bold">{pending}</p></div>
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700"><p className="text-slate-400 text-sm">Accepted</p><p className="text-teal-300 text-2xl font-bold">{confirmed}</p></div>
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700"><p className="text-slate-400 text-sm">Rejected</p><p className="text-red-300 text-2xl font-bold">{rejected}</p></div>
      </div>

      <div className="grid gap-4 mt-8">
        {appointments.length === 0 && <p className="text-slate-400">No appointments yet.</p>}
        {appointments.map((a: any) => (
          <div key={a._id.toString()} className="bg-slate-800 rounded-2xl p-5 border border-slate-700 flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <p className="font-bold text-white">{a.patientName} - {a.doctorName}</p>
              <p className="text-slate-400 text-sm mt-1">{a.date} at {a.time} - {a.specialty}</p>
              <p className="text-slate-300 text-sm mt-2 bg-slate-900 p-3 rounded-lg">Reason: {a.reason || "No reason given"}</p>
              <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full mt-3 bg-slate-900 text-white">
                {a.status === "pending" ? "WAITING FOR REVIEW" : a.status === "confirmed" ? "ACCEPTED" : a.status === "completed" ? "COMPLETED" : "REJECTED"}
              </span>
            </div>
            <div className="flex gap-2 items-start shrink-0">
              {a.status === "pending" && (
                <>
                  <form action={updateAppointmentStatus}>
                    <input type="hidden" name="id" value={a._id.toString()} />
                    <input type="hidden" name="status" value="confirmed" />
                    <button className="bg-teal-400 text-slate-900 font-bold px-4 py-2 rounded-lg text-sm">Accept</button>
                  </form>
                  <form action={updateAppointmentStatus}>
                    <input type="hidden" name="id" value={a._id.toString()} />
                    <input type="hidden" name="status" value="cancelled" />
                    <button className="bg-red-500 text-white font-bold px-4 py-2 rounded-lg text-sm">Reject</button>
                  </form>
                </>
              )}
              {a.status === "confirmed" && (
                <>
                  <form action={updateAppointmentStatus}>
                    <input type="hidden" name="id" value={a._id.toString()} />
                    <input type="hidden" name="status" value="completed" />
                    <button className="bg-green-400 text-slate-900 font-bold px-4 py-2 rounded-lg text-sm">Mark as Done</button>
                  </form>
                  <form action={updateAppointmentStatus}>
                    <input type="hidden" name="id" value={a._id.toString()} />
                    <input type="hidden" name="status" value="cancelled" />
                    <button className="bg-red-500 text-white font-bold px-4 py-2 rounded-lg text-sm">Reject</button>
                  </form>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}