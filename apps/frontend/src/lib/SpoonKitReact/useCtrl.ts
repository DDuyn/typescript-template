import { useEffect, useState } from "react";
import { Ctrl } from "../SpoonKit/controller/Ctrl";
import { equal } from "../SpoonKit/helpers/equals";
import { monitor } from "../SpoonKit/signals/Monitor";
import { state } from "../SpoonKit/signals/State";
import type { Class } from "../SpoonKit/types/Class";
import type { PropModel } from "../SpoonKit/types/PropTypes";
import type { UseCtrlHook } from "./UseCtrlHook";

export function useCtrl<T extends Ctrl>(
  ctrlToken: Class<T> | T,
  initProps: PropModel<T> = {}
): UseCtrlHook<T> {
  // -------------------------
  // INIT CTRL
  // -------------------------
  const [ctrl] = useState<Ctrl>(() => {
    const instance = ctrlToken instanceof Ctrl ? ctrlToken : new ctrlToken();
    instance.set(initProps);
    return instance;
  });

  // -------------------------
  // INIT SELF
  // -------------------------
  const [_state, setState] = useState(() => ctrl.get());

  // -------------------------
  // BIND LIFECYCLE & PROP CHANGES
  // -------------------------
  useEffect(() => {
    ctrl.onStart.next(ctrl);

    let skipFirst = state(true);
    let lastState: any = _state;
    const dispose = monitor(() => {
      if (skipFirst.get()) skipFirst.set(false);
      else {
        const props = ctrl.get();
        if (equal(lastState, props)) return;
        lastState = props;
        setState(props);
      }
    });

    return () => {
      ctrl.onDestroy.next();
      dispose();
    };
  }, []);

  //console.log("DEBUG RENDERS", self?.constructor?.name, props);

  // TODO: Review this typing errors when removing as any
  return {
    self: ctrl,
    state: _state,
    setState: (props: PropModel<T>) => ctrl.set(props),
  } as any;
}
