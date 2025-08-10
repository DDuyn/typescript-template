import { isPlainObject } from "../helpers/isPlainObject";
import { $batch } from "../signals/$batch";
import { calc } from "../signals/Calc";
import type {
  FieldObject,
  ModelErrors,
  ModelValues,
} from "../types/ModelTypes";
import { Field, type FieldOptions } from "./Field";

export abstract class FieldModel<T = FieldObject> {
  abstract model: T;

  private getFields(
    callback: (field: Field<any>, resolve: (value: any) => void) => void,
    model: T = this.model,
    payload: any = {}
  ) {
    for (const key in model) {
      const item = model[key];

      if (item instanceof Field) {
        callback(item, (value) => (payload[key] = value));
      } else if (isPlainObject(item)) {
        const nestedPayload = {};
        const result = this.getFields(callback, item as T, nestedPayload);
        if (Object.keys(result).length > 0) {
          payload[key] = nestedPayload;
        }
      }
    }

    return payload;
  }

  private setFields(
    values: any,
    options?: FieldOptions,
    model: T = this.model
  ) {
    for (const key in model) {
      if (!(key in values)) continue;
      const item = model[key];

      if (item instanceof Field) {
        item.set(values[key], options);
      } else if (isPlainObject(item)) {
        this.setFields(values[key], options, item as T);
      }
    }
  }

  public values = calc(() => {
    const model = this.getFields((field, resolve) => {
      resolve(field.get());
    });

    return model as ModelValues<this["model"]>;
  });

  public errors = calc(() => {
    const model = this.getFields((field, resolve) => {
      if (!field.isValid.get()) {
        resolve(field.errors.get());
      }
    });

    return model as ModelErrors<this["model"]>;
  });

  public isValid = calc(() => {
    return Object.keys(this.errors.get()).length === 0;
  });

  public get() {
    return this.values.get();
  }

  public peek() {
    return this.values.peek();
  }

  public set(values: ModelValues<this["model"]>, options?: FieldOptions) {
    $batch(() => {
      this.setFields(values, options);
    });

    return this;
  }

  public discard() {
    this.getFields((field) => {
      field.discard();
    });
  }
}
