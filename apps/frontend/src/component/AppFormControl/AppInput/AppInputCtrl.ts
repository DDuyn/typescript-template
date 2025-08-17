import { monitor } from "../../../lib/SpoonKit/signals/Monitor";
import { state } from "../../../lib/SpoonKit/signals/State";
import { AppFormControl } from "../AppFormControlOld";

export class AppInputCtrl extends AppFormControl<string | number> {
  type = state<string>("text");
  size = state<"small" | "medium">("small");
  variant = state<"outlined" | "filled" | "standard">("outlined");
  required = state<boolean>(false);
  placeholder = state<string>("");
  endAdornment = state<"€" | "%" | null>(null);

  constructor() {
    super();
    const dispose = monitor(() => {
      if (this.value.get() === "") {
        this.value.set(null);
      }
    });

    this.onDestroy.subscribe(() => dispose());
  }
}
