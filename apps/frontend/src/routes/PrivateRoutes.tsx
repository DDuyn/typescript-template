import { useCtrl } from "@lib/SpoonKitReact/useCtrl";
import { Outlet } from "@mui/icons-material";
import { PrivateRoutesCtrl } from "./PrivateRoutesCtrl";

export function PrivateRoutes() {
  const { state } = useCtrl(PrivateRoutesCtrl);
  if (state.authInProgress) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white z-50">
        <p className="text-lg">Cargando...</p>
      </div>
    );
  }

  return <Outlet />;
}
