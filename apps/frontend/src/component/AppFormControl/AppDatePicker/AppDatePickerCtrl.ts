import { state } from "../../../lib/SpoonKit/signals/State";
import { AppFormControl } from "../AppFormControl";

export class AppDatePickerCtrl extends AppFormControl<Date> {
  size = state<"small" | "medium">("small");
  format = state<string>("dd/MM/yyyy");
  minDate = state<Date>();
  maxDate = state<Date>();
  disablePast = state<boolean>(false);
  disableFuture = state<boolean>(false);
  readOnly = state<boolean>(false);
  // El texto mostrado cuando no hay fecha seleccionada
  placeholderText = state<string>("DD/MM/YYYY");
  variant = state<"outlined" | "filled" | "standard">("outlined");
  required = state<boolean>(false);
}
