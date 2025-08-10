import type { ReadonlySignal } from "@preact/signals-core";
import { computed } from "@preact/signals-core";

export const calc = <T>(fn: () => T) => new Calc<T>(fn);

export class Calc<T> {
  private self: ReadonlySignal<T>;
  private calcFn: () => T;

  constructor(calcFn: () => T) {
    this.calcFn = calcFn;
    this.self = computed(() => this.calcFn());
  }

  public get() {
    return this.self.value;
  }

  public peek() {
    return this.self.peek();
  }
}
