import { Ctrl } from "../../lib/SpoonKit/controller/Ctrl";
import { calc } from "../../lib/SpoonKit/signals/Calc";
import { emitter } from "../../lib/SpoonKit/signals/Emitter";
import { state } from "../../lib/SpoonKit/signals/State";

export interface TabItem {
  label: string;
  disabled?: boolean;
  content: Ctrl;
}

export class AppTabsCtrl extends Ctrl {
  tabs = state<TabItem[]>([]);
  selectedIndex = state<number>(0);
  onChange = emitter<number>();

  selectedContent = calc(() => {
    return this.tabs.get()[this.selectedIndex.get()]?.content;
  });
}
