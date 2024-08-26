import { DEFAULT_PAGE_SIZE } from "@/utils/constants";
import { z } from "../zod";

// Pagination
export const getPaginationQuerySchema = ({
  maxPageSize,
}: {
  maxPageSize: number;
}) =>
  z.object({
    page: z.coerce
      .number({ invalid_type_error: "Page must be a number." })
      .positive({ message: "Page must be greater than 0." })
      .optional()
      .default(1)
      .describe("The page number for pagination.")
      .openapi({
        example: 1,
      }),
    pageSize: z.coerce
      .number({ invalid_type_error: "Page size must be a number." })
      .positive({ message: "Page size must be greater than 0." })
      .max(maxPageSize, {
        message: `Max page size is ${maxPageSize}.`,
      })
      .optional()
      .default(DEFAULT_PAGE_SIZE)
      .describe("The number of items per page.")
      .openapi({
        example: 50,
      }),
  });
