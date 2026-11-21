import Image from "next/image";
import Link from "next/link";

export default function DoctorCard({ doctor }: { doctor: any }) {
  const initial = doctor.name?.replace(/^Dr\.\s*/i, "")?.charAt(0) || "D";
  const hasImage = doctor.image && doctor.image !== "";
  const about = doctor.about || doctor.bio || "";
  const expText = doctor.experience ? String(doctor.experience).replace("years", "").trim() : "";

  return (
    <Link href={`/doctors/${doctor.id}`} className="block bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-teal-400 transition">
      <div className="relative h-64 w-full bg-slate-700 overflow-hidden">
        {hasImage ? (
          <Image
            src={doctor.image}
            alt={doctor.name}
            fill
            className="object-cover object-top"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
           <div className="w-full h-full bg-linear-to-br from-teal-400 to-slate-700 flex items-center justify-center">  
           <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-slate-900 font-bold text-4xl">  </div>
         
              {initial}
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2">
          <span className="bg-teal-400/20 text-teal-300 text-xs font-bold px-2.5 py-1 rounded-full">
            {doctor.specialty}
          </span>
          {expText && <span className="text-slate-400 text-xs">{expText} years experience</span>}
        </div>

        <h3 className="font-bold text-white text-lg mt-3">{doctor.name}</h3>
        <p className="text-slate-400 text-sm mt-1 line-clamp-2">{about}</p>

        <p className="text-teal-400 text-sm font-bold mt-4">Next: {doctor.next || "Available Today"} →</p>
      </div>
    </Link>
  );
}