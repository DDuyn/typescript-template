import { Ctrl } from "../../lib/SpoonKit/controller/Ctrl";
import { AppTextLabelCtrl } from "../AppTextLabel/AppTextLabelCtrl";

export type OptionModel = {
  id: number;
  name: string;
  description?: string;
};

export class AppOptionCtrl<T extends OptionModel> extends Ctrl {
  nameText = new AppTextLabelCtrl().set({
    text: this.option.name,
  });

  descriptionText = new AppTextLabelCtrl().set({
    text: this.option.description ?? " ",
    variantText: "caption",
  });

  constructor(private option: T) {
    super();
  }
}
