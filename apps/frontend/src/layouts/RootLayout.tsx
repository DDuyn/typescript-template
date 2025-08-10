import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { Badge, badgeClasses } from "@mui/material";
import type { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {
  type CSSObject,
  styled,
  type Theme,
  useTheme,
} from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import * as React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppModal } from "../component/AppModal/AppModal";
import { useCtrl } from "../lib/SpoonKitReact/useCtrl";
import { useRegister } from "../lib/SpoonKitReact/useRegister";
import { LocationProvider } from "../providers/LocationProvider/LocationProvider";
import { Navigate } from "../providers/Navigate/Navigate";
import { ModalService } from "../services/ModalService";
import { RootLayoutCtrl } from "./RootLayoutCtrl";

const drawerWidth = 320;

interface AppMenuItemProps {
  path: string;
  title: string;
  icon: string;
  self: Pick<RootLayoutCtrl, "location" | "navigateTo">;
}

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(5)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(6)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: "#0a5094",
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

const NotificationBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -8px;
    right: -2px;
  }
`;

function AppMenuItem({
  path,
  title,
  icon,
  self,
  open,
}: AppMenuItemProps & { open: boolean }) {
  const isSelected = path === self.location().pathname;
  return (
    <ListItem
      disablePadding
      sx={[
        { display: "block" },
        isSelected ? { backgroundColor: "#F3F8FB" } : null,
      ]}
    >
      <ListItemButton
        onClick={() => self.navigateTo(path)}
        sx={[
          { minHeight: 36, px: 1.5 },
          open ? { justifyContent: "initial" } : { justifyContent: "center" },
        ]}
      >
        <ListItemIcon
          sx={[
            { color: "#0a5094", minWidth: 0, justifyContent: "center" },
            open ? { mr: 3, ml: 0.5 } : { mr: "auto" },
          ]}
        >
          <i className={icon}></i>
        </ListItemIcon>
        <ListItemText
          primary={title}
          sx={open ? { opacity: 1 } : { opacity: 0 }}
        />
      </ListItemButton>
    </ListItem>
  );
}

export function RootLayout() {
  useRegister(Navigate, useNavigate());
  useRegister(LocationProvider, useLocation);
  useRegister(ModalService, new ModalService());

  const { self, state } = useCtrl(RootLayoutCtrl);

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <>
      {state.currentModal && <AppModal ctrl={state.currentModal} />}
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar variant="dense">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              sx={[
                {
                  marginRight: 2,
                  p: 0,
                },
                open && { display: "none" },
              ]}
            >
              <MenuIcon />
            </IconButton>
            <div className="flex justify-between items-center w-full">
              <img
                src="/img/accem_logo_blue.png"
                alt="logo"
                className="w-30 cursor-pointer"
                onClick={() => self.navigateTo("/home")}
              />
              <div className="flex items-center gap-1">
                <IconButton color="inherit">
                  <NotificationsNoneOutlinedIcon fontSize="small" />
                  <NotificationBadge
                    badgeContent={0}
                    variant="dot"
                    color="info"
                    overlap="circular"
                  />
                </IconButton>
                <IconButton
                  color="inherit"
                  onClick={() => {
                    self.navigateTo("/my-profile");
                  }}
                >
                  <AccountCircleOutlinedIcon fontSize="small" />
                </IconButton>
                <IconButton
                  color="inherit"
                  onClick={() => {
                    self.logout();
                  }}
                >
                  <LogoutOutlinedIcon fontSize="small" />
                </IconButton>
              </div>
            </div>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          open={open}
          sx={{
            "& .MuiPaper-root": {
              borderRight: 0,
            },
          }}
        >
          <DrawerHeader sx={{ minHeight: "48px !important" }}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List sx={{ p: 0 }}>
            {state.menuItems?.map((item, i) =>
              item.isMenuItem ? (
                <AppMenuItem
                  path={item.path}
                  key={item.path}
                  title={item.title}
                  icon={item.icon}
                  self={self}
                  open={open}
                />
              ) : (
                <Divider key={i} sx={{ mx: 2 }} />
              )
            )}
          </List>
        </Drawer>
        <main className="grid grid-rows-[48px_1fr] w-full h-dvh">
          <span></span>
          <Outlet />
        </main>
      </Box>
    </>
  );
}
