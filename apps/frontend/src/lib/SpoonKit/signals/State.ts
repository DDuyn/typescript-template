import { signal, Signal } from "@preact/signals-core";
import { equal } from "../helpers/equals";
import { Calc } from "./Calc";
import { monitor } from "./Monitor";

export function state<T>(value?: T | State<T> | Calc<T> | null): State<T> {
  return new State<T>().set(value ?? null);
}

export class State<T> {
  private self: Signal<T | null> = signal<T | null>(null);
  private disposers: (() => void)[] = [];

  public get() {
    return this.self.value;
  }

  public update(updateFn: (value: T | null) => T) {
    return this.set(updateFn(this.peek()));
  }

  public peek() {
    return this.self.peek();
  }

  private disposePrevious() {
    this.disposers.forEach((dispose) => dispose());
  }

  public set(value: T | State<T> | Calc<T> | null): this {
    if (value instanceof State || value instanceof Calc) {
      this.disposePrevious();

      const disposeGetter = monitor(() => {
        const v = value.get();
        if (!equal(this.peek(), v)) {
          this.self.value = v;
        }
      });

      this.disposers.push(disposeGetter);

      if (value instanceof State) {
        const disposeSetter = monitor(() => {
          const v = this.get();
          value.set(v);
        });

        this.disposers.push(disposeSetter);
      }
    } else {
      if (!equal(this.peek(), value)) {
        this.self.value = value;
      }
    }

    return this;
  }
}
