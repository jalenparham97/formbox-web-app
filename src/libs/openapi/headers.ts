import { z } from "@/libs/zod";

export const apiKeyHeader = z.object({
  "api-key": z
    .string()
    .describe("The API key.")
    .openapi({
      title: "api-key",
      header: {
        required: true,
        description:
          "The API key for a given organization for authentication purposes.",
        example: "fbsk_AmXu6ZWkC.....",
      },
    }),
});
