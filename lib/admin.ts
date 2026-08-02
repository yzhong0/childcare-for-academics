import { cookies } from "next/headers";

const COOKIE = "childcare_admin";

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "childcare-admin";
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return store.get(COOKIE)?.value === adminPassword();
}

export async function setAdminCookie(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, adminPassword(), {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
    path: "/",
  });
}

export async function clearAdminCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}
