import { type NextRequest, NextResponse } from "next/server";
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { db } from "@/server/db";
import {
  addSheetEntry,
  updateSheetHeaders,
} from "@/libs/nango/integrations/google-sheets";
import { getRange } from "@/utils/spreadsheets";

// QStash will call this endpoint with the data it received earlier.
async function handler(req: NextRequest) {
  const body = await req.json();

  try {
    const integration = await db.integration.findFirst({
      where: { formId: body.formId, type: "google-sheets" },
      select: {
        id: true,
        connectionId: true,
        spreadsheetId: true,
        isEnabled: true,
      },
    });

    if (!integration) {
      return NextResponse.json(
        { success: true, message: "No google-sheets integration found" },
        { status: 200 },
      );
    }

    if (!integration.isEnabled) {
      return NextResponse.json(
        { success: true, message: "Google Sheets integration is disabled" },
        { status: 200 },
      );
    }

    const { connectionId, spreadsheetId } = integration;

    const range = getRange(Object.keys(body.data).length);

    await updateSheetHeaders(
      connectionId as string,
      spreadsheetId as string,
      range,
      [[...Object.keys(body.data)] as string[]],
    );

    await addSheetEntry(
      connectionId as string,
      spreadsheetId as string,
      range,
      [[...Object.values(body.data)] as string[]],
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log("ERROR: ", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

// It is very important to add this line as this makes
// sure that only QStash can successfully call this endpoint.
// It will make use of the QSTASH_CURRENT_SIGNING_KEY and
// QSTASH_NEXT_SIGNING_KEY from your .env file.
export const POST = verifySignatureAppRouter(handler);
// export const POST = handler;
