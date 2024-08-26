import { handleAndReturnErrorResponse } from "@/server/api/errors";
import { withApiKeyAuth } from "@/server/api/handlers/auth.handler";
import { db } from "@/server/db";
import {
  getPaginationData,
  parseRequestBody,
  structurePaginatedApiResponse,
} from "@/server/api/utils";
import { API_SCOPES, DEFAULT_PAGE_SIZE } from "@/utils/constants";
import { formCreateBodySchema } from "@/libs/schemas/form.schemas";
import { isEmpty } from "radash";
import {
  throwIfPlanAccessForbidden,
  setSubmissionStorageDuration,
} from "@/server/api/forms";

export const GET = withApiKeyAuth(
  async ({ searchParams, headers, orgId }) => {
    const type = searchParams.type;
    const search = searchParams.search;
    const sort = searchParams.sort;
    const page = searchParams.page ? Number(searchParams.page) : 1;
    const take = searchParams.pageSize
      ? Number(searchParams.pageSize)
      : DEFAULT_PAGE_SIZE;

    try {
      const forms = await db.form.findMany({
        where: {
          orgId,
          ...(search && {
            name: {
              contains: search,
              mode: "insensitive",
            },
          }),
          ...(type && { type }),
        },
        select: {
          id: true,
          name: true,
          type: true,
          isClosed: true,
          _count: {
            select: {
              submissions: true,
            },
          },
          orgId: true,
          createdAt: true,
          updatedAt: true,
        },
        skip: (page - 1) * take,
        take,
        orderBy: {
          ...(sort === "submissions"
            ? { submissions: { _count: "desc" } }
            : { createdAt: "desc" }),
        },
      });

      const total = await db.form.count({ where: { orgId } });

      const data = forms.map((form) => ({
        id: form.id,
        name: form.name,
        type: form.type,
        isClosed: form.isClosed,
        submissions: form._count.submissions,
        orgId: form.orgId,
        createdAt: form.createdAt,
        updatedAt: form.updatedAt,
      }));

      const paginationData = getPaginationData(page, take, total);
      const meta = { total };
      const result = structurePaginatedApiResponse(data, meta, paginationData);

      return Response.json(result, { status: 200 });
    } catch (error) {
      console.log(error);
      return handleAndReturnErrorResponse(error, headers);
    }
  },
  { requiredPermissions: [API_SCOPES.api.read, API_SCOPES.api.full] },
);

export const POST = withApiKeyAuth(
  async ({ req, headers, orgId }) => {
    const body = formCreateBodySchema.parse(await parseRequestBody(req));

    try {
      const org = await db.org.findUnique({
        where: { id: orgId },
        select: {
          stripePlan: true,
          members: {
            where: {
              role: "owner",
            },
            select: {
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
      });

      const plan = org?.stripePlan ?? "free";

      throwIfPlanAccessForbidden(plan, body);

      const result = await db.form.create({
        data: {
          ...body,
          submissionStorageDuration: setSubmissionStorageDuration(plan, body),
          emailsToNotify: isEmpty(body.emailsToNotify)
            ? [org?.members?.[0]?.user?.email ?? ""]
            : body.emailsToNotify,
          orgId,
        },
      });

      return Response.json(result, { status: 200 });
    } catch (error) {
      console.log(error);
      return handleAndReturnErrorResponse(error, headers);
    }
  },
  { requiredPermissions: [API_SCOPES.api.full] },
);
