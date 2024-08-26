import { type NextRequest } from "next/server";
import { convertToCSV } from "@/utils/convert";
import { db } from "@/server/db";
import { nanoid } from "@/libs/nanoid";
import { dash } from "radash";
import { auth } from "@/libs/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { formId: string } },
) {
  const session = await auth();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;
  const format = searchParams.get("format");
  const isSpam = searchParams.get("isSpam");

  try {
    const form = await db.form.findUnique({ where: { id: params.formId } });

    if (!form) {
      return new Response("Form not found", { status: 404 });
    }

    const submissions = await db.submission.findMany({
      where: {
        formId: params.formId,
        isSpam: isSpam === "false" ? false : true,
      },
      include: {
        answers: true,
      },
    });

    const answers: Record<string, string> = {};

    const json = submissions.map((submission) => {
      submission.answers?.map((answer) => {
        answers[answer.label] = answer.value;
      });

      return {
        ...answers,
        isSpam: submission.isSpam,
      };
    });

    if (format === "csv") {
      const csv = convertToCSV(json);

      return new Response(csv, {
        status: 200,
        headers: {
          "Content-Disposition": `attachment; filename="${dash(form.name.toLowerCase())}-${nanoid(6)}.csv"`,
          "Content-Type": "application/csv",
        },
      });
    }

    if (format === "json") {
      return Response.json(json, {
        status: 200,
        headers: {
          "Content-Disposition": `attachment; filename="${dash(form.name.toLowerCase())}-${nanoid(6)}.json"`,
          "Content-Type": "application/json",
        },
      });
    }
  } catch (e) {
    if (e instanceof Error) {
      console.error(e);
      return new Response(e.message, {
        status: 400,
      });
    }
  }
}
