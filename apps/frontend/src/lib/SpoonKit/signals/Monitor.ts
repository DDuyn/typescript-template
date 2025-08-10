import { effect } from "@preact/signals-core";

export const monitor = (fn: () => void) => {
  return new Monitor(fn).dispose;
};

// TODO: Pending add dispose method
export class Monitor {
  public dispose: () => void;
  private monitorFn: () => void;

  constructor(monitorFn: () => void) {
    this.monitorFn = monitorFn;
    this.dispose = effect(this.monitorFn);
  }
}
