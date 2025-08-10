import { Ctrl } from "../../lib/SpoonKit/controller/Ctrl";
import { emitter } from "../../lib/SpoonKit/signals/Emitter";
import { state } from "../../lib/SpoonKit/signals/State";

export class AppIconButtonCtrl extends Ctrl {
  tooltip = state<string>();
  size = state<"small" | "medium" | "large">("small");
  fontSize = state<"inherit" | "small" | "medium" | "large">("inherit");
  onClick = emitter<void>();
  disabled = state<boolean>();
  iconType = state<"create-proposal" | "delete" | "edit">();
  loading = state<boolean>(false);
  color = state<"primary" | "secondary" | "success" | "warning" | "error" | "info" | "inherit">("primary");
}
