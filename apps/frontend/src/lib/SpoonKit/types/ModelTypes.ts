import { Field } from "../domain/Field";

export type FieldObject = { [key: string]: Field<any> | FieldObject };

export type ModelValues<T> = {
  [K in keyof T as T[K] extends Field<any>
    ? K
    : T[K] extends FieldObject
    ? K
    : never]?: T[K] extends Field<infer U>
    ? U
    : T[K] extends FieldObject
    ? ModelValues<T[K]>
    : never;
};

export type ModelErrors<T> = {
  [K in keyof T as T[K] extends Field<any>
    ? K
    : T[K] extends FieldObject
    ? K
    : never]?: T[K] extends Field<any>
    ? string[]
    : T[K] extends FieldObject
    ? ModelErrors<T[K]>
    : never;
};
