import { db } from "./db";

export async function getUserById(id: string = "") {
  try {
    const user = await db.user.findUnique({ where: { id } });
    if (!user) return null;
    return user;
  } catch {
    return null;
  }
}

export async function getUserByEmail(email: string) {
  try {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) return null;
    return user;
  } catch {
    return null;
  }
}
