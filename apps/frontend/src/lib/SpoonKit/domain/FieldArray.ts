import { equal } from "../helpers/equals";
import { Field } from "./Field";

export function fieldArray<T>(init?: FieldConf<T[]>) {
  return new FieldArray<T>(init);
}

interface FieldConf<T> {
  value?: T;
  map?: (value: T) => T;
}

export class FieldArray<T> extends Field<T[]> {
  public setAt(index: number, value: Partial<T> | T) {
    const values = this.get() || [];
    if (index < 0 || index >= values.length) {
      throw new Error("Index out of bounds");
    }
    const newValues = [...values];
    const oldItem = newValues[index];

    const updatedItem =
      typeof oldItem === "object" &&
      oldItem !== null &&
      typeof value === "object"
        ? { ...oldItem, ...value }
        : value;

    if (!equal(oldItem, updatedItem)) {
      newValues[index] = updatedItem as T;
      this.set(newValues);
    }
  }

  public removeAt(index: number) {
    const values = this.get() || [];
    if (index < 0 || index >= values.length) {
      throw new Error("Index out of bounds");
    }
    const newValues = [...values];
    newValues.splice(index, 1);
    this.set(newValues);
  }

  public push(value: T) {
    const values = this.get() || [];
    this.set([...values, value]);
  }
}
