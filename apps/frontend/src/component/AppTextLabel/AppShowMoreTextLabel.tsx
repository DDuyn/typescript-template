import { Typography } from "@mui/material";
import { useCtrl } from "../../lib/SpoonKitReact/useCtrl";
import { AppShowMoreTextLabelCtrl } from "./AppShowMoreTextLabelCtrl";
// import { useEffect } from "react";
import { AppClickableTextLabel } from "./AppClickableTextLabel";
import { AppClickableTextLabelCtrl } from "./AppClickableTextLabelCtrl";

export function AppShowMoreTextLabel({
  ctrl,
}: {
  ctrl: AppShowMoreTextLabelCtrl;
}) {
  const { self, state } = useCtrl(ctrl);

  // // Call this when the component mounts
  // useEffect(() => {
  //   document.addEventListener("mousedown", self.handleDocumentClick);
  //   return () => {
  //     document.removeEventListener("mousedown", self.handleDocumentClick);
  //   }
  // })

  return (
    <div className="flex justify-between items-center gap-3">
      {state.iconStart && <i className={state.iconStart}></i>}
      <div className="w-full">
        {state.label && (
          <Typography variant="caption" color="textSecondary">
            {state.label}
          </Typography>
        )}
        {state.showMore === false && (
          <>
            <Typography
              variant="inherit"
              align={state.align}
              noWrap={state.noWrap}
              sx={{ lineHeight: 1 }}
            >
              {state.text[0]}
            </Typography>
            <AppClickableTextLabel
              ctrl={new AppClickableTextLabelCtrl().set({
                text: "Ver más",
                onClick: self.onClick,
                color: "primary",
                cursor: "pointer",
              })}
            />
          </>
        )}
        {state.showMore === true && (
          <>
            {state.text.map((text, index) => (
              <Typography
                variant="inherit"
                align={state.align}
                noWrap={state.noWrap}
                sx={{ lineHeight: 1 }}
                key={index}
              >
                {text}
              </Typography>
            ))}
            <AppClickableTextLabel
              ctrl={new AppClickableTextLabelCtrl().set({
                text: "Ver menos",
                onClick: self.onClick,
                color: "primary",
                cursor: "pointer",
                textDecoration: "none",
              })}
            />
          </>
        )}
      </div>
      {state.iconEnd && <i className={state.iconEnd}></i>}
    </div>
  );
}
