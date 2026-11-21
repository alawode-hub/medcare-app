import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import User from "@/models/User";
import { updateAppointmentStatus } from "@/actions/appointment";
import AddDoctorForm from "./components/AddDoctorForm";
import { DeleteUserButton, SeedDoctorsButton, ViewDoctorButton, EditDoctorButton } from "./components/AdminActions";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ tab?: string; status?: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/");

  const { tab, status } = await searchParams;
  const activeTab = tab || "doctors";
  const activeStatus = status || "all";

  await connectDB();
  const appointments = await Appointment.find({}).sort({ createdAt: -1 }).lean();
  const allUsers = await User.find({}).sort({ createdAt: -1 }).lean();

  const dbDoctors: any[] = allUsers.filter((u: any) => u.role === "doctor");
  const patients: any[] = allUsers.filter((u: any) => u.role === "patient");

  const totalDoctors = dbDoctors.length;
  const totalPatients = patients.length;
  const total = appointments.length;
  const pending = appointments.filter((a: any) => a.status === "pending").length;
  const accepted = appointments.filter((a: any) => a.status === "confirmed").length;
  const completed = appointments.filter((a: any) => a.status === "completed").length;
  const rejected = appointments.filter((a: any) => a.status === "cancelled").length;

  const filteredAppointments = activeStatus === "all"
    ? appointments
    : appointments.filter((a: any) => a.status === activeStatus);

  const tabStyle = (t: string) => `px-4 py-2 rounded-full text-sm font-bold ${activeTab === t ? "bg-teal-400 text-slate-900" : "bg-slate-800 text-slate-300 border border-slate-700"}`;

  const statCard = (isActive: boolean, activeColor: string) =>
    `bg-slate-800 p-4 rounded-2xl border transition ${isActive ? `${activeColor} ring-1` : "border-slate-700"} hover:opacity-90 block text-left w-full`;

  const filterPill = (value: string, label: string, count: number) => {
    const isActive = activeStatus === value;
    return (
      <Link
        href={`/admin?tab=appointments&status=${value}`}
        className={`px-3 py-1.5 rounded-full text-xs font-bold ${isActive ? "bg-teal-400 text-slate-900" : "bg-slate-800 text-slate-300 border border-slate-700"}`}
      >
        {label} ({count})
      </Link>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <p className="text-teal-400 text-sm font-bold tracking-widest">ADMIN DASHBOARD</p>
      <h1 className="text-3xl font-bold text-white mt-1">Welcome, {user.name}</h1>
      <p className="text-slate-400 text-sm mt-2">Manage doctors, patients and all appointments.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700"><p className="text-slate-400 text-sm">Total Doctors</p><p className="text-white text-2xl font-bold">{totalDoctors}</p></div>
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700"><p className="text-slate-400 text-sm">Total Patients</p><p className="text-white text-2xl font-bold">{totalPatients}</p></div>

        <Link href="/admin?tab=appointments&status=all" className={statCard(activeTab === "appointments" && activeStatus === "all", "border-white ring-white")}>
          <p className="text-slate-400 text-sm">Total Appointments </p><p className="text-white text-2xl font-bold">{total}</p>
        </Link>
        <Link href="/admin?tab=appointments&status=pending" className={statCard(activeTab === "appointments" && activeStatus === "pending", "border-yellow-300 ring-yellow-300")}>
          <p className="text-slate-400 text-sm">Pending </p><p className="text-yellow-300 text-2xl font-bold">{pending}</p>
        </Link>
        <Link href="/admin?tab=appointments&status=completed" className={statCard(activeTab === "appointments" && activeStatus === "completed", "border-green-300 ring-green-300")}>
          <p className="text-slate-400 text-sm">Completed </p><p className="text-green-300 text-2xl font-bold">{completed}</p>
        </Link>
        <Link href="/admin?tab=appointments&status=cancelled" className={statCard(activeTab === "appointments" && activeStatus === "cancelled", "border-red-400 ring-red-400")}>
          <p className="text-slate-400 text-sm">Rejected </p><p className="text-red-300 text-2xl font-bold">{rejected}</p>
        </Link>
      </div>

      <div className="flex gap-2 mt-8 flex-wrap">
        <Link href="/admin?tab=doctors" className={tabStyle("doctors")}>Doctors ({totalDoctors})</Link>
        <Link href="/admin?tab=patients" className={tabStyle("patients")}>Patients ({totalPatients})</Link>
        <Link href="/admin?tab=appointments&status=all" className={tabStyle("appointments")}>Appointments ({total})</Link>
      </div>

      {activeTab === "doctors" && (
        <div className="grid gap-4 mt-6">
          <AddDoctorForm />

          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 flex justify-between items-center flex-wrap gap-3">
            <div>
              <p className="text-white font-bold text-sm">Fix Doctor Pictures</p>
              <p className="text-slate-400 text-xs mt-1">You get {dbDoctors.length} doctors. Click to put their pictures + bio back into DB.</p>
            </div>
            <SeedDoctorsButton />
          </div>

          {dbDoctors.map((d: any) => (
            <div key={d._id.toString()} className="bg-slate-800 rounded-2xl p-5 border border-slate-700 flex justify-between gap-4">
              <div><p className="font-bold text-white">{d.name}</p><p className="text-slate-400 text-sm">{d.email} • {d.specialty || "Doctor"}</p><p className="text-slate-500 text-xs mt-1">{appointments.filter((a: any) => a.doctorName === d.name || a.doctorId === d._id.toString()).length} appointments</p></div>
              <div className="flex gap-2 items-start shrink-0">
                <ViewDoctorButton doctor={JSON.parse(JSON.stringify(d))} apptCount={appointments.filter((a: any) => a.doctorName === d.name || a.doctorId === d._id.toString()).length} />
                <EditDoctorButton doctor={JSON.parse(JSON.stringify(d))} />
                <DeleteUserButton id={d._id.toString()} name={d.name} />
              </div>
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
        <div className="mt-6">
          <div className="flex gap-2 flex-wrap items-center">
            {filterPill("all", "All", total)}
            {filterPill("pending", "Pending", pending)}
            {filterPill("confirmed", "Accepted", accepted)}
            {filterPill("completed", "Completed", completed)}
            {filterPill("cancelled", "Rejected", rejected)}
            <span className="text-slate-500 text-xs ml-2">Showing {filteredAppointments.length} of {total} appointments</span>
          </div>

          <div className="grid gap-4 mt-4">
            {filteredAppointments.length === 0 && <p className="text-slate-400">No {activeStatus === "all" ? "" : activeStatus} appointments found.</p>}
            {filteredAppointments.map((a: any) => (
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
        </div>
      )}
    </div>
  );
}