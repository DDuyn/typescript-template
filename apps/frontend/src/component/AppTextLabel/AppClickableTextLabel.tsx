import { Typography } from "@mui/material";
import { useCtrl } from "../../lib/SpoonKitReact/useCtrl";
import { AppClickableTextLabelCtrl } from "./AppClickableTextLabelCtrl";

export function AppClickableTextLabel({
  ctrl,
}: {
  ctrl: AppClickableTextLabelCtrl;
}) {
  const { self, state } = useCtrl(ctrl);

  return (
    <div className="flex justify-between items-center gap-3">
      {state.iconStart && <i className={state.iconStart}></i>}
      <div className="w-full">
        {state.label && (
          <Typography variant="caption" color="textSecondary">
            {state.label}
          </Typography>
        )}
        <Typography
          variant="inherit"
          align={state.align}
          noWrap={state.noWrap}
          sx={{
            lineHeight: 1,
            cursor: state.cursor,
            fontWeight: 500,
            color:
              state.color === "primary" ? "rgba(0, 92, 155, 1)" : state.color,
            textDecoration: state.textDecoration,
            userSelect: "none",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
          onClick={() => self.onClick.next()}
        >
          {state.text}
        </Typography>
      </div>
      {state.iconEnd && <i className={state.iconEnd}></i>}
    </div>
  );
}
