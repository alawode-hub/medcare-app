import { cookies } from "next/headers";

export type Role = "patient" | "doctor" | "admin";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("medcare_user");
  if (!cookie) return null;
  try {
    return JSON.parse(cookie.value) as { id: string; name: string; email: string; role: Role; doctorId: string | null };
  } catch {
    return null;
  }
}