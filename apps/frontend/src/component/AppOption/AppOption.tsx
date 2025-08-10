import { useCtrl } from "../../lib/SpoonKitReact/useCtrl";
import { AppTextLabel } from "../AppTextLabel/AppTextLabel";
import { AppOptionCtrl, OptionModel } from "./AppOptionCtrl";

export function AppOption<T extends OptionModel>({
  ctrl,
}: {
  ctrl: AppOptionCtrl<T>;
}) {
  const { self } = useCtrl(ctrl);

  return (
    <div className="grid grid-cols-1 gap-2">
      <div>
        <span>
          <AppTextLabel ctrl={self.nameText} />
        </span>
        <span>
          <AppTextLabel ctrl={self.descriptionText} />
        </span>
      </div>
    </div>
  );
}
