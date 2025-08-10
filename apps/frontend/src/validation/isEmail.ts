import type { FieldValidation } from "@lib/SpoonKit/types/FieldTypes";

export function isEmail(): FieldValidation<string> {
  return (field) => {
    const value = field.get();

    if (!value?.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
      return "Email inválido";
    }

    return null;
  };
}
