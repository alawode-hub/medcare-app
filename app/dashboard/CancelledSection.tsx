"use client";

import { useState } from "react";
import { ChevronDown, Trash2 } from "lucide-react";
import { deleteCancelledAppointment } from "../../actions/appointment";

export default function CancelledSection({ cancelled }: { cancelled: any[] }) {
  const [list, setList] = useState(cancelled);
  const [open, setOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (list.length === 0) return null;

  async function handleRemove(id: string) {
    const confirmDelete = window.confirm("Are you sure you want to remove this cancelled appointment?");
    if (!confirmDelete) return;
    setDeletingId(id);
    const result = await deleteCancelledAppointment(id);
    if (result?.success) {
      setList((prev) => prev.filter((a) => String(a._id) !== String(id)));
    }
    setDeletingId(null);
  }

  return (
    <div className="mt-6">
      <button onClick={() => setOpen(!open)} className="text-slate-400 text-sm font-bold flex items-center gap-1">
        Cancelled ({list.length}) <ChevronDown size={14} className={open ? "rotate-180" : ""} />
      </button>

      {open && (
        <div className="space-y-2 mt-3">
          {list.map((a: any) => (
            <div key={a._id} className="bg-slate-800/50 rounded-xl px-4 py-3 flex items-center justify-between border border-slate-700 opacity-70">
              <div>
                <p className="font-bold line-through text-white text-sm">{a.doctorName} • {a.specialty}</p>
                <p className="text-slate-400 text-xs mt-0.5">{a.date}, {a.time} • Cancelled</p>
              </div>
              <button
                onClick={() => handleRemove(a._id)}
                disabled={deletingId === String(a._id)}
                className="text-slate-500 hover:text-red-400 flex items-center gap-1 text-xs font-bold shrink-0"
              >
                <Trash2 size={14} /> {deletingId === String(a._id) ? "Removing..." : "Remove"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}