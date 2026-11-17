import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import User from "@/models/User";
import { updateAppointmentStatus } from "@/actions/appointment";
import AddDoctorForm from "./components/AddDoctorForm";
import { DeleteUserButton, SeedDoctorsButton } from "./components/AdminActions";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/");

  const { tab } = await searchParams;
  const activeTab = tab || "doctors";

  await connectDB();
  const appointments = await Appointment.find({}).sort({ createdAt: -1 }).lean();
  const allUsers = await User.find({}).sort({ createdAt: -1 }).lean();

  const dbDoctors: any[] = allUsers.filter((u: any) => u.role === "doctor");
  const patients: any[] = allUsers.filter((u: any) => u.role === "patient");

  // OPTION C: Total = DB only. No static again.
  const totalDoctors = dbDoctors.length;
  const totalPatients = patients.length;
  const total = appointments.length;
  const pending = appointments.filter((a: any) => a.status === "pending").length;
  const completed = appointments.filter((a: any) => a.status === "completed").length;
  const rejected = appointments.filter((a: any) => a.status === "cancelled").length;

  const tabStyle = (t: string) => `px-4 py-2 rounded-full text-sm font-bold ${activeTab === t ? "bg-teal-400 text-slate-900" : "bg-slate-800 text-slate-300 border border-slate-700"}`;

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <p className="text-teal-400 text-sm font-bold tracking-widest">ADMIN DASHBOARD</p>
      <h1 className="text-3xl font-bold text-white mt-1">Welcome, {user.name}</h1>
      <p className="text-slate-400 text-sm mt-2">Manage doctors, patients and all appointments.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700"><p className="text-slate-400 text-sm">Total Doctors</p><p className="text-white text-2xl font-bold">{totalDoctors}</p></div>
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700"><p className="text-slate-400 text-sm">Total Patients</p><p className="text-white text-2xl font-bold">{totalPatients}</p></div>
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700"><p className="text-slate-400 text-sm">Total Appts</p><p className="text-white text-2xl font-bold">{total}</p></div>
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700"><p className="text-slate-400 text-sm">Pending</p><p className="text-yellow-300 text-2xl font-bold">{pending}</p></div>
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700"><p className="text-slate-400 text-sm">Completed</p><p className="text-green-300 text-2xl font-bold">{completed}</p></div>
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700"><p className="text-slate-400 text-sm">Rejected</p><p className="text-red-300 text-2xl font-bold">{rejected}</p></div>
      </div>

      <div className="flex gap-2 mt-8 flex-wrap">
        <Link href="/admin?tab=doctors" className={tabStyle("doctors")}>Doctors ({totalDoctors})</Link>
        <Link href="/admin?tab=patients" className={tabStyle("patients")}>Patients ({totalPatients})</Link>
        <Link href="/admin?tab=appointments" className={tabStyle("appointments")}>Appointments ({total})</Link>
      </div>

      {activeTab === "doctors" && (
        <div className="grid gap-4 mt-6">
          <AddDoctorForm />
          {dbDoctors.length === 0 && (
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
              <p className="text-white font-bold">No doctors for DB yet</p>
              <p className="text-slate-400 text-sm mt-1">Click below to carry your 6 doctors from code enter DB once. After that, na DB be Oga.</p>
              <div className="mt-4"><SeedDoctorsButton /></div>
            </div>
          )}
          {dbDoctors.length > 0 && dbDoctors.length < 6 && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 flex justify-between items-center">
              <p className="text-slate-300 text-sm">You get {dbDoctors.length} doctors. Want carry the remaining static doctors enter DB?</p>
              <SeedDoctorsButton />
            </div>
          )}
          {dbDoctors.map((d: any) => (
            <div key={d._id.toString()} className="bg-slate-800 rounded-2xl p-5 border border-slate-700 flex justify-between gap-4">
              <div><p className="font-bold text-white">{d.name}</p><p className="text-slate-400 text-sm">{d.email} • {d.specialty || "Doctor"}</p><p className="text-slate-500 text-xs mt-1">{appointments.filter((a: any) => a.doctorName === d.name || a.doctorId === d._id.toString()).length} appointments</p></div>
              <DeleteUserButton id={d._id.toString()} name={d.name} />
            </div>
          ))}
        </div>
      )}

      {activeTab === "patients" && (
        <div className="grid gap-4 mt-6">
          {patients.length === 0 && <p className="text-slate-400">No patients yet.</p>}
          {patients.map((p: any) => (
            <div key={p._id.toString()} className="bg-slate-800 rounded-2xl p-5 border border-slate-700 flex justify-between gap-4">
              <div><p className="font-bold text-white">{p.name}</p><p className="text-slate-400 text-sm">{p.email}</p><p className="text-slate-500 text-xs mt-1">{appointments.filter((a: any) => a.patientId === p._id.toString() || a.patientEmail === p.email).length} appointments</p></div>
              <DeleteUserButton id={p._id.toString()} name={p.name} />
            </div>
          ))}
        </div>
      )}

      {activeTab === "appointments" && (
        <div className="grid gap-4 mt-6">
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
                {a.status === "pending" && (<><form action={updateAppointmentStatus}><input type="hidden" name="id" value={a._id.toString()} /><input type="hidden" name="status" value="confirmed" /><button className="bg-teal-400 text-slate-900 font-bold px-4 py-2 rounded-lg text-sm">Accept</button></form><form action={updateAppointmentStatus}><input type="hidden" name="id" value={a._id.toString()} /><input type="hidden" name="status" value="cancelled" /><button className="bg-red-500 text-white font-bold px-4 py-2 rounded-lg text-sm">Reject</button></form></>)}
                {a.status === "confirmed" && (<><form action={updateAppointmentStatus}><input type="hidden" name="id" value={a._id.toString()} /><input type="hidden" name="status" value="completed" /><button className="bg-green-400 text-slate-900 font-bold px-4 py-2 rounded-lg text-sm">Mark as Done</button></form><form action={updateAppointmentStatus}><input type="hidden" name="id" value={a._id.toString()} /><input type="hidden" name="status" value="cancelled" /><button className="bg-red-500 text-white font-bold px-4 py-2 rounded-lg text-sm">Reject</button></form></>)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}