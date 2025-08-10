import { Ctrl } from "../../lib/SpoonKit/controller/Ctrl";
import { $untracked } from "../../lib/SpoonKit/signals/$untracked";
import { emitter } from "../../lib/SpoonKit/signals/Emitter";
import { monitor } from "../../lib/SpoonKit/signals/Monitor";
import { state } from "../../lib/SpoonKit/signals/State";

export class AppFormControl<T> extends Ctrl {
  fullWidth = state<boolean>(true);
  value = state<T>();
  label = state<string>();
  helperText = state<string>();
  isValid = state<boolean>(true);
  isDirty = state<boolean>();
  fetching = state<boolean>();
  disabled = state<boolean>();
  isTouched = state<boolean>(true);
  onChange = emitter<T>();

  public discard() {
    this.value.set(null);
    this.isDirty.set(false);
  }

  constructor() {
    super();

    let dispose;
    this.onStart.subscribe(() => {
      let skipFirst = true;
      dispose = monitor(() => {
        const value = this.value.get();
        $untracked(() => {
          if (!skipFirst) {
            this.onChange.next(value);
          } else {
            skipFirst = false;
          }
        });
      });
    });

    this.onDestroy.subscribe(() => dispose?.());
  }
}
