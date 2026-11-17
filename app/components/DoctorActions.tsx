"use client";
import { updateAppointmentStatus } from "@/actions/appointment";

export default function DoctorActions({ id, status }: { id: string; status: string }) {
  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    const yes = window.confirm("Are you sure you want to REJECT this appointment? The patient will see it as Rejected.");
    if (!yes) return;

    const formData = new FormData();
    formData.append("id", id);
    formData.append("status", "cancelled");
    await updateAppointmentStatus(formData);
  };

  return (
    <div className="flex gap-2 items-start shrink-0">
      {status === "pending" && (
        <>
          <form action={updateAppointmentStatus}>
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="status" value="confirmed" />
            <button className="bg-teal-400 text-slate-900 font-bold px-4 py-2 rounded-lg text-sm">Accept</button>
          </form>
          <form onSubmit={handleReject}>
            <button className="bg-red-500 text-white font-bold px-4 py-2 rounded-lg text-sm">Reject</button>
          </form>
        </>
      )}

      {status === "confirmed" && (
        <>
          <form action={updateAppointmentStatus}>
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="status" value="completed" />
            <button className="bg-green-400 text-slate-900 font-bold px-4 py-2 rounded-lg text-sm">Mark as Done</button>
          </form>
          <form onSubmit={handleReject}>
            <button className="bg-red-500 text-white font-bold px-4 py-2 rounded-lg text-sm">Reject</button>
          </form>
        </>
      )}

      {status === "cancelled" && <p className="text-red-300 text-sm font-bold px-2 py-2">Rejected</p>}
      {status === "completed" && <p className="text-green-300 text-sm font-bold px-2 py-2">Done</p>}
    </div>
  );
}