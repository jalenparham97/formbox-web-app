import { createDocument } from "zod-openapi";
import { openApiErrorResponses } from "@/libs/openapi/responses";
import { formsPaths } from "@/libs/openapi/forms";
import { submissionsPaths } from "@/libs/openapi/submissions";
import { formSchema } from "@/libs/schemas/form.schemas";
import { submissionSchema } from "@/libs/schemas/submission.schemas";

export const document = createDocument({
  openapi: "3.1.0",
  info: {
    title: "Formbox API",
    description: "Formbox is an all in one forms solution for your business.",
    version: "0.0.1",
    contact: {
      name: "Formbox Support",
      email: "support@formbox.app",
      url: "https://docs.formbox.app/api-reference",
    },
  },
  servers: [
    {
      url: "https://app.formbox.app/api/v1",
      description: "Production API",
    },
  ],
  paths: {
    ...formsPaths,
    ...submissionsPaths,
  },
  components: {
    schemas: {
      formSchema,
      submissionSchema,
    },
    securitySchemes: {
      ApiKeyAuth: {
        name: "api-key",
        type: "apiKey",
        in: "header",
        description: "API key authentication",
      },
    },
    responses: {
      ...openApiErrorResponses,
    },
  },
});
