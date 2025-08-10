import { Ctrl } from "../../lib/SpoonKit/controller/Ctrl";
import { state } from "../../lib/SpoonKit/signals/State";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export class AppBreadcrumbsCtrl extends Ctrl {
  items = state<BreadcrumbItem[]>([]);
}
