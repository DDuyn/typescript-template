import { Typography } from "@mui/material";
import { useCtrl } from "../../lib/SpoonKitReact/useCtrl";
import { AppTextLabelCtrl } from "./AppTextLabelCtrl";

export function AppTextLabel({ ctrl }: { ctrl: AppTextLabelCtrl }) {
  const { state } = useCtrl(ctrl);

  return (
    <div className="flex justify-between items-center gap-3">
      {state.iconStart && <i className={state.iconStart}></i>}
      <div className="w-full">
        {state.label && (
          <Typography variant={state.variantLabel}>{state.label}</Typography>
        )}
        <Typography
          variant={state.variantText}
          align={state.align}
          noWrap={state.noWrap}
        >
          {state.text ?? "-"}
        </Typography>
      </div>
      {state.iconEnd && <i className={state.iconEnd}></i>}
    </div>
  );
}
