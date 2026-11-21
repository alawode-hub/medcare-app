import Link from "next/link";

export default function Navbar({ user }: { user?: any }) {
  const clean = user?.name?.replace(/^Dr\.\s*/i, "").trim() || "";
  const first = clean.split(" ")[0] || "";
  const hiName = user?.role === "doctor" ? `Dr. ${first}` : first;

  const dashboardLink =
    user?.role === "admin" ? { href: "/admin", label: "Admin" } :
    user?.role === "doctor" ? { href: "/doctor", label: "Doctor" } :
    { href: "/dashboard", label: "Appointments" };

  return (
    <nav className="flex justify-between items-center px-5 py-4 max-w-6xl mx-auto w-full">
      <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white">
        <span className="bg-teal-400 text-slate-900 w-8 h-8 flex items-center justify-center rounded-lg text-xl">+</span>
        MedCare
      </Link>
      <div className="flex gap-5 text-sm items-center">
        <Link href="/" className="text-teal-400">Home</Link>
        <Link href="/doctors" className="text-white/80">Doctors</Link>

        {user && (
          <Link href={dashboardLink.href} className="text-white/80">{dashboardLink.label}</Link>
        )}

        {user ? (
          <span className="text-white/80">Hi, {hiName}</span>
        ) : (
          <Link href="/login" className="text-white/80">Login</Link>
        )}

        {!user && (
          <Link href="/register" className="bg-teal-400 text-slate-900 px-4 py-2 rounded-lg font-bold">Register</Link>
        )}
      </div>
    </nav>
  );
}