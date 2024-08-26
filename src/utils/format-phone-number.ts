import { parsePhoneNumber } from "libphonenumber-js";
import { isEmpty } from "radash";

export function formatPhoneNumber(phoneNumber: string) {
  if (isEmpty(phoneNumber)) return "";
  return parsePhoneNumber(phoneNumber, "US").formatNational();
}
