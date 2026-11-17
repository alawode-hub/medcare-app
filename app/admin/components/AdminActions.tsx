"use client";
import { useState } from "react";
import { deleteUser } from "@/actions/admin";
import { seedDoctors } from "@/actions/admin";

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

export function SeedDoctorsButton() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  return (
    <div>
      <button
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          const res = await seedDoctors();
          setLoading(false);
          setMsg(`Added ${res.added} doctors. Total static na ${res.totalStatic}. Refresh page.`);
        }}
        className="bg-teal-400 text-slate-900 font-bold px-4 py-2 rounded-lg text-sm disabled:opacity-50"
      >
        {loading ? "Importing..." : "Import 6 Static Doctors to DB"}
      </button>
      {msg && <p className="text-green-300 text-sm mt-2">{msg}</p>}
    </div>
  );
}