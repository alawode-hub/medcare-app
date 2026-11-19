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

// Helper - validate pic file for server side
async function getImageValue(formData: FormData): Promise<{ image: string; error?: string }> {
  const imageUrl = (formData.get("imageUrl") as string)?.trim() || "";
  const file = formData.get("imageFile") as File | null;

  // If file dey, use file
  if (file && file.size > 0) {
    // 1. Must be image
    if (!file.type.startsWith("image/")) {
      return { image: "", error: "Pic must be image file - JPG, PNG or WEBP" };
    }
    // 2. Only allow jpg, png, webp
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowed.includes(file.type)) {
      return { image: "", error: "Only JPG, PNG or WEBP allowed" };
    }
    // 3. Max 2MB
    if (file.size > 2 * 1024 * 1024) {
      return { image: "", error: "Pic too big - max 2MB" };
    }
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    return { image: `data:${file.type};base64,${base64}` };
  }

  // If na link, validate am small
  if (imageUrl) {
    if (!imageUrl.startsWith("http") && !imageUrl.startsWith("/") && !imageUrl.startsWith("data:image")) {
      return { image: "", error: "Pic link no valid - must start with https:// or /" };
    }
    return { image: imageUrl };
  }

  return { image: "" };
}

export async function addDoctor(formData: FormData) {
  await connection();
  await checkAdmin();
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const specialty = (formData.get("specialty") as string)?.trim();
  const experience = (formData.get("experience") as string)?.trim() || "";
  const bio = (formData.get("bio") as string)?.trim() || "";

  if (!name || !email || !password || !specialty) {
    return { error: "Fill all fields - name, email, password, specialty" };
  }

  // Pic validation for server
  const pic = await getImageValue(formData);
  if (pic.error) return { error: pic.error };

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
    image: pic.image,
    experience,
    bio,
  });
  newDoctor.doctorId = newDoctor._id.toString();
  await newDoctor.save();

  revalidatePath("/admin");
  revalidatePath("/doctors");
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

export async function updateDoctor(formData: FormData) {
  await connection();
  await checkAdmin();
  const id = formData.get("id") as string;
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const specialty = (formData.get("specialty") as string)?.trim();
  const password = (formData.get("password") as string)?.trim();
  const experience = (formData.get("experience") as string)?.trim() || "";
  const bio = (formData.get("bio") as string)?.trim() || "";

  if (!id || !name || !email || !specialty) {
    return { error: "Fill name, email, specialty" };
  }

  const pic = await getImageValue(formData);
  if (pic.error) return { error: pic.error };

  await connectDB();
  const exists = await User.findOne({ email, _id: { $ne: id } });
  if (exists) return { error: "Another user don use this email" };

  const update: any = { name, email, specialty, experience, bio };
  if (pic.image) update.image = pic.image;
  if (password) {
    update.password = await bcrypt.hash(password, 10);
  }
  await User.findByIdAndUpdate(id, update);
  revalidatePath("/admin");
  revalidatePath("/doctors");
  return { success: true };
}

export async function seedDoctors() {
  await connection();
  await checkAdmin();
  await connectDB();

  const fullDoctors = [
    { name: "Dr. Bam Adams", specialty: "General Practitioner", experience: "12", bio: "Check-ups, everyday illness and preventive care for the whole family.", image: "/doctor3.avif" },
    { name: "Dr. Fatima Ajibade", specialty: "Gynecologist", experience: "16", bio: "Routine women's health, pregnancy care and family planning advice.", image: "/doctor2.jpg" },
    { name: "Dr. Shola Adeniji", specialty: "Dentist", experience: "10", bio: "Cleanings, fillings, braces and gentle care for nervous patients.", image: "/doctor1.avif" },
    { name: "Dr. Bayo Marcus", specialty: "Cardiologist", experience: "18", bio: "Heart rhythm, blood pressure and cholesterol, with a focus on prevention.", image: "/doctor4.jpg" },
    { name: "Dr. Felix Ade", specialty: "Pediatrician", experience: "14", bio: "Newborn checks, vaccinations and care for children through their teens.", image: "/doctor5.jpg" },
    { name: "Dr. Jerry Dotun", specialty: "Dermatologist", experience: "9", bio: "Skin, hair and nails - acne, eczema and mole checks.", image: "/doctor6.jpg" },
  ];

  const hashed = await bcrypt.hash("doctor123", 10);
  let added = 0;
  let updated = 0;

  for (const d of fullDoctors) {
    // Find by NAME - this one no go miss, even if email different
    const exists = await User.findOne({ name: d.name, role: "doctor" });

    if (exists) {
      exists.image = d.image;
      exists.experience = d.experience;
      exists.bio = d.bio;
      exists.specialty = d.specialty;
      await exists.save();
      updated++;
      continue;
    }

    const cleanName = d.name.replace(/^Dr\.\s*/i, "").trim();
    const email = `${cleanName.toLowerCase().replace(/[^a-z]+/g, ".").replace(/^\.|\.$/g, "")}@medcare.com`;
    const newDoctor = await User.create({
      name: d.name,
      email,
      password: hashed,
      role: "doctor",
      specialty: d.specialty,
      image: d.image,
      experience: d.experience,
      bio: d.bio,
    });
    newDoctor.doctorId = newDoctor._id.toString();
    await newDoctor.save();
    added++;
  }

  revalidatePath("/admin");
  revalidatePath("/doctors");
  return { added, updated, totalStatic: fullDoctors.length };
}