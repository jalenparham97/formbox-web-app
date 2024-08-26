import {
  FormboxApiError,
  handleAndReturnErrorResponse,
} from "@/server/api/errors";
import { withApiKeyAuth } from "@/server/api/handlers/auth.handler";
import { formUpdateBodySchema } from "@/utils/schemas";
import { parseRequestBody } from "@/server/api/utils";
import { db } from "@/server/db";
import { API_SCOPES } from "@/utils/constants";
import { throwIfPlanAccessForbidden } from "@/server/api/forms";

export const GET = withApiKeyAuth(
  async ({ params, headers }) => {
    try {
      const form = await db.form.findUnique({ where: { id: params.formId } });

      if (!form) {
        throw new FormboxApiError({
          code: "not_found",
          message: "The requested resource does not exist.",
        });
      }

      return Response.json(form, { status: 200 });
    } catch (error) {
      console.log(error);
      return handleAndReturnErrorResponse(error, headers);
    }
  },
  { requiredPermissions: [API_SCOPES.api.read, API_SCOPES.api.full] },
);

export const PATCH = withApiKeyAuth(
  async ({ req, params, headers, orgId }) => {
    const body = formUpdateBodySchema.parse(await parseRequestBody(req));

    try {
      const org = await db.org.findUnique({
        where: { id: orgId },
        select: {
          stripePlan: true,
          members: {
            where: {
              role: "owner",
            },
          },
        },
      });

      const plan = org?.stripePlan ?? "free";

      throwIfPlanAccessForbidden(plan, body);

      const result = await db.form.update({
        where: { id: params.formId },
        data: body,
      });
      return Response.json(result, { status: 200 });
    } catch (error) {
      console.log(error);
      return handleAndReturnErrorResponse(error, headers);
    }
  },
  {
    requiredPermissions: [API_SCOPES.api.full],
  },
);

export const DELETE = withApiKeyAuth(
  async ({ params, headers }) => {
    try {
      const result = await db.form.delete({ where: { id: params.formId } });
      return Response.json({ formId: result.id }, { status: 200 });
    } catch (error) {
      console.log(error);
      return handleAndReturnErrorResponse(error, headers);
    }
  },
  {
    requiredPermissions: [API_SCOPES.api.full],
  },
);
