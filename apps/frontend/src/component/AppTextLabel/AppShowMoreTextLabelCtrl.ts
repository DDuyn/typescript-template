import { state } from "../../lib/SpoonKit/signals/State";
import { AppTextLabelCtrl } from "./AppTextLabelCtrl";

export class AppShowMoreTextLabelCtrl extends AppTextLabelCtrl {
  text = state<string[]>();
  showMore = state<boolean>(false);
  // rootElement = state<HTMLElement>();
  onClick = this.setShowMoreText.bind(this);

  constructor() {
    super();
  }

  private setShowMoreText() { this.showMore.set(!this.showMore.get()); }

  // private onClickOutside() {
  //   console.log("Clicked outside the component");
  //   this.setShowMoreText();
  // }

  // handleDocumentClick = (event: MouseEvent) => {
  //   console.log("Document clicked", event);
  //   console.log(this.rootElement);
  //   if (!this.rootElement) return;
  //   if (this.rootElement.get().contains(event.target as Node)) {
  //     this.onClickOutside();
  //   }
  // };
}
