"use server";
import { connection } from "next/server";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { connectDB } from "../lib/mongodb";
import User from "../models/User";
import { getCurrentUser } from "../lib/auth";

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
  // Give doctor him own doctorId so him appointments go match
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