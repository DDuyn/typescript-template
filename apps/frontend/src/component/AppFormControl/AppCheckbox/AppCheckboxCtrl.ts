import { state } from "../../../lib/SpoonKit/signals/State";
import { AppFormControl } from "../AppFormControl";

export class AppCheckboxCtrl extends AppFormControl<boolean> {
  indeterminate = state<boolean>();
}
