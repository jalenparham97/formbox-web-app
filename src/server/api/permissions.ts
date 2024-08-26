import { FormboxApiError } from "./errors";

export function checkPermissions(scopes: string[], requiredScopes: string[]) {
  if (requiredScopes.includes(scopes.join(" "))) {
    return true;
  }
  return false;
}

export function throwIfNoAccess(scopes: string[], requiredScopes: string[]) {
  if (!checkPermissions(scopes, requiredScopes)) {
    const missingScopes = requiredScopes.filter(
      (scope) => !scopes.includes(scope),
    );
    throw new FormboxApiError({
      code: "forbidden",
      message: `The provided key does not have the required permissions for this action. Having one of the following permissions is required: ${missingScopes.join(", ")}`,
    });
  }
}
