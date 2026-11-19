import { Suspense } from "react";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import DoctorsClient from "./DoctorsClient";
import { doctors as fallbackDoctors } from "../data/doctors";

export default async function DoctorsPage() {
  await connectDB();
  const dbDoctors = await User.find({ role: "doctor" }).sort({ createdAt: -1 }).lean();

  const doctors = dbDoctors.length > 0
    ? dbDoctors.map((d: any) => ({
        id: d._id.toString(),
        name: d.name,
        specialty: d.specialty || "General Practitioner",
        image: d.image || "",
        experience: d.experience || "",
        bio: d.bio || "",
        about: d.bio || "",
        email: d.email,
        next: "Available Today",
      }))
    : fallbackDoctors;

  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-5 py-10 text-slate-400">Loading...</div>}>
      <DoctorsClient doctors={doctors} />
    </Suspense>
  );
}