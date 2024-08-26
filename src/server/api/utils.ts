import { FormboxApiError } from "./errors";

export const getSearchParams = (url: string) => {
  // Create a params object
  const params = {} as Record<string, string>;

  new URL(url).searchParams.forEach(function (val, key) {
    params[key] = val;
  });

  return params;
};

export function getPaginationData(page: number, take: number, total: number) {
  const totalPages = Math.ceil(total / take);
  const currentPage = page;
  const nextPage = currentPage === totalPages ? null : currentPage + 1;
  const previousPage = currentPage === 1 ? null : currentPage - 1;
  return {
    totalPages,
    currentPage,
    nextPage,
    previousPage,
  };
}

export function structurePaginatedApiResponse<T>(
  data: T[],
  meta: Record<string, any>,
  paginationData: ReturnType<typeof getPaginationData>,
) {
  return {
    data,
    meta,
    pagination: {
      ...paginationData,
    },
  };
}

export async function parseRequestBody(req: Request) {
  try {
    return await req.json();
  } catch (error) {
    throw new FormboxApiError({
      code: "bad_request",
      message:
        "Invalid JSON format in request body. Please ensure the request body is a valid JSON object.",
    });
  }
}
