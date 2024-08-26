import { openApiErrorResponses } from "@/libs/openapi/responses";
import { ZodOpenApiOperationObject } from "zod-openapi";
import {
  formResponseSchema,
  formUpdateBodySchema,
} from "@/libs/schemas/form.schemas";
import { z } from "@/libs/zod";
import { apiKeyHeader } from "@/libs/openapi/headers";

export const updateFormByIdOperation: ZodOpenApiOperationObject = {
  operationId: "updateForm",
  summary: "Update a form",
  description: "Update a form for the authenticated organization.",
  requestParams: {
    header: apiKeyHeader,
    path: z.object({
      formId: z
        .string()
        .describe("The unique ID of the form to update.")
        .openapi({ example: "clux0rgak00011..." }),
    }),
  },
  requestBody: {
    content: {
      "application/json": {
        schema: formUpdateBodySchema,
      },
    },
  },
  responses: {
    "200": {
      description: "The updated form.",
      content: {
        "application/json": {
          schema: formResponseSchema,
        },
      },
    },
    ...openApiErrorResponses,
  },
  tags: ["Forms"],
  security: [{ token: [] }],
};
