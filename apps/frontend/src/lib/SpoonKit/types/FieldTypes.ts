import { Field } from "../domain/Field";

export type FieldValidation<T> = (field: Field<T>) => string | null;
