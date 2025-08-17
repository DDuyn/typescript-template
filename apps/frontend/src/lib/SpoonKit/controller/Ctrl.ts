import { $batch } from "../signals/$batch";
import { Calc } from "../signals/Calc";
import { Emitter, emitter } from "../signals/Emitter";
import { State } from "../signals/State";
import type { PropModel } from "../types/PropTypes";

function isEmitter(obj: any): obj is Emitter<any> {
  return obj && typeof obj.subscribe === "function";
}

function isState(obj: any): obj is State<any> {
  return obj && typeof obj.get === "function" && typeof obj.set === "function";
}

function isCalc(obj: any): obj is Calc<any> {
  return (
    obj && typeof obj.get === "function" && typeof obj.subscribe === "function"
  );
}

export class Ctrl {
  [key: string]: any;
  key = Math.random().toString(36).slice(2);

  onStart = emitter<this>();
  onDestroy = emitter<void>();

  constructor() {
    this.onStart.subscribe(() => {
      this["ctrlStart"]?.();
    });

    this.onDestroy.subscribe(() => {
      this["ctrlDestroy"]?.();
    });
  }

  public set(propsFn: (ctrl: this) => PropModel<this>): this;
  public set(props: PropModel<this>): this;
  public set(props: PropModel<this> | ((ctrl: this) => PropModel<this>)) {
    if (props instanceof Function) {
      props = props(this);
    }

    const propsAny = props as any;

    $batch(() => {
      for (const key in propsAny) {
        const val = this[key];
        if (isState(val)) {
          val.set(propsAny[key]);
        } else if (isEmitter(val)) {
          val.subscribe(propsAny[key]);
        } else {
          this[key] = propsAny[key];
        }
      }
    });

    return this;
  }

  public get(): PropModel<this> {
    const values = {} as PropModel<this>;
    const valuesAny = values as any;

    for (const key in this) {
      const val = this[key];
      if (isState(val) || isCalc(val)) {
        valuesAny[key] = (val as { get: () => any }).get();
      }
    }

    return values;
  }
}

export interface CtrlOnStart {
  ctrlStart(): void;
}

export interface CtrlOnDestroy {
  ctrlDestroy(): void;
}
