"use server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectDB } from "../lib/mongodb";
import User from "../models/User";

export async function registerUser(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) return { error: "Fill all fields" };
  if (name.trim().length < 3) return { error: "Name must be at least 3 characters" };
  if (!email.includes("@")) return { error: "Enter valid email" };
  if (password.length < 8) return { error: "Password must be at least 8 characters" };
  if (password.length > 30) return { error: "Password too long, max 30 characters" };

  await connectDB();
  const exists = await User.findOne({ email: email.toLowerCase().trim() });
  if (exists) return { error: "Email has been registered before. Go login." };

  const hashed = await bcrypt.hash(password, 10);
  await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashed,
    role: "patient", 
  });

  return { success: "Account created successfully! Redirecting you to login..." };
}

export async function loginUser(prevState: any, formData: FormData) {
  const email = (formData.get("email") as string)?.toLowerCase().trim();
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "Fill all fields" };

  await connectDB();
  const user = await User.findOne({ email });
  if (!user) return { error: "No user with this email" };

  const isCorrect = await bcrypt.compare(password, user.password);
  if (!isCorrect) return { error: "Wrong password" };

 
  (await cookies()).set("medcare_user", JSON.stringify({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role || "patient",
    doctorId: user.doctorId || null,
  }), { httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: "/" });

  if (user.role === "admin") redirect("/admin");
  if (user.role === "doctor") redirect("/doctor");
  redirect("/dashboard");
}

export async function logoutUser() {
  (await cookies()).delete("medcare_user");
  redirect("/");
}