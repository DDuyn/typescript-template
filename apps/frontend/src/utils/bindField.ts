import type { Entity } from "@lib/SpoonKit/domain/Entity";
import type { Field } from "@lib/SpoonKit/domain/Field";
import { calc } from "@lib/SpoonKit/signals/Calc";

export function bindField<T extends Entity<any>>(
  entity: T,
  fieldName: keyof T["model"]
) {
  const field = entity.model[fieldName] as Field<any>;

  return {
    value: field,
    isValid: field.isValid,
    disabled: calc(() => {
      const committing = entity.lifeCycle.committing.get();
      const syncing = entity.lifeCycle.syncing.get();
      const dropping = entity.lifeCycle.dropping.get();

      return committing || syncing || dropping;
    }),
    helperText: calc(() => field.errors.get()[0]),
  };
}
