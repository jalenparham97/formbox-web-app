import {
  FormboxApiError,
  handleAndReturnErrorResponse,
} from "@/server/api/errors";
import { withApiKeyAuth } from "@/server/api/handlers/auth.handler";
import { db } from "@/server/db";
import { API_SCOPES } from "@/utils/constants";

export const GET = withApiKeyAuth(
  async ({ params, searchParams, headers }) => {
    if (searchParams.formId === undefined) {
      throw new FormboxApiError({
        code: "bad_request",
        message:
          "Form ID is required. Set the formId search query parameter to get a submission for a specific form.",
      });
    }

    try {
      const submission = await db.submission.findUnique({
        where: { id: params.submissionId, formId: params.formId },
        include: {
          answers: {
            select: {
              id: true,
              label: true,
              value: true,
            },
          },
          files: {
            select: {
              id: true,
              name: true,
              type: true,
              size: true,
              url: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      if (!submission) {
        throw new FormboxApiError({
          code: "not_found",
          message: "The requested resource does not exist.",
        });
      }

      return Response.json(submission, { status: 200 });
    } catch (error) {
      console.log(error);
      return handleAndReturnErrorResponse(error, headers);
    }
  },
  { requiredPermissions: [API_SCOPES.api.read, API_SCOPES.api.full] },
);

export const DELETE = withApiKeyAuth(
  async ({ params, searchParams, headers }) => {
    if (searchParams.formId === undefined) {
      throw new FormboxApiError({
        code: "bad_request",
        message:
          "Form ID is required. Set the formId search query parameter to delete a submission for a specific form.",
      });
    }
    try {
      const result = await db.submission.delete({
        where: { id: params.submissionId, formId: params.formId },
      });
      return Response.json({ submissionId: result.id }, { status: 200 });
    } catch (error) {
      console.log(error);
      return handleAndReturnErrorResponse(error, headers);
    }
  },
  {
    requiredPermissions: [API_SCOPES.api.full],
  },
);
