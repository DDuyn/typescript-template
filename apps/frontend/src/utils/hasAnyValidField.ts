import { isValidValue } from "@lib/SpoonKit/helpers/isValidValue";

export const hasAnyValidField = (obj: any, fields: string[]): boolean => {
  return fields.some((field) => isValidValue(obj[field]));
};
