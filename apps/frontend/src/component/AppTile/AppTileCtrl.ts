import { Ctrl } from "../../lib/SpoonKit/controller/Ctrl";
import { state } from "../../lib/SpoonKit/signals/State";

export class AppTileCtrl extends Ctrl {
  label = state<string>();
  icon = state<string>();
  badge = state<number>();
}
