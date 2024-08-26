import { openApiErrorResponses } from "@/libs/openapi/responses";
import { ZodOpenApiOperationObject } from "zod-openapi";
import { z } from "@/libs/zod";
import { apiKeyHeader } from "@/libs/openapi/headers";
import { getSubmissionQuerySchema } from "@/libs/schemas/submission.schemas";

export const deleteSubmissionByIdOperation: ZodOpenApiOperationObject = {
  operationId: "deleteSubmission",
  summary: "Delete a submission",
  description:
    "Delete a specific submission for a given form for the authenticated organization.",
  requestParams: {
    header: apiKeyHeader,
    query: getSubmissionQuerySchema,
    path: z.object({
      submissionId: z
        .string()
        .describe("The unique ID of the submission to delete.")
        .openapi({ example: "clux0rgak00011..." }),
    }),
  },
  responses: {
    "200": {
      description: "A specific form.",
      content: {
        "application/json": {
          schema: z.object({
            submissionId: z
              .string()
              .describe("The unique ID of the submission that was deleted."),
          }),
        },
      },
    },
    ...openApiErrorResponses,
  },
  tags: ["Submissions"],
  security: [{ token: [] }],
};
