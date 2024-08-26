import { ZodOpenApiOperationObject } from "zod-openapi";
import { z } from "@/libs/zod";
import { formResponseSchema } from "@/libs/schemas/form.schemas";
import { openApiErrorResponses } from "@/libs/openapi/responses";
import { apiKeyHeader } from "@/libs/openapi/headers";

export const getFormByIdOperation: ZodOpenApiOperationObject = {
  operationId: "getForm",
  summary: "Retrieve a form",
  description: "Retrieve a specific form for the authenticated organization.",
  requestParams: {
    header: apiKeyHeader,
    path: z.object({
      formId: z
        .string()
        .describe("The unique ID of the form to retrieve.")
        .openapi({ example: "clux0rgak00011..." }),
    }),
  },
  responses: {
    "200": {
      description: "A specific form.",
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
