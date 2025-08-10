import { emitter } from "../../lib/SpoonKit/signals/Emitter";
import { state } from "../../lib/SpoonKit/signals/State";
import { AppTextLabelCtrl } from "./AppTextLabelCtrl";

export class AppClickableTextLabelCtrl extends AppTextLabelCtrl {
  clickable = state<boolean>(true);
  onClick = emitter<void>();
  cursor = state<string>("pointer");
  color = state<string>("primary");
  textDecoration = state<string>("underline");
}
