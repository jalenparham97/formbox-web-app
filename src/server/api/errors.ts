import { z } from "@/libs/zod";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { generateErrorMessage } from "zod-error";
import { ZodOpenApiResponseObject } from "zod-openapi";

export const ErrorCode = z.enum([
  "bad_request",
  "not_found",
  "internal_server_error",
  "unauthorized",
  "forbidden",
  "rate_limit_exceeded",
  "invite_expired",
  "invite_pending",
  "exceeded_limit",
  "conflict",
  "unprocessable_entity",
]);

const errorCodeToHttpStatus: Record<z.infer<typeof ErrorCode>, number> = {
  bad_request: 400,
  unauthorized: 401,
  forbidden: 403,
  exceeded_limit: 403,
  not_found: 404,
  conflict: 409,
  invite_pending: 409,
  invite_expired: 410,
  unprocessable_entity: 422,
  rate_limit_exceeded: 429,
  internal_server_error: 500,
};

const ErrorSchema = z.object({
  error: z.object({
    code: ErrorCode.openapi({
      description: "A short code indicating the error code returned.",
      example: "not_found",
    }),
    message: z.string().openapi({
      description: "A human readable error message.",
      example: "The requested resource was not found.",
    }),
  }),
});

export type ErrorResponse = z.infer<typeof ErrorSchema>;
export type ErrorCodes = z.infer<typeof ErrorCode>;

export class FormboxApiError extends Error {
  public readonly code: z.infer<typeof ErrorCode>;

  constructor({
    code,
    message,
  }: {
    code: z.infer<typeof ErrorCode>;
    message: string;
  }) {
    super(message);
    this.code = code;
  }
}

export function fromZodError(error: ZodError): ErrorResponse {
  return {
    error: {
      code: "unprocessable_entity",
      message: generateErrorMessage(error.issues, {
        maxErrors: 1,
        delimiter: {
          component: ": ",
        },
        path: {
          enabled: true,
          type: "objectNotation",
          label: "",
        },
        code: {
          enabled: true,
          label: "",
        },
        message: {
          enabled: true,
          label: "",
        },
      }),
    },
  };
}

export function handleApiError(error: any): ErrorResponse & { status: number } {
  console.error("API error occurred: ", error.message);

  // Zod errors
  if (error instanceof ZodError) {
    return {
      ...fromZodError(error),
      status: errorCodeToHttpStatus.unprocessable_entity,
    };
  }

  // FormboxApiError errors
  if (error instanceof FormboxApiError) {
    return {
      error: {
        code: error.code,
        message: error.message,
      },
      status: errorCodeToHttpStatus[error.code],
    };
  }

  // Prisma record not found error
  if (error.code === "P2025") {
    return {
      error: {
        code: "not_found",
        message:
          error?.meta?.cause ||
          error.message ||
          "The requested resource was not found.",
      },
      status: 404,
    };
  }

  // Fallback
  // Unhandled errors are not user-facing, so we don't expose the actual error
  return {
    error: {
      code: "internal_server_error",
      message:
        "An internal server error occurred. Please contact our support if the problem persists.",
    },
    status: 500,
  };
}

export function handleAndReturnErrorResponse(
  err: unknown,
  headers?: Record<string, string>,
) {
  const { error, status } = handleApiError(err);
  return NextResponse.json<ErrorResponse>({ error }, { headers, status });
}

export const errorSchemaFactory = (
  code: ErrorCodes,
  description: string,
): ZodOpenApiResponseObject => {
  return {
    description,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            error: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                  enum: [code],
                  description:
                    "A short code indicating the error code returned.",
                  example: code,
                },
                message: {
                  type: "string",
                  description:
                    "A human readable explanation of what went wrong.",
                  example: "The requested resource was not found.",
                },
              },
              required: ["code", "message"],
            },
          },
          required: ["error"],
        },
      },
    },
  };
};
