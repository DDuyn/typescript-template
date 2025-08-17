import { state } from "@lib/SpoonKit/signals/State";
import { createSet } from "@lib/SpoonKitComposition/utils/set";
import { createFormControl } from "../form.control";

export function createInputCtrl() {
  const formControl = createFormControl<string | number>();

  const type = state("text");
  const size = state<"small" | "medium">("small");
  const variant = state<"outlined" | "filled" | "standard">("outlined");
  const required = state(false);
  const placeholder = state("");
  const endAdornment = state<"€" | "%" | null>(null);

  const states = { type, size, variant, required, placeholder, endAdornment };
  const setStates = createSet(states);

  const ctrl = {
    ...formControl,
    ...states,
    set: (props: any) => {
      formControl.set(props);
      setStates(props);
      return ctrl;
    },
  };

  return ctrl;
}
