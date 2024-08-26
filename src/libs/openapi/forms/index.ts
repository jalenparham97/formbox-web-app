import { ZodOpenApiPathsObject } from "zod-openapi";
import { getFormsOperation } from "./get-forms";
import { getFormByIdOperation } from "./get-form-by-id";
import { createFormOperation } from "./create-form";
import { updateFormByIdOperation } from "./update-form-by-id";
import { deleteFormByIdOperation } from "./delete-form-by-id";

export const formsPaths: ZodOpenApiPathsObject = {
  "/forms": {
    get: getFormsOperation,
    post: createFormOperation,
  },
  "/forms/{formId}": {
    get: getFormByIdOperation,
    patch: updateFormByIdOperation,
    delete: deleteFormByIdOperation,
  },
};
