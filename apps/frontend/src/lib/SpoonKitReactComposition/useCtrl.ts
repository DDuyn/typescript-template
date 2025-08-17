import { equal } from "@lib/SpoonKit/helpers/equals";
import { Calc } from "@lib/SpoonKit/signals/Calc";
import { monitor } from "@lib/SpoonKit/signals/Monitor";
import { State } from "@lib/SpoonKit/signals/State";
import { useEffect, useState } from "react";

type ReactiveProp = State<any> | Calc<any>;

type PropValues<T> = {
  [K in keyof T]?: T[K] extends State<infer U>
    ? U
    : T[K] extends Calc<infer U>
    ? U
    : never;
};

type Self<T> = {
  [K in keyof T as T[K] extends ReactiveProp ? never : K]: T[K];
};

type MaybeSet<T> = T & Partial<{ set: (props: Partial<T>) => void }>;

export function useCtrl<T>(factory: () => T): {
  ctrl: T;
  self: Self<T>;
  state: PropValues<T>;
  setState: (props: Partial<PropValues<T>>) => void;
} {
  const [ctrl] = useState(factory as () => MaybeSet<T>);
  const [state, setState] = useState<PropValues<T>>({} as any);

  useEffect(() => {
    const dispose = monitor(() => {
      const newState: any = {};
      let changed = false;

      for (const key in ctrl) {
        const val = (ctrl as any)[key];
        if (val instanceof State || val instanceof Calc) {
          const currentVal = val.get();
          const k = key as keyof PropValues<T>;
          if (!equal(state[k], currentVal)) {
            changed = true;
          }
          newState[k] = currentVal;
        }
      }

      if (changed) {
        setState(newState);
      }
    });

    return () => dispose();
  }, [ctrl, state]);

  const setCtrlState = (props: Partial<PropValues<T>>) => {
    if (typeof (ctrl as MaybeSet<T>).set === "function") {
      (ctrl as MaybeSet<T>).set?.(props as any);
    } else {
      // Opcional: lanzar error o simplemente ignorar
      throw new Error("Controlador no implementa set");
    }
  };

  return {
    ctrl,
    self: ctrl as Self<T>,
    state,
    setState: setCtrlState,
  };
}
