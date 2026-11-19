export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../../lib/auth";
import { getMyAppointments } from "../../actions/appointment";
import AppointmentCard from "../components/AppointmentCard";

export default async function Dashboard() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // --- FIX: Admin & Doctor no suppose stay here ---
  if (user.role === "admin") redirect("/admin");
  if (user.role === "doctor") redirect("/doctor");

  const appointments = await getMyAppointments();
  const active = appointments.filter((a: any) => a.status !== "cancelled");
  const cancelled = appointments.filter((a: any) => a.status === "cancelled");

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <p className="text-teal-400 text-sm font-bold tracking-widest">MY APPOINTMENTS</p>
      <h1 className="text-3xl font-bold mt-1 text-white">Welcome, {user.name} 👋</h1>
      <p className="text-slate-400 mt-2">You have {active.length} active appointment(s).</p>

      {active.length === 0 ? (
        <div className="bg-slate-800 rounded-2xl p-6 mt-6 border border-slate-700">
          <p className="font-bold text-white">No appointments yet</p>
          <p className="text-slate-400 text-sm mt-1">Go book one from Doctors page. E go save for real database now.</p>
          <Link href="/doctors" className="inline-block bg-teal-400 text-slate-900 font-bold px-5 py-2.5 rounded-lg mt-4 text-sm">Find a Doctor →</Link>
        </div>
      ) : (
        <div className="space-y-4 mt-6">
          {active.map((a: any) => (
            <AppointmentCard key={a._id} appt={a} />
          ))}
        </div>
      )}

      {cancelled.length > 0 && (
        <>
          <h2 className="text-lg font-bold mt-10 text-white">Cancelled</h2>
          <div className="space-y-3 mt-4 opacity-60">
            {cancelled.map((a: any) => (
              <div key={a._id} className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
                <p className="font-bold line-through text-white">{a.doctorName} • {a.specialty}</p>
                <p className="text-slate-400 text-sm">{a.date}, {a.time} • Cancelled</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}