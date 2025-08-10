import { Ctrl } from "../../lib/SpoonKit/controller/Ctrl";
import { state } from "../../lib/SpoonKit/signals/State";

export class AppAvatarCtrl extends Ctrl {
  src = state<string>();
  alt = state<string>("user");
  size = state<number>(40);
  variant = state<"circular" | "rounded" | "square">("circular");
  color = state<
    | "primary"
    | "secondary"
    | "error"
    | "warning"
    | "info"
    | "success"
    | "default"
  >("primary");
  initials = state<string>();
}
