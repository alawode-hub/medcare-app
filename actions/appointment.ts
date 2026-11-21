"use server";
import { connection } from 'next/server';
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectDB } from "../lib/mongodb";
import Appointment from "../models/Appointment";
import { getCurrentUser } from "../lib/auth";

export async function bookAppointment(formData: FormData) {
  await connection();
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const doctorId = formData.get("doctorId") as string;
  const doctorName = formData.get("doctorName") as string;
  const specialty = formData.get("specialty") as string;
  const date = formData.get("date") as string;
  const time = formData.get("time") as string;
  const reason = (formData.get("reason") as string) || "";

  if (!doctorId || !date || !time) {
    return { error: "Pick date and time first" };
  }

  if (!reason.trim()) {
    return { error: "Kindly state the reason for your visit" };
  }

  const today = new Date().toISOString().split("T")[0];
  if (date < today) {
    return { error: "You cannot book an appointment for a past date" };
  }

  await connectDB();

  const alreadyBooked = await Appointment.findOne({
    doctorId,
    date,
    time,
    status: { $ne: "cancelled" },
  });

  if (alreadyBooked) {
    return { error: "This particular time is already booked. Pick another time." };
  }

  await Appointment.create({
    patientId: user.id,
    patientName: user.name,
    patientEmail: user.email,
    doctorId,
    doctorName,
    specialty,
    date,
    time,
    reason: reason.trim(),
    status: "pending",
  });

  revalidatePath("/dashboard");
  revalidatePath(`/doctors/${doctorId}`);
  redirect("/dashboard");
}

export async function updateAppointmentStatus(formData: FormData): Promise<void> {
  await connection();
  const user = await getCurrentUser();
  if (!user) return;
  if (user.role === "patient") return;

  const id = formData.get("id") as string;
  const status = formData.get("status") as "confirmed" | "cancelled" | "completed";
  if (!id || !status) return;

  await connectDB();
  const appt = await Appointment.findById(id);
  if (!appt) return;

  if (user.role === "doctor") {
    const clean = (n: string) => n.toLowerCase().replace("dr. ", "").replace("dr ", "").trim();
    const isMyAppointment =
      appt.doctorId === user.doctorId ||
      appt.doctorId === user.id ||
      clean(appt.doctorName || "") === clean(user.name);
    if (!isMyAppointment) return;
  }

  appt.status = status;
  await appt.save();

  revalidatePath("/admin");
  revalidatePath("/doctor");
  revalidatePath("/dashboard");
}

export async function getMyAppointments() {
  await connection();
  const user = await getCurrentUser();
  if (!user) return [];

  await connectDB();
  const list = await Appointment.find({ patientId: user.id })
    .sort({ date: 1, createdAt: -1 })
    .lean();

  return list.map((a: any) => ({
    ...a,
    _id: a._id.toString(),
    createdAt: a.createdAt?.toISOString(),
    updatedAt: a.updatedAt?.toISOString(),
  }));
}

export async function getBookedSlots(doctorId: string, date: string) {
  await connection();
  if (!doctorId || !date) return [];
  await connectDB();
  const list = await Appointment.find({
    doctorId,
    date,
    status: { $ne: "cancelled" },
  }).lean();

  return list.map((a: any) => a.time);
}

export async function cancelAppointment(id: string) {
  await connection();
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  await connectDB();
  const appt = await Appointment.findById(id);
  if (!appt) return { error: " No Appointment " };
  if (appt.patientId !== user.id) {
    return { error: "You cannot cancel another person appointment" };
  }

  appt.status = "cancelled";
  await appt.save();

  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateAppointment(formData: FormData) {
  await connection();
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const id = formData.get("id") as string;
  const date = formData.get("date") as string;
  const time = formData.get("time") as string;
  const reason = (formData.get("reason") as string) || "";

  if (!id || !date || !time) {
    return { error: "Pick date and time first" };
  }

  if (!reason.trim()) {
    return { error: "Kindly state the reason for your visit" };
  }

  const today = new Date().toISOString().split("T")[0];
  if (date < today) {
    return { error: "You no fit pick past date" };
  }

  await connectDB();
  const appt = await Appointment.findById(id);
  if (!appt) return { error: "Appointment no dey" };
  if (appt.patientId !== user.id) {
    return { error: "You can't edit another person appointment" };
  }

  if (appt.date !== date || appt.time !== time) {
    const clash = await Appointment.findOne({
      _id: { $ne: id },
      doctorId: appt.doctorId,
      date,
      time,
      status: { $ne: "cancelled" },
    });
    if (clash) {
      return { error: "This particular time is already booked. Pick another time." };
    }
  }

  appt.date = date;
  appt.time = time;
  appt.reason = reason.trim();
  await appt.save();

  revalidatePath("/dashboard");
  revalidatePath(`/doctors/${appt.doctorId}`);
  return { success: true };
}