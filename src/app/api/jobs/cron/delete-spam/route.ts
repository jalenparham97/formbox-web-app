import { type NextRequest, NextResponse } from "next/server";
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { db } from "@/server/db";

/**
 * Cron to delete the spam submissions that are more than 30 days old.
 * Runs every 6 hours (might need to change this if we have more users).
 **/
async function handler(_req: NextRequest) {
  try {
    const submissions = await db.submission.deleteMany({
      where: {
        createdAt: {
          lte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        isSpam: true,
      },
    });
    return NextResponse.json(
      {
        message: "success",
        deletedCount: submissions.count,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(error, { status: 500 });
  }
}

export const POST = verifySignatureAppRouter(handler);
