import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BadgeCheck, CalendarDays, Clock, ArrowLeft, MapPin } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { doctors as fallbackDoctors } from "../../data/doctors";

const ALL_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DEFAULTS_BY_SPECIALTY: Record<string, { about: string; qualifications: string[]; availability: string[] }> = {
  "General Practitioner": {
    about: "Provides check-ups, everyday illness care and preventive health for the whole family. Focuses on clear explanations, early detection and helping patients stay healthy between visits.",
    qualifications: ["MBBS - University of Lagos", "MSc Family Medicine", "Member, Nigerian Medical Association"],
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  },
  Gynecologist: {
    about: "Provides routine women's health, pregnancy care and family planning advice. Known for a calm, respectful approach and for explaining every step clearly.",
    qualifications: ["MBBS - Kwara State University", "FWACS Obstetrics & Gynaecology", "Certificate in Maternal Health"],
    availability: ["Mon", "Tue", "Wed", "Fri", "Sat"],
  },
  Dentist: {
    about: "Provides cleanings, fillings, braces and gentle care for nervous patients. Makes dental visits comfortable and explains treatment options in simple language.",
    qualifications: ["BDS - Kwara State University", "MSc Orthodontics", "Member, Nigerian Dental Association"],
    availability: ["Mon", "Tue", "Thu", "Fri", "Sat"],
  },
  Cardiologist: {
    about: "Specialises in heart rhythm, blood pressure and cholesterol, with a focus on prevention. Helps patients understand their heart health and build long-term healthy habits.",
    qualifications: ["MBBS - University of Lagos", "FWACP Cardiology", "Fellow, Nigerian Cardiac Society"],
    availability: ["Mon", "Wed", "Thu", "Fri", "Sat"],
  },
  Pediatrician: {
    about: "Provides newborn checks, vaccinations and care for children through their teens. Parents trust him for patient, friendly care and practical advice at every stage.",
    qualifications: ["MBBS - Obafemi Awolowo University", "FWACP Paediatrics", "Certificate in Child Nutrition"],
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  },
  Dermatologist: {
    about: "Treats skin, hair and nails, including acne, eczema and mole checks. Focuses on gentle treatments and clear skincare plans patients can follow at home.",
    qualifications: ["MBBS - Kwara State University", "MSc Dermatology", "Member, Nigerian Association of Dermatologists"],
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  },
};

const DEFAULT_WORKING_HOURS = "9:00 AM - 4:00 PM, 30-minute appointments. Lunch break 12:00 PM - 1:00 PM.";
const DEFAULT_SLOTS = [
  { time: "9:00 AM", date: "Mon, Nov 23" },
  { time: "9:30 AM", date: "Mon, Nov 23" },
  { time: "9:00 AM", date: "Tue, Nov 24" },
  { time: "9:30 AM", date: "Tue, Nov 24" },
  { time: "9:00 AM", date: "Wed, Nov 25" },
  { time: "9:30 AM", date: "Wed, Nov 25" },
];

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
    const specialty = doctor.specialty || "General Practitioner";
    const defaults = DEFAULTS_BY_SPECIALTY[specialty] || DEFAULTS_BY_SPECIALTY["General Practitioner"];
    const aboutText = doctor.about || doctor.bio;
    doctor = {
      id: doctor._id.toString(),
      name: doctor.name,
      specialty,
      image: doctor.image || "",
      experience: doctor.experience || "",
      bio: doctor.bio || "",
      about: aboutText && aboutText.length > 80 ? aboutText : defaults.about,
      qualifications: doctor.qualifications?.length > 0 ? doctor.qualifications : defaults.qualifications,
      availability: doctor.availability?.length > 0 ? doctor.availability : defaults.availability,
      workingHours: doctor.workingHours || DEFAULT_WORKING_HOURS,
      nextSlots: doctor.nextSlots?.length > 0 ? doctor.nextSlots : DEFAULT_SLOTS,
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
  const qualifications = doctor.qualifications;
  const availability: string[] = doctor.availability;
  const workingHours = doctor.workingHours || DEFAULT_WORKING_HOURS;
  const nextSlots = (doctor.nextSlots || DEFAULT_SLOTS).map((s: any) =>
    typeof s === "string" ? { time: s, date: "" } : s
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-5 py-5 w-full">
      <Link href="/doctors" className="text-teal-400 text-xs sm:text-sm flex items-center gap-1">
        <ArrowLeft size={14} /> Back to doctors
      </Link>

      <div className="grid lg:grid-cols-[320px_1fr] gap-4 mt-4 items-start">
        <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 lg:sticky lg:top-4">
          <div className="relative h-56 sm:h-64 w-full bg-slate-700">
            {hasImage ? (
              <Image src={doctor.image} alt={doctor.name} fill className="object-cover object-top" />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-teal-400 to-slate-700 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-slate-900 font-bold text-4xl">{initial}</div>
              </div>
            )}
            <span className="absolute bottom-2 left-2 bg-teal-400 text-slate-900 text-[11px] font-bold px-2.5 py-1 rounded-full">{doctor.specialty}</span>
          </div>
          <div className="p-4">
            <h1 className="text-xl font-bold text-white leading-tight">{doctor.name}</h1>
            <p className="text-slate-400 text-xs mt-1">{doctor.experience} years experience</p>
            <p className="text-slate-400 text-xs mt-1 flex items-center gap-1">
              <MapPin size={12} className="text-teal-400" /> MedCare Clinic, Abuja
            </p>
            <p className="text-teal-400 text-xs font-bold mt-3 flex items-center gap-1.5">
              <Clock size={13} /> Next: {doctor.next || "Available Today"}
            </p>
            <Link href={`/book?doctor=${doctor.id}`} className="block text-center mt-3 bg-teal-400 text-slate-900 font-bold text-sm px-4 py-2.5 rounded-lg">
              Book Appointment
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <h2 className="text-base font-bold text-white">About {doctor.name}</h2>
            <p className="text-slate-300 text-[13px] leading-relaxed mt-2">{doctor.about}</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <h2 className="text-base font-bold text-white">Qualifications</h2>
            <div className="space-y-2 mt-3">
              {qualifications.map((q: string) => (
                <p key={q} className="flex items-start gap-2 text-slate-300 text-[13px]">
                  <BadgeCheck size={16} className="text-teal-400 shrink-0 mt-0.5" /> {q}
                </p>
              ))}
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CalendarDays size={16} className="text-teal-400" /> Availability
            </h2>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {ALL_DAYS.map((day) => {
                const active = availability.includes(day);
                return (
                  <span
                    key={day}
                    className={
                      active
                        ? "bg-teal-400 text-slate-900 text-[11px] font-bold px-2.5 py-1 rounded-full"
                        : "bg-slate-900 text-slate-500 text-[11px] font-bold px-2.5 py-1 rounded-full border border-slate-700"
                    }
                  >
                    {day}
                  </span>
                );
              })}
            </div>
            <p className="text-slate-400 text-xs mt-2.5 leading-relaxed">{workingHours}</p>

            <h3 className="text-white text-sm font-bold mt-4">Next open times</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
              {nextSlots.map((slot: any, i: number) => (
                <Link
                  key={i}
                  href={`/book?doctor=${doctor.id}`}
                  className="bg-slate-900 border border-slate-700 hover:border-teal-400 rounded-lg px-3 py-2 block"
                >
                  <span className="block text-white text-[13px] font-bold">{slot.time}</span>
                  {slot.date && <span className="block text-slate-400 text-[11px] mt-0.5">{slot.date}</span>}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}