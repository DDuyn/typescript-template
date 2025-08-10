import { Ctrl } from "../../lib/SpoonKit/controller/Ctrl";
import { state } from "../../lib/SpoonKit/signals/State";

export class AppTextLabelCtrl extends Ctrl {
  text = state<string | string[] | number>();
  label = state<string>();
  iconEnd = state<string>();
  iconStart = state<string>();
  noWrap = state<boolean>(false);
  align = state<"inherit" | "left" | "center" | "right" | "justify">("inherit");
  variantText = state<"inherit" | "caption" | "body1" | "body2">("inherit");
  variantLabel = state<"inherit" | "caption" | "body1" | "body2">("inherit");
}
