import { calc } from "../signals/Calc";
import { State, state } from "../signals/State";
import type { FieldValidation } from "../types/FieldTypes";

export function field<T>(init?: FieldConf<T>) {
  return new Field<T>(init);
}

interface FieldConf<T> {
  value?: T;
  map?: (value: T | null) => T;
}

export interface FieldOptions {
  mode: "commit" | "remote" | "local";
}

export class Field<T> extends State<T | null> {
  // INTERNAL STATE
  private value = state<T | null>(null);
  private conf: FieldConf<T>;

  // PUBLIC STATE
  public errors = state<string[]>([]);
  public isValid = calc(() => this.errors.get()?.length === 0);

  constructor(conf: FieldConf<T> = {}) {
    super();
    super.set(this.value);
    this.conf = conf;
    this.set(conf.value ?? null, { mode: "commit" });
  }

  public set(value: T | null, options?: FieldOptions) {
    options = options || { mode: "local" };
    if (value === undefined) value = null;
    if (this.conf.map) value = this.conf.map(value);

    switch (options.mode) {
      case "commit":
        this.value.set(value);
        this.discard();
        break;
      case "remote":
      case "local":
        this.value.set(value);
        break;
    }

    return this;
  }

  public validate(...rules: FieldValidation<T>[]): void {
    const errors = rules
      .map((validationFn) => validationFn(this))
      .filter((error) => error !== null);

    this.errors.set(errors);
  }

  public discard() {
    this.errors.set([]);
  }

  public firstError(): string {
    const errors = this.errors.get();
    if (!errors || errors.length === 0) return "";
    return errors[0];
  }
}
