"use client";
import { useState } from "react";
import { updateAppointmentStatus } from "@/actions/appointment";

export default function DoctorActions({ id, status }: { id: string; status: string }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReject = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("id", id);
    formData.append("status", "cancelled");
    await updateAppointmentStatus(formData);
    setLoading(false);
    setShowConfirm(false);
  };

  return (
    <>
      <div className="flex gap-2 items-start shrink-0">
        {status === "pending" && (
          <>
            <form action={updateAppointmentStatus}>
              <input type="hidden" name="id" value={id} />
              <input type="hidden" name="status" value="confirmed" />
              <button className="bg-teal-400 text-slate-900 font-bold px-4 py-2 rounded-lg text-sm">Accept</button>
            </form>
            <button
              onClick={() => setShowConfirm(true)}
              className="bg-red-500 text-white font-bold px-4 py-2 rounded-lg text-sm"
            >
              Reject
            </button>
          </>
        )}

        {status === "confirmed" && (
          <>
            <form action={updateAppointmentStatus}>
              <input type="hidden" name="id" value={id} />
              <input type="hidden" name="status" value="completed" />
              <button className="bg-green-400 text-slate-900 font-bold px-4 py-2 rounded-lg text-sm">Mark as Done</button>
            </form>
            <button
              onClick={() => setShowConfirm(true)}
              className="bg-red-500 text-white font-bold px-4 py-2 rounded-lg text-sm"
            >
              Reject
            </button>
          </>
        )}

        {status === "cancelled" && <p className="text-red-300 text-sm font-bold px-2 py-2">Rejected</p>}
        {status === "completed" && <p className="text-green-300 text-sm font-bold px-2 py-2">Done</p>}
      </div>

      {/* Fine Modal - No more ugly browser popup */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center text-2xl mb-4">
              ⚠️
            </div>
            <h2 className="text-white text-xl font-bold">Reject Appointment?</h2>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Are you sure you want to reject this appointment? The patient will see it as <span className="text-red-300 font-bold">Rejected</span>.
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2.5 rounded-xl text-sm"
              >
                No, Keep It
              </button>
              <button
                onClick={handleReject}
                disabled={loading}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl text-sm disabled:opacity-50"
              >
                {loading ? "Rejecting..." : "Yes, Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}