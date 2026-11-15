"use client";
import { useState } from "react";
import { logoutUser } from "../../actions/user";

export default function LogoutButton() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)} className="text-white text-sm bg-red-500 px-4 py-2 rounded-lg">Logout</button>
      {show && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-sm text-center">
            <h2 className="text-white font-bold text-lg">Are you sure?</h2>
            <p className="text-slate-400 text-sm mt-1">You want logout?</p>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShow(false)} className="flex-1 bg-slate-700 text-white py-2 rounded-lg">No</button>
              <form action={logoutUser} className="flex-1">
                <button className="w-full bg-red-500 text-white py-2 rounded-lg">Yes</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}