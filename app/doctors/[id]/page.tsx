import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BadgeCheck, CalendarDays, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { doctors as fallbackDoctors } from "../../data/doctors";

const ALL_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default async function DoctorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();

  let doctor: any = null;

  try {
    doctor = await User.findById(id).lean();
  } catch {}
  if (!doctor) {
    doctor = await User.findOne({ doctorId: id }).lean();
  }

  if (doctor) {
    doctor = {
      id: doctor._id.toString(),
      name: doctor.name,
      specialty: doctor.specialty || "General Practitioner",
      image: doctor.image || "",
      experience: doctor.experience || "",
      bio: doctor.bio || "",
      about: doctor.bio || "",
      qualifications: doctor.qualifications || [],
      availability: doctor.availability || ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      nextSlots: doctor.nextSlots || [],
      email: doctor.email,
      next: "Available Today",
    };
  } else {
    const found = fallbackDoctors.find((d: any) => String(d.id) === String(id));
    if (found) doctor = found;
  }

  if (!doctor) return notFound();

  const initial = doctor.name?.replace(/^Dr\.\s*/i, "")?.charAt(0) || "D";
  const hasImage = doctor.image && doctor.image !== "";
  const qualifications = doctor.qualifications?.length > 0 ? doctor.qualifications : ["MBBS - Registered Medical Doctor", "Licensed and verified by MedCare"];
  const availability: string[] = doctor.availability?.length > 0 ? doctor.availability : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const nextSlots: string[] = doctor.nextSlots?.length > 0 ? doctor.nextSlots : [doctor.next || "Available Today"];

  return (
    <div className="max-w-6xl mx-auto px-5 py-10 w-full">
      <Link href="/doctors" className="text-teal-400 text-sm flex items-center gap-1"><ArrowLeft size={15} /> Back to doctors</Link>

      {/* TOP CARD - Same as before */}
      <div className="grid md:grid-cols-2 gap-8 mt-6 bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
        <div className="relative h-80 md:h-full min-h-80 w-full bg-slate-700">
          {hasImage ? (
            <Image src={doctor.image} alt={doctor.name} fill className="object-cover object-top" />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-teal-400 to-slate-700 flex items-center justify-center">
              <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center text-slate-900 font-bold text-5xl">{initial}</div>
            </div>
          )}
        </div>
        <div className="p-6 md:p-8">
          <span className="bg-teal-400/20 text-teal-300 text-xs font-bold px-3 py-1 rounded-full">{doctor.specialty}</span>
          <h1 className="text-3xl font-bold text-white mt-4">{doctor.name}</h1>
          <p className="text-slate-400 text-sm mt-2">{doctor.experience} years experience</p>
          <p className="text-slate-300 mt-4 leading-relaxed">{doctor.about || doctor.bio}</p>
          <p className="text-teal-400 text-sm font-bold mt-6 flex items-center gap-1.5"><Clock size={15} /> Next: {doctor.next || "Available Today"}</p>
          <Link href={`/book?doctor=${doctor.id}`} className="block text-center mt-6 bg-teal-400 text-slate-900 font-bold px-6 py-3 rounded-lg">Book Appointment</Link>
        </div>
      </div>

      {/* BOTTOM - NEW: About + Qualifications + Availability + Next Times */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h2 className="text-lg font-bold text-white">About {doctor.name}</h2>
          <p className="text-slate-300 text-sm leading-relaxed mt-3">{doctor.about || doctor.bio || "This doctor provides professional, patient-focused care."}</p>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h2 className="text-lg font-bold text-white">Qualifications</h2>
          <div className="space-y-3 mt-4">
            {qualifications.map((q: string) => (
              <p key={q} className="flex items-start gap-2 text-slate-300 text-sm"><BadgeCheck size={18} className="text-teal-400 shrink-0 mt-0.5" /> {q}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 mt-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2"><CalendarDays size={18} className="text-teal-400" /> Availability</h2>
        <div className="flex flex-wrap gap-2 mt-4">
          {ALL_DAYS.map((day) => {
            const active = availability.includes(day);
            return (
              <span key={day} className={active ? "bg-teal-400 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full" : "bg-slate-900 text-slate-500 text-xs font-bold px-3 py-1.5 rounded-full border border-slate-700"}>{day}</span>
            );
          })}
        </div>

        <h3 className="text-white font-bold mt-6">Next open times</h3>
        <div className="flex flex-wrap gap-2 mt-3">
          {nextSlots.map((slot: string) => (
            <Link key={slot} href={`/book?doctor=${doctor.id}`} className="bg-slate-900 border border-slate-700 hover:border-teal-400 text-slate-200 text-sm font-bold px-4 py-2 rounded-lg flex items-center gap-1">{slot} <ArrowRight size={14} className="text-teal-400" /></Link>
          ))}
        </div>
      </div>
    </div>
  );
}