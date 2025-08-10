import { state } from "../../../lib/SpoonKit/signals/State";
import { AppFormControl } from "../AppFormControl";

export type RadioOptions = {
  name: string;
  id: number | boolean;
};

export class AppRadioCtrl<T> extends AppFormControl<T> {
  options = state<RadioOptions[]>([
    { id: true, name: "Sí" },
    { id: false, name: "No" },
  ]);
  required = state<boolean>(false);
  disable = state<boolean>(false);
}
