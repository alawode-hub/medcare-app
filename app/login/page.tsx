"use client";
import { useActionState, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { loginUser } from "../../actions/user";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginUser, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex-1 flex items-center justify-center px-5 py-8">
      <main className="w-full max-w-md">
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h1 className="text-white text-2xl font-bold text-center">Welcome Back</h1>
          <p className="text-slate-400 text-sm text-center mt-1">Login to MedCare</p>

          <form action={formAction} className="flex flex-col gap-4 mt-6">
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
                placeholder="Password"
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

            {state?.error && <p className="text-red-400 text-sm text-center">{state.error}</p>}

            <button
              disabled={isPending}
              className="w-full bg-teal-400 text-slate-900 font-bold p-3 rounded-lg"
            >
              {isPending ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-slate-400 text-sm text-center mt-4">
            No account yet? <Link href="/register" className="text-teal-400 font-bold">Create an account</Link>
          </p>
        </div>
      </main>
    </div>
  );
}