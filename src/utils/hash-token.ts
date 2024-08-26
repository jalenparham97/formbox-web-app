import { env } from "@/env";
import { createHash } from "crypto";

export function hashToken(token: string) {
  return createHash("sha256")
    .update(`${token}${env.NEXTAUTH_SECRET ?? ""}`)
    .digest("hex");
}

export function compareToken(token: string, hash: string) {
  return hashToken(token) === hash;
}

export async function hashKey(key: string) {
  const encoder = new TextEncoder();

  const data = encoder.encode(`${key}${env.NEXTAUTH_SECRET ?? ""}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function compareKey(key: string, hash: string) {
  const hashedKey = await hashKey(key);
  return hashedKey === hash;
}
