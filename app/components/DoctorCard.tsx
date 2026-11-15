import Image from "next/image";
import Link from "next/link";

export default function DoctorCard({ doctor }: { doctor: any }) {
  const imageSrc =
    doctor.image ||
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80";

  return (
    <Link href={`/doctors/${doctor.id}`} className="block bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-teal-400 transition">
      <div className="relative h-56 w-full bg-slate-700">
        <Image
          src={imageSrc}
          alt={doctor.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 33vw"
        />
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2">
          <span className="bg-teal-400/20 text-teal-300 text-xs font-bold px-2.5 py-1 rounded-full">
            {doctor.specialty}
          </span>
          <span className="text-slate-400 text-xs">{doctor.experience} years experience</span>
        </div>

        <h3 className="font-bold text-white text-lg mt-3">{doctor.name}</h3>
        <p className="text-slate-400 text-sm mt-1 line-clamp-2">{doctor.about}</p>

        <p className="text-teal-400 text-sm font-bold mt-4">Next: {doctor.next} →</p>
      </div>
    </Link>
  );
}