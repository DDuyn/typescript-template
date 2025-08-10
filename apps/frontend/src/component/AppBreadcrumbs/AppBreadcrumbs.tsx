import { Breadcrumbs, Link as MuiLink, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useCtrl } from "../../lib/SpoonKitReact/useCtrl";
import { AppBreadcrumbsCtrl } from "./AppBreadcrumbsCtrl";

export function AppBreadcrumbs({ ctrl }: { ctrl: AppBreadcrumbsCtrl }) {
  const { state } = useCtrl(ctrl);

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {state.items?.map((item, idx) =>
        item.href && idx !== state.items.length - 1 ? (
          <MuiLink
            key={idx}
            component={RouterLink}
            to={item.href}
            underline="hover"
          >
            {item.label}
          </MuiLink>
        ) : (
          <Typography key={idx}>{item.label}</Typography>
        )
      )}
    </Breadcrumbs>
  );
}
