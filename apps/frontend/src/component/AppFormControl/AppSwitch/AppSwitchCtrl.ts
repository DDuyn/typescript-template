import { state } from "../../../lib/SpoonKit/signals/State";
import { AppFormControl } from "../AppFormControlOld";

export class AppSwitchCtrl extends AppFormControl<boolean> {
  color = state<
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning"
    | "default"
  >("primary");
  size = state<"small" | "medium">("medium");
}
