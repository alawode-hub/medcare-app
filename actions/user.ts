"use server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectDB } from "../lib/mongodb";
import User from "../models/User";

const TEST_ACCOUNTS: Record<string, string> = {
  "admin@medcare.com": "Admin MedCare",
  "adaeze@medcare.com": "Dr. Adaeze Nwosu",
  "fatima@medcare.com": "Dr. Fatima Al-Sayed",
  "priya@medcare.com": "Dr. Priya Raman",
  "marcus@medcare.com": "Dr. Marcus Bellamy",
  "kenji@medcare.com": "Dr. Kenji Tanaka",
  "sofia@medcare.com": "Dr. Sofia Reyes",
};

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
  if (exists) return { error: "Email don register before. Go login." };

  const hashed = await bcrypt.hash(password, 10);
  await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashed,
  });

  // No auto-login, no cookie here - make user go login so browser fit ask Save Password
  return { success: "Account created successfully! Redirecting you to login..." };
}

export async function loginUser(prevState: any, formData: FormData) {
  const email = (formData.get("email") as string)?.toLowerCase().trim();
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "Fill all fields" };
  if (password.length < 8) return { error: "Password must be at least 8 characters" };

  await connectDB();
  let user = await User.findOne({ email });

  if (!user && TEST_ACCOUNTS[email]) {
    const hashed = await bcrypt.hash(password, 10);
    user = await User.create({
      name: TEST_ACCOUNTS[email],
      email,
      password: hashed,
    });
  }

  if (!user) return { error: "No user with this email" };
  const isCorrect = await bcrypt.compare(password, user.password);
  if (!isCorrect) return { error: "Wrong password" };

  (await cookies()).set("medcare_user", JSON.stringify({ id: user._id.toString(), name: user.name, email: user.email }), { httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: "/" });

  if (email === "admin@medcare.com") redirect("/admin");
  if (TEST_ACCOUNTS[email]) redirect("/doctor");
  redirect("/dashboard");
}

export async function logoutUser() {
  (await cookies()).delete("medcare_user");
  redirect("/");
}