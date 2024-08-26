import { openApiErrorResponses } from "@/libs/openapi/responses";
import { ZodOpenApiOperationObject } from "zod-openapi";
import {
  getSubmissionsQuerySchema,
  getSubmissionsResponseSchema,
} from "@/libs/schemas/submission.schemas";
import { apiKeyHeader } from "@/libs/openapi/headers";

export const getSubmissionsOperation: ZodOpenApiOperationObject = {
  operationId: "getSubmissions",
  summary: "Retrieve a list of submissions",
  description:
    "Retrieve a paginated list of submissions for a given form for the authenticated organization.",
  requestParams: {
    header: apiKeyHeader,
    query: getSubmissionsQuerySchema,
  },
  responses: {
    "200": {
      description: "A list of submissions.",
      content: {
        "application/json": {
          schema: getSubmissionsResponseSchema,
        },
      },
    },
    ...openApiErrorResponses,
  },
  tags: ["Submissions"],
  security: [{ token: [] }],
};
