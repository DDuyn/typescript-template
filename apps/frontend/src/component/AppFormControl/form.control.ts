import { emitter } from "@lib/SpoonKit/signals/Emitter";
import { state } from "@lib/SpoonKit/signals/State";
import { createSet } from "@lib/SpoonKitComposition/utils/set";

export function createFormControl<TValue>() {
  const fullWidth = state<boolean>(true);
  const value = state<TValue | null>();
  const label = state<string>();
  const helperText = state<string>();
  const isValid = state<boolean>(true);
  const fetching = state<boolean>();
  const disabled = state<boolean>();
  const onChange = emitter<TValue | null>();

  const states = {
    fullWidth,
    value,
    label,
    helperText,
    isValid,
    fetching,
    disabled,
    onChange,
  };

  const set = createSet(states);

  return {
    ...states,
    set,
  };
}
