import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import { IconButton, Tooltip } from "@mui/material";
import { useCtrl } from "../../lib/SpoonKitReact/useCtrl";
import { AppIconButtonCtrl } from "./AppIconButtonCtrl";

export function AppIconButton({ ctrl }: { ctrl: AppIconButtonCtrl }) {
  const { self, state } = useCtrl(ctrl);

  const getIcon = (type: string) => {
    switch (type) {
      case "create-proposal":
        return <PostAddOutlinedIcon fontSize={state.size} />;
      case "delete":
        return <DeleteIcon fontSize={state.size} />;
      case "edit":
        return <EditIcon fontSize={state.size} />;
      default:
        return null;
    }
  };

  return (
    <Tooltip title={state.tooltip}>
      <IconButton
        color={state.color}
        size={state.size}
        disabled={state.disabled}
        onClick={() => self.onClick.next()}
        loading={state.loading}
      >
        {getIcon(state.iconType)}
      </IconButton>
    </Tooltip>
  );
}
