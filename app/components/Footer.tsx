import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-800 px-5 py-10 border-t border-slate-700">
      <div className="max-w-6xl mx-auto grid sm:grid-cols-4 gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 bg-teal-400 rounded-lg flex items-center justify-center text-slate-900 text-xl font-bold">+</span>
            <p className="font-bold text-lg text-white">Med<span className="text-teal-400">Care</span></p>
          </div>
          <p className="text-slate-400 text-sm mt-2">Online clinic appointments with trusted doctors, booked in a minute.</p>
        </div>

        <div>
          <p className="font-bold text-white">Explore</p>
          <div className="flex flex-col gap-2 mt-2">
            <Link href="/" className="text-slate-400 text-sm hover:text-teal-400">Home</Link>
            <Link href="/doctors" className="text-slate-400 text-sm hover:text-teal-400">Find a doctor</Link>
            <Link href="/dashboard" className="text-slate-400 text-sm hover:text-teal-400">My appointments</Link>
            <Link href="/login" className="text-slate-400 text-sm hover:text-teal-400">Login</Link>
            <Link href="/register" className="text-slate-400 text-sm hover:text-teal-400">Create an account</Link>
          </div>
        </div>

        <div>
          <p className="font-bold text-white">Specialties</p>
          <div className="flex flex-col gap-2 mt-2">
            <Link href="/doctors?specialty=General Practitioner" className="text-slate-400 text-sm hover:text-teal-400">General Practitioner</Link>
            <Link href="/doctors?specialty=Dentist" className="text-slate-400 text-sm hover:text-teal-400">Dentist</Link>
            <Link href="/doctors?specialty=Cardiologist" className="text-slate-400 text-sm hover:text-teal-400">Cardiologist</Link>
            <Link href="/doctors?specialty=Dermatologist" className="text-slate-400 text-sm hover:text-teal-400">Dermatologist</Link>
            <Link href="/doctors?specialty=Pediatrician" className="text-slate-400 text-sm hover:text-teal-400">Pediatrician</Link>
          </div>
        </div>

        <div>
          <p className="font-bold text-white">Contact</p>
          <p className="text-slate-400 text-sm mt-2 leading-6">09067199520<br/>hello@medcare.com<br/>NO 13 Lekki Epe Road<br/>Mon-Sat, 8:00 AM - 6:00 PM</p>
        </div>
      </div>
    </footer>
  );
}