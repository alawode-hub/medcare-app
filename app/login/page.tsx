"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }
    window.location.href = "/dashboard";
  }

  return (
    <main className="max-w-md mx-auto px-5 py-10">
      <div className="bg-slate-800 rounded-2xl p-6">
        <h1 className="text-white text-2xl font-bold text-center">Welcome Back</h1>
        <p className="text-slate-400 text-sm text-center mt-1">Login to MedCare</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-lg outline-none"
          />

          {/* PASSWORD - REAL EYE ICON */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            disabled={loading}
            className="w-full bg-teal-400 text-slate-900 font-bold p-3 rounded-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-slate-400 text-sm text-center mt-4">
          No account yet? <Link href="/register" className="text-teal-400 font-bold">Create an account</Link>
        </p>
      </div>
    </main>
  );
}