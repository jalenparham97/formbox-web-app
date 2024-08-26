import { ZodOpenApiOperationObject } from "zod-openapi";
import { z } from "@/libs/zod";
import { openApiErrorResponses } from "@/libs/openapi/responses";
import {
  getSubmissionQuerySchema,
  submissionResponseSchema,
} from "@/libs/schemas/submission.schemas";
import { apiKeyHeader } from "@/libs/openapi/headers";

export const getSubmissionByIdOperation: ZodOpenApiOperationObject = {
  operationId: "getSubmission",
  summary: "Retrieve a submission",
  description:
    "Retrieve a specific submission for a given form for the authenticated organization.",
  requestParams: {
    header: apiKeyHeader,
    query: getSubmissionQuerySchema,
    path: z.object({
      submissionId: z
        .string()
        .describe("The unique ID of the submission to retrieve.")
        .openapi({ example: "clux0rgak00011..." }),
    }),
  },
  responses: {
    "200": {
      description: "A specific submission.",
      content: {
        "application/json": {
          schema: submissionResponseSchema,
        },
      },
    },
    ...openApiErrorResponses,
  },
  tags: ["Submissions"],
  security: [{ token: [] }],
};
