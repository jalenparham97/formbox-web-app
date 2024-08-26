import { ZodOpenApiOperationObject } from "zod-openapi";
import { z } from "@/libs/zod";
import { openApiErrorResponses } from "@/libs/openapi/responses";
import { apiKeyHeader } from "@/libs/openapi/headers";

export const deleteFormByIdOperation: ZodOpenApiOperationObject = {
  operationId: "deleteForm",
  summary: "Delete a form",
  description: "Delete a specific form for the authenticated organization.",
  requestParams: {
    header: apiKeyHeader,
    path: z.object({
      formId: z
        .string()
        .describe("The unique ID of the form to delete.")
        .openapi({ example: "clux0rgak00011..." }),
    }),
  },
  responses: {
    "200": {
      description: "A specific form.",
      content: {
        "application/json": {
          schema: z.object({
            formId: z
              .string()
              .describe("The unique ID of the form that was deleted."),
          }),
        },
      },
    },
    ...openApiErrorResponses,
  },
  tags: ["Forms"],
  security: [{ token: [] }],
};
