import { z } from "../zod";
import { getPaginationQuerySchema } from "./api.schemas";

export const submissionSchema = z.object({
  id: z.string().describe("The unique ID of the submission."),
  formId: z.string().describe("The ID of the form."),
  isSpam: z.boolean().describe("Whether the submission is spam."),
  answers: z
    .array(
      z.object({
        id: z.string().describe("The answer ID."),
        label: z.string().describe("The answer label."),
        value: z.string().describe("The answer value."),
      }),
    )
    .optional()
    .describe("The answers for the submission."),
  files: z
    .array(
      z.object({
        id: z.string().describe("The file ID."),
        name: z.string().describe("The file name."),
        type: z.string().describe("The file type."),
        size: z.number().describe("The file size in bytes."),
        url: z.string().describe("The file URL."),
        createdAt: z.string().describe("The date the file was created."),
        updatedAt: z.string().describe("The date the file was last updated."),
      }),
    )
    .optional()
    .describe("The files for the submission."),
  createdAt: z.string().describe("The date the submission was created."),
  updatedAt: z.string().describe("The date the submission was last updated."),
});

export const getSubmissionQuerySchema = z.object({
  formId: z.string().describe("The unique ID of the form."),
});

export const getSubmissionsQuerySchema = z
  .object({
    formId: z.string().describe("The unique ID of the form."),
    search: z
      .string()
      .optional()
      .describe("Search for a submission by its content."),
  })
  .merge(getPaginationQuerySchema({ maxPageSize: 100 }));

export const getSubmissionsResponseSchema = z.object({
  data: z.array(submissionSchema).describe("The list of submissions."),
  meta: z
    .object({
      total: z.number().describe("The total number of submissions."),
      totalInbox: z.number().describe("The total number of inbox submissions."),
      totalSpam: z.number().describe("The total number of spam submissions."),
    })
    .describe("Extra metadata about the submissions response."),
  pagination: z
    .object({
      totalPages: z.number().describe("The total number of pages."),
      currentPage: z.number().describe("The current page number."),
      nextPage: z.number().nullish().describe("The next page number."),
      previousPage: z.number().nullish().describe("The previous page number."),
    })
    .describe("Pagination metadata."),
});

export const submissionResponseSchema = submissionSchema;
