import { isEmpty } from "radash";

interface Entity {
  firstName?: string | null;
  lastName?: string | null;
}

export function getFullName<T extends Entity | null>(entity: T) {
  return entity && !isEmpty(entity)
    ? `${entity?.firstName} ${entity?.lastName}`
    : "";
}
