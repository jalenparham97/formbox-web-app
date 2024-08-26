import { type NextRequest } from "next/server";
import { type Prisma } from "@prisma/client";
import { auth } from "@/libs/auth";
import { dayjs } from "@/libs/dayjs";
import { db } from "@/server/db";
import { redirect } from "next/navigation";

async function verifyToken(token: string, email: string) {
  const verificationToken = await db.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken) return false;
  if (dayjs().isAfter(verificationToken.expires)) return false;

  if (email === verificationToken.identifier) return true;

  return false;
}

async function deleteToken(token: string) {
  return await db.verificationToken.delete({ where: { token } });
}

async function updateUser(id: string, updateUserData: Prisma.UserUpdateInput) {
  return await db.user.update({ where: { id }, data: updateUserData });
}

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const accountUrl = "/settings";

  const searchParams = req.nextUrl.searchParams;
  const token = searchParams.get("token") as string;
  const email = searchParams.get("email") as string;

  try {
    const isValidToken = await verifyToken(token, email);
    if (!isValidToken) {
      return redirect(`${accountUrl}?error=EmailVerificationExpired`);
    }
  } catch (error) {
    return redirect(`${accountUrl}?error=EmailVerification`);
  }

  try {
    await deleteToken(token);
    await updateUser(session.user.id, {
      email,
      emailVerified: new Date(),
    });
  } catch (error) {
    return redirect(`${accountUrl}?error=EmailVerification`);
  }

  return redirect(accountUrl);
}
