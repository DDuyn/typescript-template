import CloseIcon from "@mui/icons-material/Close";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { ResolveCtrl } from "../../lib/SpoonKitReact/ResolveCtrl";
import { useCtrl } from "../../lib/SpoonKitReact/useCtrl";
import { AppModalCtrl } from "./AppModalCtrl";

// @ts-nocheck
export function AppModal({ ctrl }: { ctrl: AppModalCtrl }) {
  const { self, state } = useCtrl(ctrl);

  return (
    <Dialog
      open={state.open}
      onClose={() => self.close()}
      maxWidth={state.maxWidth}
      fullWidth={state.fullWidth}
      fullScreen={state.fullScreen}
      hideBackdrop={state.hideBackdrop}
      disableEscapeKeyDown={state.disableEscapeKeyDown}
      disablePortal={state.disablePortal}
    >
      {state.title && (
        <DialogTitle
          sx={{
            color: "rgba(41, 41, 41, 1)",
            fontWeight: 600,
            letterSpacing: "0px",
            fontSize: "16px",
            lineHeight: "16px",
            verticalAlign: "middle",
          }}
          className="flex justify-between items-center"
        >
          <span>{state.title}</span>
          <IconButton
            aria-label="close"
            onClick={() => self.close()}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      )}
      <DialogContent dividers>
        <ResolveCtrl ctrl={ctrl} />
      </DialogContent>
    </Dialog>
  );
}
