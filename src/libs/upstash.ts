import { env } from "@/env";
import { Client } from "@upstash/qstash";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const qstash = new Client({ token: env.QSTASH_TOKEN });

export const qstashUrls = {
  welcomeEmailUrl: `${env.APP_URL}/api/jobs/send-welcome-email`,
} as const;

export async function rateLimit(identifier: string) {
  const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(600, "1 m"),
    analytics: true,
    prefix: "ratelimit/api",
  });

  return await ratelimit.limit(identifier);
}
