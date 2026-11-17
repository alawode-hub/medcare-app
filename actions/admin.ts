"use server";
import { connection } from "next/server";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { connectDB } from "../lib/mongodb";
import User from "../models/User";
import { getCurrentUser } from "../lib/auth";

const staticDoctors = [
  { name: "Dr. Bam Adams", specialty: "General Practitioner" },
  { name: "Dr. Bayo Marcus", specialty: "Cardiologist" },
  { name: "Dr. Jerry Dotun", specialty: "Dermatologist" },
  { name: "Dr. Felix Ade", specialty: "Pediatrician" },
  { name: "Dr. Fatima Ajibade", specialty: "Gynecologist" },
  { name: "Dr. Shola Adeniji", specialty: "Dentist" },
];


async function checkAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") throw new Error("Not admin");
  return user;
}

export async function addDoctor(formData: FormData) {
  await connection();
  await checkAdmin();
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const specialty = (formData.get("specialty") as string)?.trim();

  if (!name || !email || !password || !specialty) {
    return { error: "Fill all fields - name, email, password, specialty" };
  }
  await connectDB();
  const exists = await User.findOne({ email });
  if (exists) return { error: "This email don already exist" };

  const hashed = await bcrypt.hash(password, 10);
  const newDoctor = await User.create({
    name: name.startsWith("Dr.") ? name : `Dr. ${name}`,
    email,
    password: hashed,
    role: "doctor",
    specialty,
  });
  newDoctor.doctorId = newDoctor._id.toString();
  await newDoctor.save();

  revalidatePath("/admin");
  return { success: true };
}

export async function deleteUser(userId: string) {
  await connection();
  const admin = await checkAdmin();
  await connectDB();
  if (userId === admin.id) return { error: "You no fit delete yourself" };
  await User.findByIdAndDelete(userId);
  revalidatePath("/admin");
  return { success: true };
}

// OPTION C: Move 6 static doctors enter DB once
export async function seedDoctors() {
  await connection();
  await checkAdmin();
  await connectDB();

  let added = 0;
  const hashed = await bcrypt.hash("doctor123", 10);

  for (const d of staticDoctors) {
    const cleanName = d.name.replace(/^Dr\.\s*/i, "").trim();
    // Make email from name: e.g "Bam Adams" -> "bam.adams@medcare.com"
    const email = `${cleanName.toLowerCase().replace(/[^a-z]+/g, ".").replace(/^\.|\.$/g, "")}@medcare.com`;
    const exists = await User.findOne({ email });
    if (exists) continue;
    // Also check by name, make we no duplicate
    const existsByName = await User.findOne({ name: d.name });
    if (existsByName) continue;

    const newDoctor = await User.create({
      name: d.name,
      email,
      password: hashed,
      role: "doctor",
      specialty: d.specialty,
    });
    newDoctor.doctorId = newDoctor._id.toString();
    await newDoctor.save();
    added++;
  }

  revalidatePath("/admin");
  return { added, totalStatic: staticDoctors.length };
}