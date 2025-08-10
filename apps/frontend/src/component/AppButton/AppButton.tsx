import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, Tooltip } from "@mui/material";
import { useCtrl } from "../../lib/SpoonKitReact/useCtrl";
import { AppButtonCtrl } from "./AppButtonCtrl";

export function AppButton({ ctrl }: { ctrl: AppButtonCtrl }) {
  const { self, state } = useCtrl(ctrl);

  const iconMap = {
    delete: <DeleteIcon />,
    add: <AddIcon />,
  };
  const iconComponent = state.icon ? iconMap[state.icon] : null;

  return (
    <Tooltip title={state.tooltip} placement="top" arrow>
      <Button
        fullWidth={state.fullWidth}
        variant={state.variant}
        disabled={state.disabled}
        loading={state.isLoading}
        loadingPosition="start"
        color={state.color}
        size={state.size}
        startIcon={iconComponent}
        onClick={() => self.onClick.next()}
      >
        {state.label}
      </Button>
    </Tooltip>
  );
}
