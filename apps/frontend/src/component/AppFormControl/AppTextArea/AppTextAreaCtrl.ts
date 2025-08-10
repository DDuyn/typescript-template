import { monitor } from "../../../lib/SpoonKit/signals/Monitor";
import { state } from "../../../lib/SpoonKit/signals/State";
import { AppFormControl } from "../AppFormControl";

export class AppTextAreaCtrl extends AppFormControl<string> {
  type = state<string>("text");
  size = state<"small" | "medium">("small");
  minRows = state<number>(5);
  maxRows = state<number>(10);
  maxLength = state<number>(100);
  variant = state<"outlined" | "filled" | "standard">("outlined");
  placeholder = state<string>("");
  required = state<boolean>(false);

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
