import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../../lib/auth";
import { getMyAppointments } from "../../actions/appointment";
import AppointmentCard from "../components/AppointmentCard";
import CancelledSection from "./CancelledSection";

export default async function Dashboard() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  if (user.role === "admin") redirect("/admin");
  if (user.role === "doctor") redirect("/doctor");

  const appointments = await getMyAppointments();

  const active = appointments.filter((a: any) => ["pending", "confirmed"].includes(a.status?.toLowerCase()));
  const completed = appointments.filter((a: any) => a.status?.toLowerCase() === "completed");
  const cancelled = appointments.filter((a: any) => a.status?.toLowerCase() === "cancelled");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-5 py-5 w-full">
      <p className="text-teal-400 text-xs font-bold tracking-widest">MY APPOINTMENTS</p>
      <h1 className="text-2xl sm:text-3xl font-bold mt-1 text-white">Welcome, {user.name}</h1>
      <p className="text-slate-400 text-sm mt-1">You have {active.length} active appointment(s).</p>

      <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4">
        <Link href="/book" className="bg-teal-400 text-slate-900 font-bold text-xs sm:text-sm text-center py-3 rounded-xl">Book Appointment</Link>
        <Link href="/doctors" className="bg-slate-800 border border-slate-700 text-white font-bold text-xs sm:text-sm text-center py-3 rounded-xl">Find Doctors</Link>
        <Link href="/chat" className="bg-slate-800 border border-slate-700 text-white font-bold text-xs sm:text-sm text-center py-3 rounded-xl">Chat</Link>
      </div>

      {active.length === 0 ? (
        <div className="bg-slate-800 rounded-2xl p-5 mt-6 border border-slate-700">
          <p className="font-bold text-white">No appointments yet</p>
          <p className="text-slate-400 text-sm mt-1">Book one from the Doctors page to get started.</p>
          <Link href="/doctors" className="inline-block bg-teal-400 text-slate-900 font-bold px-5 py-2.5 rounded-lg mt-4 text-sm">Find a Doctor</Link>
        </div>
      ) : (
        <>
          <h2 className="text-white font-bold mt-6">Upcoming Appointments</h2>
          <div className="grid md:grid-cols-2 gap-3 mt-3">
            {active.map((a: any) => (
              <AppointmentCard key={a._id} appt={a} />
            ))}
          </div>
        </>
      )}

      {completed.length > 0 && (
        <>
          <h2 className="text-white font-bold mt-6">Past Appointments</h2>
          <div className="space-y-2 mt-3">
            {completed.map((a: any) => (
              <div key={a._id} className="bg-slate-800 rounded-xl px-4 py-3 flex items-center justify-between border border-slate-700">
                <div>
                  <p className="font-bold text-white text-sm">{a.doctorName} • {a.specialty}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{a.date}, {a.time} • Completed</p>
                </div>
                <span className="bg-teal-400/20 text-teal-300 text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0">Completed</span>
              </div>
            ))}
          </div>
        </>
      )}

      <CancelledSection cancelled={JSON.parse(JSON.stringify(cancelled))} />
    </div>
  );
}