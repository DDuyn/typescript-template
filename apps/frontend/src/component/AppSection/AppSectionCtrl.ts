import { Ctrl } from "../../lib/SpoonKit/controller/Ctrl";
import { emitter } from "../../lib/SpoonKit/signals/Emitter";
import { state } from "../../lib/SpoonKit/signals/State";

export class AppSectionCtrl extends Ctrl {
  title = state<string>();
  expanded = state<boolean>(false);
  onChange = emitter<boolean>();
  disabled = state<boolean>(false);
  borderless = state<boolean>(true);
  isValid = state<boolean>(true);
  isDirty = state<boolean>(false);
  content = state<Ctrl>();
}
