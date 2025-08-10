import type { FieldValidation } from "@lib/SpoonKit/types/FieldTypes";

export function isRequired(label?: string): FieldValidation<any> {
  return (field) => {
    const value = field.get();

    if (
      value === undefined ||
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return label || "Campo requerido";
    }

    return null;
  };
}
