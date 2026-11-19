import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { doctors as fallbackDoctors } from "../../data/doctors";

export default async function DoctorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();

  let doctor: any = null;

  // Try Mongo _id first, then doctorId
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
      email: doctor.email,
      next: "Available Today",
    };
  } else {
    // Fallback to old static list - for id "1", "2" etc
    const found = fallbackDoctors.find((d: any) => String(d.id) === String(id));
    if (found) doctor = found;
  }

  if (!doctor) return notFound();

  const initial = doctor.name?.replace(/^Dr\.\s*/i, "")?.charAt(0) || "D";
  const hasImage = doctor.image && doctor.image !== "";

  return (
    <div className="max-w-6xl mx-auto px-5 py-10 w-full">
      <Link href="/doctors" className="text-teal-400 text-sm">← Back to doctors</Link>
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
          <p className="text-teal-400 text-sm font-bold mt-6">Next: {doctor.next || "Available Today"}</p>
          <Link href={`/book?doctor=${doctor.id}`} className="block text-center mt-6 bg-teal-400 text-slate-900 font-bold px-6 py-3 rounded-lg">Book Appointment</Link>
        </div>
      </div>
    </div>
  );
}