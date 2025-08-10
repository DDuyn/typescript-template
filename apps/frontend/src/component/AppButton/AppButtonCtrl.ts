import { Ctrl } from "../../lib/SpoonKit/controller/Ctrl";
import { emitter } from "../../lib/SpoonKit/signals/Emitter";
import { state } from "../../lib/SpoonKit/signals/State";

export class AppButtonCtrl extends Ctrl {
  label = state<string>();
  variant = state<"contained" | "outlined" | "text">("contained");
  fullWidth = state<boolean>();
  color = state<
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "info"
    | "inherit"
  >("primary");
  disabled = state<boolean>();
  isLoading = state<boolean>();
  size = state<"small" | "medium" | "large">("medium");
  onClick = emitter<void>();
  tooltip = state<string>();
  icon = state<"delete" | "add">();
  textTransorm = state<"none" | "uppercase">("none");
}
