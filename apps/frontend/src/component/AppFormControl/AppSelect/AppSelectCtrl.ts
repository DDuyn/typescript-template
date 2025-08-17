import { state } from "../../../lib/SpoonKit/signals/State";
import { AppFormControl } from "../AppFormControlOld";

export type SelectOptions = {
  name: string;
  id: string | number;
};

export class AppSelectCtrl<T> extends AppFormControl<T> {
  options = state<SelectOptions[]>([]);
  filterOptions = state<(option: SelectOptions) => boolean>(() => true);
  multiple = state<boolean>(false);
  size = state<"small" | "medium">("small");
  noneOption = state<string>("Seleccionar...");
  variant = state<"outlined" | "filled" | "standard">("outlined");
  placeholder = state<string>("");
  required = state<boolean>(false);

  constructor() {
    super();
  }
}
