"use client";
import { useState, useEffect } from "react";
import { cancelAppointment, updateAppointment, getBookedSlots } from "../../actions/appointment";

const allSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"];

export default function AppointmentCard({ appt }: { appt: any }) {
  const [showCancel, setShowCancel] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [date, setDate] = useState(appt.date);
  const [time, setTime] = useState(appt.time);
  const [reason, setReason] = useState(appt.reason || "");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [today, setToday] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setToday(new Date().toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    if (!showEdit || !appt.doctorId || !date) return;
    getBookedSlots(appt.doctorId, date).then(setBookedSlots);
  }, [showEdit, appt.doctorId, date]);

  const handleCancel = async () => {
    setLoading(true);
    await cancelAppointment(appt._id);
    setLoading(false);
    setShowCancel(false);
    window.location.reload();
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData();
    formData.append("id", appt._id);
    formData.append("date", date);
    formData.append("time", time);
    formData.append("reason", reason);
    const result = await updateAppointment(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    setLoading(false);
    setShowEdit(false);
    window.location.reload();
  };

  return (
    <>
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <p className="font-bold text-white">{appt.doctorName} • {appt.specialty}</p>
          <p className="text-slate-400 text-sm mt-1">{appt.date}, {appt.time} • <span className="text-teal-400 font-bold capitalize">{appt.status}</span></p>
          {appt.reason && <p className="text-slate-400 text-sm mt-1">Reason: {appt.reason}</p>}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowEdit(true)} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-bold">Edit</button>
          <button onClick={() => setShowCancel(true)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold">Cancel</button>
        </div>
      </div>

      
      {showCancel && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-sm border border-slate-700">
            <h3 className="font-bold text-lg text-white">Cancel appointment?</h3>
            <p className="text-slate-400 text-sm mt-2">Are you sure you want to cancel your appointment with {appt.doctorName} on {appt.date}, {appt.time}?</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowCancel(false)} className="flex-1 bg-slate-700 text-white py-2.5 rounded-xl text-sm font-bold">Keep it</button>
              <button onClick={handleCancel} disabled={loading} className="flex-1 bg-red-500 text-white py-2.5 rounded-xl text-sm font-bold disabled:opacity-50">{loading ? "Cancelling..." : "Yes, Cancel"}</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT SIDE */}
      {showEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleUpdate} className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-700">
            <h3 className="font-bold text-lg text-white">Edit appointment</h3>
            <p className="text-slate-400 text-sm mt-1">{appt.doctorName} • {appt.specialty}</p>
            {error && <p className="bg-red-500/20 text-red-300 text-sm p-3 rounded-lg mt-4">{error}</p>}

            <label className="block text-sm font-bold text-white mt-5 mb-2">Pick a date</label>
            <input type="date" value={date} min={today} onChange={(e) => setDate(e.target.value)} required className="w-full bg-slate-900 p-3 rounded-xl text-sm text-white outline-none border border-slate-700" />

            <label className="block text-sm font-bold text-white mt-5 mb-2">Pick a time</label>
            <div className="grid grid-cols-3 gap-2">
              {allSlots.map((slot) => {
                const isBooked = bookedSlots.includes(slot) && slot !== appt.time;
                if (isBooked) {
                  return <div key={slot} className="bg-red-500/20 border border-red-500/30 text-center py-2.5 rounded-xl text-xs text-red-300 font-bold">{slot} - Booked</div>;
                }
                return (
                  <button type="button" key={slot} onClick={() => setTime(slot)} className={`py-2.5 rounded-xl text-xs font-bold border ${time === slot ? "bg-teal-400 text-slate-900 border-teal-400" : "bg-slate-900 text-white border-slate-700"}`}>{slot}</button>
                );
              })}
            </div>

            <label className="block text-sm font-bold text-white mt-5 mb-2">Reason for visit</label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} placeholder="e.g I have tooth pain..." className="w-full bg-slate-900 p-3 rounded-xl text-sm text-white outline-none border border-slate-700" />

            <div className="flex gap-3 mt-6">
              <button type="button" onClick={() => setShowEdit(false)} className="flex-1 bg-slate-700 text-white py-3 rounded-xl text-sm font-bold">Close</button>
              <button disabled={loading} className="flex-1 bg-teal-400 text-slate-900 py-3 rounded-xl text-sm font-bold disabled:opacity-50">{loading ? "Saving..." : "Save Changes"}</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}