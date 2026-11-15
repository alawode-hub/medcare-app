import { cookies } from "next/headers";

export const ADMIN_EMAIL = "admin@medcare.com";

export const DOCTOR_EMAILS: Record<string, string> = {
  "adaeze@medcare.com": "1",
  "fatima@medcare.com": "2",
  "priya@medcare.com": "3",
  "marcus@medcare.com": "4",
  "kenji@medcare.com": "5",
  "sofia@medcare.com": "6",
};

export type Role = "patient" | "doctor" | "admin";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("medcare_user");
  if (!cookie) return null;
  try {
    const user = JSON.parse(cookie.value) as { id: string; name: string; email: string };
    let role: Role = "patient";
    let doctorId: string | null = null;

    if (user.email === ADMIN_EMAIL) {
      role = "admin";
    } else if (DOCTOR_EMAILS[user.email]) {
      role = "doctor";
      doctorId = DOCTOR_EMAILS[user.email];
    }

    return { ...user, role, doctorId };
  } catch {
    return null;
  }
}