import { openApiErrorResponses } from "@/libs/openapi/responses";
import { ZodOpenApiOperationObject } from "zod-openapi";
import {
  formResponseSchema,
  formCreateBodySchema,
} from "@/libs/schemas/form.schemas";
import { apiKeyHeader } from "@/libs/openapi/headers";

export const createFormOperation: ZodOpenApiOperationObject = {
  operationId: "createForm",
  summary: "Create a new form",
  description: "Create a new form for the authenticated organization.",
  requestParams: {
    header: apiKeyHeader,
  },
  requestBody: {
    content: {
      "application/json": {
        schema: formCreateBodySchema,
      },
    },
  },
  responses: {
    "200": {
      description: "The newly created form.",
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
