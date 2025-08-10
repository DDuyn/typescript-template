import { Avatar } from "@mui/material";
import { useCtrl } from "../../lib/SpoonKitReact/useCtrl";
import { AppAvatarCtrl } from "./AppAvatarCtrl";

export function AppAvatar({ ctrl }: { ctrl: AppAvatarCtrl }) {
  const { state } = useCtrl(ctrl);

  return (
    <Avatar
      src={state.src}
      alt={state.alt}
      variant={state.variant}
      sx={{
        width: state.size,
        height: state.size,
        bgcolor: state.src ? "transparent" : `${state.color}.main`,
      }}
    >
      {!state.src && state.initials}
    </Avatar>
  );
}
