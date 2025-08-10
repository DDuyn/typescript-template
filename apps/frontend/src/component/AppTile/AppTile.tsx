import { useCtrl } from "../../lib/SpoonKitReact/useCtrl";
import { AppTileCtrl } from "./AppTileCtrl";

export function AppTile({ ctrl }: { ctrl: AppTileCtrl }) {
  const { state } = useCtrl(ctrl);

  return (
    <div className="border border-white px-3 py-4 grid grid-rows-[auto_1fr] gap-4 max-w-42">
      <div className="flex justify-between">
        <div>
          <i className={state.icon} style={{ height: 24, width: 24 }}></i>
        </div>
        {state.badge && <p className="text-sm font-light">{state.badge}</p>}
      </div>
      <p className="uppercase text-sm font-light">{state.label}</p>
    </div>
  );
}
