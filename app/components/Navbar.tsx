import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-5 py-4 max-w-6xl mx-auto w-full">
      <Link href="/" className="flex items-center gap-2 font-bold text-lg">
        <span className="bg-[#2DD4BF] text-[#0F1E1D] w-8 h-8 flex items-center justify-center rounded-lg text-xl">+</span>
        MedCare
      </Link>
      <div className="flex gap-5 text-sm items-center">
        <Link href="/" className="text-[#2DD4BF]">Home</Link>
        <Link href="/doctors" className="text-white/80">Doctors</Link>
        <Link href="/dashboard" className="text-white/80">Appointments</Link>
        <Link href="/login" className="text-white/80">Login</Link>
        <Link href="/register" className="bg-[#2DD4BF] text-[#0F1E1D] px-4 py-2 rounded-lg font-bold">Register</Link>
      </div>
    </nav>
  );
}