import { openApiErrorResponses } from "@/libs/openapi/responses";
import { ZodOpenApiOperationObject } from "zod-openapi";
import {
  getFormsQuerySchema,
  getFormsResponseSchema,
} from "@/libs/schemas/form.schemas";
import { apiKeyHeader } from "@/libs/openapi/headers";

export const getFormsOperation: ZodOpenApiOperationObject = {
  operationId: "getForms",
  summary: "Retrieve a list of forms",
  description:
    "Retrieve a paginated list of forms for the authenticated organization.",
  requestParams: {
    header: apiKeyHeader,
    query: getFormsQuerySchema,
  },
  responses: {
    "200": {
      description: "A list of forms.",
      content: {
        "application/json": {
          schema: getFormsResponseSchema,
        },
      },
    },
    ...openApiErrorResponses,
  },
  tags: ["Forms"],
  security: [{ token: [] }],
};
