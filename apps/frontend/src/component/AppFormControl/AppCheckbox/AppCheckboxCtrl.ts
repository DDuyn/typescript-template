import { state } from "../../../lib/SpoonKit/signals/State";
import { AppFormControl } from "../AppFormControlOld";

export class AppCheckboxCtrl extends AppFormControl<boolean> {
  indeterminate = state<boolean>();
}
