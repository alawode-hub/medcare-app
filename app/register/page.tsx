"use client";
import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { registerUser } from "../../actions/user";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerUser, null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (state?.success) {
      const t = setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [state?.success]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    const password = (form.elements.namedItem("password") as HTMLInputElement)?.value;
    if (password !== confirmPassword) {
      e.preventDefault();
      setLocalError("Passwords no match");
      return;
    }
    setLocalError("");
  }

  return (
    <div className="flex-1 flex items-center justify-center px-5 py-8">
      <main className="w-full max-w-md">
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h1 className="text-white text-2xl font-bold text-center">Create Account</h1>
          <p className="text-slate-400 text-sm text-center mt-1">Join MedCare in a minute</p>

          <form action={formAction} onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
            <input
              name="name"
              placeholder="Full Name"
              required
              className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-lg outline-none"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-lg outline-none"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create password"
                required
                className="w-full bg-slate-900 border border-slate-700 text-white p-3 pr-12 rounded-lg outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-teal-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
                className="w-full bg-slate-900 border border-slate-700 text-white p-3 pr-12 rounded-lg outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3 text-slate-400 hover:text-teal-400"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {(localError || state?.error) && <p className="text-red-400 text-sm text-center">{localError || state?.error}</p>}
            {state?.success && <p className="text-green-400 text-sm text-center">{state.success}</p>}

            <button
              disabled={isPending}
              className="w-full bg-teal-400 text-slate-900 font-bold p-3 rounded-lg"
            >
              {isPending ? "Creating..." : "Create Account"}
            </button>
          </form>

          <p className="text-slate-400 text-sm text-center mt-4">
            Already have an account? <Link href="/login" className="text-teal-400 font-bold">Login</Link>
          </p>
        </div>
      </main>
    </div>
  );
}