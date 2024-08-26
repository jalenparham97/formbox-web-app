import { ZodOpenApiPathsObject } from "zod-openapi";
import { getSubmissionsOperation } from "@/libs/openapi/submissions/get-submissions";
import { getSubmissionByIdOperation } from "@/libs/openapi/submissions/get-submission-by-id";
import { deleteSubmissionByIdOperation } from "@/libs/openapi/submissions/delete-submission-by-id";

export const submissionsPaths: ZodOpenApiPathsObject = {
  "/submissions": {
    get: getSubmissionsOperation,
  },
  "/submissions/{submissionId}": {
    get: getSubmissionByIdOperation,
    delete: deleteSubmissionByIdOperation,
  },
};
