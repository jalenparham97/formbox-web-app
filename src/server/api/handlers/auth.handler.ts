import { rateLimit } from "@/libs/upstash";
import { db } from "@/server/db";
import { getSearchParams } from "@/server/api/utils";
import { FormboxApiError, handleAndReturnErrorResponse } from "../errors";
import { throwIfNoAccess } from "../permissions";

interface ApiKeyAuthHandler {
  ({
    req,
    params,
    searchParams,
    headers,
    orgId,
  }: {
    req: Request;
    params: Record<string, string>;
    searchParams: Record<string, string>;
    headers?: Record<string, string>;
    orgId: string;
  }): Promise<Response>;
}

export function withApiKeyAuth(
  handler: ApiKeyAuthHandler,
  { requiredPermissions = [] }: { requiredPermissions: string[] },
) {
  return async (
    req: Request,
    { params }: { params: Record<string, string> | undefined },
  ) => {
    const searchParams = getSearchParams(req.url);

    let headers = {};

    try {
      const apiKeyHeader = req.headers.get("api-key");

      if (!apiKeyHeader) {
        throw new FormboxApiError({
          code: "unauthorized",
          message: "Unauthorized: Must provide an API key",
        });
      }

      const apiKey = await db.apiKey.findUnique({
        where: { key: apiKeyHeader },
      });

      if (!apiKey) {
        throw new FormboxApiError({
          code: "unauthorized",
          message: "Unauthorized: Invalid API key.",
        });
      }

      const limitResponse = await rateLimit(apiKeyHeader);

      headers = {
        "Retry-After": limitResponse.reset.toString(),
        "X-RateLimit-Limit": limitResponse.limit.toString(),
        "X-RateLimit-Remaining": limitResponse.remaining.toString(),
        "X-RateLimit-Reset": limitResponse.reset.toString(),
      };

      if (!limitResponse.success) {
        throw new FormboxApiError({
          code: "rate_limit_exceeded",
          message: "Too many requests.",
        });
      }

      throwIfNoAccess(apiKey.scopes, requiredPermissions);

      return await handler({
        req,
        params: params || {},
        searchParams,
        headers,
        orgId: apiKey.orgId,
      });
    } catch (error) {
      return handleAndReturnErrorResponse(error, headers);
    }
  };
}
