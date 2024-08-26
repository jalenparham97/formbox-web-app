import { type NextRequest, NextResponse } from "next/server";
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { db } from "@/server/db";
import {
  addExcelSheetEntry,
  getRowCount,
  updateExcelSheetHeaders,
} from "@/libs/nango/integrations/excel";
import { getRange } from "@/utils/spreadsheets";
import { AxiosError } from "axios";

export const maxDuration = 30;

// QStash will call this endpoint with the data it received earlier.
async function handler(req: NextRequest) {
  const body = await req.json();

  try {
    const integration = await db.integration.findFirst({
      where: { formId: body.formId, type: "excel" },
      select: {
        id: true,
        connectionId: true,
        spreadsheetId: true,
        isEnabled: true,
      },
    });

    if (!integration) {
      return NextResponse.json(
        { success: true, message: "No Excel integration found" },
        { status: 200 },
      );
    }

    if (!integration.isEnabled) {
      return NextResponse.json(
        { success: true, message: "Excel integration is disabled" },
        { status: 200 },
      );
    }

    const { connectionId, spreadsheetId } = integration;

    await updateExcelSheetHeaders(
      connectionId as string,
      spreadsheetId as string,
      getRange(Object.keys(body.data).length),
      [[...Object.keys(body.data)] as string[]],
    );

    const rowCount = await getRowCount(
      connectionId as string,
      spreadsheetId as string,
    );

    await addExcelSheetEntry(
      connectionId as string,
      spreadsheetId as string,
      getRange(Object.keys(body.data).length, rowCount + 1),
      [[...Object.values(body.data)] as string[]],
    );

    return NextResponse.json({ success: true, rowCount }, { status: 200 });
  } catch (error) {
    console.log("ERROR: ", error);
    if (error instanceof AxiosError) {
      console.error("******ERROR******", error?.response?.data);
    }
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

// It is very important to add this line as this makes
// sure that only QStash can successfully call this endpoint.
// It will make use of the QSTASH_CURRENT_SIGNING_KEY and
// QSTASH_NEXT_SIGNING_KEY from your .env file.
export const POST = verifySignatureAppRouter(handler);
// export const POST = handler;
