import {
  FormboxApiError,
  handleAndReturnErrorResponse,
} from "@/server/api/errors";
import { withApiKeyAuth } from "@/server/api/handlers/auth.handler";
import { db } from "@/server/db";
import {
  getPaginationData,
  structurePaginatedApiResponse,
} from "@/server/api/utils";
import { API_SCOPES, DEFAULT_PAGE_SIZE } from "@/utils/constants";

export const GET = withApiKeyAuth(
  async ({ searchParams, headers }) => {
    const search = searchParams.search;
    const isSpam = searchParams.isSpam === "true";
    const page = searchParams.page ? Number(searchParams.page) : 1;
    const take = searchParams.pageSize
      ? Number(searchParams.pageSize)
      : DEFAULT_PAGE_SIZE;

    if (searchParams.formId === undefined) {
      throw new FormboxApiError({
        code: "bad_request",
        message:
          "Form ID is required. Set the formId search query parameter to get submissions for a specific form.",
      });
    }

    try {
      const data = await db.submission.findMany({
        where: {
          formId: searchParams.formId,
          ...(searchParams.isSpam && { isSpam }),
          answers: {
            some: {
              value: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
        include: {
          answers: {
            select: {
              id: true,
              label: true,
              value: true,
            },
          },
          files: {
            select: {
              id: true,
              name: true,
              type: true,
              size: true,
              url: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
        skip: (page - 1) * take,
        take,
        orderBy: { createdAt: "desc" },
      });

      const total = await db.submission.count({
        where: { formId: searchParams.formId },
      });
      const totalInbox = await db.submission.count({
        where: { formId: searchParams.formId, isSpam: false },
      });
      const totalSpam = await db.submission.count({
        where: { formId: searchParams.formId, isSpam: true },
      });

      const paginationData = getPaginationData(page, take, total);
      const meta = { total, totalInbox, totalSpam };
      const result = structurePaginatedApiResponse(data, meta, paginationData);

      return Response.json(result, { status: 200 });
    } catch (error) {
      console.log(error);
      return handleAndReturnErrorResponse(error, headers);
    }
  },
  { requiredPermissions: [API_SCOPES.api.read, API_SCOPES.api.full] },
);
