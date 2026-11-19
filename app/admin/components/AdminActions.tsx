"use client";
import { useState } from "react";
import { deleteUser, seedDoctors, updateDoctor } from "@/actions/admin";

export function DeleteUserButton({ id, name }: { id: string; name: string }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)} className="bg-red-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs">Delete</button>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-white text-lg font-bold">Delete {name}?</h2>
            <p className="text-slate-400 text-sm mt-2">This go delete the user permanently. You sure?</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShow(false)} className="flex-1 bg-slate-700 text-white font-bold py-2.5 rounded-xl text-sm">No, Keep</button>
              <button disabled={loading} onClick={async () => { setLoading(true); await deleteUser(id); setLoading(false); }} className="flex-1 bg-red-500 text-white font-bold py-2.5 rounded-xl text-sm disabled:opacity-50">{loading ? "Deleting..." : "Yes, Delete"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function ViewDoctorButton({ doctor, apptCount }: { doctor: any; apptCount: number }) {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)} className="bg-slate-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs">View</button>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setShow(false)}>
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start">
              <h2 className="text-white text-lg font-bold">Doctor Details</h2>
              <button onClick={() => setShow(false)} className="text-slate-400 text-xl">✕</button>
            </div>
            <div className="mt-4 space-y-3">
              <div className="w-14 h-14 rounded-full bg-teal-400 flex items-center justify-center text-slate-900 font-bold text-xl">{doctor.name?.replace("Dr. ", "")?.charAt(0) || "D"}</div>
              <p className="text-white font-bold text-lg">{doctor.name}</p>
              <div className="bg-slate-900 rounded-xl p-4 space-y-2 text-sm">
                <p className="text-slate-300"><span className="text-slate-500">Email: </span>{doctor.email}</p>
                <p className="text-slate-300"><span className="text-slate-500">Specialty: </span>{doctor.specialty || "Doctor"}</p>
                <p className="text-slate-300"><span className="text-slate-500">Role: </span>{doctor.role}</p>
                <p className="text-slate-300"><span className="text-slate-500">Total Appointments: </span>{apptCount}</p>
                <p className="text-slate-300"><span className="text-slate-500">Joined: </span>{doctor.createdAt ? new Date(doctor.createdAt).toLocaleDateString() : "N/A"}</p>
                <p className="text-slate-300"><span className="text-slate-500">Doctor ID: </span>{doctor.doctorId || doctor._id}</p>
              </div>
              <button onClick={() => setShow(false)} className="w-full bg-teal-400 text-slate-900 font-bold py-2.5 rounded-xl text-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function EditDoctorButton({ doctor }: { doctor: any }) {
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)} className="bg-amber-400 text-slate-900 font-bold px-3 py-1.5 rounded-lg text-xs">Edit</button>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-start">
              <h2 className="text-white text-lg font-bold">Edit Doctor - {doctor.name}</h2>
              <button onClick={() => setShow(false)} className="text-slate-400 text-xl">✕</button>
            </div>
            <form
              action={async (fd) => {
                setError(""); setLoading(true);
                const res = await updateDoctor(fd);
                setLoading(false);
                if (res?.error) setError(res.error);
                else setShow(false);
              }}
              className="mt-4 space-y-3"
            >
              <input type="hidden" name="id" value={doctor._id} />
              <div>
                <label className="text-slate-400 text-xs">Full Name</label>
                <input name="name" defaultValue={doctor.name} required className="w-full mt-1 bg-slate-900 border border-slate-700 p-3 rounded-xl text-white text-sm outline-none" />
              </div>
              <div>
                <label className="text-slate-400 text-xs">Email</label>
                <input name="email" type="email" defaultValue={doctor.email} required className="w-full mt-1 bg-slate-900 border border-slate-700 p-3 rounded-xl text-white text-sm outline-none" />
              </div>
              <div>
                <label className="text-slate-400 text-xs">Specialty</label>
                <select name="specialty" defaultValue={doctor.specialty} required className="w-full mt-1 bg-slate-900 border border-slate-700 p-3 rounded-xl text-white text-sm outline-none">
                  <option value="">Select specialty</option>
                  <option>General Practitioner</option><option>Dentist</option><option>Cardiologist</option><option>Dermatologist</option><option>Pediatrician</option><option>Gynecologist</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 text-xs">New Password (leave empty if you no wan change)</label>
                <input name="password" type="password" placeholder="Leave empty to keep old password" className="w-full mt-1 bg-slate-900 border border-slate-700 p-3 rounded-xl text-white text-sm outline-none" />
              </div>
              {error && <p className="text-red-300 text-sm">{error}</p>}
              <div className="flex gap-3">
                <button type="button" onClick={() => setShow(false)} className="flex-1 bg-slate-700 text-white font-bold py-2.5 rounded-xl text-sm">Cancel</button>
                <button disabled={loading} className="flex-1 bg-teal-400 text-slate-900 font-bold py-2.5 rounded-xl text-sm disabled:opacity-50">{loading ? "Saving..." : "Save Changes"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export function SeedDoctorsButton() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  return (
    <div>
      <button disabled={loading} onClick={async () => { setLoading(true); const res = await seedDoctors(); setLoading(false); setMsg(`Added ${res.added} doctors. Refresh page.`); }} className="bg-teal-400 text-slate-900 font-bold px-4 py-2 rounded-lg text-sm disabled:opacity-50">
        {loading ? "Importing..." : "Import 6 Static Doctors to DB"}
      </button>
      {msg && <p className="text-green-300 text-sm mt-2">{msg}</p>}
    </div>
  );
}