import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";
import BookForm from "./BookForm";

async function BookWrapper({ doctorId }: { doctorId: string }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  await connectDB();
  const doctors = await User.find({ role: "doctor" }).sort({ name: 1 }).lean();

  const cleanDoctors = doctors.map((d: any) => ({
    id: d._id.toString(),
    name: d.name,
    specialty: d.specialty || "General Practitioner",
  }));

  return <BookForm doctors={cleanDoctors} doctorId={doctorId} />;
}

export default async function BookPage({ searchParams }: { searchParams: Promise<{ doctor?: string }> }) {
  const { doctor } = await searchParams;
  return (
    <Suspense fallback={<div className="max-w-xl mx-auto px-5 py-10 text-slate-400">Loading...</div>}>
      <BookWrapper doctorId={doctor || ""} />
    </Suspense>
  );
}